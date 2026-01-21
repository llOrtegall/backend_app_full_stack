import type { Request, Response } from "express";
import type { UserUseCases } from "../../application/user/use-cases";
import { validateUserDto } from "../dto/user.schema";

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

      return res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(400).json({ message: (error as Error).message });
    }
  };
}
