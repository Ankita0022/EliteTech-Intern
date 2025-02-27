import Inventory from "../models/inventoryModel.js";

// Get all inventory items
export const getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find().sort({ category: 1 }); // Sort by category
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: "Error fetching inventory", error });
    }
};


// Update stock quantity
export const updateStock = async (req, res) => {
    try {
        const { id, change } = req.body;
        const item = await Inventory.findById(id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        item.quantity += change;
        await item.save();

        // If stock goes below 10, set low stock notification
        if (item.quantity < 10) {
            item.lowStockNotification = `⚠️ Low Stock Alert: ${item.name} has only ${item.quantity} left!`;
        } else {
            item.lowStockNotification = null; // Remove alert if stock is replenished
        }
        await item.save();

        res.json({ message: "Stock updated", stock: item.quantity });

    } catch (error) {
        res.status(500).json({ message: "Error updating inventory", error });
    }
};

// Get low stock notifications for admin
export const getLowStockNotifications = async (req, res) => {
    try {
        const lowStockItems = await Inventory.find({ quantity: { $lt: 10 } });
        const notifications = lowStockItems.map(item => item.lowStockNotification).filter(Boolean);

        res.json({ notifications });
    } catch (error) {
        res.status(500).json({ message: "Error fetching low stock notifications", error });
    }
};

// Add new inventory item (Optional: If needed)
export const addInventoryItem = async (req, res) => {
    try {
        const { name, quantity, category } = req.body;
        const newItem = new Inventory({ name, quantity, category });
        await newItem.save();
        res.json({ message: "Item added successfully", item: newItem });
    } catch (error) {
        res.status(500).json({ message: "Error adding inventory item", error });
    }
};

