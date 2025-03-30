import React, { useEffect, useRef } from "react";
import RecTile from "./RecTile";

interface ScrollingWrapperProps {
  tiles: any[];
  onTileClick: (tile: any) => void;
}

const ScrollingWrapper: React.FC<ScrollingWrapperProps> = ({
  tiles,
  onTileClick,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollSpeed = 1;

    const scroll = () => {
      if (scrollContainer) {
        scrollAmount += scrollSpeed;
        scrollContainer.scrollLeft = scrollAmount;

        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
          scrollAmount = 0;
        }
      }
      requestAnimationFrame(scroll);
    };

    scroll();
  }, []);

  return (
    <div className="overflow-hidden w-full bg-gray-100 py-4">
      <div
        ref={scrollRef}
        className="flex whitespace-nowrap space-x-4 overflow-x-hidden"
        style={{ scrollBehavior: "smooth" }}
      >
        {[...tiles, ...tiles].map((tile, index) => (
          <div key={index} className="flex-shrink-0 w-full">
            <RecTile tiles={[tile]} onTileClick={onTileClick} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingWrapper;
