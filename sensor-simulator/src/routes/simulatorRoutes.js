/**
 * @swagger
 * tags:
 *   name: Simulator
 *   description: 장비 시뮬레이터 제어 API
 */
const express = require('express');
const router = express.Router();
const simulatorController = require('../modules/simulator/simulatorController');

/**
 * @swagger
 * /api/simulator/{deviceId}:
 *   post:
 *     summary: 특정 장비 시뮬레이터 생성 및 시작
 *     tags: [Simulator]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: 장비 ID
 *     responses:
 *       200:
 *         description: 시뮬레이터 생성 성공
 *       500:
 *         description: 시뮬레이터 생성 실패
 */
router.post('/:deviceId', simulatorController.startDevice);

/**
 * @swagger
 * /api/simulator/restart/{deviceId}:
 *   post:
 *     summary: 특정 장비 시뮬레이터 재시작
 *     tags: [Simulator]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: 장비 ID
 *     responses:
 *       200:
 *         description: 시뮬레이터 재시작 성공
 *       500:
 *         description: 시뮬레이터 재시작 실패
 */
router.post('/restart/:deviceId', simulatorController.restartDevice);

/**
 * @swagger
 * /api/simulator:
 *   get:
 *     summary: 현재 실행 중인 시뮬레이터 조회
 *     tags: [Simulator]
 *     responses:
 *       200:
 *         description: 시뮬레이터 목록 조회 성공
 *       500:
 *         description: 시뮬레이터 목록 조회 실패
 */
router.get('/', simulatorController.getRunningDevices);

/**
 * @swagger
 * /api/simulator/{deviceId}:
 *   delete:
 *     summary: 특정 장비 시뮬레이터 삭제
 *     tags: [Simulator]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: 장비 ID
 *     responses:
 *       200:
 *         description: 시뮬레이터 삭제 성공
 *       500:
 *         description: 시뮬레이터 삭제 실패
 */
router.delete('/:deviceId', simulatorController.deleteDevice);

/**
 * @swagger
 * /api/simulator:
 *   delete:
 *     summary: 모든 시뮬레이터 삭제
 *     tags: [Simulator]
 *     responses:
 *       200:
 *         description: 모든 시뮬레이터 삭제 성공
 *       500:
 *         description: 모든 시뮬레이터 삭제 실패
 */
router.delete('/', simulatorController.deleteAllDevices);

module.exports = router;
