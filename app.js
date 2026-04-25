const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const queueRoutes = require("./routes/queueRoutes");
const counterRoutes = require("./routes/counterRoutes");
const tokenRoutes = require("./routes/tokenRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

//security
app.use(helmet());
app.use(cors());

//logging
app.use(morgan("dev"));

//rate limiting
const limiter = rateLimit({
    windowMs: 15*60*1000, //15 mins
    max:100, //max 100 requests per 15 min per IP
})
app.use(limiter);

//parse incoming json
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/counter", counterRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api", tokenRoutes);

module.exports = app;