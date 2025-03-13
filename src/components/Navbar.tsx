import { Link, useLocation } from "react-router";

function Navbar() {
  const router = useLocation();

  const { pathname } = router;

  const urls = [
    {
      id: 0,
      name: "Videos",
      href: "/",
    },
    {
      id: 1,
      name: "Playlist",
      href: "/playlist",
    },
  ];

  return (
    <div className="flex gap-3">
      {urls.map((url) => (
        <Link to={url.href} key={url.id}>
          <h2
            className={`text-2xl font-semibold mb-4 hover:underline ${
              pathname === url.href
                ? "text-[var(----font-color)]/80 underline"
                : "text-white"
            }`}
          >
            {url.name}
          </h2>
        </Link>
      ))}
    </div>
  );
}

export default Navbar;
