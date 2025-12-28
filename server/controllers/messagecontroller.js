import Message from "../models/message.js";
import User from "../models.user.js";

//get all users except the logged in user
export const getUsersForSidebar = async () => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    //count number of messages not seen
    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });
    await Promise.all(promises);
    res.json({ succcess: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.log(error.message);
    res.json({ succcess: false, message: error.message });
  }
};


// Get all messages for selected user
export const getMessages = async (req, res) => {
  try {
    // ID of the user you are chatting with (from URL params)
    const { id: selectedUserId } = req.params;

    // ID of the logged-in user (from auth middleware)
    const myId = req.user._id;

    // Get all messages between logged-in user and selected user
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    // Mark messages sent TO me by selected user as seen
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );

    res.json({ success: true, messages });
      
  } catch (error) {
    console.log(error.message);
    res.status(500).json({success: false,message: error.message});
  }
};


// API to mark a message as seen using message ID
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    await Message.findByIdAndUpdate(id, { seen: true });

    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

