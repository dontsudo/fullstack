export class HttpException extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string,
  ) {
    super(message);
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor(public readonly message: string) {
    super(401, message);
  }
}

export class NotFoundException extends HttpException {
  constructor(public readonly message: string) {
    super(404, message);
  }
}
