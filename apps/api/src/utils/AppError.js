// Unify all app error structure and response
class AppError extends Error {
    constructor (requestId, message, code, status, retryable = false) {
      super(message);
      this.request_id = requestId
      this.status = status;
      this.code = code;
      this.retryable = retryable;
    };

    getErrorBody() {
        return {
            request_id: this.request_id,
            code: this.code,
            message: this.message,
            retryable: this.retryable
        };
    };
};

module.exports = AppError;