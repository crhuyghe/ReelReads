import React from "react";

interface Tile {
  type: "book" | "movie";
  image?: string;
  movie_id?: string;
  title?: string;
  genres?: string[];
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

  return (
    <div>
      {/* MOVIES (if there are any) */}
      {movieTiles.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Movies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movieTiles.map((tile) => (
              /* TODO: CHECK THAT THE PARAMS MATCH UP WITH WHAT YOU GET FROM BACKEND */
              <div
                key={tile.movie_id}
                className="bg-white border rounded-lg shadow-md overflow-hidden hover:cursor-pointer"
                onClick={() => onTileClick(tile)}
              >
                <img
                  src={tile.image}
                  alt={tile.title}
                  className="w-full h-44 object-cover bg-blue-400"
                />
                <div className="p-2 bg-blue-200">
                  <h3 className="text-lg text-center font-semibold">
                    {tile.title}
                  </h3>
                  {/*TODO: THE RATING HAS TO BE STARS*/}
                  <h4 className="text-base text-center font-semibold">
                    {tile.movie_rating}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOOKS (if there are any) */}
      {bookTiles.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold my-4">Books</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bookTiles.map((tile) => (
              <div
                key={tile.isbn}
                className="bg-white border rounded-lg shadow-md overflow-hidden hover:cursor-pointer"
                onClick={() => onTileClick(tile)}
              >
                <img
                  src={tile.image}
                  alt={tile.title}
                  className="w-full h-44 object-cover bg-blue-400"
                />
                <div className="p-2 bg-blue-200">
                  <h3 className="text-lg text-center font-semibold">
                    {tile.title}
                  </h3>
                  {/*TODO: THE RATING HAS TO BE STARS*/}
                  <h4 className="text-base text-center font-semibold">
                    {tile.book_rating}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecTile;
