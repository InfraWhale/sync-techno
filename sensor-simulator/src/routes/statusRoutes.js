/**
 * @swagger
 * tags:
 *   name: Status
 *   description: 장비 상태 API
 */

const express = require("express");
const router = express.Router();
const statusController = require("../modules/status/statusController");

/**
 * @swagger
 * /api/status:
 *   post:
 *     summary: 장비 상태 저장
 *     tags: [Status]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceId:
 *                 type: string
 *                 example: "device-001"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-26T16:22:35.617Z"
 *               temperature:
 *                 type: number
 *                 example: 25.5
 *               voltage:
 *                 type: number
 *                 example: 3.3
 *               vibration:
 *                 type: number
 *                 example: 0.01
 *     responses:
 *       201:
 *         description: 상태 저장 성공
 *       500:
 *         description: 상태 저장 실패
 */
router.post("/", statusController.createStatus);

/**
 * @swagger
 * /api/status/{deviceId}:
 *   get:
 *     summary: 특정 장비 상태 이력 조회
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: 장비 ID
 *     responses:
 *       200:
 *         description: 특정 장비 상태 이력 조회 성공
 *       500:
 *         description: 특정 장비 상태 이력 조회 실패
 */
router.get("/:deviceId", statusController.getStatusByDeviceId);

/**
 * @swagger
 * /api/status:
 *   delete:
 *     summary: 모든 장비 상태 이력 삭제
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: 모든 장비 상태 이력 삭제 성공
 *       500:
 *         description: 모든 장비 상태 이력 삭제 실패
 */
router.delete("/", statusController.deleteAllStatus);

/**
 * @swagger
 * /api/status/{deviceId}:
 *   delete:
 *     summary: 특정 장비 상태 이력 삭제
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: 장비 ID
 *     responses:
 *       200:
 *         description: 특정 장비 상태 이력 삭제 성공
 *       500:
 *         description: 상태 이력 삭제 실패
 */
router.delete("/:deviceId", statusController.deleteStatusByDeviceId);

module.exports = router;
