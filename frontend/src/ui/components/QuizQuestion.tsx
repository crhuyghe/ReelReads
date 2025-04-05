import { useEffect, useState } from "react";
import axios from "axios";
import QuizChoices from "./QuizChoices";

const QuizQuestion: React.FC = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [choices, setChoices] = useState<string[][]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  useEffect(() => {
    let hasFetched = false;

    setQuizFinished(false);
    const fetchData = async () => {
      if (hasFetched) return;
      hasFetched = true;

      try {
        const response = await axios.post("http://localhost:5000/grabQuiz");
        console.log("Fetched data:", response);

        setQuestions(response.data.fetched_quiz[0]);
        console.log("trying to grab questions", response.data.fetched_quiz[0]);

        setChoices(response.data.fetched_quiz[1]);
        console.log("trying to grab choices", response.data.fetched_quiz[1]);

        setAnswers(response.data.fetched_quiz[2]);
        console.log("trying to grab answers", response.data.fetched_quiz[2]);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []); //empty array makes sure it only runs once

  const handleAnswer = (selected: string) => {
    const correct = answers[currentQuestionIndex];
    // grab what the user selected, if it matches the answers array, it's correct
    if (selected === correct) {
      setScore(score + 1); //got it right, increase score by 1
    }

    //go to next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      //quiz done, maybe come back to set another component with a finished screen
      setQuizFinished(true);
      console.log("DONE: SCORE: ", score);
    }
  };

  // Defensive check
  if (
    questions.length === 0 ||
    choices.length === 0 ||
    answers.length === 0 ||
    !choices[currentQuestionIndex]
  ) {
    return <div>Loading quiz...</div>;
  }

  return (
    <>
      <div className="flex flex-col items-center ring ring-2 ring-blue-300 rounded-lg pt-4 pb-8 px-4 w-full">
        {!quizFinished && (
          <>
            <div className="font-semibold text-lg text-center mb-4">
              {questions[currentQuestionIndex]}
            </div>
            <div className="grid grid-rows-{2} grid-cols-2 gap-x-8 gap-y-4 ring ring-2 ring-red-200">
              {choices[currentQuestionIndex].map((choice, index) => (
                <div key={index} className="flex justify-left">
                  <QuizChoices
                    answerStr={choice}
                    label={String.fromCharCode(97 + index)}
                    onClick={() => handleAnswer(choice)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
        {quizFinished && (
          <>
            <div className="font-semibold text-lg text-center">
              SCORE: {score}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default QuizQuestion;
