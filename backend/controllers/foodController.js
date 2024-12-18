import fs from "fs";
import foodModel from "../models/foodModel.js";

// add food item
const addFood = async (req, res) => {
    // Ensure req.file exists before accessing filename
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    let image_filename = req.file.filename; 
    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,
    });

    try {
        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (err) {
        console.log(`error is ${err}`, err);
        res.status(500).json({ success: false, message: "Error" });
    }
};

// add all food list
const listFood = async(req, res) => {
   try{
   const foods = await foodModel.find({});
   res.json({success: true, data: foods})
   }
   catch(err){
  console.log(err);
  res.json({success: false, message:"Error"});
   }
}

const removeFood = async (req, res) => {
    const { id } = req.body; // Retrieve the ID from the form

    try {
        // Find the food item by ID
        const foodItem = await foodModel.findById(id);
        if (!foodItem) {
            return res.status(404).json({ success: false, message: "Food item not found." });
        }

        // Define the path to the file in the upload folder
        const filePath = path.join("upload", foodItem.image);

        // Delete the file from the upload folder if it exists
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete the food item from the database
        await foodModel.findByIdAndDelete(id);

        res.json({ success: true, message: "Food item deleted successfully." });
    } catch (err) {
        console.error(`Error deleting food item: ${err}`);
        res.status(500).json({ success: false, message: "Error deleting food item." });
    }
};

export { addFood, listFood, removeFood };
