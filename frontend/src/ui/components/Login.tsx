import React from "react";

const Login = () => {
  return (
    <>
      <div>
        <h4>Login</h4>
        <form>
          <div>
            <input
              type="text"
              id="username"
              name="username"
              defaultValue="username"
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              name="password"
              defaultValue="password"
            />
          </div>
          <input type="submit" value="LOGIN" />
        </form>
        <a href="/signup">Sign Up</a>
      </div>
    </>
  );
};

export default Login;
