// import React,{ createContext, useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client"
// import axios from "axios"

// const backendUrl = import.meta.env.VITE_BACKEND_URL;
// axios.defaults.baseURL = backendUrl;

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {

//     const [token, setToken] = useState(localStorage.getItem("token"))
//     const [authUser, setAuthUser] = useState(null);
//     const [onlineUsers, setOnlineUsers] = useState([]);
//     const [socket, setSocket] = useState(null);

//     //check if user is authenticated and if so,set the user data and connect the socket
//     const checkAuth = async () => {
//         try {
//             const {data}=await axios.get("/api/auth/check")
//             if (data.success) {
//                 setAuthUser(data.user)
//                 connectSocket(data.user)
//             }
//         } catch (error) {
//             toast.error(error.message)
//         }
//     }

//     //login function to handle user authentication and socket connection
//     const login = async (state, credentials) => {
//         try {
//             const { data } = await axios.post(`/api/auth/${state}`, credentials);
//             if (data.success) {
//                 setAuthUser(data.userData);
//                 connectSocket(data.userData);
//                 axios.defaults.headers.common["token"] = data.token; //Automatically attach token to every future request.
//                 setToken(data.token);
//                 localStorage.setItem("token", data.token)//saving the token in frontend
//                 toast.success(data.message)
//             }
//             else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.message);
//         }
//     }

//     //logout function to handle user logout and socket disconnection
//     const logout = async () => {
//       localStorage.removeItem("token");
//       setToken(null);
//       setAuthUser(null);
//       setOnlineUsers([]);
//       axios.defaults.headers.common["token"] = null;
//       toast.success("logged out successfully");
//       socket?.disconnect(); //Stops real-time connection safely.
//     }

//     //update profile function to handle user profule updates
//     const updateProfile = async (body) => {
//         try {
//             const { data } = await axios.put("/api/auth/update-profile", body);
//             if (data.success) {
//                 setAuthUser(data.user);
//                 toast.success("profile updated successsfully");
//             }
//         } catch (error) {
//             toast.error(error.message)
//         }
//     }

//     //connect socket function to handle socket connection and online users updates
//     const connectSocket = (userData) => {
//         if (!userData || socket?.connected) return;
//         const newSocket = io(backendUrl, {
//             query: {
//                 userId: userData._id,
//             }
//         });
//         newSocket.connect();
//         setSocket(newSocket);

//         newSocket.on("getOnlineUsers", (userIds) => {
//             setOnlineUsers(userIds);
//         })
//     }

//     useEffect(() => {
//         if (token) {
//             axios.defaults.headers.common["token"] = token;
//         }
//         checkAuth();
//     },[])

//     const value = {
//         axios,
//         authUser,
//         onlineUsers,
//         socket,
//         login,
//         logout,
//         updateProfile
//     }

//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     )
// }

import React, { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
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

  // ✅ FIX: works for BOTH signup & login
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      // ✅ BACKEND sends: userData + token
      setAuthUser(data.userData);
      axios.defaults.headers.common["token"] = data.token;
      localStorage.setItem("token", data.token);
      setToken(data.token);

      connectSocket(data.userData);
      toast.success(data.message);
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
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
