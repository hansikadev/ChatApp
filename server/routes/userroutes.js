import express from "express";
import { chechAuth, login, signup, updateProfile } from "../controllers/usercontroller.js";
import { protectRoute } from "../middleware/auth.js";
const userrouter=express.Router()

userrouter.post("/signup", signup)
userrouter.post("/login", login);
userrouter.put("/update-profile", protectRoute, updateProfile);
userrouter.get("/check", protectRoute, chechAuth);


export default userrouter 