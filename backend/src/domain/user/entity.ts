import { randomUUID } from "node:crypto";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  GUEST = "guest",
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity implements IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: Pick<IUser, "name" | "email" | "password">) {
    this.id = randomUUID();
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.role = UserRole.USER;
    this.isActive = true;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
