import "./App.css";
import "./index.css";
import RecommendationPage from "./components/RecommendationPage";
import Login from "./components/Login";
import CreateAccount from "./components/CreateAccount";
import Welcome from "./components/Welcome";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { UserProvider } from "./components/UserContext";
import UserLibrary from "./components/UserLibrary";
import MyList from "./components/MyList";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";

//theme toggle placement
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isMainPage =
    location.pathname === "/" || location.pathname === "/createAccount";

  return (
    <>
      {!isMainPage && <Navbar />}
      <main className="min-h-screen">{children}</main>
    </>
  );
};

function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isMainOrCreateAccountPage =
    location.pathname === "/" || location.pathname === "/createAccount";

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark text-black dark:text-white">
      {isMainOrCreateAccountPage && (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="fixed top-4 right-4 px-2 py-2 rounded-full hover:bg-primary ring ring-1 ring-primary dark:ring-secondary_dark dark:hover:bg-secondary_dark"
        >
          {theme === "dark" ? <img src="/sun.svg" /> : <img src="/moon.svg" />}
        </button>
      )}
      <UserProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/createAccount" element={<CreateAccount />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/recommendation" element={<RecommendationPage />} />
              <Route path="/myList" element={<MyList />} />
              <Route path="/userLibrary" element={<UserLibrary />} />
            </Routes>
          </Layout>
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
