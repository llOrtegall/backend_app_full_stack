import z, { prettifyError } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  quantity: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "Quantity must be a non-negative integer",
    }),
  minStock: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "Min stock must be a non-negative integer",
    }),
  maxStock: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "Max stock must be a non-negative integer",
    })
    .optional(),
  cost: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .refine((val) => val === undefined || (!isNaN(val) && val >= 0), {
      message: "Cost must be a non-negative number",
    }),
  price: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "Price must be a non-negative number",
    }),
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
