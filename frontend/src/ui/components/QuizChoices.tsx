import React, { useState } from "react";

interface answerProps {
  answerStr: string;
  label: string;
  onClick: () => void;
}

const QuizChoices: React.FC<answerProps> = ({ answerStr, label, onClick }) => {
  return (
    <button
      className="w-full flex gap-2 rounded-md
        hover:ring hover:ring-1 hover:ring-blue-300 hover:rounded-md focus:ring-2
         focus:ring-blue-300 focus:ring-opacity-50 px-2"
      onClick={onClick}
    >
      <span className="text-lg font-semibold">{label})</span>
      <h2 className="text-lg font-semibold text-left">{answerStr}</h2>
    </button>
  );
};

export default QuizChoices;
