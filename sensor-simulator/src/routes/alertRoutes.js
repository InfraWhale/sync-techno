/**
 * @swagger
 * tags:
 *   name: Alert
 *   description: 장비 이상패턴 API
 */

const express = require('express');
const router = express.Router();
const alertController = require("../modules/alert/alertController");

/**
 * @swagger
 * /api/alerts:
 *   get:
 *     summary: 전체 Alert 조회
 *     tags: [Alert]
 *     responses:
 *       200:
 *         description: 전체 Alert 리스트 조회 성공
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
 *                   type:
 *                     type: string
 *                     example: VoltageDrop
 *                   message:
 *                     type: string
 *                     example: "1분간 전압이 2.9V 미만인 상태가 3회 이상 발생했습니다. (현재 전압: 2.65V)"
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-04-26T16:25:30.000Z
 *       500:
 *         description: Alert 전체 조회 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Alert 전체 조회에 실패했습니다.
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/', alertController.getAllAlerts);

/**
 * @swagger
 * /api/alerts/{deviceId}:
 *   get:
 *     summary: 특정 장비 Alert 조회
 *     tags: [Alert]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: 조회할 장비 ID
 *     responses:
 *       200:
 *         description: 특정 장비의 Alert 리스트 조회 성공
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
 *                   type:
 *                     type: string
 *                     example: AvgTempHigh
 *                   message:
 *                     type: string
 *                     example: "최근 5분간 평균 온도 70°C, 평균 습도 80%를 초과했습니다. (현재 온도: 72°C, 현재 습도: 85°C)"
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-04-26T16:30:00.000Z
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
 *         description: Alert 조회 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 장비 device-001의 조회에 실패했습니다.
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/:deviceId', alertController.getAlertsByDeviceId);

/**
 * @swagger
 * /api/alerts:
 *   delete:
 *     summary: 전체 Alert 삭제
 *     tags: [Alert]
 *     responses:
 *       200:
 *         description: 전체 Alert 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 총 7건의 전체 Alert가 삭제되었습니다.
 *       500:
 *         description: Alert 삭제 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 전체 Alert 삭제에 실패했습니다.
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.delete('/', alertController.deleteAllAlerts);

/**
 * @swagger
 * /api/alerts/{deviceId}:
 *   delete:
 *     summary: 특정 장비 Alert 삭제
 *     tags: [Alert]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: 삭제할 장비 ID
 *     responses:
 *       200:
 *         description: 특정 장비의 Alert 삭제 성공 또는 삭제할 데이터 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 총 3건의 Alert가 삭제되었습니다.
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
 *         description: Alert 삭제 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 장비 device-001의 Alert 삭제에 실패했습니다.
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

router.delete('/:deviceId', alertController.deleteAlertsByDeviceId);

module.exports = router;
