import React, { useState, useEffect } from "react";
import SearchRec from "./SearchRec";
import RecTile from "./RecTile";
import { Link } from "react-router-dom";
import axios from "axios";

interface Tile {
  type: "book" | "movie";
  id: number;
  imageUrl: string;
  title: string;
  summary: string;
  author?: string;
  rating: number;
  publisher?: string;
  pub_date?: string;
  rating_count?: number;
  isbn?: string;
  runtime?: string;
  genre?: string;
  release_date?: string;
}

const RecommendationPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tilesData, setTilesData] = useState<Tile[]>([]);
  const [showTiles, setShowTiles] = useState<boolean>(false);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  // const [fetchedData, setFetchedData] = useState<Tile[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Search query: ", query);
  };

  /* THIS IS FOR TESTING PURPOSES ONLY COMMENT OUT WHEN USING BACKEND */
  // const handleSearchRecommendClick = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const fetchedData: Tile[] = [
  //     {
  //       type: "book",
  //       id: 1,
  //       imageUrl: "https://via.placeholder.com/150",
  //       title: "Tile 1",
  //       summary: "This is a summary of Tile 1",
  //       author: "Author 1",
  //       rating: 4.5,
  //     },
  //     {
  //       type: "book",
  //       id: 2,
  //       imageUrl: "https://via.placeholder.com/150",
  //       title: "Tile 2",
  //       summary: "This is a summary of Tile 2",
  //       author: "Author 2",
  //       rating: 3.8,
  //     },
  //     {
  //       type: "movie",
  //       id: 3,
  //       imageUrl: "https://via.placeholder.com/150",
  //       title: "Tile 3",
  //       summary: "This is a summary of Tile 3",
  //       author: "Author 3",
  //       rating: 4.2,
  //     },
  //     {
  //       type: "book",
  //       id: 4,
  //       imageUrl: "https://via.placeholder.com/150",
  //       title: "Tile 4",
  //       summary: "This is a summary of Tile 4",
  //       author: "Author 4",
  //       rating: 4.0,
  //     },
  //     {
  //       type: "movie",
  //       id: 5,
  //       imageUrl: "https://via.placeholder.com/150",
  //       title: "Tile 5",
  //       summary: "This is a summary of Tile 5",
  //       author: "Author 5",
  //       rating: 4.7,
  //     },
  //     {
  //       type: "book",
  //       id: 6,
  //       imageUrl: "https://via.placeholder.com/150",
  //       title: "Tile 6",
  //       summary: "This is a summary of Tile 6",
  //       author: "Author 6",
  //       rating: 3.5,
  //     },
  //   ];
  //   setTilesData(fetchedData);
  //   setShowTiles(true);
  // };

  /* THIS IS FOR REAL, UNCOMMENT WHEN DONE TESTING */
  const handleSearchRecommendClick = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/search", {
        searchQuery,
      });

      setTilesData(response.data);
      //grab info from response
      console.error("Response from recommend:", response.data);
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

  return (
    <>
      <div className="">
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
            to="/welcome"
            className="text-blue-600 hover:underline underline-offset-2"
          >
            Back to Welcome
          </Link>
        </div>
        <SearchRec onSearch={handleSearch} />
        <div className="flex justify-center mt-[2rem]">
          {/*TODO: this would call the code for the recommender*/}
          <button
            onClick={handleSearchRecommendClick}
            className="w-[25%] ring ring-2 ring-blue-400 bg-blue-200 rounded-xl py-2 px-8 text-lg font-semibold hover:bg-blue-100 hover:ring-blue-300"
          >
            Recommend
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
                src={selectedTile.imageUrl}
                alt={selectedTile.title}
                className="w-full h-48 object-cover mb-4"
              />
              <p className="text-sm">{selectedTile.summary}</p>
              <p className="text-sm">{selectedTile.runtime}</p>
              <p className="text-sm mb-2">Genre: {selectedTile.genre}</p>
              <p className="text-sm">Released: {selectedTile.release_date}</p>
              <p className="text-sm font-medium mb-2">
                Rating: {selectedTile.rating}
              </p>
              <p className="text-sm">{selectedTile.rating_count}</p>
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
                {selectedTile.title}
              </h2>
              <img
                src={selectedTile.imageUrl}
                alt={selectedTile.title}
                className="w-full h-48 object-cover mb-4"
              />
              <p className="text-sm">{selectedTile.summary}</p>
              <p className="text-sm mb-2">Author: {selectedTile.author}</p>
              <p className="text-sm">{selectedTile.publisher}</p>
              <p className="text-sm">{selectedTile.pub_date}</p>
              <p className="text-sm font-medium mb-2">
                Rating: {selectedTile.rating}
              </p>
              <p className="text-sm">{selectedTile.rating_count}</p>
              <p className="text-sm">{selectedTile.isbn}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RecommendationPage;
