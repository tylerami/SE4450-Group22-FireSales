import { ImageService } from "services/interfaces/ImageService";
import {
  ref,
  getDownloadURL,
  FirebaseStorage,
  uploadBytes,
  UploadResult,
} from "firebase/storage";
import { Conversion } from "src/models/Conversion";

/**
 * Returns the path for storing conversion attachments in Firebase Storage.
 * @param userId The user ID.
 * @param conversionId The conversion ID.
 * @param id The attachment ID.
 * @returns The path for storing conversion attachments.
 */
const getConversionAttachmentsPath = (
  conversion: Conversion,
  attachmentNumber: number
): string => {
  if (conversion.isUnassigned()) {
    const assignmentCode = conversion.assignmentCode;
    return `/conversions/unassigned/${assignmentCode}/${
      conversion.id
    }/${attachmentNumber}-${new Date().toISOString()})}`;
  }

  return `/conversions/${conversion.userId}/${
    conversion.id
  }/${attachmentNumber}-${new Date().toISOString()})}`;
};

/**
 * Implementation of the ImageService interface using Firebase Storage.
 */
class ImageFirebaseService implements ImageService {
  private storage: FirebaseStorage;

  /**
   * Constructs a new ImageFirebaseService instance.
   * @param storage The FirebaseStorage instance.
   */
  constructor(storage: FirebaseStorage) {
    this.storage = storage;
  }

  /**
   * Uploads conversion attachments to Firebase Storage.
   * @param conversion The conversion object.
   * @param attachments The list of attachments to upload.
   * @returns The updated conversion object.
   */
  async uploadConversionAttachments(
    conversion: Conversion,
    attachments: File[]
  ): Promise<Conversion> {
    const newAttachmentUrls: string[] = [];
    let count = conversion.attachmentUrls.length + 1;
    for (const file of attachments) {
      const path = getConversionAttachmentsPath(conversion, count);
      const url: string = await this.uploadImage(path, file);
      if (!url) {
        continue;
      }
      count++;
      newAttachmentUrls.push(url);
    }

    return conversion.addConversionAttachmentUrls(newAttachmentUrls);
  }

  /**
   * Gets the download URL of an image from Firebase Storage.
   * @param path The path of the image.
   * @returns The download URL of the image, or null if it doesn't exist.
   */
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

  /**
   * Uploads an image to Firebase Storage.
   * @param path The path to store the image.
   * @param file The image file to upload.
   * @param fileName The name of the file (optional).
   * @returns The download URL of the uploaded image.
   */
  async uploadImage(
    path: string,
    file: File,
    fileName: string | null = null
  ): Promise<string> {
    if (fileName) {
      file = new File([file], fileName, {
        type: file.type,
        lastModified: file.lastModified,
      });
    }
    const storageRef = ref(this.storage, path);
    let result: UploadResult = await uploadBytes(storageRef, file);
    return await getDownloadURL(result.ref);
  }
}

export default ImageFirebaseService;
