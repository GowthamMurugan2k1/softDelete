import { Request, Response } from "express";
import { CatchAsyncHandler } from "../middleware/errorMiddleware";
import { prismaClient } from "../db/db.config.js";

// Create a playlist
export const handleCreatePlaylist = CatchAsyncHandler(
  async (req: Request, res: Response) => {
    const { name, categories } = req.body;
    if (
      !name ||
      !Array.isArray(categories) ||
      !categories ||
      categories.length === 0
    ) {
      res.status(400).send({ status: false, error: "data is required." });
      return;
    }

    if (!name || !categories || !Array.isArray(categories)) {
      return res.status(400).json({ error: "Invalid playlist data" });
    }

    // Creating playlist and all related data in a transaction
    const result = await prismaClient.$transaction(async (tx) => {
      const playlist = await tx.playlist.create({
        data: {
          name,
        },
      });

      // 2. Process each category and its videos
      for (const categoryData of categories) {
        if (
          !categoryData.name ||
          !categoryData.videos ||
          !Array.isArray(categoryData.videos)
        ) {
          throw new Error("Invalid category data");
        }

        const category = await tx.category.create({
          data: {
            name: categoryData.name,
            playlistId: playlist.id,
          },
        });

        for (const videoId of categoryData.videos) {
          // Check if the video exists
          const video = await tx.video.findUnique({
            where: { id: videoId },
          });

          if (!video) {
            throw new Error(`Video with ID ${videoId} not found`);
          }

          await tx.categoryVideo.create({
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
    });
    console.log(result);
    res.status(201).json({
      message: "Playlist created successfully",
      data: result,
    });
  }
);

export const handleFetchPlaylist = CatchAsyncHandler(
  async (req: Request, res: Response) => {
    const playlists = await prismaClient.playlist.findMany({
      include: { categories: {
        include:{
          categoryVideos:{
            include:{
              video:true
            }
          }
        }
      }},
    });
    res.status(200).send({ status: true, playlists });
  }
);

export const handleDeletePlaylist = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if the playlist exists
  const playlist = await prismaClient.playlist.findUnique({
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
     return
  }

  if (playlist.status === 'DELETED') {
     res.status(400).json({ error: 'Playlist already deleted' });
     return
  }

  const now = new Date();

  // Extracting unique video IDs from the playlist's categoryVideos
  const videoIds = [
    ...new Set(playlist.categoryVideos.map((cv) => cv.videoId))
  ];

  

  await prismaClient.$transaction(async (tx) => {
    for (const videoId of videoIds) {
      const activeReferences = await tx.categoryVideo.count({
        where: {
          videoId: videoId,
          deletedAt: null,
          playlistId: { not: id },
        },
      });

      // If no active references remain then soft delete the video.
      if (activeReferences === 0) {
        await tx.video.update({
          where: { id: videoId },
          data: {
            status: 'DELETED',
            deletedAt: now,
          },
        });
      }
    }

    // Soft delete all category-video
    await tx.categoryVideo.updateMany({
      where: { playlistId: id, deletedAt: null },
      data: {
        deletedAt: now,
      },
    });

    
    await tx.category.updateMany({
      where: { playlistId: id, deletedAt: null },
      data: {
        status: 'DELETED',
        deletedAt: now,
      },
    });

   
    await tx.playlist.update({
      where: { id },
      data: {
        status: 'DELETED',
        deletedAt: now,
      },
    });
  });

   res.status(200).json({
    message: 'Playlist and related entities have been deleted',
    playlistId: id,
  });
};
