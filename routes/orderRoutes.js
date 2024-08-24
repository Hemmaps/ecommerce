const express = require('express');
const router = express.Router();
const orderRecord = require('../models/orderModel');
const productRecord = require('../models/productModel');
const authMiddleware = require('../middlewares/authMiddleware')

// Create an order
router.post('/', authMiddleware, async (req, res) => {
    const { products } = req.body;

    if (!products || products.length === 0) {
        return res.status(400).json({ message: 'No products in order' });
    }

    try {
        // Calculate total price
        let totalPrice = 0;

        for (let item of products) {
            const product = await productRecord.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.product} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }
            totalPrice += product.price * item.quantity;
            product.stock -= item.quantity; // Reduce stock
            await product.save();
        }

        const order = await orderRecord.create({
            user: req.user.id,
            products,
            totalPrice,
            status: 'Pending'
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
// Get orders for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const orders = await orderRecord.find({ user: req.user.id }).populate('products.product', 'name price');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
// Update order status
router.put('/:id/status', authMiddleware, async (req, res) => {
    const { status } = req.body;

    if (!status || !['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const order = await orderRecord.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
// Delete an order
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const order = await orderRecord.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await order.remove();
        res.status(200).json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
