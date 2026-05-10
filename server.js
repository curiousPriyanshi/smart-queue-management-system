require('dotenv').config();
const http = require('http');         // 1. http module
const app = require('./app');
const connectDB = require('./config/db');
const {initSocket} = require('./config/socket');
const {markExpiredTokens, cleanupExpiredTokens} = require("./jobs/expiredTokens")


const PORT = process.env.PORT || 3000;

const server = http.createServer(app); // 3. http server wraps express app

const startServer = async () => {
  try {
    await connectDB();
    initSocket(server);
    markExpiredTokens();
cleanupExpiredTokens();

    server.listen(PORT, () => {        // 6. app.listen nahi, server.listen
      console.log(`Server is listening at port ${PORT}`);
    });

  } catch (err) {
    console.log("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
