import React, { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useUser();
  console.log("User from context: ", user);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.user_id) return; // Wait until user_id is available
      setLoading(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]); //update when user catches up

  const [columnsPerRow, setColumnsPerRow] = useState(() => {
    const width = window.innerWidth;
    if (width >= 1536) return 6; // 2xl
    if (width >= 1280) return 5; // xl
    if (width >= 1024) return 4; // lg
    if (width >= 768) return 3; // md
    return 1; // sm and below
  });

  useEffect(() => {
    const getColumnsPerRow = () => {
      const width = window.innerWidth;
      if (width >= 1536) return 6; // 2xl
      if (width >= 1280) return 5; // xl
      if (width >= 1024) return 4; // lg
      if (width >= 768) return 3; // md
      return 1; // sm and below
    };

    const handleResize = () => {
      setColumnsPerRow(getColumnsPerRow());
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const movieTiles = tiles.filter((tile) => tile.movie_id !== undefined);
  const bookTiles = tiles.filter((tile) => tile.isbn !== undefined);

  // Defensive check for loading state
  if (movieTiles.length === 0 || bookTiles.length === 0) {
    return (
      <div className="text-center mt-40 text-lg font-medium">
        <span>Loading</span>
        <span>
          <span className="inline-block animate-blink text-xl ml-1">.</span>
          <span className="inline-block animate-blink [animation-delay:0.2s] text-xl ml-1">
            .
          </span>
          <span className="inline-block animate-blink [animation-delay:0.4s] text-xl ml-1">
            .
          </span>
        </span>
      </div>
    );
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="pb-8 xl:mx-[8rem]">
      <h1 className="font-semibold text-2xl mx-[3rem] my-[2rem]">My Library</h1>
      <div className="relative px-[3rem] space-y-6">
        {movieTiles.length > 0 && (
          <div className="space-y-8">
            {Array.from({
              length: Math.ceil(movieTiles.length / columnsPerRow),
            }).map((_, rowIndex) => (
              <div key={rowIndex}>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1">
                  {movieTiles
                    .slice(
                      rowIndex * columnsPerRow,
                      rowIndex * columnsPerRow + columnsPerRow
                    )
                    .map((tile) => (
                      <div
                        key={tile.movie_id}
                        className="overflow-hidden w-[200px]"
                      >
                        <img
                          src={tile.image || "/movie_default.svg"}
                          alt={tile.title}
                          className="w-full h-32 xl:h-40 object-contain"
                        />
                        <div>
                          <h3 className="text-lg xl:text-xl text-center font-semibold truncate">
                            {tile.title}
                          </h3>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="relative w-full mt-1">
                  {/* Horizontal shelf line */}
                  <div className="w-full border-b-4 border-brown_color shadow"></div>

                  {/* Vertical supports (legs) */}
                  <div className="absolute left-[10%] h-3 w-1 bg-brown_color shadow"></div>
                  <div className="absolute right-[10%] h-3 w-1 bg-brown_color shadow"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {bookTiles.length > 0 && (
          <div className="space-y-8">
            {Array.from({
              length: Math.ceil(bookTiles.length / columnsPerRow),
            }).map((_, rowIndex) => (
              <div key={rowIndex}>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1">
                  {bookTiles
                    .slice(
                      rowIndex * columnsPerRow,
                      rowIndex * columnsPerRow + columnsPerRow
                    )
                    .map((tile) => (
                      <div
                        key={tile.isbn}
                        className="overflow-hidden w-[200px]"
                      >
                        <img
                          src={tile.image || "/movie_default.svg"}
                          alt={tile.book_name}
                          className="w-full h-32 xl:h-40 object-contain"
                        />
                        <div>
                          <h3 className="text-lg xl:text-xl text-center font-semibold truncate">
                            {tile.book_name}
                          </h3>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="relative w-full mt-1">
                  {/* Horizontal shelf line */}
                  <div className="w-full border-b-4 border-brown_color shadow"></div>

                  {/* Vertical supports (legs) */}
                  <div className="absolute left-[10%] h-3 w-1 bg-brown_color"></div>
                  <div className="absolute right-[10%] h-3 w-1 bg-brown_color"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLibrary;
