import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
        console.log("Fetched Orders:", response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Network error, please try again.");
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value,
      });
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className='order-list'>
        {orders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt='' />
            <div>
              <div className='order-item-food'>
                {order.items.map((item, idx) => (
                  <div key={idx}>
                    <p><b>{item.name}</b> x {item.quantity}</p>
                    {/* Custom Pizza Details */}
                    {item.isCustomPizza && item.customOptions && (
                      <div className="custom-pizza-details">
                        <p><b>Base:</b> {item.customOptions.base}</p>
                        <p><b>Sauce:</b> {item.customOptions.sauce}</p>
                        <p><b>Cheese:</b> {item.customOptions.cheese}</p>
                        <p><b>Veggies:</b> {item.customOptions.veggies?.length > 0 ? item.customOptions.veggies.join(', ') : 'None'}</p>
                        <p><b>Meat:</b> {item.customOptions.meat?.length > 0 ? item.customOptions.meat.join(', ') : 'None'}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
              <div className='order-item-address'>
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>₹{order.amount}</p>
            <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
