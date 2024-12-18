import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";

const userRouter = express.Router();

// Render the registration page
userRouter.get("/register", (req, res) => {
    res.render("register", { message: null }); 
});

// Handle user registration
userRouter.post("/register", registerUser);

// Handle user login
userRouter.post("/login", loginUser);

export default userRouter;
