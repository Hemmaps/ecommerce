const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName : {type:String, required:true},
    description : String,
    category : String,
    price : {type:Number,required:true},
    stockQuantity: {type:Number,required:true}
})

const productRecord = mongoose.model('productRecord',productSchema)

module.exports = productRecord;