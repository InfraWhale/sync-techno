const alertService = require('./alertService');

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
    const alerts = await alertService.getAlertsByDeviceId(deviceId);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: '특정 장비 Alert 조회 실패', details: err.message });
  }
}

async function deleteAllAlerts(req, res) {
  try {
    const deletedCount = await alertService.deleteAllAlerts();
    res.json({ message: '전체 Alert 삭제 완료', deletedCount });
  } catch (err) {
    res.status(500).json({ error: '전체 Alert 삭제 실패', details: err.message });
  }
}

async function deleteAlertsByDeviceId(req, res) {
  try {
    const { deviceId } = req.params;
    const deletedCount = await alertService.deleteAlertsByDeviceId(deviceId);
    res.json({ message: `${deviceId} 장비 Alert 삭제 완료`, deletedCount });
  } catch (err) {
    res.status(500).json({ error: '특정 장비 Alert 삭제 실패', details: err.message });
  }
}

module.exports = {
  getAllAlerts,
  getAlertsByDeviceId,
  deleteAllAlerts,
  deleteAlertsByDeviceId,
};
