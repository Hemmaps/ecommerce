const bycrpt = require('bcrypt')
const express = require('express')
const router = express.Router();
const userRecord = require('../models/userModel');
const jwt = require('jsonwebtoken')
const orderRecord = require('../models/orderModel')
const authMiddleware = require('../middlewares/authMiddleware')

//generate jwt

const generateToken =(id)=>{
    return jwt.sign({id},process.env.JWT_TOKEN,{expiresIn : '30d'})
}

//register user

router.post('/register',async(req,res)=>{

    const {name,email,password} = req.body
    if(!name||!email||!password){
        res.status(400).json({message : "Please add fields"})
    }

    const userExists = await userRecord.findOne({email});
    if(userExists){
        res.status(400).json({message:"User exitsts"})
    }

    const salt = await bycrpt.genSalt(10);
    const hashedPassword = await bycrpt.hash(password,salt)

    const user = await userRecord.create({
        name,
        email,
        password: hashedPassword
    })

    if(user){
        res.status(201).json({
            _id:user.id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id)
        })
    }else{
        res.status(400).json({message:"invalid user"})
    }

})

//login user
router.post('/login',async(req,res)=>{
    const {email,password} = req.body
    if(!email||!password){
        res.status(400).json({message : "Please add fields"})
    }

    const user = await userRecord.findOne({email})
    if(user && (await bycrpt.compare(password,user.password))){
        res.json({
            _id:user.id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id)
        })
    }else{
        res.status(400).json({message:"invalid credentials"})
    }
})

//user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        // Find the user by ID and populate the orderHistory field
        const user = await userRecord.findById(req.user.id).populate('orderHistory');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            orderHistory: user.orderHistory // This will contain detailed order information
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = router;