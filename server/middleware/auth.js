import User from "../models/user.js";
import jwt from "jsonwebtoken";

// middleware to protect routes
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;

    // 1️⃣ Check token exists
    if (!token) {
      console.log("TOKEN MISSING");
      return res.json({ success: false, message: "token missing" });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED TOKEN:", decoded);

    // 3️⃣ IMPORTANT: match key name used when signing
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.log("USER NOT FOUND IN DB");
      return res.json({ success: false, message: "user not found" });
    }

    // 4️⃣ Attach user
    req.user = user;
    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return res.json({ success: false, message: "user not found" });
  }
};