import React, { useContext, useEffect, useState, createContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);
  

  // Helper to get token
  const getToken = () => localStorage.getItem("token");

  // =========================
  // Get all users for sidebar
  // =========================
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users", {
        headers: {
          token: getToken(),
        },
      });

      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages || {});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // =========================
  // Get messages for selected user
  // =========================
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`, {
        headers: {
          token: getToken(),
        },
      });

      if (data.success) {
        setMessages(data.messages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // =========================
  // Send message
  // =========================
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData,
        {
          headers: {
            token: getToken(),
          },
        }
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // =========================
  // Subscribe to socket messages
  // =========================
  const subscribeToMessages = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      // If message is from currently selected user
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;

        setMessages((prev) => [...prev, newMessage]);

        // Mark message as seen
        axios.put(
          `/api/messages/mark/${newMessage._id}`,
          {},
          {
            headers: {
              token: getToken(),
            },
          }
        );
      } else {
        // Increase unseen count
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]:
            prev?.[newMessage.senderId]
              ? prev[newMessage.senderId] + 1
              : 1,
        }));
      }
    });
  };

  // =========================
  // Unsubscribe from socket
  // =========================
  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  // =========================
  // Effect
  // =========================
  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getUsers,
    getMessages,
    sendMessage,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};