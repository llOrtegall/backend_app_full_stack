import { z, treeifyError } from "zod";

const pgSchemaEnvironments = z.object({
  PG_HOST: z.string().min(1, "PG_HOST is required"),
  PG_PORT: z
    .string()
    .min(1, "PG_PORT is required")
    .transform((val: string) => parseInt(val, 10)),
  PG_USER: z.string().min(1, "PG_USER is required"),
  PG_PASSWORD: z.string().min(3, "PG_PASSWORD is required"),
  PG_DATABASE: z.string().min(3, "PG_DATABASE is required"),
  PG_SCHEMA: z.string().min(3, "PG_SCHEMA is required"),
});

const { success, data, error } = pgSchemaEnvironments.safeParse(process.env);

if (!success) {
  console.error(
    "Invalid PostgreSQL environment variables:",
    treeifyError(error),
  );
  process.exit(1);
}

export const {
  PG_HOST,
  PG_PORT,
  PG_USER,
  PG_PASSWORD,
  PG_DATABASE,
  PG_SCHEMA,
} = data;
