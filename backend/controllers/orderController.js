import Order from '../models/orderModel.js';
import mongoose from 'mongoose';

const normalizeShippingAddress = (shippingAddress) => {
  if (typeof shippingAddress === 'string') {
    return {
      address: shippingAddress,
      city: 'N/A',
      postalCode: 'N/A',
    };
  }

  return {
    address: shippingAddress?.address || '',
    city: shippingAddress?.city || 'N/A',
    postalCode: shippingAddress?.postalCode || 'N/A',
  };
};

const normalizeOrderItems = (items = []) =>
  items.map((item) => ({
    name: item.name || item.menuItem?.name || item.food?.name || 'Food Item',
    quantity: Number(item.quantity || 1),
    image: item.image || item.imageUrl || item.menuItem?.image || item.menuItem?.imageUrl || item.food?.image || item.food?.imageUrl || '',
    price: Number(item.price || item.unitPrice || 0),
    food: item.food || item.menuItem?._id || item.menuItem || item._id || null,
  }));

const formatOrderForClient = (order) => ({
  ...order.toObject(),
  items: order.orderItems.map((item) => ({
    ...item.toObject(),
    menuItem: item.food,
    price: item.price,
    quantity: item.quantity,
  })),
  totalAmount: order.totalPrice,
  shippingAddress: `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`,
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      orderItems,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      deliveryPrice,
      totalPrice,
      totalAmount,
    } = req.body;

    const normalizedItems = normalizeOrderItems(orderItems || items || []);

    if (!normalizedItems.length) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'No order items found',
      });
    }

    const normalizedShippingAddress = normalizeShippingAddress(shippingAddress);
    const itemsPriceValue = Number(itemsPrice || totalAmount || 0);
    const taxPriceValue = Number(taxPrice || 0);
    const deliveryPriceValue = Number(deliveryPrice || 40);
    const totalPriceValue = Number(totalPrice || totalAmount || itemsPriceValue + taxPriceValue + deliveryPriceValue);
    const selectedPaymentMethod = paymentMethod || 'COD';
    const isPaidOrder = selectedPaymentMethod !== 'COD';
    const paymentStatus = isPaidOrder ? 'Completed' : 'Pending';
    const transactionId = isPaidOrder ? `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}` : '';

    const order = new Order({
      user: req.user._id,
      orderItems: normalizedItems,
      shippingAddress: normalizedShippingAddress,
      paymentMethod: selectedPaymentMethod,
      paymentStatus,
      transactionId,
      isPaid: isPaidOrder,
      paidAt: isPaidOrder ? new Date() : null,
      itemsPrice: itemsPriceValue,
      taxPrice: taxPriceValue,
      deliveryPrice: deliveryPriceValue,
      totalPrice: totalPriceValue,
    });

    const createdOrder = await order.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: formatOrderForClient(createdOrder),
    });
  } catch (error) {
    await session.abortTransaction();

    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

// @desc    Get all orders for admin
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json(orders.map(formatOrderForClient));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(orders.map(formatOrderForClient));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get Admin Analytics
// @route   GET /api/orders/admin/analytics
// @access  Private/Admin
export const getAdminAnalytics = async (req, res) => {
  try {
    const analytics = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'Cancelled' },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalPrice' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$totalPrice' },
        },
      },
    ]);

    const categoryStats = await Order.aggregate([
      {
        $unwind: '$orderItems',
      },
      {
        $group: {
          _id: '$orderItems.name',
          totalQuantity: {
            $sum: '$orderItems.quantity',
          },
          totalRevenue: {
            $sum: {
              $multiply: [
                '$orderItems.price',
                '$orderItems.quantity',
              ],
            },
          },
        },
      },
      {
        $sort: {
          totalQuantity: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      summary: analytics[0] || {
        totalSales: 0,
        totalOrders: 0,
        averageOrderValue: 0,
      },
      popularItems: categoryStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update Order Status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = [
      'Pending',
      'Preparing',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status',
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const normalizedStatus = status === 'Pending' ? 'Placed' : status;
    order.status = normalizedStatus;

    if (status === 'Delivered') {
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    const updatedOrder = await order.save();

    const io = req.app.get('socketio');

    if (io) {
      io.to(order.user.toString()).emit('orderStatusUpdated', {
        orderId: order._id,
        status: order.status,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully!',
      order: formatOrderForClient(updatedOrder),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};