import { z, prettifyError } from "zod";

const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 5 characters long"),
});

export const validateUserDto = (userInfo: unknown) => {
  const { success, data, error } = UserSchema.safeParse(userInfo);

  if (!success) {
    const formattedError = prettifyError(error);
    throw new Error(`Invalid zod user data: ${formattedError}`);
  }

  return data;
};
