import React from "react";

interface Tile {
  id: number;
  imageUrl: string;
  title: string;
  summary: string;
  author: string;
  rating: number;
}

interface TilesGridProps {
  tiles: Tile[];
  onTileClick: (tile: Tile) => void;
}

const RecTile: React.FC<TilesGridProps> = ({ tiles, onTileClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {tiles.map((tile) => (
        <div
          key={tile.id}
          className="bg-white border rounded-lg shadow-md overflow-hidden hover:cursor-pointer"
          onClick={() => onTileClick(tile)}
        >
          <img
            src={tile.imageUrl}
            alt={tile.title}
            className="w-full h-44 object-cover bg-blue-400"
          />
          <div className="p-2 bg-blue-200">
            <h3 className="text-lg text-center font-semibold">{tile.title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecTile;
