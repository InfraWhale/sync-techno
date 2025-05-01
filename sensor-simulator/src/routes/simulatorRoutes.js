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
 * /api/simulator/start/{deviceId}:
 *   post:
 *     summary: 장비 시뮬레이션 시작
 *     tags: [Simulator]
 *     parameters: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [deviceId]
 *             properties:
 *               deviceId:
 *                 type: string
 *                 example: "device-001"
 *     responses:
 *       200:
 *         description: 장비 시뮬레이터 시작 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: device-001의 시뮬레이션을 시작합니다.
 *       400:
 *         description: 필수 파라미터 누락
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: deviceId는 필수입니다.
 *       409:
 *         description: 이미 실행 중인 장비
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 장비 device-001은(는) 이미 실행 중입니다.
 *       500:
 *         description: 시뮬레이터 시작 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 장비 device-001 시작에 실패했습니다.
 *                 error:
 *                   type: string
 *                   example: Internal server error
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
 *         description: 재시작할 장비 ID
 *     responses:
 *       200:
 *         description: 시뮬레이터 재시작 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: device-001의 시뮬레이션을 재시작합니다.
 *       400:
 *         description: 필수 파라미터 누락
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: deviceId는 필수입니다.
 *       404:
 *         description: 실행 중이지 않은 장비
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 장비 device-001은(는) 실행 중이 아닙니다.
 *       500:
 *         description: 시뮬레이터 재시작 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 시뮬레이터 재시작에 실패했습니다.
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/restart/:deviceId', simulatorController.restartDevice);

/**
 * @swagger
 * /api/simulator:
 *   get:
 *     summary: 현재 실행 중인 장비 목록 조회
 *     tags: [Simulator]
 *     responses:
 *       200:
 *         description: 실행 중인 장비 ID 리스트 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 runningDevices:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["device-001", "device-002"]
 *       500:
 *         description: 장비 조회 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 전체 시뮬레이터 조회에 실패했습니다.
 *                 error:
 *                   type: string
 *                   example: Internal server error
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
 *         required: true
 *         schema:
 *           type: string
 *         description: 삭제할 장비 ID
 *     responses:
 *       200:
 *         description: 장비 시뮬레이터 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: device-001 시뮬레이션이 삭제되었습니다.
 *       400:
 *         description: deviceId 누락
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: deviceId는 필수입니다.
 *       404:
 *         description: 장비가 실행 중이지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 장비 device-001은(는) 실행 중이 아닙니다.
 *       500:
 *         description: 삭제 중 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 시뮬레이터 삭제에 실패했습니다.
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.delete('/:deviceId', simulatorController.deleteDevice);

/**
 * @swagger
 * /api/simulator:
 *   delete:
 *     summary: 전체 장비 시뮬레이터 중지
 *     tags: [Simulator]
 *     responses:
 *       200:
 *         description: 전체 장비 중지 및 데이터 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 총 5개의 장비가 중지 및 삭제되었습니다.
 *       500:
 *         description: 전체 장비 삭제 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 시뮬레이션 전체 삭제에 실패했습니다.
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.delete('/', simulatorController.deleteAllDevices);

module.exports = router;
