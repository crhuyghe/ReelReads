import React, { useState } from "react";

interface answerProps {
  answerStr: string;
  label: string;
}

const QuizChoices: React.FC<answerProps> = ({ answerStr, label }) => {
  const [isAnswered, setIsAnswered] = useState(false);
  // const [buttonStyle, setButtonStyle] = useState<string[]>([]); // State to track button style for correctness

  const checkAnswer = () => {
    if (!isAnswered) {
      setIsAnswered(true); // Mark that the user has answered
      // setButtonStyle([
      //   ...(props.correctness
      //     ? ["bg-green-500", "hover:bg-green-600"]
      //     : ["bg-red-500", "hover:bg-red-600"]),
      // ]);

      // if (!props.correctness) {
      //   props.onTakeDamage(20);
      // } else if (props.correctness) {
      //   props.onGetPoints(100);
      // }
      // Apply the correct or incorrect colors
    }
  };

  return (
    <button
      className="flex gap-2 rounded-md
        hover:ring hover:ring-1 hover:ring-blue-300 hover:rounded-md focus:ring-2
         focus:ring-blue-300 focus:ring-opacity-50 px-2"
      onClick={checkAnswer}
    >
      <span className="text-lg font-semibold">{label})</span>
      <h2 className="text-lg font-semibold">{answerStr}</h2>
      {/* {isAnswered && (
        <div
          className={`text-center flex justify-center border text-white rounded-lg ${
            props.correctness ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {props.correctness ? "Correct!" : "Incorrect!"}
        </div>
      )} */}
    </button>
  );
};

export default QuizChoices;
