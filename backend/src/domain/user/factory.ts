import { randomUUID } from "node:crypto";
import { UserEntity, UserRole, type IUser } from "./entity.ts";
import { InvalidUserDataError } from "./errors.ts";

export function createUser(props: {
  name: string;
  email: string;
  password: string;
  id?: string;
  role?: UserRole;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}): UserEntity {
  // Validaciones de dominio
  if (!props.name || props.name.trim().length === 0) {
    throw new InvalidUserDataError("Name cannot be empty");
  }

  if (!props.email || !props.email.includes("@")) {
    throw new InvalidUserDataError("Invalid email format");
  }

  if (!props.password || props.password.length < 5) {
    throw new InvalidUserDataError(
      "Password must be at least 5 characters long",
    );
  }

  return new UserEntity({
    id: props.id || randomUUID(),
    name: props.name.trim(),
    email: props.email.toLowerCase().trim(),
    password: props.password,
    role: props.role || UserRole.USER,
    isActive: props.isActive ?? true,
    createdAt: props.createdAt || new Date(),
    updatedAt: props.updatedAt || new Date(),
  });
}

export function reconstituteUser(props: IUser): UserEntity {
  // Para reconstruir entidades desde la base de datos sin validaciones
  return new UserEntity(props);
}
