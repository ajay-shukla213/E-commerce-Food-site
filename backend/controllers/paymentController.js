import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

let razorpay = null;

try {
  const RazorpayModule = await import('razorpay');
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new RazorpayModule.default({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
} catch (error) {
  console.warn('Razorpay package not available, using mock mode:', error.message);
}

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount = 0, receipt } = req.body;
    const amountInPaise = Math.round(Number(amount || 0) * 100);

    if (!amountInPaise || amountInPaise <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount',
      });
    }

    if (!razorpay) {
      return res.status(200).json({
        success: true,
        mock: true,
        order: {
          id: `mock_order_${Date.now()}`,
          amount: amountInPaise,
          currency: 'INR',
          receipt: receipt || `receipt_${Date.now()}`,
          keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo',
        },
      });
    }

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
    });

    res.status(200).json({
      success: true,
      order: {
        ...order,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyRazorpayPayment = (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification data is incomplete',
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(200).json({
        success: true,
        verified: true,
        mock: true,
        message: 'Mock Razorpay verification succeeded',
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    res.status(200).json({
      success: isValid,
      verified: isValid,
      message: isValid ? 'Payment verified successfully' : 'Payment verification failed',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
