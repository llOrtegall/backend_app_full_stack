import { z, treeifyError } from "zod";

const r2SchemaEnvironments = z.object({
  R2_ENDPOINT: z.string().url("R2_ENDPOINT must be a valid URL"),
  R2_ACCESS_KEY_ID: z.string().min(1, "R2_ACCESS_KEY_ID is required"),
  R2_SECRET_ACCESS_KEY: z.string().min(1, "R2_SECRET_ACCESS_KEY is required"),
  R2_PUBLIC_URL: z.string().min(1, "R2_PUBLIC_URL is required"),
  R2_BUCKET_NAME: z.string().min(1, "R2_BUCKET_NAME is required"),
});

const { success, data, error } = r2SchemaEnvironments.safeParse(process.env);

if (!success) {
  console.error("Invalid R2 environment variables:", treeifyError(error));
  process.exit(1);
}

export const {
  R2_ENDPOINT,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_PUBLIC_URL,
  R2_BUCKET_NAME,
} = data;
