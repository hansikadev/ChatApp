import mongoose from "mongoose"

//function to connect to the mongodb database
export const connectDB = async () => {
    try {
        mongoose.connection.on('connected',()=>console.log('database connected'))
        await mongoose.connect(`${process.env.MONGODB_URI}`)
    } catch (error) {
        console.log(error);
    }
}

// import mongoose from "mongoose";

// console.log("Mongo URI:", process.env.MONGO_URI);

// mongoose.connection.once("open", () => {
//   console.log("Connected DB name:", mongoose.connection.name);
// });
