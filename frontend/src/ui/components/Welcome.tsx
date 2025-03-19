import React, { useState } from "react";
import Login from "./Login";
import { Link } from "react-router-dom";
import { useUser } from "./UserContext";

const Welcome = () => {
  const { user, setUser } = useUser();

  const handleLogout = () => {
    setUser(null);
  };
  return (
    <>
      {/* NAVIGATION FOR NOW, DELETE LATER */}
      <div className="flex flex-col items-center font-semibold mb-3">
        <h1>NAVIGATION FOR TESTING NOW, DELETE LATER</h1>
        <Link
          to="/"
          className="text-blue-600 hover:underline underline-offset-2"
        >
          Back to Login
        </Link>
        <Link
          to="/recommendation"
          className="text-blue-600 hover:underline underline-offset-2"
        >
          Recommendation
        </Link>
      </div>
      <div className="flex flex-col items-center mt-36">
        <div>CONGRATS YOU SIGNED IN!!!!</div>

        <button
          onClick={handleLogout}
          className="rounded-sm bg-blue-300 py-2 px-4 text-black mt-8"
        >
          LOGOUT
        </button>
      </div>
    </>
  );
};

export default Welcome;
