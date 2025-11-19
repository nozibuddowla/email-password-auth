import React, { useState } from "react";
import { auth } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { LuEye, LuEyeClosed } from "react-icons/lu";

const Register = () => {
  // form input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();

    // reset previous messages
    setSignupError("");
    setSignupSuccess(false);
    setEmailError("");
    setPasswordError("");
    setTermsError("");

    const emailValue = email.trim();

    const emailErrors = [];
    const passwordErrors = [];

    if (!emailValue) emailErrors.push("Email is required");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailValue && !emailPattern.test(emailValue))
      emailErrors.push("Invalid email address");

    if (!password) passwordErrors.push("Password is required");
    if (password && password.length < 8)
      passwordErrors.push(
        "Password must be at least 8 characters and include at least one uppercase, one lowercase, and one special character."
      );
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (password && !passwordPattern.test(password))
      passwordErrors.push("Password is too weak");

    if (!acceptTerms) {
      setTermsError("You must accept the Terms and Conditions");
    }

    if (emailErrors.length > 0) {
      setEmailError(emailErrors.join(`. `));
      return;
    }
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
      setAcceptTerms(false);
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

  const handleTogglePasswordShow = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "email-error" : undefined}
              />

              {emailError && (
                <p className="text-red-500 font-bold text-xl">{emailError}</p>
              )}

              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!passwordError}
                  aria-describedby={
                    passwordError ? "password-error" : undefined
                  }
                />
                <button
                  type="button"
                  onClick={handleTogglePasswordShow}
                  className="btn btn-xs bg-transparent border-none absolute top-2 right-6"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <LuEyeClosed /> : <LuEye />}
                </button>
              </div>

              {passwordError && (
                <p className="text-red-500 font-bold text-xl">
                  {passwordError}
                </p>
              )}

              <div>
                <fieldset className="fieldset">
                  <label className="label flex items-center gap-2">
                    <input
                      id="acceptTerms"
                      type="checkbox"
                      className="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      aria-invalid={!!termsError}
                      aria-describedby={termsError ? "terms-error" : undefined}
                    />
                    <span>Accept our Terms and Conditions</span>
                  </label>
                  {termsError && (
                    <p
                      id="terms-error"
                      className="text-red-500 font-medium text-sm"
                    >
                      {" "}
                      {termsError}{" "}
                    </p>
                  )}
                </fieldset>
              </div>

              <div className="flex justify-center items-center">
                <a className="link link-hover"> Forgot password? </a>
              </div>

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
