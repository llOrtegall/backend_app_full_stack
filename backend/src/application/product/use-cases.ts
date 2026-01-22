import { ProductEntity, type IProduct } from "../../domain/product/entity.ts";
import type { IProductRepository } from "../../domain/product/repository.ts";

export class ProductUseCases {
  constructor(private productRepo: IProductRepository) {}

  createNewProduct = async (
    props: Omit<IProduct, "id" | "createdAt" | "updatedAt">,
  ): Promise<IProduct> => {
    const newProduct = new ProductEntity(props);

    await this.productRepo.create(newProduct);

    return newProduct;
  };
}
