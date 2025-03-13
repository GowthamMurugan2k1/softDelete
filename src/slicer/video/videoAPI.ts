import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Video } from "../../types/types";
import toast from "react-hot-toast";

export const API_URL = import.meta.env.VITE_BACKEND_API;

export const fetchVideos = createAsyncThunk("videos/fetchVideos", async () => {
  try {
    const response = await axios.get(`${API_URL}/video`);

    return response.data.allVideos;
  } catch (error) {
    toast.error("failed to fetch");
    return error;
  }
});

export const addVideo = createAsyncThunk<
  Video,
  string,
  {
    rejectValue: string;
  }
>("videos/addVideo", async (title, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/video`, { title });
    toast.success("added successfully");
    return response.data?.VideoData;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to add video"
    );
  }
});

export const deleteVideo = createAsyncThunk<
  string | number,
  string | number,
  { rejectValue: string }
>("videos/deleteVideo", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/video/${id}`);
    toast.success("deleted successfully");
    return id;
  } catch (error) {
    toast.success(
      error instanceof Error ? error.message : "Failed to delete video"
    );
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to delete video"
    );
  }
});
