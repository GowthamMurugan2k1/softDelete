import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideos, deleteVideo } from '../slicer/video/videoSlice';
import { AppDispatch ,RootState } from '../store/store';
import { Video } from '../types/types';

const VideoList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: videos, status, error } = useSelector((state:RootState ) => state?.videos);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVideos());
    }
  }, [status, dispatch]);

  const handleDelete = (id:string | number) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      dispatch(deleteVideo(id));
    }
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center py-4">
      <div className="w-8 h-8 border-4 border-blue-600 border-dotted rounded-full animate-spin"></div>
    </div>;
  }

  if (status === 'failed') {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-clip-border text-gray-700 bg-white shadow-md">
      <table className="min-w-full border-collapse ">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos.length === 0 ? (
            <tr>
              <td colSpan={2} className="px-4 py-2 text-center">
                No videos found
              </td>
            </tr>
          ) : (
            videos.map((video:Video) => (
              <tr key={video.id} className="p-4 border-b border-blue-gray-50">
                <td className="px-4 py-2 block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">{video.title}</td>
                <td className="px-4 py-2 text-right">
                  <button 
                    onClick={() => handleDelete(video.id)}
                    className="inline-flex cursor-pointer items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VideoList;
