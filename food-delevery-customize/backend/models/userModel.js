import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    cartData: { type: Object, default: {} },
    resetToken: { type: String, default: null },  // Store reset token
    resetTokenExpiration: { type: Date, default: null }  // Expiration time
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
