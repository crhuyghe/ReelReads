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
  console.log("User from context: ", user);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.user_id) return; // Wait until user_id is available
      setLoading(true); // Set loading state before fetching

      try {
        const response = await axios.post("http://localhost:5000/grabList", {
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

  const handleRate = (newRating: number) => {
    console.log("New rating received:", newRating); // Check if rating is being set
    setRating(newRating);
  };

  const handleSubmit = (tile: Tile) => {
    console.log("Submitting for tile: ", tile);
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
      .post("http://localhost:5000/updateLib", data)
      .then((response) => {
        console.log("Data sent successfully:", response);
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  };

  const handleRemove = (tile: Tile) => {
    console.log("removing tile: ", tile);
    const data: any = {
      userId: user?.user_id,
    };

    if (tile.movie_id) {
      data.type = "movie";
      data.identifier = tile.movie_id;
    } else {
      data.type = "book";
      data.identifier = tile.isbn;
    }

    console.log("Sending to backend: ", data);

    axios
      .post("http://localhost:5000/removeList", data)
      .then((response) => {
        console.log("Data removed successfully:", response);
        setTiles((prevTiles) => prevTiles.filter((t) => t !== tile)); //filter out the one you deleted for now until the user comes back to page
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  };

  // Separate books and movies
  console.log("tile", tiles);
  const books = tiles.filter((tile) => tile.isbn);
  const movies = tiles.filter((tile) => tile.movie_id);
  console.log("Movies:", movies);
  console.log("Books:", books);

  return (
    <div>
      <Navbar />
      <h1 className="font-semibold text-2xl mx-[3rem] mt-[2rem]">My List</h1>
      <div className="flex justify-between gap-6 my-[2rem] mx-[3rem]">
        <div className="flex flex-col w-full">
          <div className="grid grid-cols-1 gap-2 w-full">
            {movies.map((tile) => (
              /* TODO: CHECK THAT THE PARAMS MATCH UP WITH WHAT YOU GET FROM BACKEND */
              <div
                key={tile.movie_id}
                className="relative bg-white border rounded-lg shadow-md overflow-hidden flex"
              >
                <button
                  onClick={() => handleRemove(tile)}
                  className="absolute bottom-2 right-2"
                >
                  <img src="/trash.svg" className="w-5" />
                </button>
                <div>
                  <img
                    src={tile.image || "/movie_default.svg"}
                    alt={tile.title}
                    className="w-full h-40 object-contain bg-blue-400"
                  />
                </div>
                <div className="px-2 py-6 bg-blue-200 flex flex-col w-full gap-2">
                  <h3 className="text-xl text-center font-semibold">
                    {tile.title}
                  </h3>
                  <div className="flex flex-col items-center gap-1">
                    {/*TODO: THE RATING HAS TO BE STARS*/}
                    <StarRating onRate={handleRate} />
                    <button
                      onClick={() => handleSubmit(tile)}
                      className="ring ring-2 ring-blue-400 rounded-md hover:bg-blue-100 px-2 py-1 text-base text-center font-semibold flex justify-center"
                    >
                      Watched It!
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="grid grid-cols-1 gap-2 w-full">
            {books.map((tile) => (
              /* TODO: CHECK THAT THE PARAMS MATCH UP WITH WHAT YOU GET FROM BACKEND */
              <div
                key={tile.isbn}
                className="relative h-40 bg-white border rounded-lg shadow-md overflow-hidden flex"
              >
                <button
                  onClick={() => handleRemove(tile)}
                  className="absolute bottom-2 right-2"
                >
                  <img src="/trash.svg" className="w-5" />
                </button>
                <div>
                  <img
                    src={tile.image || "/book_default.svg"}
                    alt={tile.book_name}
                    className="w-full h-40 object-contain bg-blue-400"
                  />
                </div>
                <div className="px-2 py-6 bg-blue-200 flex flex-col w-full gap-2">
                  <h3 className="text-xl font-semibold text-center leading-tight flex-grow overflow-hidden">
                    {tile.book_name}
                  </h3>
                  <div className="flex flex-col items-center gap-1">
                    {/*TODO: THE RATING HAS TO BE STARS*/}
                    <StarRating onRate={handleRate} />
                    <button
                      onClick={() => handleSubmit(tile)}
                      className="ring ring-2 ring-blue-400 rounded-md hover:bg-blue-100 px-2 py-1 text-base text-center font-semibold flex justify-center"
                    >
                      Read It!
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyList;
