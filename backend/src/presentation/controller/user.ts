import type { Request, Response } from "express";
import type { UserUseCases } from "../../application/user/use-cases";
import { validateUserDto } from "../dto/user.schema";
import {
  UserAlreadyExistsError,
  InvalidUserDataError,
} from "../../domain/user/errors";

export class UserController {
  constructor(private userUseCase: UserUseCases) {}

  public createUserCtrl = async (req: Request, res: Response) => {
    try {
      const { email, name, password } = validateUserDto(req.body);

      const newUser = await this.userUseCase.registerUser({
        email,
        name,
        password,
      });

      return res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt,
      });
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        return res.status(409).json({
          message: error.message,
          code: "USER_ALREADY_EXISTS",
        });
      }

      if (error instanceof InvalidUserDataError) {
        return res.status(400).json({
          message: error.message,
          code: "INVALID_USER_DATA",
        });
      }

      if (error instanceof Error && error.message.includes("Invalid zod")) {
        return res.status(400).json({
          message: error.message,
          code: "VALIDATION_ERROR",
        });
      }

      console.error("Error creating user:", error);
      return res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_ERROR",
      });
    }
  };
}
