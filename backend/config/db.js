import mongoose from "mongoose";

export const connectDB = async () =>{
   await mongoose.connect("mongodb://localhost:27017/Tomato", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((error) => {
        console.error("Error connecting to DB:", error);
    });
}

