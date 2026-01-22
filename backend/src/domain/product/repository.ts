import type { ProductEntity } from "./entity";

export interface IProductRepository {
  create(product: ProductEntity): Promise<ProductEntity>;
  findById(id: string): Promise<ProductEntity | null>;
  findAll(): Promise<ProductEntity[]>;
  update(product: ProductEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
