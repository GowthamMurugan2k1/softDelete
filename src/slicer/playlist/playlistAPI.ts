import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Playlist } from "../../types/types";
import toast from "react-hot-toast";

export const API_URL =  import.meta.env.VITE_BACKEND_API
export const fetchPlaylists = createAsyncThunk(
  "playlists/fetchPlaylists",
  async () => {
    try {
      const response = await axios.get(`${API_URL}/playlist`);
      
      return response.data.playlists;
    } catch (error:any) {
      toast.error(error.message ?? "failed to fetch playlist")
        return error.message ?? "failed to fetch playlist"
    }
  }
);

export const addPlaylist = createAsyncThunk<
  Playlist,
  Playlist,
  {
    rejectValue: string;
  }
>("playlists/addPlaylist", async (playlistData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/playlist`, playlistData);
    toast.success("Created Successfully")
    return response.data.data;
  } catch (error) {
    toast.error(   error instanceof Error ? error.message : "Failed to add playlist")
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to add playlist"
    );
  }
});

export const deletePlaylist = createAsyncThunk<
  string | number,
  string | number,
  { rejectValue: string }
>("playlists/deletePlaylist", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/playlist/${id}`);
    toast.success("Deleted Successfully")
    return id;
  } catch (error) {
    toast.error(   error instanceof Error ? error.message : "Failed to add playlist")
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to delete playlist"
    );
  }
});
