import "./App.css";
import "./index.css";
import RecommendationPage from "./components/RecommendationPage";
import Login from "./components/Login";
import CreateAccount from "./components/CreateAccount";
import Welcome from "./components/Welcome";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./components/UserContext";
import UserLibrary from "./components/UserLibrary";
import MyList from "./components/MyList";

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
          <Route path="/myList" element={<MyList />} />
          <Route path="/userLibrary" element={<UserLibrary />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
