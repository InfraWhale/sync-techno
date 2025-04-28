/**
 * @swagger
 * tags:
 *   name: Alert
 *   description: 장비 Alert(이상 패턴) API
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
 *         description: 전체 Alert 조회 성공
 *       500:
 *         description: 전체 Alert 조회 실패
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
 *         description: 장비 ID
 *     responses:
 *       200:
 *         description: 특정 장비 Alert 조회 성공
 *       500:
 *         description: 특정 장비 Alert 조회 실패
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
 *       500:
 *         description: 전체 Alert 삭제 실패
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
 *         description: 장비 ID
 *     responses:
 *       200:
 *         description: 특정 장비 Alert 삭제 성공
 *       500:
 *         description: 특정 장비 Alert 삭제 실패
 */
router.delete('/:deviceId', alertController.deleteAlertsByDeviceId);

module.exports = router;
