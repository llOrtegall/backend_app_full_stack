import type { IProduct } from "../../domain/product/entity.ts";
import type { IProductRepository } from "../../domain/product/repository.ts";
import { createProduct } from "../../domain/product/factory.ts";
import { ProductAlreadyExistsError } from "../../domain/product/errors.ts";

export class ProductUseCases {
  constructor(private productRepo: IProductRepository) {}

  createNewProduct = async (
    props: Omit<IProduct, "id" | "createdAt" | "updatedAt">,
  ): Promise<IProduct> => {
    // Validar que el SKU no exista
    const existingProduct = await this.productRepo.findBySku(props.sku);
    if (existingProduct) {
      throw new ProductAlreadyExistsError(props.sku);
    }

    // Crear producto con validaciones de dominio
    const newProduct = createProduct(props);

    // Persistir y retornar el producto creado
    return await this.productRepo.create(newProduct);
  };
}
