import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js";

//signup a new user
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;
    console.log("REGISTER API HIT", req.body);

    try {
        if (!fullName || !email || !password ) {
            return res.json({ success: false, message: "missing details" })
        }
        const user = await User.findOne({ email })

        if(user) {
            return res.json({ success: false, message: "user already exists, kindly login" });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio           
        })

        const token = generateToken(newUser._id);
        res.json({ success: true, userData: newUser ,token,message:"account created successfully"});
    
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}



//controller to login a user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email })
        
        const isPasswordCorrect = await bcrypt.compare(password, userData.password)
        
        if(!isPasswordCorrect) {
            return res.json({success:false,message:"invalid credentials"})
        }

        const token = generateToken(newUser._id);

        res.json({success: true,userData: newUser,token,message: "account login successful" });
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

//controller to check if user is authenticated
export const chechAuth = (req, res) => {
    res.json({ success: true, user: req.user })
};
//  what is the use of this function?
// What happens on refresh?
// Browser refreshes
// React state is cleared
// User appears logged out in frontend
// BUT token still exists (localStorage / cookies)



//controller to update user profile details
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;
        const userId = req.user._id 
        let updatedUser; 

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName },
            { new: true });
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, { profile: upload.secure_url, bio, fullName }, { new: true });
        }
        res.json({success:true,user:updatedUser})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false,message:error.message });
        
    }
} 