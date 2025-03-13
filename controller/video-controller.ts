import { Request, Response } from "express";
import { CatchAsyncHandler } from "../middleware/errorMiddleware";
import { prismaClient } from "../db/db.config.js";

// Create a video
export const handleCreateVideo = CatchAsyncHandler(
  async (req: Request, res: Response) => {
    const { title } = req.body;
    if (!title) {
      res.status(400).send({ status: false, error: "title is required." });
      return;
    }
    const VideoData = await prismaClient.video.create({
      data: {
        title,
      },
    });
    res.status(201).send({ status: true, VideoData });
  }
);

// Get all video
export const handleFetchVideo = CatchAsyncHandler(
  async (req: Request, res: Response) => {
    const allVideos = await prismaClient.video.findMany({});
    res.status(200).send({ status: true, allVideos });
  }
);

//   delete video
export const handleDeleteVideo = CatchAsyncHandler(
  async (req: Request, res: Response) => {
    const { videoId } = req.params;
    const now = new Date();
    if (!videoId) {
      res.status(400).json({ message: "videoId is required" });
      return;
    }
    // Soft delete the video
    await prismaClient.$transaction(async (tx) => {
      await tx.categoryVideo.findMany({
        where: { videoId: videoId, status: "ACTIVE" },
      });

      await tx.categoryVideo.updateMany({
        where: { videoId: videoId, status: "ACTIVE" },
        data: {
          status: "DELETED",
          deletedAt: now,
        },
      });

      await tx.video.update({
        where: { id: videoId },
        data: {
          status: "DELETED",
          deletedAt: now,
        },
      });
    });
    res.json({ message: "Video deleted successfully" });
  }
);
