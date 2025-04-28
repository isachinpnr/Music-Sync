// src/components/Room.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoom } from '../utils/rooms';
import { sendMessage, listenForMessages } from '../utils/chat';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

function Room({ user }) {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const chatContainerRef = useRef(null);

  // Fetch room details
  useEffect(() => {
    console.log('Room.jsx: roomId from useParams:', roomId); // Debug log

    // Initial fetch
    const fetchRoom = async () => {
      try {
        const roomData = await getRoom(roomId);
        console.log('Room.jsx: Initial room data:', roomData); // Debug log
        setRoom(roomData);
        setError(null);
      } catch (err) {
        console.error('Room.jsx: Fetch room error:', err.message); // Debug log
        setError(err.message);
      }
    };

    fetchRoom();

    // Real-time updates
    const roomsRef = collection(db, 'rooms');
    const q = query(roomsRef, where('roomId', '==', roomId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Room.jsx: onSnapshot snapshot size:', snapshot.size); // Debug log
      if (snapshot.empty) {
        console.log('Room.jsx: No room found in onSnapshot'); // Debug log
        setError('Room not found');
        setRoom(null);
      } else {
        const roomDoc = snapshot.docs[0];
        const roomData = { id: roomDoc.id, ...roomDoc.data() };
        console.log('Room.jsx: onSnapshot room data:', roomData); // Debug log
        setRoom(roomData);
        setError(null);
      }
    }, (err) => {
      console.error('Room.jsx: onSnapshot error:', err.message); // Debug log
      setError('Failed to listen for room updates');
    });

    return () => unsubscribe();
  }, [roomId]);

  // Listen for messages
  useEffect(() => {
    if (!room) return; // Wait for room to load
    const unsubscribe = listenForMessages(room.id, (fetchedMessages) => {
      setMessages(fetchedMessages);
    });
    return () => unsubscribe();
  }, [room]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !room) return;

    try {
      await sendMessage(room.id, user, messageText);
      setMessageText('');
    } catch (err) {
      setError(err.message);
    }
  };

  console.log('Room.jsx: Current room state:', room); // Debug log
  console.log('Room.jsx: Current error state:', error); // Debug log
  console.log('Room.jsx: Current messages state:', messages); // Debug log

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!room) {
    console.log('Room.jsx: Rendering loading state'); // Debug log
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-700">Loading room...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Room: {room.name}</h1>
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
          <div
            ref={chatContainerRef}
            className="h-64 overflow-y-auto border p-2 mb-4 rounded bg-gray-50"
          >
            {messages.length === 0 && (
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 ${
                  message.senderId === user.uid ? 'text-right' : 'text-left'
                }`}
              >
                <p className="text-sm text-gray-600">
                  {message.senderName} •{' '}
                  {new Date(message.createdAt.seconds * 1000).toLocaleTimeString()}
                </p>
                <p
                  className={`inline-block p-2 rounded-lg ${
                    message.senderId === user.uid
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mt-6">
        <h2 className="text-xl font-semibold mb-2">Users in Room</h2>
        <ul className="space-y-2">
          {room.users.map((userId) => (
            <li key={userId} className="text-gray-700">
              {userId === user.uid ? user.displayName || user.email : `User ${userId.slice(0, 8)}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Room;