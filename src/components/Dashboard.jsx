// src/components/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';

function Dashboard({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // Redirect to Homepage
    } catch (err) {
      console.error('Logout failed:', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-md p-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Music Sharing</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-blue-500 text-white py-2 mb-2 rounded-lg hover:bg-blue-600 transition"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate('/room/test123')}
          className="w-full bg-green-500 text-white py-2 mb-2 rounded-lg hover:bg-green-600 transition"
        >
          Join Test Room
        </button>
        <input
          type="text"
          placeholder="Enter Room Token"
          className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="w-full bg-gray-500 text-white py-2 mb-4 rounded-lg hover:bg-gray-600 transition">
          Join Room
        </button>
        <h3 className="text-lg font-semibold mb-2">Friends</h3>
        <ul className="space-y-2">
          <li className="text-gray-700">Friend 1 - Listening to Song A</li>
          <li className="text-gray-700">Friend 2 - Offline</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">
            Welcome, {user.displayName || user.email}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Notifications</h2>
          <p className="text-gray-700">Friend X is listening to Song Y</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Active Rooms</h2>
          <ul className="space-y-2">
            <li
              className="text-gray-700 cursor-pointer hover:text-blue-500"
              onClick={() => navigate('/room/room1')}
            >
              Room 1 - 3 users
            </li>
            <li
              className="text-gray-700 cursor-pointer hover:text-blue-500"
              onClick={() => navigate('/room/room2')}
            >
              Room 2 - 5 users
            </li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Music Player</h2>
          <p className="text-gray-700">Song: Example Song</p>
          <div className="flex space-x-4 mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
              Play
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
              Pause
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;