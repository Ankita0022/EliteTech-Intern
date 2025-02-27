import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    customPizzas, // ✅ Extracting customPizzas from StoreContext
    url,
    clearCart,
  } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    let orderItems = [];

    console.log("Cart Items:", cartItems);
    console.log("Food List:", food_list);
    console.log("Custom Pizzas Before Placing Order:", customPizzas);
    console.log("Final Order Amount:", getTotalCartAmount());

    // Add regular pizzas from food_list
    orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        ...item,
        quantity: cartItems[item._id],
        isCustomPizza: false,
      }));

    console.log("Regular Pizzas Added:", orderItems);

    // Add custom pizzas manually
    if (customPizzas.length > 0) {
      customPizzas.forEach((customPizza) => {
        orderItems.push({
          name: "Custom Pizza",
          quantity: 1, // Each custom pizza is unique
          isCustomPizza: true,
          totalPrice: customPizza.totalPrice,
          customOptions: {
            base: customPizza.base,
            sauce: customPizza.sauce,
            cheese: customPizza.cheese,
            veggies: customPizza.veggies || [],
            meat: customPizza.meat || [],
          },
        });
      });
    }

    console.log("Final Order Items:", orderItems);

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    console.log("Order Data being sent to backend:", orderData);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay. Try again.");
        return;
      }

      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });

      if (response.data.success) {
        const { order_id, amount, currency } = response.data;

        const options = {
          key: "rzp_test_P8ZigNlmIZ3vsd",
          amount,
          currency,
          name: "Pizza Delivery",
          description: "Order Payment",
          order_id,
          handler: async function (paymentResponse) {
            try {
              await axios.post(`${url}/api/order/verify`, {
                orderId: order_id,
                paymentId: paymentResponse.razorpay_payment_id,
                signature: paymentResponse.razorpay_signature,
              });

              alert("Payment successful!");
              navigate("/myorders");
              clearCart();
            } catch (error) {
              alert("Payment verification failed!");
              navigate("/");
            }
          },
          prefill: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            contact: data.phone,
          },
          theme: { color: "#3399cc" },
          modal: {
            ondismiss: function () {
              alert("Payment cancelled.");
              navigate("/");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert("Error processing order.");
      }
    } catch (error) {
      console.error("Error in placeOrder:", error);
      alert("Error processing order.");
    }
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={(e) => setData({ ...data, firstName: e.target.value })}
            value={data.firstName}
            type="text"
            placeholder="First name"
          />
          <input
            required
            name="lastName"
            onChange={(e) => setData({ ...data, lastName: e.target.value })}
            value={data.lastName}
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          name="email"
          onChange={(e) => setData({ ...data, email: e.target.value })}
          value={data.email}
          type="email"
          placeholder="Email address"
        />
        <input
          required
          name="street"
          onChange={(e) => setData({ ...data, street: e.target.value })}
          value={data.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={(e) => setData({ ...data, city: e.target.value })}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            onChange={(e) => setData({ ...data, state: e.target.value })}
            value={data.state}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={(e) => setData({ ...data, zipcode: e.target.value })}
            value={data.zipcode}
            type="text"
            placeholder="Zip code"
          />
          <input
            required
            name="country"
            onChange={(e) => setData({ ...data, country: e.target.value })}
            value={data.country}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          onChange={(e) => setData({ ...data, phone: e.target.value })}
          value={data.phone}
          type="text"
          placeholder="Phone"
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
