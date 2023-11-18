import { ImageService } from "services/interfaces/ImageService";
import {
  ref,
  getDownloadURL,
  FirebaseStorage,
  uploadBytes,
  UploadResult,
} from "firebase/storage";

class ImageFirebaseService implements ImageService {
  private storage: FirebaseStorage;

  constructor(storage: FirebaseStorage) {
    this.storage = storage;
  }

  async getImageUrl(path: string): Promise<string | null> {
    try {
      const storageRef = ref(this.storage, path);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  }
  async uploadImage(path: string, file: File): Promise<string> {
    const storageRef = ref(this.storage, path);
    let result: UploadResult = await uploadBytes(storageRef, file);
    return await getDownloadURL(result.ref);
  }
}

export default ImageFirebaseService;
