import type { Request, Response } from "express";
import type { ProductUseCases } from "../../application/product/use-cases";
import { validateProductDto } from "../dto/product.schema.ts";

export class ProductController {
  constructor(private productUseCase: ProductUseCases) {}

  public createProductCtrl = async (req: Request, res: Response) => {
    try {
      const {
        name,
        price,
        description,
        category,
        minStock,
        quantity,
        sku,
        barcode,
        cost,
        image,
        maxStock,
        notes,
      } = validateProductDto(req.body);
      const newProduct = await this.productUseCase.createNewProduct({
        name,
        price,
        description,
        category,
        minStock,
        quantity,
        sku,
        barcode,
        cost,
        image,
        maxStock,
        notes,
      });
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };
}
