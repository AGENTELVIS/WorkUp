import User from "../model/Usermodel.js";
import bcrypt from "bcryptjs";

export const Signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.status(200).json({ message: "Sign in successful" });
    } catch (error) {
        console.error("Error signing in:", error.message);
        
    }
};

export const Register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/; 
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid Email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10); 

        const createdUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await createdUser.save();
        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error in registration:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

