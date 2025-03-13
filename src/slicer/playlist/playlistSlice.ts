import { createSlice } from "@reduxjs/toolkit";
import { addPlaylist, deletePlaylist, fetchPlaylists } from "./playlistAPI";
import { Playlist } from "../../types/types";
import { RootState } from "../../store/store";

const playlistSlice = createSlice({
  name: "playlists",
  initialState: {
    items: [] as Playlist[],
    status: "idle",
    error:null as null | string,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylists.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPlaylists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchPlaylists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "failed to fetch playlist";
      })

      // addVideo cases
      .addCase(addPlaylist.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addPlaylist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.unshift(action.payload);
        state.error = null;
      })
      .addCase(addPlaylist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error occurred";
      })

      // deleteVideo cases
      .addCase(deletePlaylist.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter(
          (video) => video.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deletePlaylist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error occurred";
      });
  },
});


export const selectPlaylist = (state:RootState) => state.videos.items;
export const selectPlaylistStatus = (state: RootState) => state.videos.status;
export const selectPlaylistError = (state: RootState) => state.videos.error;

export default playlistSlice.reducer;

export { fetchPlaylists, addPlaylist, deletePlaylist };