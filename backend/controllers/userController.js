import userModel from '../models/userModel.js';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import validator from 'validator';

// Create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error during login" });
        console.error(`Error in login is ${err}`, err);
    }
}

// Register user
const registerUser = async (req, res) => {
    const { name, password, email, phoneNumber } = req.body;
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    const phoneRegex = /^\d{10}$/;

    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User Already Exists" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email ID" });
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long and include at least one special character"
            });
        }
        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid 10-digit phone number"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({ name, email, phoneNumber, password: hashedPassword });
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error in registration" });
        console.error(`Error in registration is ${err}`, err);
    }
}

export { loginUser, registerUser };
