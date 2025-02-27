import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://customise:pizza@cluster0.y3tzz.mongodb.net/food-delevery-customize').then(()=>console.log("DB Connected"));
}

//mongodb+srv://ankita:ankita@cluster0.gdktl.mongodb.net/

//customize pizza
// mongodb+srv://customise:pizza@cluster0.y3tzz.mongodb.net/food-delevery-customize

