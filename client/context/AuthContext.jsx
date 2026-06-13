import React, { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Configure axios to use backend URL
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // ✅ FIX: do NOT crash if /check fails
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      console.log("Auth check skipped");
    }
  };

  const signup = async (credentials) => {
    try {
      const { data } = await axios.post("/api/auth/signup", credentials);

      if (!data.success) {
        toast.error(data.message);
        return; 
      }

      setAuthUser(data.userData);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      axios.defaults.headers.common["token"] = data.token;

      connectSocket(data.userData);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const login = async (credentials) => {
    try {
      const { data } = await axios.post("/api/auth/login", credentials);

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      setAuthUser(data.userData);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      axios.defaults.headers.common["token"] = data.token;

      connectSocket(data.userData);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    socket?.disconnect();
    toast.success("logged out successfully");
  };

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("profile updated successsfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });

    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        onlineUsers,
        socket,
        login,
        signup,
        logout,
        updateProfile,
        axios,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
