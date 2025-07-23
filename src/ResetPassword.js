import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from "./firebaseconfig";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const auth = getAuth(app);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        <form onSubmit={handleReset}>
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
          <button type="submit" className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition">Send Reset Email</button>
        </form>
        <div className="text-center mt-4 text-base text-gray-900 font-medium">
          <a href="/login" className="font-semibold text-blue-600 hover:underline">Back to Login</a> | <a href="/signup" className="font-semibold text-blue-600 hover:underline">Sign up</a>
        </div>
        {message && <p className="text-green-600 mt-3 text-center">{message}</p>}
        {error && <p className="text-red-600 mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
} 