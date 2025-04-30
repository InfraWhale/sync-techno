const { body } = require("express-validator");

const validateStatus = [
  body("deviceId")
    .isString().withMessage("deviceId는 문자열이어야 합니다.")
    .notEmpty().withMessage("deviceId는 필수입니다."),
  body("timestamp")
    .isISO8601().withMessage("timestamp는 ISO 날짜 형식이어야 합니다."),
  body("temperature")
    .isNumeric().withMessage("temperature는 숫자여야 합니다."),
  body("humidity")
    .isNumeric().withMessage("humidity는 숫자여야 합니다."),
  body("voltage")
    .isNumeric().withMessage("voltage는 숫자여야 합니다."),
  body("vibration")
    .isNumeric().withMessage("vibration은 숫자여야 합니다."),
];

module.exports = validateStatus;