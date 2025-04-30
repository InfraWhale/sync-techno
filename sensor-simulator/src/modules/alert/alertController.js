const alertService = require('./alertService');
const { devices } = require("../../devices/simulator");

async function getAllAlerts(req, res) {
  try {
    const alerts = await alertService.getAllAlerts();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Alert 전체 조회 실패', details: err.message });
  }
}

async function getAlertsByDeviceId(req, res) {
  try {
    const { deviceId } = req.params;

    if (!devices[deviceId]) {
      return res.status(404).json({ message: `장비 ${deviceId}(이)가 존재하지 않습니다.` });
    }

    const alerts = await alertService.getAlertsByDeviceId(deviceId);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: `장비 ${deviceId}의 Alert 조회에 실패했습니다.`, details: err.message });
  }
}

async function deleteAllAlerts(req, res) {
  try {
    const deletedCount = await alertService.deleteAllAlerts();
    return res.status(200).json({ message: `총 ${deletedCount}건의 전체 Alert가 삭제되었습니다.` });
  } catch (err) {
    res.status(500).json({ error: '전체 Alert 삭제에 실패했습니다.', details: err.message });
  }
}

async function deleteAlertsByDeviceId(req, res) {
  try {
    const { deviceId } = req.params;

    if (!devices[deviceId]) {
      return res.status(404).json({ message: `장비 ${deviceId}(이)가 존재하지 않습니다.` });
    }

    const deletedCount = await alertService.deleteAlertsByDeviceId(deviceId);
    return res.status(200).json({ message: `총 ${deletedCount}건의 Alert가 삭제되었습니다.` });
  } catch (err) {
    res.status(500).json({ error: `장비 ${deviceId}의 Alert 삭제에 실패했습니다.`, details: err.message });
  }
}

module.exports = {
  getAllAlerts,
  getAlertsByDeviceId,
  deleteAllAlerts,
  deleteAlertsByDeviceId,
};
