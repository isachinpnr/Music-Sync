// src/components/Homepage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle, signUpWithEmail, loginWithEmail } from '../utils/auth';

function Homepage({ user }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      console.log('Logged in user:', user);
      navigate('/dashboard'); // Redirect to Dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const user = isSignUp
        ? await signUpWithEmail(email, password)
        : await loginWithEmail(email, password);
      console.log(isSignUp ? 'Signed up user:' : 'Logged in user:', user);
      navigate('/dashboard'); // Redirect to Dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  if (user) {
    return null; // App.jsx handles redirect to Dashboard
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">
        Welcome to Music Sharing App!
      </h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-md">
        Listen to music together in real-time with your friends. Create or join rooms, chat, and vibe!
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={handleGoogleLogin}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition mb-4"
      >
        Login with Google
      </button>

      <form onSubmit={handleEmailSubmit} className="w-full max-w-sm">
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>

      <p className="mt-4 text-gray-700">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-500 hover:underline ml-1"
        >
          {isSignUp ? 'Login' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
}

export default Homepage;