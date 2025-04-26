// src/components/Room.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Room({ user }) {
  const { roomId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Room: {roomId}</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="flex space-x-4">
        <div className="w-1/3 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Now Playing</h2>
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

        <div className="w-2/3 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Live Chat</h2>
          <div className="h-64 overflow-y-auto border p-2 mb-4 rounded">
            <p className="text-gray-700">User 1: Yo, this song is fire! 🔥</p>
            <p className="text-gray-700">User 2: Haha, totally!</p>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
              Send
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mt-6">
        <h2 className="text-xl font-semibold mb-2">Users in Room</h2>
        <ul className="space-y-2">
          <li className="text-gray-700">{user.displayName || user.email}</li>
          <li className="text-gray-700">User 2</li>
        </ul>
      </div>
    </div>
  );
}

export default Room;