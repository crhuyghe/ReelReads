import Navbar from "./Navbar";
import { useUser } from "./UserContext";

const Welcome = () => {
  const { user } = useUser();

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-36">
        <div>CONGRATS {user?.user_id} YOU SIGNED IN!!!!</div>
        <h1>user: {user?.user_id}</h1>
      </div>
    </>
  );
};

export default Welcome;
