import VideoForm from "./VideoForm";
import VideoList from "./VideoList";
import Navbar from "./Navbar";

function HomeComp() {
 
  return (
    <div className="min-h-screen bg-[var(--primary-color)] ">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4 text-[var(--font-color)]">
            Video Playlist Manager
          </h1>
        </header>

        <section className="mb-12">
          <Navbar/>
          <VideoForm />
          <VideoList />
        </section>
      </div>
    </div>
  );
}

export default HomeComp;
