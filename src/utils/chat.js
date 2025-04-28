// src/utils/chat.js
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

// Send a message to a room
export const sendMessage = async (roomDocId, user, text) => {
  try {
    const messagesRef = collection(db, 'rooms', roomDocId, 'messages');
    await addDoc(messagesRef, {
      text: text.trim(),
      senderId: user.uid,
      senderName: user.displayName || user.email,
      createdAt: new Date(),
    });
    console.log('Message sent to roomDocId:', roomDocId); // Debug log
  } catch (error) {
    console.error('Send Message Error:', error.message);
    throw error;
  }
};

// Listen for messages in a room
export const listenForMessages = (roomDocId, callback) => {
  try {
    const messagesRef = collection(db, 'rooms', roomDocId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Fetched messages for roomDocId:', roomDocId, messages); // Debug log
      callback(messages);
    }, (error) => {
      console.error('Listen Messages Error:', error.message);
      callback([]);
    });
    return unsubscribe;
  } catch (error) {
    console.error('Listen Messages Setup Error:', error.message);
    callback([]);
    return () => {};
  }
};