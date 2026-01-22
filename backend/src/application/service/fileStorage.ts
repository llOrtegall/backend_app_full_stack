export interface FileStorageService {
  uploadImage(file: {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
  }): Promise<string>;

  deleteImage(url: string): Promise<void>;
}
