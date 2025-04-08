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
  const [quizKey, setQuizKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // prevent rendering while data is loading
      setQuizFinished(false);
      setCurrentQuestionIndex(0);
      setScore(0);

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [quizKey]); //runs again when quizKey changes

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

  const getScoreMessage = (score: number) => {
    if (score === 10) return "Perfect score! WOW! You know your trivia 🌟";
    if (score >= 8) return "Great job! Almost perfect 👍";
    if (score >= 5) return "Not bad! But you can definitely do better!";
    return "Give it another go! You've got this";
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

  if (isLoading) return <div>Loading quiz...</div>;

  return (
    <>
      <div className="flex flex-col items-center gap-4 ring ring-4 ring-primary dark:ring-secondary rounded-lg justify-center h-[230px] px-4 w-full">
        {!quizFinished && (
          <>
            <div className="font-semibold text-lg text-center mb-4">
              {questions[currentQuestionIndex]}
            </div>
            <div className="grid grid-rows-{2} grid-cols-2 gap-x-8 gap-y-2">
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
            <div className="font-semibold text-lg text-center -mb-1">
              {getScoreMessage(score)}
            </div>
            <div className="font-semibold text-2xl text-center mb-3">
              SCORE: {score}
            </div>
            <button
              onClick={() => setQuizKey((prev) => prev + 1)}
              className="mt-4 bg-primary dark:bg-secondary text-black dark:text-white font-semibold py-2 px-4 rounded hover:bg-secondary_hover_light2 dark:hover:bg-secondary_hover transition"
            >
              Play Again
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default QuizQuestion;
