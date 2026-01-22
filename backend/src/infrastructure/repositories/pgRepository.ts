import type { IUserRepository } from "../../domain/user/repository.ts";
import { UserEntity } from "../../domain/user/entity.ts";
import { UserModel } from "../persistence/model/user.ts";

export class pgRepository implements IUserRepository {
  async create(user: UserEntity): Promise<UserEntity> {
    try {
      await UserModel.sync();

      const newUser = new UserEntity({
        name: user.name,
        email: user.email,
        password: user.password,
      });

      const createdUser = await UserModel.create({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      });

      return createdUser.toJSON() as UserEntity;
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  update(user: UserEntity): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }

  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  findById(id: string): Promise<UserEntity | null> {
    throw new Error("Method not implemented.");
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    try {
      await UserModel.sync();
      const userRecord = await UserModel.findOne({ where: { email } });
      if (userRecord) {
        return userRecord.toJSON() as UserEntity;
      }
      return null;
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error}`);
    }
  }
}
