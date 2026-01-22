import { type IUser, UserEntity } from "../../domain/user/entity";
import type { IUserRepository } from "../../domain/user/repository";
import type { PasswordEncryptor } from "../service/passwordHash";

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
  }): Promise<IUser | null> => {
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      return null; // User already exists
    }

    const hashedPassword = await this.passwordHasher.hash(password);

    const newUser = new UserEntity({
      name,
      email,
      password: hashedPassword,
    });

    await this.userRepo.create(newUser);

    return newUser;
  };
}
