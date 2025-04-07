import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useUser } from "./UserContext";
import axios from "axios";

interface Tile {
  type: "book" | "movie";
  image?: string;
  movie_id?: string;
  title?: string;
  book_name?: string;
  isbn?: string;
}

const UserLibrary: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]); // state to hold the list of tiles

  const { user } = useUser();
  console.log("User from context: ", user);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.user_id) return; // Wait until user_id is available

      try {
        const response = await axios.post("http://localhost:5000/grabLib", {
          userId: user.user_id,
        });
        console.log("frontend", user.user_id);
        console.log("Fetched data:", response);
        setTiles(response.data.fetched_data);
        console.log("Response formatted: ", response.data.fetched_data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [user]); //update when user catches up

  const movieTiles = tiles.filter((tile) => tile.movie_id !== undefined);
  const bookTiles = tiles.filter((tile) => tile.isbn !== undefined);

  return (
    <div>
      <h1 className="font-semibold text-2xl mx-[3rem] my-[2rem]">My Library</h1>
      <div className="relative px-[3rem] space-y-10">
        {movieTiles.length > 0 && (
          <div>
            {Array.from({ length: Math.ceil(movieTiles.length / 4) }).map(
              (_, rowIndex) => (
                <div key={rowIndex} className="relative">
                  {/* Row containing 4 items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {movieTiles
                      .slice(rowIndex * 4, rowIndex * 4 + 4)
                      .map((tile) => (
                        <div
                          key={tile.movie_id}
                          className="bg-white border rounded-lg shadow-md overflow-hidden hover:cursor-pointer"
                        >
                          <img
                            src={tile.image || "/movie_default.svg"}
                            alt={tile.title}
                            className="w-full h-44 object-contain bg-blue-400"
                          />
                          <div className="p-2 bg-blue-200">
                            <h3 className="text-lg text-center font-semibold">
                              {tile.title}
                            </h3>
                          </div>
                        </div>
                      ))}
                  </div>
                  {/* Shelf under each row */}
                  <div className="w-full border-b-4 border-gray-600 mt-4 mb-12"></div>
                </div>
              )
            )}
          </div>
        )}
        {bookTiles.length > 0 && (
          <div>
            {Array.from({ length: Math.ceil(bookTiles.length / 4) }).map(
              (_, rowIndex) => (
                <div key={rowIndex} className="relative">
                  {/* Row containing 4 items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {bookTiles
                      .slice(rowIndex * 4, rowIndex * 4 + 4)
                      .map((tile) => (
                        <div
                          key={tile.isbn}
                          className="bg-white border rounded-lg shadow-md overflow-hidden hover:cursor-pointer"
                        >
                          <img
                            src={tile.image || "/book_default.svg"}
                            alt={tile.book_name}
                            className="w-full h-44 object-contain bg-blue-400"
                          />
                          <div className="p-2 bg-blue-200">
                            <h3 className="text-lg text-center font-semibold">
                              {tile.book_name}
                            </h3>
                          </div>
                        </div>
                      ))}
                  </div>
                  {/* Shelf under each row */}
                  <div className="w-full border-b-4 border-gray-600 mt-4 mb-12"></div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLibrary;
