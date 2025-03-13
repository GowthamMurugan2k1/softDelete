import { configureStore } from '@reduxjs/toolkit';
import videoReducer from '../slicer/video/videoSlice';
import playlistSlice from '../slicer/playlist/playlistSlice';

export const store = configureStore({
  reducer: {
    videos: videoReducer, 
    playlists:playlistSlice
  },
});

// RootState type
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
