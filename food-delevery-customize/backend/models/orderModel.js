import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [
        {
            name: String,  // Pizza name
            quantity: Number,
      isCustomPizza: Boolean, 
      customOptions: {
        base: String,
        sauce: String,
        cheese: String,
        veggies: [String], // Array for multiple veggies
        meat: [String]},
            selectedIngredients: [String] // Store ingredients for inventory update
        }
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Food Processing" },
    date: { type: Date, default: Date.now() },
    payment: { type: Boolean, default: false }
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
