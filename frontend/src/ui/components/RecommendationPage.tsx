import React, { useState } from "react";
import SearchRec from "./SearchRec";
import RecTile from "./RecTile";
import Stars from "./Stars";
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

  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useUser();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Search query: ", query);
  };

  const handleSearchRecommendClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
    setLoading(false);
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
      setAddShowPopup(false);
    }, 300);
  };

  return (
    <>
      <div className="">
        <SearchRec
          onSearch={handleSearch}
          onEnter={handleSearchRecommendClick}
        />
        <div className="flex justify-center mt-[1rem]">
          {/*TODO: this would call the code for the recommender*/}
          <button
            onClick={handleSearchRecommendClick}
            className="w-[25%] xl:w-[15%] ring ring-2 ring-secondary_hover_light bg-primary dark:bg-secondary_dark dark:ring-brand-dark rounded-xl py-2 px-8 text-lg font-semibold hover:bg-primary_light dark:hover:opacity-90"
          >
            Search
          </button>
        </div>
        {loading ? (
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
        ) : (
          showTiles && (
            <div className="py-2 mx-[4rem] flex justify-center">
              <RecTile tiles={tilesData} onTileClick={handleTileClick} />
            </div>
          )
        )}

        {/* POP UP CODE */}

        {/* MOVIE INFO TO DISPLAY
              title, genre, release date, movie rating, description, runtime
        */}
        {showPopup && selectedTile && selectedTile.type === "movie" && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-brand-dark dark:border dark:border-black h-[80%] 2xl:h-[65%] p-6 rounded-lg w-[60%] xl:w-[50%] 2xl:w-[40%] relative lg:px-12">
              <button
                onClick={handleClosePopup}
                className="absolute top-2 right-3 text-lg font-bold"
              >
                X
              </button>
              <h2 className="text-lg lg:text-2xl font-semibold mb-4 truncate">
                {selectedTile.title}
              </h2>
              <div className="relative w-full h-32 lg:h-60 mb-2">
                {/* Background blurred/low-opacity image */}
                <img
                  src={selectedTile.image || "/movie_default.svg"}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm"
                  aria-hidden="true"
                />

                {/* Foreground clean image */}
                <img
                  src={selectedTile.image || "/movie_default.svg"}
                  alt={selectedTile.title}
                  className="relative z-10 w-full h-full object-contain"
                />
              </div>
              <div className="flex gap-2 items-center">
                <p className="text-sm lg:text-base font-medium mb-2">
                  <Stars rating={selectedTile.movie_rating} type="movie" />
                </p>
                <p className="text-sm lg:text-base font-semibold">
                  {selectedTile.runtime} min
                </p>
              </div>
              <p className="text-sm lg:text-base italic mb-2 h-[27%] 2xl:h-[30%] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {selectedTile.description}
              </p>
              <p className="text-sm lg:text-base">
                <span className="font-semibold">Genre: </span>
                {selectedTile.genre}
              </p>
              <p className="text-sm lg:text-base">
                <span className="font-semibold">Released: </span>
                {selectedTile.release_date}
              </p>
              <p className="text-sm lg:text-base">
                <span className="font-semibold">Ratings: </span>
                {selectedTile.movie_rating_count}
              </p>
              <button
                className="rounded-full w-8 2xl:w-9 2xl:h-9 2xl:text-2xl h-8 flex justify-center font-bold text-xl ring-2 dark:ring-secondary_light dark:text-secondary_light dark:hover:ring-brand-light dark:hover:text-brand-light ring-secondary hover:ring-secondary_hover text-secondary hover:text-secondary_hover absolute bottom-4 lg:bottom-8 right-4 lg:right-8"
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
                      <div className="bg-white dark:bg-brand-dark p-6 rounded-lg w-[40%] 2xl:w-[30%] relative text-center">
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-brand-dark dark:border dark:border-black h-[80%] 2xl:h-[65%] p-6 rounded-lg w-[60%] xl:w-[50%] 2xl:w-[40%] relative lg:px-12">
              <button
                onClick={handleClosePopup}
                className="absolute top-2 right-3 text-lg font-bold"
              >
                X
              </button>
              <h2 className="text-xl lg:text-2xl font-semibold mb-2 truncate">
                {selectedTile.book_name}
              </h2>
              <div className="relative w-full h-32 lg:h-56 mb-2">
                {/* Background blurred/low-opacity image */}
                <img
                  src={selectedTile.image || "/movie_default.svg"}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm"
                  aria-hidden="true"
                />

                {/* Foreground clean image */}
                <img
                  src={selectedTile.image || "/movie_default.svg"}
                  alt={selectedTile.book_name}
                  className="relative z-10 w-full h-full object-contain"
                />
              </div>
              <div className="flex gap-2 items-center -mb-1">
                <p className="text-sm lg:text-base font-medium mb-2">
                  <Stars rating={selectedTile.book_rating} type="book" />
                </p>
                <p className="text-sm lg:text-base font-semibold">
                  {selectedTile.author}
                </p>
              </div>
              <p className="text-sm lg:text-base italic mb-2 h-[27%] 2xl:h-[30%] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {selectedTile.description}
              </p>
              <p className="text-sm lg:text-base">
                <span className="font-semibold">Publisher: </span>
                {selectedTile.publisher}
              </p>
              <p className="text-sm lg:text-base">
                <span className="font-semibold">Published: </span>
                {selectedTile.publication_date}
              </p>
              <p className="text-sm lg:text-base">
                <span className="font-semibold">Ratings: </span>
                {selectedTile.book_rating_count}
              </p>
              <p className="text-sm lg:text-base">
                <span className="font-semibold">ISBN: </span>
                {selectedTile.isbn}
              </p>
              <button
                className="rounded-full w-8 h-8 flex justify-center font-bold text-xl ring-2 dark:ring-secondary_light dark:text-secondary_light dark:hover:ring-brand-light dark:hover:text-brand-light ring-secondary hover:ring-secondary_hover text-secondary hover:text-secondary_hover absolute bottom-4 lg:bottom-8 right-4 lg:right-8"
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
                      <div className="bg-white dark:bg-brand-dark p-6 rounded-lg w-[40%] 2xl:w-[30%] relative text-center">
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
      </div>
    </>
  );
};

export default RecommendationPage;
