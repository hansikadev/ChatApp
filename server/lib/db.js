// import mongoose from "mongoose"

// //function to connect to the mongodb database
// export const connectDB = async () => {
//     try {
//         mongoose.connection.on('connected',()=>console.log('database connected'))
//         await mongoose.connect(`${process.env.MONGODB_URI}`)
//     } catch (error) {
//         console.log(error);
//     }
// }

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};


