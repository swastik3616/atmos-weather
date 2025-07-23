import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "./firebaseconfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const auth = getAuth(app);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError("Email or password is incorrect");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <h2 className="text-4xl font-bold mb-8 text-center">Log in with</h2>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-2 mb-6 hover:bg-gray-50 transition"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={24} height={24} className="mr-2" />
          <span className="font-medium text-black text-lg">Google</span>
        </button>
        <div className="flex items-center w-full mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="mx-2 text-gray-400 text-base">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-transparent focus:border-blue-500 focus:outline-none text-lg"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-transparent focus:border-blue-500 focus:outline-none text-lg"
          />
          <div className="text-right">
            <a href="/reset-password" className="text-blue-500 text-sm hover:underline">Forgot password?</a>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-bold text-xl hover:bg-gray-900 transition"
          >
            Log In
          </button>
        </form>
        <div className="text-center mt-6 text-lg text-gray-700">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 font-semibold hover:underline">Sign up</a>
        </div>
        {error && <p className="text-red-600 mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
}