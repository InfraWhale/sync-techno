const statusService = require("./statusService");
const { getDevice } = require("../../devices/devicesAccessor");

async function createStatus(req, res) {
  try {
    await statusService.createStatus(req.body);
    res.status(201).json({ message: "상태 저장에 성공했습니다." });
  } catch (err) {
    res.status(500).json({ message: "상태 저장에 실패했습니다.", error: err.message });
  }
}

async function deleteAllStatus(req, res) {
  try {
    const deletedCount = await statusService.deleteAllStatus();
    return res.status(200).json({ message: `총 ${deletedCount}건 삭제되었습니다.` });
  } catch (err) {
    res.status(500).json({ message: "상태 전체 삭제에 실패했습니다.", error: err.message });
  }
}

async function getStatusByDeviceId(req, res) {
  try {
    const { deviceId } = req.params;

    if (!getDevice(deviceId)) {
      return res.status(404).json({ message: `장비 ${deviceId}(이)가 존재하지 않습니다.` });
    }

    const results = await statusService.getStatusByDeviceId(deviceId);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "상태 조회에 실패했습니다.", error: err.message });
  }
}

async function deleteStatusByDeviceId(req, res) {
  try {
    const { deviceId } = req.params;

    if (!getDevice(deviceId)) {
      return res.status(404).json({ message: `장비 ${deviceId}(이)가 존재하지 않습니다.` });
    }

    const deletedCount = await statusService.deleteStatusByDeviceId(deviceId);
    return res.status(200).json({ message: `총 ${deletedCount}건 삭제되었습니다.` });
  } catch (err) {
    res.status(500).json({ message: "상태 삭제에 실패했습니다.", error: err.message });
  }
}

module.exports = {
  createStatus,
  deleteAllStatus,
  getStatusByDeviceId,
  deleteStatusByDeviceId,
};