/**
 * Application error. If an application error is handled in global handler,
 * a notification is automatically shown with error message and associated cause is logged.
 */
export class AppError extends Error {
  /**
   * Returns an instance of AppError with given message and optional error cause.
   * @param message message
   * @param cause error cause
   */
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'AppError';
  }
}
