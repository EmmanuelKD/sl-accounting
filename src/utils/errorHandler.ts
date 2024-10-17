

export class HttpError extends Error {
  code: number;
  message: string;
  success: boolean;
  error?: unknown;

  constructor({
    code,
    success,
    message,
    error,
  }: {
    code: number;
    success: boolean;
    message?: string;
    error?: unknown;
  }) {
    super(message);
    this.name = "HttpError";
    this.code = code;
    this.message = message ?? "";
    this.success = success;
    this.error = error;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
  }
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      success: this.success,
      error: this.error,
    };
  }
}
