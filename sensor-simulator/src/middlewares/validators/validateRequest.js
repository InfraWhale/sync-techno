const { validationResult } = require("express-validator");

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg);
    return res.status(400).json({ message: "유효성 검사에 실패했습니다.", errors: messages });
  }
  next();
}

module.exports = validateRequest;