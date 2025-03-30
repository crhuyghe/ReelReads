import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import "./index.css";
import RecommendationPage from "./components/RecommendationPage";
import Login from "./components/Login";
import CreateAccount from "./components/CreateAccount";
import Welcome from "./components/Welcome";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./components/UserContext";

function App() {
  return (
    <UserProvider>
      <Router>
        {/* <RecommendationPage /> */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/createAccount" element={<CreateAccount />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/recommendation" element={<RecommendationPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
