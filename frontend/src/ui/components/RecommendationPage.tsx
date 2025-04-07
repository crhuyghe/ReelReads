import React, { useState } from "react";
import SearchRec from "./SearchRec";
import RecTile from "./RecTile";
import Stars from "./Stars";
import Navbar from "./Navbar";
import axios from "axios";
import { useUser } from "./UserContext";
import StarRating from "./StarRating";

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

const RecommendationPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tilesData, setTilesData] = useState<Tile[]>([]);
  const [showTiles, setShowTiles] = useState<boolean>(false);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [addShowPopup, setAddShowPopup] = useState<boolean>(false);

  const [rating, setRating] = useState<number | null>(null);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  // const [fetchedData, setFetchedData] = useState<Tile[]>([]);

  const { user } = useUser();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Search query: ", query);
  };

  const handleSearchRecommendClick = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/search", {
        searchQuery,
      });
      // Handle API response
      console.log("Response from recommend:", response.data);
      if (response.data && Array.isArray(response.data.fetched_data)) {
        setTilesData(response.data.fetched_data);
        console.log("Response formatted: ", response.data.fetched_data);
      } else {
        console.error("Fetched data is not in the expected format");
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching your recommendations",
        error
      );
    }

    setShowTiles(true);
  };

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

  return (
    <>
      <Navbar />
      <h2>CURRENT USER: {user?.user_id}</h2>
      <div className="">
        <SearchRec onSearch={handleSearch} />
        <div className="flex justify-center mt-[2rem]">
          {/*TODO: this would call the code for the recommender*/}
          <button
            onClick={handleSearchRecommendClick}
            className="w-[25%] ring ring-2 ring-blue-400 bg-blue-200 rounded-xl py-2 px-8 text-lg font-semibold hover:bg-blue-100 hover:ring-blue-300"
          >
            Search
          </button>
        </div>
        {showTiles && (
          <div className="my-[2rem] mx-[4rem]">
            <RecTile tiles={tilesData} onTileClick={handleTileClick} />
          </div>
        )}

        {/* POP UP CODE */}

        {/* MOVIE INFO TO DISPLAY
              title, genre, release date, movie rating, description, runtime
        */}
        {showPopup && selectedTile && selectedTile.type === "movie" && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[60%] relative">
              <button
                onClick={handleClosePopup}
                className="absolute top-2 right-3 text-lg font-bold"
              >
                X
              </button>
              <h2 className="text-xl font-semibold mb-4">
                {selectedTile.title}
              </h2>
              <img
                src={selectedTile.image || "/movie_default.svg"}
                alt={selectedTile.title}
                className="w-full h-48 object-contain mb-4"
              />
              <div className="flex gap-2 items-center">
                <p className="text-sm font-medium mb-2">
                  <Stars rating={selectedTile.movie_rating} type="movie" />
                </p>
                <p className="text-sm font-semibold">
                  {selectedTile.runtime} min
                </p>
              </div>
              <p className="text-sm italic mb-2">{selectedTile.description}</p>
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
                className="rounded-full w-10 h-10 flex justify-center font-bold text-2xl ring-2 ring-blue-500 text-black absolute bottom-4 right-4"
                onClick={() => addTile(selectedTile)}
              >
                +
              </button>
              {addShowPopup && (
                <div className="z-20 absolute right-0 -mt-32 w-40 bg-white shadow-md rounded-md border p-2 text-left">
                  <button
                    onClick={() => handleAddRec(selectedTile)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Add to Watch List
                  </button>
                  <button
                    onClick={() => handleAddLibrary()}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Add to Library
                  </button>
                  {showRatingPopup && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                      <div className="bg-white p-6 rounded-lg w-[60%] relative">
                        <button
                          onClick={() => setShowRatingPopup(false)} // Close the popup
                          className="absolute top-2 right-3 text-lg font-bold"
                        >
                          X
                        </button>
                        <h2 className="text-xl font-semibold mb-4">
                          Rate {selectedTile.title}
                        </h2>
                        <StarRating onRate={handleRate} />{" "}
                        {/* Your star rating component */}
                        <button
                          onClick={() => handleSubmit(selectedTile)}
                          className="mt-4 bg-blue-500 text-white rounded px-4 py-2"
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
            <div className="bg-white p-6 rounded-lg w-[60%] relative">
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
                className="w-full h-48 object-contain mb-4"
              />
              <div className="flex gap-2 items-center">
                <p className="text-sm font-medium mb-2">
                  <Stars rating={selectedTile.book_rating} type="book" />
                </p>
                <p className="text-sm font-semibold">{selectedTile.author}</p>
              </div>
              <p className="text-sm italic mb-2">{selectedTile.description}</p>
              <p className="text-sm">
                <span className="font-semibold">Publisher: </span>
                {selectedTile.publisher}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Published: </span>
                {selectedTile.publication_date}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Ratings: </span>
                {selectedTile.book_rating_count}
              </p>
              <p className="text-sm">
                <span className="font-semibold">ISBN: </span>
                {selectedTile.isbn}
              </p>
              <button
                className="rounded-full w-10 h-10 flex justify-center font-bold text-2xl ring-2 ring-blue-500 text-black absolute bottom-4 right-4"
                onClick={() => addTile(selectedTile)}
              >
                +
              </button>
              {addShowPopup && (
                <div className="z-20 absolute right-0 -mt-32 w-40 bg-white shadow-md rounded-md border p-2 text-left">
                  <button
                    onClick={() => handleAddRec(selectedTile)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Add to Read List
                  </button>
                  <button
                    onClick={() => handleAddLibrary()}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Add to Library
                  </button>
                  {showRatingPopup && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                      <div className="bg-white p-6 rounded-lg w-[60%] relative">
                        <button
                          onClick={() => setShowRatingPopup(false)} // Close the popup
                          className="absolute top-2 right-3 text-lg font-bold"
                        >
                          X
                        </button>
                        <h2 className="text-xl font-semibold mb-4">
                          Rate {selectedTile.book_name}
                        </h2>
                        <StarRating onRate={handleRate} />{" "}
                        {/* Your star rating component */}
                        <button
                          onClick={() => handleSubmit(selectedTile)}
                          className="mt-4 bg-blue-500 text-white rounded px-4 py-2"
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
      </div>
    </>
  );
};

export default RecommendationPage;
