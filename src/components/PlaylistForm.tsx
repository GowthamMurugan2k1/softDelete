import { useState, useEffect, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPlaylist } from "../slicer/playlist/playlistSlice";
import { fetchVideos } from "../slicer/video/videoSlice";
import { AppDispatch, RootState } from "../store/store";
import { Playlist, Video } from "../types/types";

interface Category {
  id?: string | number;
  name: string;
  videos: (string | number)[];
}

const   PlaylistForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: videos, status } = useSelector(
    (state: RootState) => state.videos
  ) as { items: Video[]; status: string };

  const [playlistName, setPlaylistName] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([
    { name: "", videos: [] },
  ]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchVideos());
    }
  }, [status, dispatch]);

  const handleCategoryNameChange = (index: number, value: string): void => {
    const updatedCategories = [...categories];
    updatedCategories[index].name = value;
    setCategories(updatedCategories);
  };

  const handleVideoToggle = (
    categoryIndex: number,
    videoId: string | number
  ): void => {
    const updatedCategories = [...categories];
    const currentVideoIds = updatedCategories[categoryIndex].videos;

    if (currentVideoIds.includes(videoId)) {
      updatedCategories[categoryIndex].videos = currentVideoIds.filter(
        (id) => id !== videoId
      );
    } else {
      updatedCategories[categoryIndex].videos = [...currentVideoIds, videoId];
    }

    setCategories(updatedCategories);
  };

  const addCategory = (): void => {
    setCategories([...categories, { name: "", videos: [] }]);
  };

  const removeCategory = (index: number): void => {
    if (categories.length > 1) {
      const updatedCategories = [...categories];
      updatedCategories.splice(index, 1);
      setCategories(updatedCategories);
    }
  };
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!playlistName.trim()) {
      alert("Please enter a playlist name");
      return;
    }

    const validCategories = categories.filter(
      (cat) => cat.name.trim() && cat.videos.length > 0
    );

    if (validCategories.length === 0) {
      alert("Please add at least one category with a name and select videos");
      return;
    }

    // Dispatch Playlist object
    dispatch(
      addPlaylist({
        name: playlistName,
        categories: validCategories.map((cat) => ({
          ...cat,
          categoryVideos: cat.videos,
        })),
      } as Playlist)
    );

    // Reset state
    setPlaylistName("");
    setCategories([{ name: "", videos: [] }]);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <input
        type="text"
        placeholder="Playlist Name"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
        className="w-full p-2 border bg-white border-gray-300 rounded mb-6 focus:outline-none focus:ring focus:border-blue-300"
      />

      <h3 className="text-lg font-semibold mb-4 text-[var(--font-color)]">Categories</h3>

      {categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="bg-white shadow p-4 rounded mb-4">
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Category Name"
              value={category.name}
              onChange={(e) =>
                handleCategoryNameChange(categoryIndex, e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
           {categories.length > 1 && <button
              type="button"
              onClick={() => removeCategory(categoryIndex)}
              disabled={categories.length <= 1}
              className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
            >
              Delete
            </button>}
          </div>

          <p className="font-medium mb-2">Select Videos:</p>
          <ul className="max-h-48 overflow-y-auto border border-gray-200 rounded">
            {videos.length === 0 ? (
              <p className="text-gray-500 p-2">
                No videos available. Add videos first.
              </p>
            ) : (
              videos.map((video: Video) => (
                <li
                  key={video.id}
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleVideoToggle(categoryIndex, video.id)}
                >
                  <input
                    type="checkbox"
                    checked={category.videos.includes(video.id)}
                    readOnly
                    className="mr-2"
                  />
                  <span>{video.title}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      ))}

      <div className="flex justify-between items-center mt-4">
        <button
          type="button"
          onClick={addCategory}
          className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition cursor-pointer"
        >
          Add Category
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
        >
          Create Playlist
        </button>
      </div>
    </form>
  );
};

export default PlaylistForm;
