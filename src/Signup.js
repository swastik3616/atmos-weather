import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "./firebaseconfig";

function validatePassword(password) {
  // At least 8 chars, one uppercase, one number, one symbol
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  return regex.test(password);
}

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters, contain an uppercase letter, a number, and a symbol.");
      return;
    }
    const auth = getAuth(app);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/login"); // Redirect to login page after signup
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);
    try {
      await signInWithPopup(auth, provider);
      navigate("/"); // Redirect to home after Google signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Sign up</h1>
        <div className="flex gap-3 mb-4">
          <button
            onClick={handleGoogleSignup}
            className="flex-1 flex items-center justify-center border border-gray-300 rounded-lg p-2 bg-white cursor-pointer font-medium text-base text-gray-900 hover:bg-gray-100 transition"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} className="mr-2" />
            Sign up with Google
          </button>
        </div>
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="mx-2 text-gray-400 font-semibold text-xs">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-2">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-2">
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-right mb-4">
            <a href="/reset-password" className="text-blue-600 hover:underline text-sm">Forgot password?</a>
          </div>
          <button type="submit" className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition">Sign Up</button>
        </form>
        <div className="text-center mt-4 text-base text-gray-900 font-medium">
          Already have an account? <a href="/login" className="font-semibold text-blue-600 hover:underline">Log in</a>
        </div>
        {error && <p className="text-red-600 mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
}