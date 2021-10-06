const mongoose = require('mongoose');

// The guy doesnt like to use .then , thus he uses async
const connectDB = async () => {

try{
    const conn = await mongoose.connect(process.env.MONGO_URI,{
        useNEWURLParser: true,
        useUnifiedTopology: true
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch(err){
    console.error(err);
    process.exit(1);
    }

};

module.exports = connectDB;