export interface ImageService {
  getImageUrl(path: string): Promise<string>;
  uploadImage(path: string, file: File): Promise<string>;
  bulkUploadImages(
    path: string,
    files: File[]
  ): Promise<Array<{ path: string; url: string }>>;
}
