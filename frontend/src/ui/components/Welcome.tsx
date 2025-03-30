import Navbar from "./Navbar";

const Welcome = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-36">
        <div>CONGRATS YOU SIGNED IN!!!!</div>
      </div>
    </>
  );
};

export default Welcome;
