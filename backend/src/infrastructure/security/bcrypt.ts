import type { PasswordEncryptor } from "../../application/service/passwordHash.ts";
import bcrypt from "bcryptjs";

export class BcryptPasswordEncryptor implements PasswordEncryptor {
  async hash(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
