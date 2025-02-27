import React, { useState, useEffect } from "react";
import "./Inventory.css";

const Inventory = () => {
    const [items, setItems] = useState({});

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/inventory");
            const data = await response.json();

            const groupedItems = data.reduce((acc, item) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
            }, {});

            setItems(groupedItems);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        }
    };

    const updateQuantity = async (id, change) => {
        try {
            const response = await fetch("http://localhost:4000/api/inventory/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, change }),
            });
            if (response.ok) {
                fetchInventory();
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    return (
        <div className="inventory-container">
            <h1>Inventory Management</h1>
            {Object.entries(items).map(([category, categoryItems]) => (
                <div key={category} className="inventory-category">
                    <h2 className="category-title">{category.toUpperCase()}</h2>
                    <div className="inventory-grid">
                        {categoryItems.map((item) => (
                            <div key={item._id} className="inventory-item">
                                <h3>{item.name}</h3>
                                <p className={`stock ${item.quantity < 10 ? "low-stock" : ""}`}>
                                    Stock: {item.quantity}
                                </p>
                                <div className="quantity-controls">
                                    <button onClick={() => updateQuantity(item._id, -1)} disabled={item.quantity === 0}>
                                        -
                                    </button>
                                    <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                                </div>
                                {item.quantity < 10 && <p className="notification">⚠️ Low Stock!</p>}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Inventory;
