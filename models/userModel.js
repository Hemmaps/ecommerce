const mongoose = require('mongoose');
const orderRecord = require('./orderModel');

const userSchema = new mongoose.Schema({
    name : {type:String, required:true},
    email : {type:String, required:true, unique:true},
    password : {type:String, required:true},
    orderHistory: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'orderRecord'
    }]
},{
    timestamps:true
})

const userRecord = mongoose.model('userRecord',userSchema)

module.exports = userRecord;