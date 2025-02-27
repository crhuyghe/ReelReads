import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import "./index.css";
import RecommendationPage from "./components/RecommendationPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <RecommendationPage />
    </>
  );
}

export default App;
