import express from 'express';
import { addOrderItems, getAllOrders, getMyOrders, getAdminAnalytics, updateOrderStatus } from '../controllers/orderController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Customer Endpoints
router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.get('/my-orders', protect, getMyOrders);

// Admin Dashboard Endpoints
router.get('/', protect, isAdmin, getAllOrders);
router.get('/admin/analytics', protect, isAdmin, getAdminAnalytics);
router.put('/:id/status', protect, isAdmin, updateOrderStatus);

export default router;