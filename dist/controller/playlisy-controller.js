"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeletePlaylist = exports.handleFetchPlaylist = exports.handleCreatePlaylist = void 0;
const errorMiddleware_1 = require("../middleware/errorMiddleware");
const db_config_js_1 = require("../db/db.config.js");
// Create a playlist
exports.handleCreatePlaylist = (0, errorMiddleware_1.CatchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, categories } = req.body;
    if (!name ||
        !Array.isArray(categories) ||
        !categories ||
        categories.length === 0) {
        res.status(400).send({ status: false, error: "data is required." });
        return;
    }
    if (!name || !categories || !Array.isArray(categories)) {
        return res.status(400).json({ error: "Invalid playlist data" });
    }
    // Creating playlist and all related data in a transaction
    const result = yield db_config_js_1.prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const playlist = yield tx.playlist.create({
            data: {
                name,
            },
        });
        // 2. Process each category and its videos
        for (const categoryData of categories) {
            if (!categoryData.name ||
                !categoryData.videos ||
                !Array.isArray(categoryData.videos)) {
                throw new Error("Invalid category data");
            }
            const category = yield tx.category.create({
                data: {
                    name: categoryData.name,
                    playlistId: playlist.id,
                },
            });
            for (const videoId of categoryData.videos) {
                // Check if the video exists
                const video = yield tx.video.findUnique({
                    where: { id: videoId },
                });
                if (!video) {
                    throw new Error(`Video with ID ${videoId} not found`);
                }
                yield tx.categoryVideo.create({
                    data: {
                        playlistId: playlist.id,
                        categoryId: category.id,
                        videoId: videoId,
                    },
                });
            }
        }
        // Return the created playlist with all related data
        return tx.playlist.findUnique({
            where: { id: playlist.id },
            include: {
                categories: {
                    include: {
                        categoryVideos: {
                            include: {
                                video: true,
                            },
                        },
                    },
                },
            },
        });
    }));
    console.log(result);
    res.status(201).json({
        message: "Playlist created successfully",
        data: result,
    });
}));
exports.handleFetchPlaylist = (0, errorMiddleware_1.CatchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const playlists = yield db_config_js_1.prismaClient.playlist.findMany({
        include: { categories: {
                include: {
                    categoryVideos: {
                        include: {
                            video: true
                        }
                    }
                }
            } },
    });
    res.status(200).send({ status: true, playlists });
}));
const handleDeletePlaylist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Check if the playlist exists
    const playlist = yield db_config_js_1.prismaClient.playlist.findUnique({
        where: { id },
        include: {
            categories: true,
            categoryVideos: {
                include: {
                    video: true,
                },
            },
        },
    });
    if (!playlist) {
        res.status(404).json({ error: 'Playlist not found' });
        return;
    }
    if (playlist.status === 'DELETED') {
        res.status(400).json({ error: 'Playlist already deleted' });
        return;
    }
    const now = new Date();
    // Extracting unique video IDs from the playlist's categoryVideos
    const videoIds = [
        ...new Set(playlist.categoryVideos.map((cv) => cv.videoId))
    ];
    yield db_config_js_1.prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        for (const videoId of videoIds) {
            const activeReferences = yield tx.categoryVideo.count({
                where: {
                    videoId: videoId,
                    deletedAt: null,
                    playlistId: { not: id },
                },
            });
            // If no active references remain then soft delete the video.
            if (activeReferences === 0) {
                yield tx.video.update({
                    where: { id: videoId },
                    data: {
                        status: 'DELETED',
                        deletedAt: now,
                    },
                });
            }
        }
        // Soft delete all category-video
        yield tx.categoryVideo.updateMany({
            where: { playlistId: id, deletedAt: null },
            data: {
                deletedAt: now,
            },
        });
        yield tx.category.updateMany({
            where: { playlistId: id, deletedAt: null },
            data: {
                status: 'DELETED',
                deletedAt: now,
            },
        });
        yield tx.playlist.update({
            where: { id },
            data: {
                status: 'DELETED',
                deletedAt: now,
            },
        });
    }));
    res.status(200).json({
        message: 'Playlist and related entities have been deleted',
        playlistId: id,
    });
});
exports.handleDeletePlaylist = handleDeletePlaylist;
