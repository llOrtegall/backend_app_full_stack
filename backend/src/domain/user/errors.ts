export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
    this.name = "UserAlreadyExistsError";
  }
}

export class UserNotFoundError extends Error {
  constructor(identifier: string) {
    super(`User with identifier ${identifier} not found`);
    this.name = "UserNotFoundError";
  }
}

export class InvalidUserDataError extends Error {
  constructor(message: string) {
    super(`Invalid user data: ${message}`);
    this.name = "InvalidUserDataError";
  }
}
