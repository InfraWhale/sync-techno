const express = require("express");
const cors = require('cors');
const app = express();
require("dotenv").config();

const connectDB = require("./db/mongoose");
connectDB();

const { swaggerUi, specs } = require('./middlewares/swagger');
const statusRoutes = require("./routes/statusRoutes");
const simulatorRoutes = require("./routes/simulatorRoutes");
const alertRoutes = require('./routes/alertRoutes');
const predictRoutes = require('./routes/predictRoutes');
require("./analyser/analyser");

// 미들웨어 등록
app.use(express.json()); // JSON 파싱
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());

// 라우터 등록
app.use("/api/status", statusRoutes);
app.use("/api/simulator", simulatorRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/predict', predictRoutes);

module.exports = app;