const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config()

const dbConn = mongoose.connect(process.env.URL)
.then(()=>console.log('Database is connected'))
.catch(()=> console.log('Database is not connected'))


module.exports = {dbConn}