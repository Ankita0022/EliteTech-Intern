import React, { useState } from "react";
import './ResetPassword.css';
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:4000/api/user/reset-password", { token, newPassword });

            if (response.data.success) {
                setSuccessMessage("Password reset successful! Redirecting to login...");
                setError("");
                setTimeout(() => navigate("/"), 2000);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="reset-password-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleResetPassword}>
                <input 
                    type="password" 
                    placeholder="Enter new password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Confirm new password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                />
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;
