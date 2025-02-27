import express from "express";
import { getInventory, updateStock, getLowStockNotifications, addInventoryItem } from "../controllers/inventoryController.js";

const router = express.Router();

router.get("/", getInventory);
router.put("/update", updateStock);
router.get("/notifications", getLowStockNotifications);
router.post("/add", addInventoryItem); // Optional: Route for adding inventory items

export default router;
