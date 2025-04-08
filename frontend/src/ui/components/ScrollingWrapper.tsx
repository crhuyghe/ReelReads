import React, { useEffect, useRef } from "react";

interface ScrollingWrapperProps {
  tiles: any[];
  onTileClick: (tile: any) => void;
  title: string;
}

const ScrollingWrapper: React.FC<ScrollingWrapperProps> = ({
  tiles,
  onTileClick,
  title,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollSpeed = 1; // Speed of scrolling (higher = faster)
    const scrollInterval = 10; // Interval for the scroll animation (lower = smoother)

    // Smooth scrolling function
    const scroll = () => {
      if (
        container.scrollLeft >=
        container.scrollWidth - container.clientWidth
      ) {
        container.scrollLeft = 0; // Reset to start when the end is reached
      } else {
        container.scrollLeft += scrollSpeed; // Scroll to the right
      }
    };

    const intervalId = setInterval(scroll, scrollInterval); // Auto-scroll every 20ms

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full py-3">
      <h2 className="text-xl font-bold mb-2 px-4">{title}</h2>
      <div
        ref={scrollRef}
        className="flex whitespace-nowrap space-x-4 px-4 py-2"
        style={{
          scrollBehavior: "smooth",
          overflowX: "hidden", // Smooth scrolling transition
        }}
      >
        {[...tiles, ...tiles].map((tile, index) => {
          const displayTitle = tile.title || tile.book_name || "Untitled";
          const displayAuthor = tile.author || tile.genre || null;
          return (
            <div
              key={index}
              className={`flex-shrink-0 w-[150px] bg-primary rounded shadow p-3 cursor-pointer hover:shadow-lg transition-shadow`}
              onClick={() => onTileClick(tile)}
            >
              <img
                src={
                  tile.image ||
                  (tile.title ? "/movie_default.svg" : "book_default.svg")
                }
                alt={displayTitle}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <h3 className="text-md font-semibold text-gray-800 truncate">
                {displayTitle}
              </h3>
              <p className="text-xs text-gray-500 truncate">{displayAuthor}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScrollingWrapper;
