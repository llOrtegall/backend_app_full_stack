import { Router } from "express";
import { ProductPgRepo } from "../../infrastructure/repositories/product/ProductPgRepo.ts";
import { ProductUseCases } from "../../application/product/use-cases.ts";
import { ProductController } from "../controller/product.ts";

const productRouter = Router();

/**
 * initialize the repositories
 */

const pgProductRepo = new ProductPgRepo();

/**
 * inicialize use cases
 */

const productUseCases = new ProductUseCases(pgProductRepo);

/**
 * Initialize the controller
 */
const productController = new ProductController(productUseCases);

/**
 * Define routes
 */
productRouter.post("/", productController.createProductCtrl);

export { productRouter };
