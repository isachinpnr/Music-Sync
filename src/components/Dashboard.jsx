// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom, joinRoom } from '../utils/rooms';
import { logout } from '../utils/auth';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

function Dashboard({ user }) {
  const [roomName, setRoomName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  // Fetch rooms in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'rooms'), (snapshot) => {
      const roomsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomsData);
      console.log('Dashboard.jsx: Fetched rooms:', roomsData); // Debug log
    }, (err) => {
      console.error('Dashboard.jsx: Rooms fetch error:', err.message); // Debug log
    });
    return () => unsubscribe();
  }, []);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      setError('Room name is required');
      return;
    }
    setError(null);
    try {
      const { roomId } = await createRoom(user, roomName);
      console.log('Dashboard.jsx: Navigating to room:', roomId); // Debug log
      navigate(`/room/${roomId}`);
    } catch (err) {
      setError(err.message);
      console.error('Dashboard.jsx: Create room error:', err.message); // Debug log
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!roomId.trim()) {
      setError('Room ID is required');
      return;
    }
    setError(null);
    try {
      const { roomId: joinedRoomId } = await joinRoom(user, roomId);
      console.log('Dashboard.jsx: Navigating to joined room:', joinedRoomId); // Debug log
      navigate(`/room/${joinedRoomId}`);
    } catch (err) {
      setError(err.message);
      console.error('Dashboard.jsx: Join room error:', err.message); // Debug log
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-md p-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Music Sharing</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreateRoom}
            className="w-full bg-blue-500 text-white py-2 mb-2 rounded-lg hover:bg-blue-600 transition"
          >
            Create Room
          </button>
        </div>
        <form onSubmit={handleJoinRoom} className="mb-4">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            Join Room
          </button>
        </form>
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
            {rooms.map((room) => (
              <li
                key={room.id}
                className="text-gray-700 cursor-pointer hover:text-blue-500"
                onClick={() => navigate(`/room/${room.roomId}`)}
              >
                {room.name} ({room.users.length} users)
              </li>
            ))}
            {rooms.length === 0 && (
              <p className="text-gray-700">No active rooms</p>
            )}
          </ul>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Music Player</h2>
          <p className="text-gray-700">Song: Example Song</p>
          <div className="flex space-x-4 mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
              Play
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
              Pause
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;