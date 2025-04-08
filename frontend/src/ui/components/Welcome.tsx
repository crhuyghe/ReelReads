import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useUser } from "./UserContext";
import QuizQuestion from "./QuizQuestion";
import ScrollingWrapper from "./ScrollingWrapper";
import Stars from "./Stars";
import StarRating from "./StarRating";
import axios from "axios";

interface Tile {
  type: "book" | "movie";
  image?: string;
  movie_id?: string;
  title?: string;
  genre?: string;
  release_date?: string;
  movie_rating?: number;
  movie_rating_count?: number;
  runtime?: number;
  book_name?: string;
  description: string;
  author?: string;
  book_rating?: number;
  publisher?: string;
  publication_date?: string;
  book_rating_count?: number;
  isbn?: string;
}

const Welcome = () => {
  console.log("Current pathname:", location.pathname);
  const [tilesData, setTilesData] = useState<Tile[]>([]);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [addShowPopup, setAddShowPopup] = useState<boolean>(false);
  const [rating, setRating] = useState<number | null>(null);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchTilesData = async () => {
      if (!user?.user_id) return; // Ensure user_id exists before making the request

      try {
        const response = await axios.post("http://localhost:5000/recommend", {
          userId: user.user_id,
        });

        if (response.data && Array.isArray(response.data.fetched_data)) {
          setTilesData(response.data.fetched_data);
          console.log("Response formatted: ", response.data.fetched_data);
        } else {
          console.error("Fetched data is not in the expected format");
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching recommendations",
          error
        );
      }
    };

    fetchTilesData();
  }, []);

  const handleTileClick = (tile: Tile) => {
    setSelectedTile(tile); //set popup info to the matching clicked tile
    setShowPopup(true); //show popup when tile is clicked
  };

  const handleClosePopup = () => {
    setShowPopup(false); // close popup when x is clicked
    setSelectedTile(null); //reset the tile popup
  };

  const addTile = (tile: Tile) => {
    //ADD CODE TO ADD TILE INFO
    setAddShowPopup(!addShowPopup);
    console.log("added tile to user data", tile);
  };

  //needs to send user_id, and id of the tile
  const handleAddRec = (tile: Tile) => {
    console.log("Made it inside handleAddRec. User_id: ", user?.user_id);
    if (!user?.user_id) return; // Ensure user_id exists before making the request
    console.log("has a user id");
    const data: any = {
      userId: user.user_id,
      type: tile.type,
    };

    if (tile.type === "movie") {
      data.identifier = tile.movie_id;
    } else if (tile.type === "book") {
      data.identifier = tile.isbn;
    }

    axios
      .post("http://localhost:5000/addList", data)
      .then((response) => {
        console.log("Data sent successfully:", response);
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });

    setTimeout(() => {
      setAddShowPopup(false); // Close popup after 0.3 seconds
    }, 300);
  };

  //needs to send user_id, rating, and id of tile
  //TODO: Still need to prompt a rating!!!
  const handleAddLibrary = () => {
    if (!user?.user_id) return; // Ensure user_id exists before making the request

    // Show the rating popup
    setShowRatingPopup(true);
  };

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

    setTimeout(() => {
      setShowRatingPopup(false); // Close popup after 0.3 seconds
    }, 300);
  };

  console.log("Tile Length: ", tilesData.length);
  const movieTiles = tilesData.filter((tile) => tile.type === "movie");
  const bookTiles = tilesData.filter((tile) => tile.type === "book");

  return (
    <>
      <div className="flex flex-col items-center mt-2 mx-8">
        {movieTiles.length > 0 && (
          <ScrollingWrapper
            tiles={movieTiles}
            title="Movies For You"
            onTileClick={handleTileClick}
          />
        )}
        {movieTiles.length > 0 && (
          <ScrollingWrapper
            tiles={bookTiles}
            title="Books For You"
            onTileClick={handleTileClick}
          />
        )}
        {showPopup && selectedTile && selectedTile.type === "movie" && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-brand-dark dark:border dark:border-black h-[80%] p-6 rounded-lg w-[60%] relative">
              <button
                onClick={handleClosePopup}
                className="absolute top-2 right-3 text-lg font-bold"
              >
                X
              </button>
              <h2 className="text-lg font-semibold mb-4">
                {selectedTile.title}
              </h2>
              <img
                src={selectedTile.image || "/movie_default.svg"}
                alt={selectedTile.title}
                className="w-full h-32 object-contain mb-2"
              />
              <div className="flex gap-2 items-center">
                <p className="text-sm font-medium mb-2">
                  <Stars rating={selectedTile.movie_rating} type="movie" />
                </p>
                <p className="text-sm font-semibold">
                  {selectedTile.runtime} min
                </p>
              </div>
              <p className="text-xs italic mb-1 h-[28%] overflow-y-hidden">
                {selectedTile.description}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Genre: </span>
                {selectedTile.genre}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Released: </span>
                {selectedTile.release_date}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Ratings: </span>
                {selectedTile.movie_rating_count}
              </p>
              <button
                className="rounded-full w-8 h-8 flex justify-center font-bold text-xl ring-2 dark:ring-secondary_light dark:text-secondary_light dark:hover:ring-brand-light dark:hover:text-brand-light ring-secondary hover:ring-secondary_hover text-secondary hover:text-secondary_hover absolute bottom-4 right-4"
                onClick={() => addTile(selectedTile)}
              >
                +
              </button>
              {addShowPopup && (
                <div className="z-20 absolute right-0 -mt-32 w-40 bg-white dark:bg-brand-dark shadow-md rounded-md border dark:border-black p-2 text-left">
                  <button
                    onClick={() => handleAddRec(selectedTile)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
                  >
                    Add to Watch List
                  </button>
                  <button
                    onClick={() => handleAddLibrary()}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
                  >
                    Add to Library
                  </button>
                  {showRatingPopup && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                      <div className="bg-white dark:bg-brand-dark p-6 rounded-lg w-[40%] relative text-center">
                        <button
                          onClick={() => setShowRatingPopup(false)} // Close the popup
                          className="absolute top-2 right-3 text-lg font-bold"
                        >
                          X
                        </button>
                        <h2 className="text-xl font-semibold mb-4">
                          {selectedTile.title}
                        </h2>
                        <StarRating onRate={handleRate} />{" "}
                        {/* Your star rating component */}
                        <button
                          onClick={() => handleSubmit(selectedTile)}
                          className="mt-4 bg-secondary dark:bg-secondary_hover_light dark:text-black dark:hover:bg-secondary_hover_light2 hover:bg-secondary_hover text-white rounded px-4 py-2"
                        >
                          Submit Rating
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* BOOK INFO TO DISPLAY
              name, author, publication date, publisher description, book rating
        */}
        {showPopup && selectedTile && selectedTile.type === "book" && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-brand-dark dark:border dark:border-black h-[80%] p-6 rounded-lg w-[60%] relative">
              <button
                onClick={handleClosePopup}
                className="absolute top-2 right-3 text-lg font-bold"
              >
                X
              </button>
              <h2 className="text-xl font-semibold mb-4">
                {selectedTile.book_name}
              </h2>
              <img
                src={selectedTile.image || "/book_default.svg"}
                alt={selectedTile.book_name}
                className="w-full h-32 object-contain mb-2"
              />
              <div className="flex gap-2 items-center -mb-1">
                <p className="text-sm font-medium mb-2">
                  <Stars rating={selectedTile.book_rating} type="book" />
                </p>
                <p className="text-sm font-semibold">{selectedTile.author}</p>
              </div>
              <p className="text-xs italic mb-2 h-[29%] overflow-y-hidden">
                {selectedTile.description}
              </p>
              <p className="text-xs">
                <span className="font-semibold">Publisher: </span>
                {selectedTile.publisher}
              </p>
              <p className="text-xs">
                <span className="font-semibold">Published: </span>
                {selectedTile.publication_date}
              </p>
              <p className="text-xs">
                <span className="font-semibold">Ratings: </span>
                {selectedTile.book_rating_count}
              </p>
              <p className="text-xs">
                <span className="font-semibold">ISBN: </span>
                {selectedTile.isbn}
              </p>
              <button
                className="rounded-full w-8 h-8 flex justify-center font-bold text-xl ring-2 dark:ring-secondary_light dark:text-secondary_light dark:hover:ring-brand-light dark:hover:text-brand-light ring-secondary hover:ring-secondary_hover text-secondary hover:text-secondary_hover absolute bottom-4 right-4"
                onClick={() => addTile(selectedTile)}
              >
                +
              </button>
              {addShowPopup && (
                <div className="z-20 absolute right-0 -mt-32 w-40 bg-white dark:bg-brand-dark shadow-md rounded-md border dark:border-black p-2 text-left">
                  <button
                    onClick={() => handleAddRec(selectedTile)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
                  >
                    Add to Read List
                  </button>
                  <button
                    onClick={() => handleAddLibrary()}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
                  >
                    Add to Library
                  </button>
                  {showRatingPopup && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                      <div className="bg-white dark:bg-brand-dark p-6 rounded-lg w-[40%] relative text-center">
                        <button
                          onClick={() => setShowRatingPopup(false)} // Close the popup
                          className="absolute top-2 right-3 text-lg font-bold"
                        >
                          X
                        </button>
                        <h2 className="text-xl font-semibold mb-4">
                          {selectedTile.book_name}
                        </h2>
                        <StarRating onRate={handleRate} />{" "}
                        {/* Your star rating component */}
                        <button
                          onClick={() => handleSubmit(selectedTile)}
                          className="mt-4 bg-secondary dark:bg-secondary_hover_light dark:text-black dark:hover:bg-secondary_hover_light2 hover:bg-secondary_hover text-white rounded px-4 py-2"
                        >
                          Submit Rating
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="w-[70%] mt-8 mb-12">
          {/* QUIZ */}
          <QuizQuestion />
        </div>
      </div>
    </>
  );
};

export default Welcome;
