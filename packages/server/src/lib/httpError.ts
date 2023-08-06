export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
  ) {
    super(message);
  }
}

export class InvalidCredentials extends HttpError {
  constructor(public readonly message: string) {
    super(401, message);
  }
}

export class NotFound extends HttpError {
  constructor(public readonly message: string) {
    super(404, message);
  }
}
