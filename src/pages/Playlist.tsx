import Navbar from "../components/Navbar";
import PlaylistForm from "../components/PlaylistForm";
import PlaylistList from "../components/PLaylistList";

function Playlist() {
  return (
    <div className="min-h-screen bg-[var(--primary-color)]">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4 text-[var(--font-color)]">
            Video Playlist Manager
          </h1>
        </header>

          <Navbar />
        <section className="mb-12">
          <PlaylistForm />
          <PlaylistList />
        </section>
      </div>
    </div>
  );
}

export default Playlist;
