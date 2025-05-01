require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// 전역 유틸 초기화
require("./utils/redisClient");
require("./analyser/analyser");

// DB 연결
const connectDB = require("./db/mongoose");
connectDB();

// Swagger 설정
const { swaggerUi, specs } = require("./middlewares/swagger");

// 공통 미들웨어
const readonlyMode = require("./middlewares/readonlyMode");
const jsonSyntaxErrorHandler = require("./middlewares/errorHandler");

app.use(express.json());             // JSON 파싱
app.use(cors());                     // CORS 허용
app.use(jsonSyntaxErrorHandler);     // JSON 문법 오류 핸들링
app.use("/api-docs", readonlyMode, swaggerUi.serve, swaggerUi.setup(specs));

// 라우터 등록
app.use("/api/status", require("./routes/statusRoutes"));
app.use("/api/simulator", require("./routes/simulatorRoutes"));
app.use("/api/alerts", require("./routes/alertRoutes"));
app.use("/api/predict", require("./routes/predictRoutes"));

module.exports = app;