import React, { useState } from "react";
import { auth } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Register = () => {
  // form input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupError, setSignupError] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();

    // reset previous messages
    setSignupError("");
    setSignupSuccess(false);
    setEmailError("");
    setPasswordError("");

    const emailValue = email.trim();

    const emailErrors = [];
    const passwordErrors = [];

    if (!emailValue) emailErrors.push("Email is required");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailValue && !emailPattern.test(emailValue))
      emailErrors.push("Invalid email address");

    if (emailErrors.length > 0) {
      setEmailError(emailErrors.join(`. `));
      return;
    }

    if (!password) passwordErrors.push("Password is required");
    if (password && password.length < 8)
      passwordErrors.push("Password must be at least 8 characters");
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (password && !passwordPattern.test(password))
      passwordErrors.push("Password is too weak");

    if (passwordErrors.length > 0) {
      setPasswordError(passwordErrors.join(`. `));
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, emailValue, password);
      setSignupSuccess(true);
      setEmail("");
      setPassword("");
      setSignupError("");
    } catch (error) {
      // friendly mapping
      if (error?.code === "auth/email-already-in-use")
        setSignupError("Email is already registered");
      else if (error?.code === "auth/weak-password")
        setSignupError("Provided password is too weak");
      else setSignupError("Registration failed. Please try again.");
      console.error("signup error:", error.code, error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Register now!</h1>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form className="space-y-4" onSubmit={handleRegister}>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                className="input"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!emailError}
                aria-describedby="email-error"
              />

              {emailError && (
                <p className="text-red-500 font-bold text-xl">{emailError}</p>
              )}

              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                className="input"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!passwordError}
                aria-describedby="password-error"
              />

              {passwordError && (
                <p className="text-red-500 font-bold text-xl">
                  {passwordError}
                </p>
              )}

              <fieldset disabled={loading}>
                <button className="btn btn-neutral mt-4">
                  {loading ? "Registering..." : "Register"}
                </button>
              </fieldset>

              {signupError && (
                <p className="text-red-500 font-bold text-xl">{signupError}</p>
              )}
              {signupSuccess && (
                <p className="text-green-500 font-bold text-xl">
                  Account created successfully!
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
