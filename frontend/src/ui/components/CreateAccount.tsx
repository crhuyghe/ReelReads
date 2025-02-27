import React, { useState } from "react";
import axios from "axios";

const CreateAccount = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [showError, setShowError] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  const togglePasswordRequirements = () => {
    setShowPasswordRequirements(!showPasswordRequirements);
  };

  const togglePassword = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleRegsiterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors before making the request
    setUsernameError(""); // Clear username error when submitting new request
    setErrorMessages([]); // Clear general error messages

    try {
      const response = await axios.post("http://localhost:5000/register", {
        username,
        password,
      });
      console.log("Response from backend:", response.data);

      if (response.data.success) {
        console.log("account creation successful!");
        //TODO: go to welcome page
        setShowError(false);
      } else {
        console.log("account creation failed", response.data.message);

        if (response.data.error_codes === "[username_exists]") {
          setUsernameError(
            "The username you have chosen already exists. Please try another."
          );
          setShowError(false);
        } else {
          setErrorMessages(["Password is invalid. Please try again!"]);
          setShowError(true);
        }
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      setErrorMessages(["An unexpected error occurred. Please try again."]); // Fallback error message
      setShowError(true); // Show error message div
      setUsernameError("");
    }
  };
  return (
    <div>
      <form onSubmit={handleRegsiterSubmit}>
        <div className="flex flex-col mb-3 gap-1 min-h-100vh">
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
        {/* Username error message div */}
        {usernameError && (
          <div className="text-red-600 text-xs mb-2">
            <p>{usernameError}</p>
          </div>
        )}

        <div className="flex flex-col mb-3 gap-1">
          <div className="flex items-center gap-1">
            <label className="text-sm">PASSWORD</label>
            <button type="button" onClick={togglePasswordRequirements}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 text-red-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
            </button>
          </div>

          {/* Tooltip with password requirements */}
          {showPasswordRequirements && (
            <div className="-mt-1 mb-1 text-xs text-gray-500">
              <ul>
                {" "}
                Password must:
                <li className="ml-4">Contain at least 10 characters</li>
                <li className="ml-4">
                  Contain both lower and uppercase letter
                </li>
                <li className="ml-4">Contain at least one number</li>
                <li className="ml-4">Contain at least one symbol</li>
              </ul>
            </div>
          )}
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
        {/* Error message div */}
        {showError && (
          <div className="text-red-600 text-xs mb-2">
            {errorMessages.map((msg, index) => (
              <p key={index}>{msg}</p> // Render each error message
            ))}
          </div>
        )}

        <input
          type="submit"
          value="Sign Up"
          className="rounded-sm bg-blue-600 w-full py-1 text-white mb-3"
        />
      </form>
    </div>
  );
};

export default CreateAccount;
