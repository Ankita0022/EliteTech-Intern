import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    category: String, // Categorize items
    lowStockNotification: { type: String, default: null } // Store low stock alerts
});

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;
