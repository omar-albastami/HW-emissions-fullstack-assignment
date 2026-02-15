// Unify all app error structure and response
class AppError extends Error {
    constructor (requestId, message, code, status) {
      super(message);
      this.request_id = requestId
      this.status = status;
      this.code = code;
    };

    getErrorBody() {
        return {
            request_id: this.request_id,
            code: this.code,
            message: this.message
        };
    };
};

module.exports = AppError;