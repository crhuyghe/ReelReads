import React, { useState } from "react";
import Stars from "./Stars";

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

interface TilesGridProps {
  tiles: Tile[];
  onTileClick: (tile: Tile) => void;
}

const RecTile: React.FC<TilesGridProps> = ({ tiles, onTileClick }) => {
  //filter movies and books based on "type" param
  const movieTiles = tiles.filter((tile) => tile.type === "movie");
  const bookTiles = tiles.filter((tile) => tile.type === "book");

  const itemsPerRow = window.innerWidth >= 1024 ? 4 : 3; // 4 for large, 3 for small screens

  const [movieIndex, setMovieIndex] = useState(0);
  const [bookIndex, setBookIndex] = useState(0);

  const nextMovies = () => {
    if (movieIndex + itemsPerRow < movieTiles.length) {
      setMovieIndex(movieIndex + itemsPerRow);
    }
  };

  const prevMovies = () => {
    if (movieIndex - itemsPerRow >= 0) {
      setMovieIndex(movieIndex - itemsPerRow);
    }
  };

  const nextBooks = () => {
    if (bookIndex + itemsPerRow < bookTiles.length) {
      setBookIndex(bookIndex + itemsPerRow);
    }
  };

  const prevBooks = () => {
    if (bookIndex - itemsPerRow >= 0) {
      setBookIndex(bookIndex - itemsPerRow);
    }
  };

  return (
    <div>
      {/* MOVIES (if there are any) */}
      {movieTiles.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Movies</h2>
          <div className="relative flex items-center">
            {/* Left Arrow - Outside Grid */}
            <button
              className={`mr-4 h-8 rounded-full flex items-center hover:bg-blue-200 ${
                movieIndex === 0 ? "invisible" : ""
              }`}
              onClick={prevMovies}
            >
              <img src="left_arrow.svg" className="h-16 w-16" />
            </button>

            {/* Movie Grid */}
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-6 overflow-hidden">
              {movieTiles
                .slice(movieIndex, movieIndex + itemsPerRow)
                .map((tile) => (
                  <div
                    key={tile.movie_id}
                    className="bg-white border rounded-lg shadow-md overflow-hidden hover:cursor-pointer"
                    onClick={() => onTileClick(tile)}
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
                      <h4 className="text-base text-center font-semibold flex justify-center">
                        <Stars rating={tile.movie_rating} type="movie" />
                      </h4>
                    </div>
                  </div>
                ))}
            </div>
            {/* Right Arrow */}
            <button
              className={`ml-4 h-8 rounded-full flex items-center hover:bg-blue-200 ${
                movieIndex + itemsPerRow >= movieTiles.length ? "invisible" : ""
              }`}
              onClick={nextMovies}
            >
              <img src="right_arrow.svg" className="h-16 w-16" />
            </button>
          </div>
        </div>
      )}

      {/* BOOKS (if there are any) */}
      {bookTiles.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold my-4">Books</h2>
          <div className="relative flex items-center">
            {/* Left Arrow - Outside Grid */}
            <button
              className={`mr-4 h-8 rounded-full flex items-center hover:bg-blue-200 ${
                movieIndex === 0 ? "invisible" : ""
              }`}
              onClick={prevBooks}
            >
              <img src="left_arrow.svg" className="h-16 w-16" />
            </button>
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-6 overflow-hidden">
              {bookTiles
                .slice(bookIndex, bookIndex + itemsPerRow)
                .map((tile) => (
                  <div
                    key={tile.isbn}
                    className="bg-white border rounded-lg shadow-md overflow-hidden hover:cursor-pointer"
                    onClick={() => onTileClick(tile)}
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
                      <h4 className="text-base text-center font-semibold flex justify-center">
                        <Stars rating={tile.book_rating} type="book" />
                      </h4>
                    </div>
                  </div>
                ))}
            </div>
            {/* Right Arrow */}
            <button
              className={`ml-4 h-8 rounded-full flex items-center hover:bg-blue-200 ${
                movieIndex + itemsPerRow >= movieTiles.length ? "invisible" : ""
              }`}
              onClick={nextBooks}
            >
              <img src="right_arrow.svg" className="h-16 w-16" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecTile;
