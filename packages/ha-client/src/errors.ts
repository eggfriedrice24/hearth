export type HaConnectionErrorCode =
  | "auth_invalid"
  | "connection_failed"
  | "connection_lost"
  | "unknown";

export class HaConnectionError extends Error {
  readonly code: HaConnectionErrorCode;

  constructor(code: HaConnectionErrorCode, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "HaConnectionError";
    this.code = code;
  }
}
