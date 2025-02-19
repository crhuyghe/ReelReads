import React, { useState } from "react";
import Login from "./Login";

const Welcome = () => {
  const [currentComponent, setCurrentComponent] = useState("welcome");

  const handleClick = (component: string) => {
    setCurrentComponent(component);
  };

  return (
    <div>
      {currentComponent === "welcome" ? (
        <div>
          CONGRATS YOU SIGNED IN!!!!
          <button onClick={() => handleClick("login")}>Back to login</button>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default Welcome;
