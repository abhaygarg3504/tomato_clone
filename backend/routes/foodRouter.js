import express from 'express';
import multer from 'multer';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';
import foodModel from '../models/foodModel.js';
// Set up the router
const foodRouter = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Create a unique filename
    },
});

// Initialize Multer with storage settings
const upload = multer({ storage: storage });

foodRouter.get("/add", (req, res) => {
    res.render('uploading'); // Render the EJS form
});
// Route to add food item with file upload
foodRouter.post("/add", upload.single("image"), addFood, (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(500).json({ success: false, message: err.message });
    } else if (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});
foodRouter.get("/list", listFood);

foodRouter.get("/remove", (req, res) => {
    res.render('removing');
});

// Handle deletion of food item by ID
foodRouter.post("/remove", async (req, res, next) => {
    try {
        const { id } = req.body;
        
        // Find the food item by ID in the database
        const foodItem = await foodModel.findById(id);
        if (!foodItem) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        // If an image path is associated, delete the file
        if (foodItem.imagePath) {
            const imagePath = path.join(__dirname, foodItem.imagePath); // Adjust the path based on the image's location
            fs.unlinkSync(imagePath); // Delete the image file
        }

        // Delete the food item from the database
        await foodModel.findByIdAndDelete(id);

        // Redirect or respond with success
        res.json({ success: true, message: "Food item deleted successfully" });
    } catch (err) {
        next(err); // Pass any errors to the error handler
    }
});

export default foodRouter;
