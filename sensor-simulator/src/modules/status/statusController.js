const statusService = require("./statusService");

async function createStatus(req, res) {
  try {
    await statusService.createStatus(req.body);
    res.status(201).json({ message: "상태 저장 성공" });
  } catch (err) {
    res.status(500).json({ error: "상태 저장 실패", details: err.message });
  }
}

async function getStatusByDeviceId(req, res) {
  try {
    const { deviceId } = req.params;
    const results = await statusService.getStatusByDeviceId(deviceId);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "상태 조회 실패", details: err.message });
  }
}

async function deleteAllStatus(req, res) {
  try {
    const deletedCount = await statusService.deleteAllStatus();
    res.json({
      message: "모든 장비 상태 이력이 삭제되었습니다.",
      deletedCount,
    });
  } catch (err) {
    res.status(500).json({ error: "상태 전체 삭제 실패", details: err.message });
  }
}

async function deleteStatusByDeviceId(req, res) {
  try {
    const { deviceId } = req.params;
    const deletedCount = await statusService.deleteStatusByDeviceId(deviceId);
    res.json({
      message: `${deviceId} 장비의 상태 이력이 삭제되었습니다.`,
      deletedCount,
    });
  } catch (err) {
    res.status(500).json({ error: "상태 개별 삭제 실패", details: err.message });
  }
}

module.exports = {
  createStatus,
  getStatusByDeviceId,
  deleteAllStatus,
  deleteStatusByDeviceId,
};