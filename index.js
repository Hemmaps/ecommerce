const express = require('express');
const {dbConn} = require('./dbConn/db')
const cors = require('cors')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const userRoutes = require("./routes/userRoutes")
const dotenv = require('dotenv');

dotenv.config()
const app = express()
const port = 8000

app.use(express.json())
app.use(express.urlencoded( {extended:true }))
app.use(cors())

app.use('/products',productRoutes)
app.use('/orders',orderRoutes)
app.use('/users',userRoutes)

app.listen(port,()=>{
    console.log('server is running ')
})