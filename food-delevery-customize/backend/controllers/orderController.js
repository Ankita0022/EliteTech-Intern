import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js'
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Placing order and creating Razorpay order
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";

    try {
        console.log("🔍 Received Order Data:", JSON.stringify(req.body, null, 2));

        const newOrder = new orderModel({
            
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Creating Razorpay Order
        const options = {
            amount: newOrder.amount * 100, // Amount in paise (INR)
            currency: "INR",
            receipt: newOrder._id.toString(),
        };

        const order = await razorpay.orders.create(options);
        console.log("Razorpay Order Created:", order);

        res.json({
            success: true,
            order_id: order.id,
            amount: newOrder.amount * 100,
            currency: "INR",
            orderId: newOrder._id
        });

    } catch (error) {
        console.error("Error in placeOrder:", error);
        res.json({ success: false, message: "Error placing order" });
    }
};

// Verifying Payment
const verifyOrder = async (req, res) => {
    try {
        const { orderId, paymentId, signature } = req.body;

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(orderId + "|" + paymentId)
            .digest("hex");

        if (expectedSignature === signature) {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Payment Verified" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment Verification Failed" });
        }

    } catch (error) {
        console.error("Error in verifyOrder:", error);
        res.json({ success: false, message: "Error verifying order" });
    }
};

//user orders for frontend
const userOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId})
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//creating api for Listing orders for admin pannel
const listOrders = async (req,res)=>{
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})  
    }
}

//api for updating order status
const updateStatus = async(req,res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}