import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addVideo } from '../slicer/video/videoSlice';
import { AppDispatch } from "../store/store";

const VideoForm = () => {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e:any) => {
    e.preventDefault();
    if (title.trim()) {
      dispatch(addVideo(title));
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className=" py-6 flex  justify-center items-center gap-5">
      <input
        type="text"
        placeholder="Video Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded  focus:outline-none focus:ring focus:border-blue-300 bg-white"
      />
      <button 
        type="submit" 
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition text-nowrap"
      >
        Add Video
      </button>
    </form>
  );
};

export default VideoForm;
