import type { ProductEntity } from "../../../domain/product/entity.ts";
import type { IProductRepository } from "../../../domain/product/repository.ts";
import { ProductModel } from "../../persistence/model/product.ts";
import { reconstituteProduct } from "../../../domain/product/factory.ts";

export class ProductPgRepo implements IProductRepository {
  async create(product: ProductEntity): Promise<ProductEntity> {
    try {
      const createdProduct = await ProductModel.create({
        id: product.id,
        name: product.name,
        description: product.description,
        cost: product.cost,
        price: product.price,
        sku: product.sku,
        barcode: product.barcode,
        quantity: product.quantity,
        minStock: product.minStock,
        maxStock: product.maxStock,
        category: product.category,
        image: product.image,
        notes: product.notes,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      });

      return reconstituteProduct(createdProduct.toJSON());
    } catch (error) {
      throw new Error(`Failed to create product: ${error}`);
    }
  }

  async findById(id: string): Promise<ProductEntity | null> {
    try {
      const productRecord = await ProductModel.findOne({ where: { id } });
      if (productRecord) {
        return reconstituteProduct(productRecord.toJSON());
      }
      return null;
    } catch (error) {
      throw new Error(`Failed to find product by id: ${error}`);
    }
  }

  async findBySku(sku: string): Promise<ProductEntity | null> {
    try {
      const productRecord = await ProductModel.findOne({ where: { sku } });
      if (productRecord) {
        return reconstituteProduct(productRecord.toJSON());
      }
      return null;
    } catch (error) {
      throw new Error(`Failed to find product by SKU: ${error}`);
    }
  }

  async findAll(): Promise<ProductEntity[]> {
    try {
      const products = await ProductModel.findAll();
      return products.map((p) => reconstituteProduct(p.toJSON()));
    } catch (error) {
      throw new Error(`Failed to find all products: ${error}`);
    }
  }

  async update(_product: ProductEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async delete(_id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
