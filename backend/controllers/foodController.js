import Food from '../models/foodModel.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get all food items
// @route   GET /api/food
// @access  Public
export const getAllFoodItems = async (req, res) => {
  try {
    const foods = await Food.find({}).sort({ createdAt: -1 });
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};

// @desc    Create a new Food Item
// @route   POST /api/food
// @access  Private/Admin
export const createFoodItem = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, price, and category',
      });
    }

    let finalImageUrl = imageUrl || '';
    let cloudinaryId = imageUrl || 'local-image';

    if (req.file) {
      try {
        const cloudinaryResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'biterush_menu' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );

          stream.end(req.file.buffer);
        });

        finalImageUrl = cloudinaryResult.secure_url;
        cloudinaryId = cloudinaryResult.public_id;
      } catch (uploadError) {
        console.error('Cloudinary Upload Error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Image upload failed. Please try again.',
        });
      }
    } else if (!finalImageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a food item image or provide an image URL',
      });
    }

    const food = await Food.create({
      name,
      description,
      price: Number(price),
      category,
      image: finalImageUrl,
      cloudinaryId,
    });

    res.status(201).json(food);
  } catch (error) {
    console.error('Create Food Error:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};

// @desc    Delete a food item
// @route   DELETE /api/food/:id
// @access  Private/Admin
export const deleteFoodItem = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found',
      });
    }

    await food.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Food item deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};