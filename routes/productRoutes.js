const express = require('express')
const router = express.Router();
const productRecord = require('../models/productModel');

//create a product
router.post('/',async(req,res)=>{
    try {
        const newProduct = await productRecord.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({message : error.message})
    }
})

//get all products

// router.get('/',async(req,res)=>{
//     try {
//         const getProducts = await productRecord.find();
//         res.status(200).json(getProducts)
//     } catch (error) {
//         res.status(400).json({message : error.message})
//     }
// })

//get product by id
router.get('/:id',async(req,res)=>{
    try {
        const getProductsById = await productRecord.find({_id:req.params.id});
        res.status(200).json(getProductsById)
    } catch (error) {
        res.status(400).json({message : error.message})
    }
})

//update product by id
router.put('/:id',async(req,res)=>{
    try {
        const updateProductsById = await productRecord.findByIdAndUpdate({_id:req.params.id},{$set : req.body},{new:true})
        if(updateProductsById!=null)
            res.status(200).json({message : "Updated sucessfully"})
        else
            res.status(404).json({message : "product not found"})

    } catch (error) {
        res.status(400).json({message : error.message})
    }
})

//delete product by id
router.delete('/:id',async(req,res)=>{
    try {
        const deleteProductsById = await productRecord.findByIdAndDelete({_id:req.params.id})
        if(deleteProductsById!=null)
            res.status(200).json({message : "deleted sucessfully"})
        else
            res.status(404).json({message : "product not found"})

    } catch (error) {
        res.status(400).json({message : error.message})
    }
})
//get all with filtering
router.get('/', async (req, res) => {
    try {
       
        const reqQuery = { ...req.query };
        const removeFields = ["sort"];
        removeFields.forEach(item => delete reqQuery[item]);
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        console.log('Query String:', queryStr);
        const filter = JSON.parse(queryStr);
        console.log('Filter Object:', filter);
        const filteredProducts = await productRecord.find(filter);
        res.status(200).json(filteredProducts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



module.exports = router;