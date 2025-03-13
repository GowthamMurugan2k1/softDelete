import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlaylists,
  deletePlaylist,
} from "../slicer/playlist/playlistSlice";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";
import { AppDispatch, RootState } from "../store/store";



const PlaylistList = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    items: playlists,
    status,
    error,
  } = useSelector((state: RootState) => state.playlists);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPlaylists());
    }
  }, [status, dispatch]);

  const handleDelete = (id: string | number | undefined): void => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      dispatch(deletePlaylist(id));
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-dotted rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "failed") {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-clip-border text-gray-700 bg-white shadow-md">
      {playlists.length === 0 ? (
        <div className="bg-white shadow p-4 rounded text-center">
          <p>No playlists found</p>
        </div>
      ) : (
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Playlist Name</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {playlists?.map((playlist) => (
              <tr key={playlist.id}  className="p-4 border-b border-blue-gray-50">
                <td className="px-4 py-2">
                  <Accordion type="single" collapsible>
                    <AccordionItem value={playlist.id?.toString() || ""}>
                      <AccordionTrigger className="capitalize">{playlist.name}</AccordionTrigger>
                      <AccordionContent>
                        {playlist.categories.map((category, index) => (
                          <div key={category.id || index}>
                            <p className="font-bold capitalize">{category.name}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {category.categoryVideos.length > 0
                                ? category?.categoryVideos.map(
                                    (video: any, idx) => (
                                      <span
                                        key={idx}
                                        className="border border-gray-400 rounded px-2 py-1 text-sm"
                                      >
                                        {video?.video?.title}
                                      </span>
                                    )
                                  )
                                : ""}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => handleDelete(playlist.id)}
                    className="inline-flex items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PlaylistList;
