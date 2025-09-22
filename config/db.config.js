const mongoose = require('mongoose');


const connectDB = async ()=>{
  try{
    const conn = await mongoose.connect(process.env.DB_URI);
    
        console.log(`MongoDB Connected Successfully `);
   
  }
  catch(err){
    console.log("MongoDB not Connected")
    console.log('Error', err.message);
    process.exit(1);
  }
}

module.exports = connectDB