import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Stars from "./Stars";
import StarRating from "./StarRating";
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

const MyList: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]); // state to hold the list of tiles
  const [loading, setLoading] = useState<boolean>(true); // state for loading state
  const [rating, setRating] = useState<number | null>(null);

  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.user_id) return; // Ensure user_id exists before making the request
      const data: any = {
        userId: user.user_id,
      };
      try {
        const response = await axios.post(
          "http://localhost:5000/grabList",
          data
        );
        setTiles(response.data); //don't know what I need yet...
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRate = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = (tile: Tile) => {
    if (!rating) return;

    const data: any = {
      userId: user?.user_id,
      rating: rating,
      type: tile.type,
    };

    console.log("rating selected: ", data.rating);

    if (tile.type === "movie") {
      data.identifier = tile.movie_id;
    } else if (tile.type === "book") {
      data.identifier = tile.isbn;
    }

    console.log("Sending to backend: ", data);

    axios
      .post("http://localhost:5000/addLib", data)
      .then((response) => {
        console.log("Data sent successfully:", response);
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  };

  // Separate books and movies
  const books = tiles.filter((tile) => tile.type === "book");
  const movies = tiles.filter((tile) => tile.type === "movie");

  return (
    <div>
      <Navbar />
      <h1>My List</h1>
      {tiles.length > 0 && (
        <div className="flex gap-4">
          <div className="grid grid-cols-1 gap-6">
            {movies.map((tile) => (
              /* TODO: CHECK THAT THE PARAMS MATCH UP WITH WHAT YOU GET FROM BACKEND */
              <div
                key={tile.movie_id}
                className="bg-white border rounded-lg shadow-md overflow-hidden hover:cursor-pointer flex"
              >
                <div>
                  <img
                    src={tile.image || "/movie_default.svg"}
                    alt={tile.title}
                    className="w-full h-44 object-contain bg-blue-400"
                  />
                </div>
                <div className="p-2 bg-blue-200 flex flex-col">
                  <h3 className="text-lg text-center font-semibold">
                    {tile.title}
                  </h3>
                  <div className="flex flex-row">
                    {/*TODO: THE RATING HAS TO BE STARS*/}
                    <StarRating onRate={handleRate} />
                    <button
                      onClick={() => handleSubmit}
                      className="text-base text-center font-semibold flex justify-center"
                    >
                      Watched It!
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6">
            {books.map((tile) => (
              /* TODO: CHECK THAT THE PARAMS MATCH UP WITH WHAT YOU GET FROM BACKEND */
              <div
                key={tile.movie_id}
                className="bg-white border rounded-lg shadow-md overflow-hidden hover:cursor-pointer flex"
              >
                <div>
                  <img
                    src={tile.image || "/movie_default.svg"}
                    alt={tile.book_name}
                    className="w-full h-44 object-contain bg-blue-400"
                  />
                </div>
                <div className="p-2 bg-blue-200 flex flex-col">
                  <h3 className="text-lg text-center font-semibold">
                    {tile.book_name}
                  </h3>
                  <div className="flex flex-row">
                    {/*TODO: THE RATING HAS TO BE STARS*/}
                    <StarRating onRate={handleRate} />
                    <button
                      onClick={() => handleSubmit}
                      className="text-base text-center font-semibold flex justify-center"
                    >
                      Read It!
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyList;
