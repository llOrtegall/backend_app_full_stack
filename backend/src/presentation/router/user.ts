import { Router } from "express";
import { pgRepository } from "../../infrastructure/repositories/pgRepository";
import { UserUseCases } from "../../application/user/use-cases";
import { BcryptPasswordEncryptor } from "../../infrastructure/security/bcrypt";
import { UserController } from "../controller/user";

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
