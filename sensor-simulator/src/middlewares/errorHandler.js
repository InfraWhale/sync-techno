function jsonSyntaxErrorHandler(err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({
        message: "잘못된 JSON 형식입니다.",
        error: err.message
      });
    }
    next(err);
  }
  
  module.exports = jsonSyntaxErrorHandler;
