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
          <h2 className="text-xl font-semibold mb-2">Movies</h2>
          <div className="relative flex justify-center items-center w-full">
            {/* Left Arrow - Outside Grid */}
            <button
              className={`mr-1 -ml-8 h-8 rounded-full flex items-center ${
                movieIndex === 0 ? "opacity-30" : ""
              }`}
              onClick={prevMovies}
            >
              <img
                src="left.svg"
                className="h-12 w-12 opacity-40 hover:opacity-50"
              />
            </button>

            {/* Movie Grid */}
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-3 overflow-hidden">
              {movieTiles
                .slice(movieIndex, movieIndex + itemsPerRow)
                .map((tile) => (
                  <div
                    key={tile.movie_id}
                    className="bg-white w-[175px] h-[250px] border rounded-lg shadow my-1 hover:shadow-lg overflow-hidden hover:cursor-pointer"
                    onClick={() => onTileClick(tile)}
                  >
                    <img
                      src={tile.image || "/movie_default.svg"}
                      alt={tile.title}
                      className="w-full h-44 object-contain"
                    />
                    <div className="p-1">
                      <h3 className="text-lg text-center font-semibold truncate">
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
              className={`ml-1 -mr-8 h-8 rounded-full flex items-center ${
                movieIndex + itemsPerRow >= movieTiles.length
                  ? "opacity-30"
                  : ""
              }`}
              onClick={nextMovies}
            >
              <img
                src="right.svg"
                className="h-12 w-12 opacity-40 hover:opacity-50"
              />
            </button>
          </div>
        </div>
      )}

      {/* BOOKS (if there are any) */}
      {bookTiles.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mt-4 mb-2">Books</h2>
          <div className="relative flex justify-center items-center w-full">
            {/* Left Arrow - Outside Grid */}
            <button
              className={`mr-1 -ml-8 h-8 rounded-full flex items-center ${
                bookIndex === 0 ? "opacity-30" : ""
              }`}
              onClick={prevBooks}
            >
              <img
                src="left.svg"
                className="h-12 w-12 opacity-40 hover:opacity-50"
              />
            </button>
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-3 overflow-hidden">
              {bookTiles
                .slice(bookIndex, bookIndex + itemsPerRow)
                .map((tile) => (
                  <div
                    key={tile.isbn}
                    className="bg-white w-[175px] h-[250px] border rounded-lg shadow my-1 hover:shadow-lg overflow-hidden hover:cursor-pointer"
                    onClick={() => onTileClick(tile)}
                  >
                    <img
                      src={tile.image || "/book_default.svg"}
                      alt={tile.book_name}
                      className="w-full h-44 object-contain"
                    />
                    <div className="p-1">
                      <h3 className="text-lg text-center font-semibold truncate">
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
              className={`ml-1 -mr-8 h-8 rounded-full flex items-center ${
                bookIndex + itemsPerRow >= bookTiles.length ? "opacity-30" : ""
              }`}
              onClick={nextBooks}
            >
              <img
                src="right.svg"
                className="h-12 w-12 opacity-40 hover:opacity-50"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecTile;
