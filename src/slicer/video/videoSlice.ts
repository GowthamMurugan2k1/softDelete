import { createSlice } from '@reduxjs/toolkit';
import { addVideo, deleteVideo, fetchVideos } from './videoAPI';
import { Video } from '../../types/types';
import { RootState } from '../../store/store';

const videoSlice = createSlice({
  name: 'videos',
  initialState: {
    items: [] as Video[],
    status: 'idle',
    error: null as null | string,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(addVideo.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addVideo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log(state,'stateData',action.payload)
        state.items.unshift(action.payload);
        state.error = null;
      })
      .addCase(addVideo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error occurred';
      })
      .addCase(deleteVideo.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter((video) => video.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error occurred';
      });
  },
});


export const selectVideos = (state:RootState) => state.videos.items;
export const selectVideoStatus = (state: RootState) => state.videos.status;
export const selectVideoError = (state: RootState) => state.videos.error;


export default videoSlice.reducer;


export { fetchVideos, addVideo, deleteVideo };
