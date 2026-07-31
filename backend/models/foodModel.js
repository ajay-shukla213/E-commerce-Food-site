import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a food item name"],
      trim: true,
      maxlength: [100, "Food name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    price: {
      type: Number,
      required: [true, "Please add the price"],
      min: [0, "Price cannot be negative"],
    },

    image: {
      type: String,
      required: [true, "Please add an image URL"],
    },

    cloudinaryId: {
      type: String,
      required: [true, "Cloudinary ID is required"],
    },

    category: {
      type: String,
      required: [true, "Please specify a category"],
      enum: [
        "Starters",
        "Main Course",
        "Desserts",
        "Beverages",
        "Fast Food",
      ],
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

const Food = mongoose.model("Food", foodSchema);

export default Food;