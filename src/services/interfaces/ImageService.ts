// make the interface more concrete, with only certain options for getting/setting images (categories)

export interface ImageService {
  getImageUrl(path: string): Promise<string | null>;
  uploadImage(path: string, file: File): Promise<string>;
}
