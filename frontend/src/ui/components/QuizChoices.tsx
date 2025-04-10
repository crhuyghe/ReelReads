import React, { useState } from "react";

interface answerProps {
  answerStr: string;
  label: string;
  onClick: () => void;
}

const QuizChoices: React.FC<answerProps> = ({ answerStr, label, onClick }) => {
  return (
    <button
      className="w-full flex gap-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 hover:rounded-md px-2 py-1"
      onClick={onClick}
    >
      <span className="text-lg lg:text-xl font-semibold">{label})</span>
      <h2 className="text-lg lg:text-xl font-semibold text-left">
        {answerStr}
      </h2>
    </button>
  );
};

export default QuizChoices;
