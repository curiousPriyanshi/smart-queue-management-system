require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');


const PORT = process.env.PORT || 3000;

const startServer = async()=>{
    try{
        await connectDB();
        app.listen(PORT, ()=>{
            console.log(`Server is listening at port ${PORT}`);
        })
    }catch(err){
        console.log("Failed to start server:", err);
        process.exit(1);
    }
}
startServer();