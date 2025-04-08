import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "./UserContext";
import { useTheme } from "./ThemeContext";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { user, setUser } = useUser();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Clear user from localStorage
    console.log(user);
  };

  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="bg-white dark:bg-brand-dark shadow-soft-light dark:shadow-soft-dark p-4">
      <div className="container flex justify-between items-center">
        <Link to="/welcome" className="ml-8 focus:outline-none">
          {theme === "light" ? (
            <img src="/home.svg" />
          ) : (
            <img src="/home_light.svg" />
          )}
        </Link>
        <h2>ReelReads</h2>
        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="mr-8">
          {theme === "light" ? (
            <img src="/profile.svg" />
          ) : (
            <img src="/profile_light.svg" />
          )}
        </button>
        {dropdownOpen && (
          <div className="text-black dark:text-white z-20 absolute right-0 mt-60 w-32 bg-white dark:bg-brand-dark shadow-soft-light dark:shadow-soft-dark rounded-md p-2 text-left">
            <a
              href="/recommendation"
              className="block pl-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              Content Search
            </a>
            <a
              href="/myList"
              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              My List
            </a>
            <a
              href="/userLibrary"
              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              View Library
            </a>
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <p>Light Mode</p> : <p>Dark Mode</p>}
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
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
