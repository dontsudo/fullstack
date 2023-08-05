export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string,
  ) {
    super(message);
  }
}

export class InvalidCredentialsError extends HttpError {
  constructor(public readonly message: string) {
    super(401, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(public readonly message: string) {
    super(404, message);
  }
}
