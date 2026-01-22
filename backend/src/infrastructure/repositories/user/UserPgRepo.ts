import type { IUserRepository } from "../../../domain/user/repository.ts";
import type { UserEntity } from "../../../domain/user/entity.ts";
import { UserModel } from "../../persistence/model/user.ts";
import { reconstituteUser } from "../../../domain/user/factory.ts";

export class pgRepository implements IUserRepository {
  async create(user: UserEntity): Promise<UserEntity> {
    try {
      const createdUser = await UserModel.create({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

      return reconstituteUser(createdUser.toJSON());
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  update(_user: UserEntity): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }

  delete(_id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findById(id: string): Promise<UserEntity | null> {
    try {
      const userRecord = await UserModel.findOne({ where: { id } });
      if (userRecord) {
        return reconstituteUser(userRecord.toJSON());
      }
      return null;
    } catch (error) {
      throw new Error(`Failed to find user by id: ${error}`);
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    try {
      const userRecord = await UserModel.findOne({ where: { email } });
      if (userRecord) {
        return reconstituteUser(userRecord.toJSON());
      }
      return null;
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error}`);
    }
  }
}
