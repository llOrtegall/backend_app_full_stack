import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import type { FileStorageService } from "../../application/service/fileStorage.ts";
import {
  R2_ACCESS_KEY_ID,
  R2_PUBLIC_URL,
  R2_ENDPOINT,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
} from "../configuration/r2Schema.ts";
import { randomUUID } from "node:crypto";

export class R2StorageService implements FileStorageService {
  private client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    this.client = new S3Client({
      region: "auto",
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });
    this.bucketName = R2_BUCKET_NAME;
    this.publicUrl = R2_PUBLIC_URL;
  }

  async uploadImage(file: {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
  }): Promise<string> {
    try {
      // Generar nombre único
      const ext = file.originalName.split(".").pop();
      const fileName = `${randomUUID()}.${ext}`;

      // Subir a R2
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimeType,
        }),
      );

      // Retornar URL pública
      return `${this.publicUrl}/${fileName}`;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error}`);
    }
  }

  async deleteImage(url: string): Promise<void> {
    try {
      // Extraer el key de la URL
      const key = url.replace(`${this.publicUrl}/`, "");

      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
    } catch (error) {
      throw new Error(`Failed to delete image: ${error}`);
    }
  }
}
