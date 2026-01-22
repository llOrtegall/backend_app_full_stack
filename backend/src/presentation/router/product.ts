import { Router } from "express";
import multer from "multer";
import { ProductPgRepo } from "../../infrastructure/repositories/product/ProductPgRepo.ts";
import { ProductUseCases } from "../../application/product/use-cases.ts";
import { ProductController } from "../controller/product.ts";
import { R2StorageService } from "../../infrastructure/storage/r2Storage.ts";

const productRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

/**
 * initialize the repositories
 */
const fileStore = new R2StorageService();
const pgProductRepo = new ProductPgRepo();

/**
 * inicialize use cases
 */

const productUseCases = new ProductUseCases(pgProductRepo, fileStore);

/**
 * Initialize the controller
 */
const productController = new ProductController(productUseCases);

/**
 * Define routes
 */
productRouter.post(
  "/",
  upload.single("image"),
  productController.createProductCtrl,
);

export { productRouter };
