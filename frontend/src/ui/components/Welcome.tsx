import React, { useState } from "react";
import Login from "./Login";
import { Link } from "react-router-dom";

const Welcome = () => {
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
      <div>CONGRATS YOU SIGNED IN!!!!</div>
    </>
  );
};

export default Welcome;
