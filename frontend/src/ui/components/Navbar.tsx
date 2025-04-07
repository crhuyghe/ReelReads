import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "./UserContext";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { user, setUser } = useUser();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Clear user from localStorage
    console.log(user);
  };
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/welcome" className="">
          <img src="/home.svg" />
        </Link>
        <h2>ReelReads</h2>
        <button onClick={() => setDropdownOpen(!dropdownOpen)}>
          <img src="/profile.svg" />
        </button>
        {dropdownOpen && (
          <div className="z-20 absolute right-0 mt-52 w-30 bg-white shadow-md rounded-md border p-2 text-left">
            <a
              href="/recommendation"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Content Search
            </a>
            <a
              href="/myList"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              My List
            </a>
            <a
              href="/userLibrary"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              View Library
            </a>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              <Link to="/" className="">
                Log Out
              </Link>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
