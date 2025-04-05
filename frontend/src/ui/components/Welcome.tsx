import Navbar from "./Navbar";
import { useUser } from "./UserContext";
import QuizQuestion from "./QuizQuestion";

const Welcome = () => {
  const { user } = useUser();

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center gap-8 my-12 mx-8">
        <div className="rounded ring ring-2 text-center ring-blue-300 w-full py-20">
          user: {user?.user_id}
        </div>
        <div className="w-[70%]">
          {/* QUIZ */}
          <QuizQuestion />
        </div>
      </div>
    </>
  );
};

export default Welcome;
