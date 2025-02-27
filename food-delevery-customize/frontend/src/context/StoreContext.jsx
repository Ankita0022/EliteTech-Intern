import { createContext, useEffect, useState } from "react"; 
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = JSON.parse(localStorage.getItem("cartItems") || "{}");
        console.log("📥 Loaded Cart Items from localStorage:", savedCart);
        return savedCart;
    });

    const [customPizzas, setCustomPizzas] = useState(() => {
        const savedPizzas = JSON.parse(localStorage.getItem("customPizzas") || "[]");
        console.log("📥 Loaded Custom Pizzas from localStorage:", savedPizzas);
        return savedPizzas;
    });

    const url = "http://localhost:4000";
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [food_list, setFoodList] = useState([]);

    // Add standard food items to cart
    const addToCart = async (itemId) => {
        setCartItems((prev) => {
            const newCart = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
            console.log("🛒 Updated Cart Items:", newCart);
            localStorage.setItem("cartItems", JSON.stringify(newCart));
            return newCart;
        });

        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    };

    // Remove standard food items from cart
    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const newCart = { ...prev, [itemId]: Math.max((prev[itemId] || 0) - 1, 0) };
            console.log("🛒 Updated Cart Items:", newCart);
            localStorage.setItem("cartItems", JSON.stringify(newCart));
            return newCart;
        });

        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    };

    // Add a customized pizza to the cart and persist in localStorage
    const addCustomPizzaToCart = (pizza) => {
        setCustomPizzas((prev) => {
            const updatedPizzas = [...prev, pizza];
            console.log("🍕 Added Custom Pizza:", pizza);
            localStorage.setItem("customPizzas", JSON.stringify(updatedPizzas));
            return updatedPizzas;
        });
    };

    // Remove a customized pizza and update localStorage
    const removeCustomPizza = (index) => {
        setCustomPizzas((prev) => {
            const updatedPizzas = prev.filter((_, i) => i !== index);
            console.log("🗑️ Removed Custom Pizza at index:", index);
            localStorage.setItem("customPizzas", JSON.stringify(updatedPizzas));
            return updatedPizzas;
        });
    };

    // Clear cart (also clears custom pizzas from localStorage)
    const clearCart = () => {
        setCartItems({});
        setCustomPizzas([]);
        console.log("🗑️ Cart Cleared!");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("customPizzas");
    };

    // Calculate total cart amount including both standard and custom pizzas
    const getTotalCartAmount = () => {
        let totalAmount = 0;

        // Calculate total for standard food items
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }

        // Calculate total for customized pizzas
        totalAmount += customPizzas.reduce((sum, pizza) => sum + pizza.totalPrice, 0);

        return totalAmount;
    };

    // Fetch food list from backend
    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data);
    };

    //Load cart data from backend (for logged-in users)
    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
        setCartItems(response.data.cartData);
        localStorage.setItem("cartItems", JSON.stringify(response.data.cartData));
        console.log("📥 Loaded Cart from Backend:", response.data.cartData);
    };

    

    // Load data on startup
    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (token) {
                await loadCartData(token);
            }
        }
        loadData();
    }, [token]);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        customPizzas,
        addCustomPizzaToCart,
        removeCustomPizza,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        clearCart
    };

    return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;
