import type { IUser } from "../../domain/user/entity";
import type { IUserRepository } from "../../domain/user/repository";
import type { PasswordEncryptor } from "../service/passwordHash";
import { createUser } from "../../domain/user/factory";
import { UserAlreadyExistsError } from "../../domain/user/errors";

export class UserUseCases {
  constructor(
    private userRepo: IUserRepository,
    private passwordHasher: PasswordEncryptor,
  ) {}

  registerUser = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<IUser> => {
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new UserAlreadyExistsError(email);
    }

    const hashedPassword = await this.passwordHasher.hash(password);

    const newUser = createUser({
      name,
      email,
      password: hashedPassword,
    });

    return await this.userRepo.create(newUser);
  };
}
