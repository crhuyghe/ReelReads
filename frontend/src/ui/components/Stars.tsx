import React from "react";

interface StarRatingProps {
  rating?: number;
  type: "movie" | "book";
}

const Stars: React.FC<StarRatingProps> = ({ rating = 0, type }) => {
  const normalizedRating = type === "movie" ? rating / 2 : rating;
  const roundedRating = Math.round(normalizedRating * 2) / 2; //to the nearest 0.5
  const totalStars = 5;
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating % 1 !== 0;
  const emptyStars = Math.max(
    totalStars - fullStars - (hasHalfStar ? 1 : 0),
    0
  );

  return (
    <div
      className="text-2xl text-gray-400 flex text-center"
      style={{ letterSpacing: "4px" }}
    >
      {"★".repeat(fullStars)}
      {hasHalfStar && "☆"}
      {"☆".repeat(emptyStars)}
    </div>
  );
};

export default Stars;
