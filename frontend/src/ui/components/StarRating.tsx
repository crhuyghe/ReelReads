import React, { useState } from "react";

type StarRatingProps = {
  onRate: (rating: number) => void;
};

const StarRating: React.FC<StarRatingProps> = ({ onRate }) => {
  const [rating, setRating] = useState(0);

  const handleStarClick = (star: number) => {
    setRating(star);
    onRate(star);
  };
  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleStarClick(star)}
          className={`cursor-pointer text-2xl ${
            star <= rating
              ? "text-secondary dark:text-secondary_light"
              : "text-gray-300 dark:text-gray-600"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
