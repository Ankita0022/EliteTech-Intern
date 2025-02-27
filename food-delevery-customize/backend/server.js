import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import inventoryRouter from "./routes/inventoryRoute.js"; // Import inventory route

dotenv.config();

// App config
const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/inventory", inventoryRouter);

// Home route
app.get("/", (req, res) => {
    res.send("API Working");
});

// Start the server
app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});
