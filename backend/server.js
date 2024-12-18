import express from "express";
import cors from 'cors';
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRouter.js";
import fs from 'fs';
import userRouter from "./routes/userRouter.js";
import 'dotenv/config';
import cartRouter from "./routes/cartRouter.js";
import orderRouter from "./routes/orderRouter.js";

const app = express();
const port = 4000;

// Create upload directory if it doesn't exist
const uploadDir = 'upload';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', './views'); // Set the directory for views

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/food", foodRouter); // by defaulut /api/food already set
app.use("/images", express.static('upload'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use(express.urlencoded({ extended: true }));

// API endpoint
app.get("/", (req, res) => {
    res.send("API working");
});

app.listen(port, () => {
   console.log(`server running at ${port}`);
});
