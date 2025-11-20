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

    // Email validation
    if (!emailValue) emailErrors.push("Email is required");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailValue && !emailPattern.test(emailValue))
      emailErrors.push("Invalid email address");

    // Password validation
    if (!password) passwordErrors.push("Password is required");
    if (password && password.length < 8)
      passwordErrors.push(
        "Password must be at least 8 characters and include at least one uppercase, one lowercase, and one special character."
      );
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (password && !passwordPattern.test(password))
      passwordErrors.push(
        "Password must include uppercase, lowercase, number and special character"
      );

    // Terms validation
    if (!acceptTerms) {
      setTermsError("You must accept the Terms and Conditions");
    }

    if (emailErrors.length > 0) {
      setEmailError(emailErrors.join(". "));
    }
    if (passwordErrors.length > 0) {
      setPasswordError(passwordErrors.join(". "));
    }
    if (emailErrors.length > 0 || passwordErrors.length > 0 || !acceptTerms) {
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
        setSignupError("This email is already registered. Try logging in.");
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

  const handleTermsChange = (checked) => {
    setAcceptTerms(checked);
    if (checked) {
      setTermsError("");
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
            <form className="space-y-4" onSubmit={handleRegister} noValidate>
              <label className="label">Email</label>
              <input
                id="email"
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
                <p id="email-error" className="text-red-500 font-bold text-sm">
                  {emailError}
                </p>
              )}

              <label className="label">Password</label>
              <div className="relative">
                <input
                  id="password"
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
                <p
                  id="password-error"
                  className="text-red-500 font-bold text-sm"
                >
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
                      onChange={(e) => handleTermsChange(e.target.checked)}
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

              <fieldset className="flex justify-center items-center" disabled={loading}>
                <button type="submit" className="btn btn-neutral mt-4">
                  {loading ? "Registering..." : "Register"}
                </button>
              </fieldset>

              {signupError && (
                <p className="text-red-500 font-bold text-sm">{signupError}</p>
              )}
              {signupSuccess && (
                <p className="text-green-500 font-bold text-sm">
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
