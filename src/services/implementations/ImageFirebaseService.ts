import { ImageService } from "services/interfaces/ImageService";
import {
  ref,
  getDownloadURL,
  FirebaseStorage,
  uploadBytes,
  UploadResult,
} from "firebase/storage";
import { Conversion } from "@models/Conversion";
import { UnassignedConversion } from "@models/UnassignedConversion";

const getConversionAttachmentsPath = (
  userId: string,
  conversionId: string,
  id: number
): string => {
  return `/conversions/${userId}/${conversionId}/${id}-${new Date().toISOString()})}`;
};

const getUnassignedConversionAttachmentsPath = (
  assignmentCode: string,
  conversionId: string,
  id: number
): string => {
  return `/conversions/unassigned/${assignmentCode}/${conversionId}/${id}-${new Date().toISOString()})}`;
};

class ImageFirebaseService implements ImageService {
  private storage: FirebaseStorage;

  constructor(storage: FirebaseStorage) {
    this.storage = storage;
  }
  async uploadConversionAttachments(
    conversion: Conversion,
    attachments: File[]
  ): Promise<Conversion> {
    const newAttachmentUrls: string[] = [];
    let count = conversion.attachmentUrls.length + 1;
    for (const file of attachments) {
      const uid = conversion.userId;
      const path = getConversionAttachmentsPath(uid, conversion.id, count);
      const url: string = await this.uploadImage(path, file);
      if (!url) {
        continue;
      }
      count++;
      newAttachmentUrls.push(url);
    }

    return conversion.addConversionAttachmentUrls(newAttachmentUrls);
  }

  async uploadUnassignedConversionAttachments(
    unassignedConv: UnassignedConversion,
    attachments: File[]
  ): Promise<UnassignedConversion> {
    const newAttachmentUrls: string[] = [];
    let count = unassignedConv.attachmentUrls.length + 1;
    for (const file of attachments) {
      const code = unassignedConv.assignmentCode;
      const path = getUnassignedConversionAttachmentsPath(
        code,
        unassignedConv.id,
        count
      );
      const url: string = await this.uploadImage(path, file);
      if (!url) {
        continue;
      }
      count++;
      newAttachmentUrls.push(url);
    }

    return unassignedConv.addConversionAttachmentUrls(newAttachmentUrls);
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
