import React from "react";
import Navbar from "./Navbar";
import Stars from "./Stars";
import StarRating from "./StarRating";

// interface Tile {
//   type: "book" | "movie";
//   image?: string;
//   movie_id?: string;
//   title?: string;
//   book_name?: string;
//   isbn?: string;
// }

// interface TilesGridProps {
//   tiles: Tile[];
// }

const MyList = () => {
  //   const movieTiles = tiles.filter((tile) => tile.type === "movie");
  //   const bookTiles = tiles.filter((tile) => tile.type === "book");
  return (
    //     <div>
    <Navbar />
    //       My List
    //       {movieTiles.length > 0 && (
    //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    //           {movieTiles.map((tile) => (
    //             /* TODO: CHECK THAT THE PARAMS MATCH UP WITH WHAT YOU GET FROM BACKEND */
    //             <div
    //               key={tile.movie_id}
    //               className="bg-white border rounded-lg shadow-md overflow-hidden hover:cursor-pointer flex"}
    //             >
    //                 <div>
    //               <img
    //                 src={tile.image || "/movie_default.svg"}
    //                 alt={tile.title}
    //                 className="w-full h-44 object-contain bg-blue-400"
    //               />
    //               </div>
    //               <div className="p-2 bg-blue-200 flex flex-col">
    //                 <h3 className="text-lg text-center font-semibold">
    //                   {tile.title}
    //                 </h3>
    //                 <div className="flex flex-row">
    //                 {/*TODO: THE RATING HAS TO BE STARS*/}
    //                 <StarRating />
    //                 <h4 className="text-base text-center font-semibold flex justify-center">
    //                   Watched It!
    //                 </h4>
    //                 </div>
    //               </div>
    //               </div>
    //           ))}
    //         </div>
    //       )}
    //     </div>
  );
};

export default MyList;
