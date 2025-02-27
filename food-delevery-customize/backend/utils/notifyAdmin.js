import Inventory from "../models/inventoryModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Email sender setup
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD
    }
});

// Function to check stock and notify admin
export const checkLowStockAndNotify = async () => {
    try {
        const lowStockItems = await Inventory.find({ quantity: { $lt: 10 } });

        if (lowStockItems.length > 0) {
            const itemList = lowStockItems.map(item => `${item.name}: ${item.quantity} left`).join("\n");

            const mailOptions = {
                from: process.env.ADMIN_EMAIL,
                to: process.env.ADMIN_EMAIL, // Admin Email
                subject: "Low Stock Alert",
                text: `The following items are low in stock:\n\n${itemList}`
            };

            await transporter.sendMail(mailOptions);
            console.log("Low stock notification sent to admin.");
        }
    } catch (error) {
        console.error("Error checking stock levels:", error);
    }
};
