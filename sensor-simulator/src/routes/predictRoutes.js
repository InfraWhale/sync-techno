/**
 * @swagger
 * tags:
 *   name: Predict
 *   description: 장비 상태 예측 API
 */
const express = require("express");
const router = express.Router();
const predictController = require("../modules/predict/predictController");

/**
 * @swagger
 * /api/predict/{deviceId}:
 *   get:
 *     summary: 장비 상태 예측
 *     tags: [Predict]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: 장비 ID
 *     responses:
 *       200:
 *         description: 장비 상태 예측 결과
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deviceId:
 *                   type: string
 *                   example: "device-001"
 *                 predictedState:
 *                   type: string
 *                   enum: [Idle, Load, Overheat, Error]
 *                   example: "Load"
 *       404:
 *         description: 장비가 존재하지 않는 경우
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "device-001(이)가 존재하지 않습니다."
 *       500:
 *         description: 예측 중 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "장비상태 예측에 실패했습니다."
 *                 details:
 *                   type: string
 *                   example: Internal server error
 */
router.get("/:deviceId", predictController.predictDeviceState);

module.exports = router;