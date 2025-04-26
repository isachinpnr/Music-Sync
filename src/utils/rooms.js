// src/utils/rooms.js
import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc, getDocs, query, where, arrayUnion } from 'firebase/firestore';
import { nanoid } from 'nanoid';

// Create a new room
export const createRoom = async (user, roomName) => {
  try {
    const roomId = nanoid(8); // Generate unique 8-character room ID
    const docRef = await addDoc(collection(db, 'rooms'), {
      roomId,
      name: roomName,
      creator: user.uid,
      users: [user.uid],
      createdAt: new Date(),
    });
    console.log('Room created with ID:', roomId, 'Doc ID:', docRef.id); // Debug log
    return { id: docRef.id, roomId };
  } catch (error) {
    console.error('Create Room Error:', error.message);
    throw error;
  }
};

// Join an existing room
export const joinRoom = async (user, roomId) => {
  try {
    console.log('Attempting to join room with ID:', roomId); // Debug log
    const roomsRef = collection(db, 'rooms');
    const q = query(roomsRef, where('roomId', '==', roomId));
    const querySnapshot = await getDocs(q);

    console.log('Query snapshot size:', querySnapshot.size); // Debug log
    if (querySnapshot.empty) {
      throw new Error('Room not found');
    }

    const roomDoc = querySnapshot.docs[0];
    const roomData = { id: roomDoc.id, ...roomDoc.data() };

    await updateDoc(doc(db, 'rooms', roomDoc.id), {
      users: arrayUnion(user.uid),
    });

    console.log('Joined room with ID:', roomId, 'Data:', roomData); // Debug log
    return { id: roomDoc.id, roomId };
  } catch (error) {
    console.error('Join Room Error:', error.message);
    throw error;
  }
};

// Get room details
export const getRoom = async (roomId) => {
  try {
    console.log('Fetching room with ID:', roomId); // Debug log
    const roomsRef = collection(db, 'rooms');
    const q = query(roomsRef, where('roomId', '==', roomId));
    const querySnapshot = await getDocs(q);

    console.log('Query snapshot size:', querySnapshot.size); // Debug log
    if (querySnapshot.empty) {
      throw new Error('Room not found');
    }

    const roomDoc = querySnapshot.docs[0];
    const roomData = { id: roomDoc.id, ...roomDoc.data() };

    console.log('Fetched room:', roomData); // Debug log
    return roomData;
  } catch (error) {
    console.error('Get Room Error:', error.message);
    throw error;
  }
};