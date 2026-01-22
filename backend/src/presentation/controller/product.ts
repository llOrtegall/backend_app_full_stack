import type { Request, Response } from "express";
import type { ProductUseCases } from "../../application/product/use-cases";
import { validateProductDto } from "../dto/product.schema.ts";
import {
  ProductAlreadyExistsError,
  InvalidProductDataError,
  InvalidPriceError,
  InvalidStockError,
} from "../../domain/product/errors.ts";

export class ProductController {
  constructor(private productUseCase: ProductUseCases) {}

  public createProductCtrl = async (req: Request, res: Response) => {
    try {
      const productData = validateProductDto(req.body);

      const imageFile = req.file
        ? {
            buffer: req.file.buffer,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
          }
        : undefined;

      const newProduct = await this.productUseCase.createNewProduct(
        productData,
        imageFile,
      );

      return res.status(201).json({
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        sku: newProduct.sku,
        barcode: newProduct.barcode,
        quantity: newProduct.quantity,
        minStock: newProduct.minStock,
        maxStock: newProduct.maxStock,
        cost: newProduct.cost,
        price: newProduct.price,
        category: newProduct.category,
        image: newProduct.image,
        notes: newProduct.notes,
        createdAt: newProduct.createdAt,
      });
    } catch (error) {
      if (error instanceof ProductAlreadyExistsError) {
        return res.status(409).json({
          message: error.message,
          code: "PRODUCT_ALREADY_EXISTS",
        });
      }

      if (error instanceof InvalidProductDataError) {
        return res.status(400).json({
          message: error.message,
          code: "INVALID_PRODUCT_DATA",
        });
      }

      if (error instanceof InvalidPriceError) {
        return res.status(400).json({
          message: error.message,
          code: "INVALID_PRICE",
        });
      }

      if (error instanceof InvalidStockError) {
        return res.status(400).json({
          message: error.message,
          code: "INVALID_STOCK",
        });
      }

      if (error instanceof Error && error.message.includes("Invalid zod")) {
        return res.status(400).json({
          message: error.message,
          code: "VALIDATION_ERROR",
        });
      }

      console.error("Error creating product:", error);
      return res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_ERROR",
      });
    }
  };
}
