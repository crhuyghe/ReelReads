import QuizChoices from "./QuizChoices";

interface questionProps {
  question: string;
  answers: string[];
  correct: string;
}

const QuizQuestion: React.FC<questionProps> = (props) => {
  return (
    <>
      <div className="flex flex-col items-center ring ring-2 ring-blue-300 rounded-lg pt-4 pb-8 px-4 w-full">
        <div className="font-semibold text-lg text-center mb-4">
          {props.question}
        </div>
        <div className="grid grid-rows-{2} grid-cols-2 gap-x-16 gap-y-4">
          {props.answers.map((res, index) => (
            <div className="flex justify-center items-center">
              <QuizChoices
                answerStr={res}
                label={String.fromCharCode(97 + index)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default QuizQuestion;
