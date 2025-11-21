import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import React, { useRef, useState } from "react";
import { Link } from "react-router";
import { auth } from "../../firebase/firebase";

const Login = () => {
  const [error, setError] = useState("");
  const emailRef = useRef();

  const handleLogin = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    console.log(email, password);

    setError("");

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        if (!user.emailVerified) {
          alert("Please verify your email address first!");
        }
      })
      .catch((error) => {
        console.log(error.message);
        setError(error.message);
      });
  };

  const handleForgetPassword = () => {
    // console.log("forget password!", emailRef.current);
    const email = emailRef.current?.value;
    console.log(`forget password:  ${email}`);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Please check your email");
      })
      .catch((error) => {
        console.log(error, error.message);
      });
  };
  return (
    <div className="bg-base-300 min-h-screen flex justify-center items-center p-6">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body p-8">
            <h1 className="text-center text-3xl font-bold mb-4">Login now!</h1>
            <form onSubmit={handleLogin} noValidate>
              <fieldset className="fieldset space-y-4">
                <div>
                  <label htmlFor="login-email" className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    ref={emailRef}
                    className="input input-border w-full "
                    placeholder="Email"
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type="password"
                      name="password"
                      className="input input-bordered w-full pr-12"
                      placeholder="Enter your Password"
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs absolute right-2 top-2 h-7"
                    ></button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="checkbox" />
                    <span className="text-sm">Remember me</span>
                  </label>
                </div>

                <div onClick={handleForgetPassword}>
                  <a className="link link-hover text-blue-500 text-sm">
                    Forgot password?
                  </a>
                </div>

                <button type="submit" className="btn btn-neutral w-full mt-4">
                  Login
                </button>
              </fieldset>
            </form>
            {error && <p className="text-red-500 text-sm"> {error} </p>}
            <div className="text-center text-sm mt-4">
              <span>Don’t have an account? </span>
              <Link to="/register" className="link link-primary">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
