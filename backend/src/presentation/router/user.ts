import { Router } from "express";
import { pgRepository } from "../../infrastructure/repositories/user/UserPgRepo.ts";
import { UserUseCases } from "../../application/user/use-cases.ts";
import { BcryptPasswordEncryptor } from "../../infrastructure/security/bcrypt.ts";
import { UserController } from "../controller/user.ts";

const userRouter = Router();

/**
 * initialize the repositories
 */

const pgUserRepo = new pgRepository();

/**
 * inicialize use cases
 */

const userUseCases = new UserUseCases(
  pgUserRepo,
  new BcryptPasswordEncryptor(),
);

/**
 * Initialize the controller
 */
const userController = new UserController(userUseCases);

/**
 * Define routes
 */

userRouter.post("/", userController.createUserCtrl);

export { userRouter };
