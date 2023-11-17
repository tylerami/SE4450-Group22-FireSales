import { ImageService } from "services/interfaces/ImageService";
import { ref, getDownloadURL, FirebaseStorage } from "firebase/storage";

class ImageFirebaseService implements ImageService {
  private storage: FirebaseStorage;

  constructor(storage: FirebaseStorage) {
    this.storage = storage;
  }

  async getImageUrl(path: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, path);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error("Error fetching image:", error);
      throw new Error("Unable to fetch image");
    }
  }
  uploadImage(path: string, file: File): Promise<string> {
    throw new Error("Method not implemented.");
  }
  bulkUploadImages(
    path: string,
    files: File[]
  ): Promise<{ path: string; url: string }[]> {
    throw new Error("Method not implemented.");
  }
}

export default ImageFirebaseService;
