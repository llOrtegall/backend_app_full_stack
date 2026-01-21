import z, { prettifyError } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  quantity: z.number().int().nonnegative(),
  minStock: z.number().int().nonnegative(),
  maxStock: z.number().int().nonnegative().optional(),
  cost: z.number().nonnegative().optional(),
  price: z.number().nonnegative(),
  category: z.string().min(1, "Category is required"),
  image: z.string().optional(),
  notes: z.string().optional(),
});

export const validateProductDto = (productInfo: unknown) => {
  const { success, data, error } = productSchema.safeParse(productInfo);

  if (!success) {
    const formattedError = prettifyError(error);
    throw new Error(`Invalid zod product data: ${formattedError}`);
  }

  return data;
};
