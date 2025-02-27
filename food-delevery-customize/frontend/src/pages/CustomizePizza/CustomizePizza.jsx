import React, { useState, useContext } from "react";
import "./CustomizePizza.css";
import { assets } from '../../assets/assets';
import { StoreContext } from "../../context/StoreContext";

const CustomizePizza = () => {
    const { addCustomPizzaToCart } = useContext(StoreContext);

    // Fixed Inventory Items
    const bases = [
        { name: "Thin Crust", price: 50},
        { name: "Thick Crust", price: 60},
        { name: "Cheese-Filled Crust", price: 80},
        { name: "Whole Wheat Crust", price: 55},
        { name: "Gluten-Free Crust", price: 70},
        { name: "Sourdough Crust", price: 75},
    ];

    const sauces = [
        { name: "Classic Tomato Sauce", price: 20},
        { name: "Alfredo Sauce", price: 30},
        { name: "Pesto Sauce", price: 25},
        { name: "Barbecue Sauce", price: 35},
        { name: "Spicy Arrabbiata Sauce"},
        { name: "Garlic Butter Sauce", price: 30},
    ];

    const cheeses = [
        { name: "Mozzarella", price: 40},
        { name: "Cheddar", price: 50},
        { name: "Parmesan", price: 60},
        { name: "Provolone", price: 55},
        { name: "Gouda", price: 70},
        { name: "Ricotta", price: 65},
    ];

    const veggies = [
        { name: "Bell Peppers", price: 15},
        { name: "Mushrooms", price: 20},
        { name: "Black Olives", price: 25},
        { name: "Red Onions", price: 10},
        { name: "Spinach", price: 18},
        { name: "Cherry Tomatoes", price: 12},
    ];

    const meats = [
        { name: "Pepperoni", price: 30},
        { name: "Sausage", price: 35},
        { name: "Grilled Chicken", price: 40},
        { name: "Barbecue Chicken", price: 45},
        { name: "Bacon", price: 50},
        { name: "Ham", price: 38},
        { name: "Salami", price: 42},
    ];

    // State for selections
    const [selectedBase, setSelectedBase] = useState(null);
    const [selectedSauce, setSelectedSauce] = useState(null);
    const [selectedCheese, setSelectedCheese] = useState(null);
    const [selectedVeggies, setSelectedVeggies] = useState([]);
    const [selectedMeats, setSelectedMeats] = useState([]);

    // Handle multi-selection for veggies & meats
    const handleMultiSelect = (item, setSelectedItems, selectedItems) => {
        setSelectedItems(prev => {
            const isSelected = prev.some(i => i.name === item.name);
            return isSelected
                ? prev.filter(i => i.name !== item.name)
                : [...prev, item];
        });
    };

    // Calculate total price
    const totalPrice =
        (selectedBase?.price || 0) +
        (selectedSauce?.price || 0) +
        (selectedCheese?.price || 0) +
        selectedVeggies.reduce((sum, item) => sum + item.price, 0) +
        selectedMeats.reduce((sum, item) => sum + item.price, 0);

    // Handle order submission
    const handleSubmit = () => {
        if (!selectedBase || !selectedSauce || !selectedCheese) {
            alert("Please select a base, sauce, and cheese!");
            return;
        }

        const customPizza = {
            base: selectedBase.name,
            sauce: selectedSauce.name,
            cheese: selectedCheese.name,
            veggies: selectedVeggies.map(v => v.name),
            meats: selectedMeats.map(m => m.name),
            totalPrice
        };

        addCustomPizzaToCart(customPizza);

        alert(`Your customized pizza has been added to the cart!\n
        Base: ${selectedBase.name}\n
        Sauce: ${selectedSauce.name}\n
        Cheese: ${selectedCheese.name}\n
        Veggies: ${selectedVeggies.map(v => v.name).join(", ") || "None"}\n
        Meats: ${selectedMeats.map(m => m.name).join(", ") || "None"}\n
        Total Price: ₹${totalPrice}`);
    };

    return (
        <div className="customize-container">
            <h2>Customize Your Pizza 🍕</h2>

            {/* Base Selection */}
            <div className="option-group">
                <h3>Choose a Base</h3>
                <div className="options-scroll">
                    {bases.map(base => (
                        <div
                            key={base.name}
                            className={`option ${selectedBase?.name === base.name ? "selected" : ""}`}
                            onClick={() => setSelectedBase(base)}
                        >
                            <p>{base.name} - ₹{base.price}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sauce Selection */}
            <div className="option-group">
                <h3>Choose a Sauce</h3>
                <div className="options-scroll">
                    {sauces.map(sauce => (
                        <div
                            key={sauce.name}
                            className={`option ${selectedSauce?.name === sauce.name ? "selected" : ""}`}
                            onClick={() => setSelectedSauce(sauce)}
                        >
                            <p>{sauce.name} - ₹{sauce.price}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cheese Selection */}
            <div className="option-group">
                <h3>Select Cheese</h3>
                <div className="options-scroll">
                    {cheeses.map(cheese => (
                        <div
                            key={cheese.name}
                            className={`option ${selectedCheese?.name === cheese.name ? "selected" : ""}`}
                            onClick={() => setSelectedCheese(cheese)}
                        >
                            <p>{cheese.name} - ₹{cheese.price}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Veggie Selection */}
            <div className="option-group">
                <h3>Choose Your Veggies</h3>
                <div className="options-scroll">
                    {veggies.map(veg => (
                        <div
                            key={veg.name}
                            className={`option ${selectedVeggies.some(v => v.name === veg.name) ? "selected" : ""}`}
                            onClick={() => handleMultiSelect(veg, setSelectedVeggies, selectedVeggies)}
                        >
                            <p>{veg.name} - ₹{veg.price}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Meats Selection */}
            <div className="option-group">
                <h3>Choose Your Meats</h3>
                <div className="options-scroll">
                    {meats.map(meat => (
                        <div
                            key={meat.name}
                            className={`option ${selectedMeats.some(m => m.name === meat.name) ? "selected" : ""}`}
                            onClick={() => handleMultiSelect(meat, setSelectedMeats, selectedMeats)}
                        >
                            <p>{meat.name} - ₹{meat.price}</p>
                        </div>
                    ))}
                </div>
            </div>

            <h3 className="total-price">Total Price: ₹{totalPrice}</h3>

            <button className="submit-btn" onClick={handleSubmit}>Confirm My Pizza 🍕</button>
        </div>
    );
};

export default CustomizePizza;
