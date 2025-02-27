import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";


// Configure email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to send a verification email
const sendVerificationEmail = async (email, token) => {
    const verificationLink = `http://localhost:4000/api/user/verify-email/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email",
        html: `<h2>Welcome to Pizza Delivery!</h2>
               <p>Please verify your email by clicking the link below:</p>
               <a href="${verificationLink}" target="_blank">Verify Email</a>`
    };

    await transporter.sendMail(mailOptions);
};

// Register User
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            verified: false
        });

        const user = await newUser.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        await sendVerificationEmail(email, token);

        res.json({ success: true, message: "Verification email sent! Please check your inbox." });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Verify Email
const verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await userModel.findByIdAndUpdate(decoded.id, { verified: true });

        res.send(`
            <h2>You have been verified!</h2>
            <p>Redirecting to login page...</p>
            <script>
                setTimeout(() => {
                    window.location.href = "http://localhost:5173";
                }, 3000);
            </script>
        `);
    } catch (error) {
        console.log(error);
        res.send("<h2>Invalid or expired token.</h2>");
    }
};

// Login User (Only verified users can log in)
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        if (!user.verified) {
            return res.json({ success: false, message: "Please verify your email before logging in." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};


// Forgot Password
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Generate a secure random token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour

        // Update user with reset token
        user.resetToken = resetToken;
        user.resetTokenExpiration = resetTokenExpiration;
        await user.save();

        // Create reset link
        const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Reset Your Password",
            html: `<h2>Reset Your Password</h2>
                   <p>Click the link below to reset your password:</p>
                   <a href="${resetLink}" target="_blank">Reset Password</a>
                   <p>This link is valid for 1 hour.</p>`
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Password reset link sent to email" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error sending reset email" });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const user = await userModel.findOne({ 
            resetToken: token, 
            resetTokenExpiration: { $gt: Date.now() } // Check if token is valid
        });

        if (!user) {
            return res.json({ success: false, message: "Invalid or expired token" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear reset token
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiration = null;
        await user.save();

        res.json({ success: true, message: "Password has been reset successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error resetting password" });
    }
};


export { loginUser, registerUser, verifyEmail , forgotPassword, resetPassword};
