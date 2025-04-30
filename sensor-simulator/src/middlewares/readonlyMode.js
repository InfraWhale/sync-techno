function readonlyMode(req, res, next) {
    const method = req.method.toUpperCase();
  
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      return res.status(403).json({ message: "현재 서버는 읽기 전용 모드입니다." });
    }
  
    next();
  }
  
  module.exports = readonlyMode;
  