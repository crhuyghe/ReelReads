import React, { useState } from "react";
import CreateAccount from "./CreateAccount";
import Welcome from "./Welcome";
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentComponent, setCurrentComponent] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);

  const togglePassword = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleClick = (component: string) => {
    setCurrentComponent(component);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });

      if (response.data.success) {
        console.log("Login successful!", response.data);
        setLoginFailed(false);
        setCurrentComponent("welcome");
      } else {
        console.log("Login failed", response.data.message);
        setLoginFailed(true);
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      setLoginFailed(true);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen w-full">
        <div className="w-[60%] bg-blue-200 rounded-lg py-[2rem] px-[2rem] flex flex-col text-left">
          <div className="flex items-center gap-2 mb-6">
            <img src="../../../desktopIcon.png" className="w-8 object-cover" />
            <h2 className="font-bold text-lg">ReelReads</h2>
          </div>
          <div className="flex flex-col mb-3">
            <h3 className="text-lg font-semibold">Welcome to ReelReads! 👋</h3>
            <p className="text-sm">
              {currentComponent === "login"
                ? "Please sign-in to your account to grab your entertainment recommendations"
                : "Let's get you started! Please create an account to start using ReelReads"}
            </p>
          </div>

          {/* switching between login, signup, and welcome*/}
          {currentComponent === "login" ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="flex flex-col mb-3 gap-1">
                <label className="text-sm">USERNAME</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="ring ring-1 ring-grey-200 rounded-sm py-1 px-2 text-sm"
                  placeholder="Enter your username"
                />
              </div>
              <div className="flex flex-col mb-3 gap-1">
                <label className="text-sm">PASSWORD</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="ring ring-1 ring-grey-200 rounded-sm py-1 px-2 text-sm w-full"
                    placeholder="********"
                  />

                  <button
                    onClick={togglePassword}
                    type="button"
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-xl"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div
                className="flex items-center gap-1 mb-2"
                style={{ display: loginFailed ? "flex" : "none" }}
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4 text-red-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>
                <p className="text-xs text-red-600">
                  Your username or password is incorrect. Please enter valid
                  credentials.
                </p>
              </div>
              <input
                type="submit"
                value="Sign In"
                className="rounded-sm bg-blue-600 w-full py-1 text-white mb-3 hover:cursor-pointer hover:bg-blue-500"
              />
            </form>
          ) : currentComponent === "signup" ? (
            <CreateAccount />
          ) : (
            <Welcome />
          )}

          <div className="flex gap-1 justify-center text-sm">
            <p>
              {currentComponent === "login"
                ? "New on our platform?"
                : "Already have an account?"}
            </p>
            <button
              onClick={() =>
                handleClick(currentComponent === "login" ? "signup" : "login")
              }
              className="text-blue-600 hover:underline underline-offset-2"
            >
              {currentComponent === "login" ? "Create an account" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
