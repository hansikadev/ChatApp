import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/homepage";
import Loginpage from "./pages/Loginpage";
import Profilepage from "./pages/Profilepage";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";


const App = () => {
  const authContext = useContext(AuthContext);
  const authUser = authContext?.authUser;
  
  return (
    <div className="bg-[url('./src/assets/bgimage.jpg')] bg-contain ">
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Homepage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Loginpage />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profilepage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
