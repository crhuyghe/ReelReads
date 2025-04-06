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
          style={{
            cursor: "pointer",
            color: star <= rating ? "gold" : "gray",
            fontSize: "24px",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
