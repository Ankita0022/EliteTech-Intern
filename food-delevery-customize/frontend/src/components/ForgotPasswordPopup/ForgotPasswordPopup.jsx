import React, { useState } from "react";
import './ForgotPasswordPopup.css';
import axios from "axios";
import { assets } from "../../assets/assets";

const ForgotPasswordPopup = ({ setShowForgotPassword, setShowLogin }) => {
    const [email, setEmail] = useState("");

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        const response = await axios.post("http://localhost:4000/api/user/forgot-password", { email });

        if (response.data.success) {
            alert("Password reset link sent to your email.");
            setShowForgotPassword(false);
            setShowLogin(true);
        } else {
            alert(response.data.message);
        }
    };

    return (
        <div className='forgot-password-popup'>
            <form onSubmit={handleForgotPassword} className='forgot-password-container'>
                <div className='forgot-password-title'>
                    <h2>Forgot Password</h2>
                    <img onClick={() => setShowForgotPassword(false)} src={assets.cross_icon} alt='Close' />
                </div>
                <p>Enter your registered email to receive a password reset link.</p>
                <input 
                    type="email" 
                    placeholder="Your email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <button type="submit">Send Reset Link</button>
            </form>
        </div>
    );
};

export default ForgotPasswordPopup;
