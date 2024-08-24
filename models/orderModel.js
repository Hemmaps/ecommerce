const mongoose = require('mongoose');
const productRecord = require('./productModel');

const orderSchema = new mongoose.Schema({
    user : {type:mongoose.Schema.Types.ObjectId, ref : 'userRecord',required:true},
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'productRecord', required: true },
        quantity: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], 
        default: 'Pending' 
    },
    createdAt:{type:Date,default:Date.now}
})

const orderRecord = mongoose.model('orderRecord',orderSchema)

module.exports = orderRecord;