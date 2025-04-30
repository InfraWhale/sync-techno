/**
 * @swagger
 * tags:
 *   name: Status
 *   description: 장비 상태 API
 */

const express = require("express");
const router = express.Router();
const statusController = require("../modules/status/statusController");

const validateStatus = require("../middlewares/validators/statusValidator");
const validateRequest = require("../middlewares/validators/validateRequest");

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
 *               humidity:
 *                 type: number
 *                 example: 85.0
 *               voltage:
 *                 type: number
 *                 example: 3.3
 *               vibration:
 *                 type: number
 *                 example: 0.01
 *     responses:
 *       201:
 *         description: 상태 저장 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 상태 저장에 성공했습니다.
 *       400:
 *         description: 유효성 검사 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유효성 검사에 실패했습니다."
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: ["timestamp는 ISO 날짜 형식이어야 합니다.", "vibration는 숫자여야 합니다."]
 *       500:
 *         description: 상태 저장 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "상태 저장에 실패했습니다."
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.post("/", validateStatus, validateRequest, statusController.createStatus);

/**
 * @swagger
 * /api/status:
 *   delete:
 *     summary: 전체 상태 이력 삭제
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: 전체 상태 이력 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 총 25건 삭제되었습니다.
 *       500:
 *         description: 전체 상태 이력 삭제 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 상태 전체 삭제에 실패했습니다.
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.delete("/", statusController.deleteAllStatus);

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
 *         description: 특정 장비의 상태 이력 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   deviceId:
 *                     type: string
 *                     example: device-001
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-04-26T16:22:35.617Z
 *                   temperature:
 *                     type: number
 *                     example: 25.5
 *                   humidity:
 *                     type: number
 *                     example: 85.0
 *                   voltage:
 *                     type: number
 *                     example: 3.3
 *                   vibration:
 *                     type: number
 *                     example: 0.01
 *       404:
 *         description: 장비 ID가 존재하지 않는 경우
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 장비 device-001(이)가 존재하지 않습니다.
 *       500:
 *         description: 상태 조회 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 상태 조회에 실패했습니다.
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.get("/:deviceId", statusController.getStatusByDeviceId);

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
 *         description: 삭제할 장비 ID
 *     responses:
 *       200:
 *         description: 특정 장비 상태 이력 삭제 성공 또는 삭제할 데이터 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 총 5건 삭제되었습니다.
 *       404:
 *         description: 존재하지 않는 장비 ID 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 장비 device-001(이)가 존재하지 않습니다.
 *       500:
 *         description: 상태 삭제 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 상태 삭제에 실패했습니다.
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.delete("/:deviceId", statusController.deleteStatusByDeviceId);

module.exports = router;