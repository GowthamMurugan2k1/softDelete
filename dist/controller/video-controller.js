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
exports.handleDeleteVideo = exports.handleFetchVideo = exports.handleCreateVideo = void 0;
const errorMiddleware_1 = require("../middleware/errorMiddleware");
const db_config_js_1 = require("../db/db.config.js");
// Create a video
exports.handleCreateVideo = (0, errorMiddleware_1.CatchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.body;
    if (!title) {
        res.status(400).send({ status: false, error: "title is required." });
        return;
    }
    const VideoData = yield db_config_js_1.prismaClient.video.create({
        data: {
            title,
        },
    });
    res.status(201).send({ status: true, VideoData });
}));
// Get all video
exports.handleFetchVideo = (0, errorMiddleware_1.CatchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allVideos = yield db_config_js_1.prismaClient.video.findMany({});
    res.status(200).send({ status: true, allVideos });
}));
//   delete video
exports.handleDeleteVideo = (0, errorMiddleware_1.CatchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params;
    const now = new Date();
    if (!videoId) {
        res.status(400).json({ message: "videoId is required" });
        return;
    }
    // Soft delete the video
    yield db_config_js_1.prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.categoryVideo.findMany({
            where: { videoId: videoId, status: "ACTIVE" },
        });
        yield tx.categoryVideo.updateMany({
            where: { videoId: videoId, status: "ACTIVE" },
            data: {
                status: "DELETED",
                deletedAt: now,
            },
        });
        yield tx.video.update({
            where: { id: videoId },
            data: {
                status: "DELETED",
                deletedAt: now,
            },
        });
    }));
    res.json({ message: "Video deleted successfully" });
}));
