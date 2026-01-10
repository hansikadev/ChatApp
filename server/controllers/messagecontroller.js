import Message from "../models/message.js";
import User from "../models/user.js";
import cloudinary from "cloudinary";
import { io, userSocketMap } from "../server.js";

/**
 * Get all users except the logged-in user (for sidebar)
 */
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all users except logged-in user
    const users = await User.find({ _id: { $ne: userId } }).select("-password");

    // Get unseen message counts in ONE query (optimized)
    const unseenCounts = await Message.aggregate([
      //Aggregation = data processing inside the database
      {
        $match: {
          // $match = filter documents
          receiverId: userId,
          seen: false,
        },
      },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert aggregation result to object
    const unseenMessages = {};
    unseenCounts.forEach((item) => {
      unseenMessages[item._id] = item.count;
    });

    res.json({success: true,users,unseenMessages});
  }
  catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



/**
 * Get all messages between logged-in user and selected user
 * and mark received messages as seen
 */
export const getMessages = async (req, res) => {  
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    // Mark messages sent TO me as seen
    await Message.updateMany(
      {
        senderId: selectedUserId,
        receiverId: myId,
        seen: false,
      },
      { seen: true }
    );

    // Get chat messages
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });  

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




/**
 * Mark a single message as seen
 */
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    await Message.findByIdAndUpdate(id, { seen: true });

    res.json({ success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




/**
 * Send message to selected user
 */
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl = null;

    // Upload image if exists
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // Save message to DB
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      seen: false,
    });

    // Emit message to receiver if online . emit means send an event with data from one side to another in real time.
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    // Real-time flow :
    // 1) User A sends message
    // 2) Backend saves message in DB
    // 3) Backend emits "newMessage"
    // 4) Receiver gets message instantly
    // 5) UI updates without refresh

    res.json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// | Code                   | Meaning                   |
// | ---------------------- | ------------------------- |
// | io.emit()              | Send to **everyone**      |
// | socket.emit()          | Send to **current user**  |
// | io.to(socketId).emit() | Send to **specific user** |
