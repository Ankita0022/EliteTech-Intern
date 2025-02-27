import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Inventory from "./models/inventoryModel.js";

dotenv.config();
connectDB();

const inventoryItems = [
    { name: "Thin Crust", category: "base", quantity: 15 },
    { name: "Thick Crust", category: "base", quantity: 12 },
    { name: "Cheese-Filled Crust", category: "base", quantity: 10 },
    { name: "Whole Wheat Crust", category: "base", quantity: 8 },
    { name: "Gluten-Free Crust", category: "base", quantity: 6 },
    { name: "Sourdough Crust", category: "base", quantity: 5 },
    { name: "Classic Tomato Sauce", category: "sauce", quantity: 20 },
    { name: "Alfredo Sauce", category: "sauce", quantity: 18 },
    { name: "Pesto Sauce", category: "sauce", quantity: 15 },
    { name: "Barbecue Sauce", category: "sauce", quantity: 12 },
    { name: "Spicy Arrabbiata Sauce", category: "sauce", quantity: 10 },
    { name: "Garlic Butter Sauce", category: "sauce", quantity: 8 },
    { name: "Mozzarella", category: "cheese", quantity: 25 },
    { name: "Cheddar", category: "cheese", quantity: 20 },
    { name: "Parmesan", category: "cheese", quantity: 15 },
    { name: "Provolone", category: "cheese", quantity: 12 },
    { name: "Gouda", category: "cheese", quantity: 10 },
    { name: "Ricotta", category: "cheese", quantity: 8 },
    { name: "Bell Peppers", category: "veggies", quantity: 30 },
    { name: "Mushrooms", category: "veggies", quantity: 25 },
    { name: "Black Olives", category: "veggies", quantity: 20 },
    { name: "Red Onions", category: "veggies", quantity: 18 },
    { name: "Spinach", category: "veggies", quantity: 15 },
    { name: "Cherry Tomatoes", category: "veggies", quantity: 12 },
    { name: "Pepperoni", category: "meat", quantity: 20 },
    { name: "Sausage", category: "meat", quantity: 18 },
    { name: "Grilled Chicken", category: "meat", quantity: 15 },
    { name: "Barbecue Chicken", category: "meat", quantity: 12 },
    { name: "Bacon", category: "meat", quantity: 10 },
    { name: "Ham", category: "meat", quantity: 8 },
    { name: "Salami", category: "meat", quantity: 6 },
];

// Function to insert inventory items
const seedInventory = async () => {
    try {
        await Inventory.deleteMany(); // Clear existing data
        await Inventory.insertMany(inventoryItems);
        console.log("✅ Inventory Data Inserted Successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Error Seeding Inventory Data:", error);
        process.exit(1);
    }
};

seedInventory();
