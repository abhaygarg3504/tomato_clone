
import Stripe from "stripe";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Place order function
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173"; // Make sure this is the correct frontend URL
  try {
    const { userId, items, amount, address } = req.body;

    // Validate request data
    if (!userId || !items || !amount || !address) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data. Please provide all required fields.",
      });
    }

    // Check if user exists in the database
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Create the new order
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
    });
    await newOrder.save();

    // Clear user's cart after order is placed
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Prepare line items for Stripe checkout session
    const line_items = items.map((item) => {
      if (!item.name || !item.price || !item.quantity) {
        throw new Error("Invalid item data: missing name, price, or quantity.");
      }

      return {
        price_data: {
          currency: "inr", // Assuming INR currency
          product_data: { name: item.name },
          unit_amount: item.price * 100 * 80, // Convert to paise (Stripe's smallest unit is cents/paise)
        },
        quantity: item.quantity,
      };
    });

    // Add delivery charges to the line items
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 2 * 100 * 80, // Example of delivery charges conversion
      },
      quantity: 1,
    });

    console.log("Line items sent to Stripe:", line_items);

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment", // We are handling a payment, not a subscription
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    // Return the session URL to the frontend
    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (err) {
    console.error("Stripe API Error:", err.message, err.stack);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the order.",
      error: err.message,
    });
  }
};

const verifyOrder = async(req, res)=>{
  const {orderId, success} = req.body;
  try{
    if(success=="true"){
      await orderModel.findOneAndUpdate(orderId, {payment: true});
      res.json({success: true, message: "Paid Successfully"});
    }
    else{
      await orderModel.findOneAndDelete(orderId);
      res.json({success: false, message: "Not Paid"});
    }
  }
  catch(err){
    console.log(err);
    res.json({success: false, message: "Error"});
  }
}

export { placeOrder };
