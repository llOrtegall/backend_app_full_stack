import { ProductEntity } from "../../../domain/product/entity";
import type { IProductRepository } from "../../../domain/product/repository";
import { ProductModel } from "../../persistence/model/product";

export class ProductPgRepo implements IProductRepository {
  async create(product: ProductEntity): Promise<ProductEntity | null> {
    try {
      await ProductModel.sync();

      const newProduct = new ProductEntity(product);

      const createdProduct = await ProductModel.create({
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        cost: newProduct.cost,
        price: newProduct.price,
        sku: newProduct.sku,
        barcode: newProduct.barcode,
        quantity: newProduct.quantity,
        minStock: newProduct.minStock,
        maxStock: newProduct.maxStock,
        category: newProduct.category,
        image: newProduct.image,
        notes: newProduct.notes,
      });

      return createdProduct.toJSON() as ProductEntity;
    } catch (error) {
      console.error("Error creating product:", error);
      return null;
    }
  }
  findById(id: string): Promise<ProductEntity | null> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<ProductEntity[]> {
    throw new Error("Method not implemented.");
  }
  update(product: ProductEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
