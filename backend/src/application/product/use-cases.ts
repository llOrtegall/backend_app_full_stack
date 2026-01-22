import type { IProduct } from "../../domain/product/entity.ts";
import type { IProductRepository } from "../../domain/product/repository.ts";
import { createProduct } from "../../domain/product/factory.ts";
import type { FileStorageService } from "../service/fileStorage.ts";

export class ProductUseCases {
  constructor(
    private productRepo: IProductRepository,
    private fileStorage: FileStorageService,
  ) {}

  createNewProduct = async (
    props: Omit<IProduct, "id" | "createdAt" | "updatedAt">,
    imageFile?: { buffer: Buffer; originalName: string; mimeType: string },
  ): Promise<IProduct> => {
    let imageUrl: string | undefined;
    if (imageFile) {
      imageUrl = await this.fileStorage.uploadImage(imageFile);
    }

    const newProduct = createProduct({
      ...props,
      image: imageUrl || props.image,
    });

    return await this.productRepo.create(newProduct);
  };
}
