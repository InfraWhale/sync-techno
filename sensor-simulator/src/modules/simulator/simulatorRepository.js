const Status = require('../../models/Status');
const Alert = require('../../models/Alert');

async function deleteStatusAndAlertsByDeviceId(deviceId) {
  await Status.deleteMany({ deviceId });
  await Alert.deleteMany({ deviceId });
}

async function deleteAllStatusAndAlerts() {
  await Status.deleteMany({});
  await Alert.deleteMany({});
}

module.exports = {
  deleteStatusAndAlertsByDeviceId,
  deleteAllStatusAndAlerts
};