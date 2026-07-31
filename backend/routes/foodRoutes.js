import express from 'express';
import {
  createFoodItem,
  getAllFoodItems,
  deleteFoodItem,
} from '../controllers/foodController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Public
router.get('/', getAllFoodItems);
router.get('/menu', getAllFoodItems);

// Admin
router.post(
  '/',
  protect,
  isAdmin,
  upload.single('image'),
  createFoodItem
);

router.post(
  '/menu',
  protect,
  isAdmin,
  upload.single('image'),
  createFoodItem
);

router.delete('/:id', protect, isAdmin, deleteFoodItem);

export default router;