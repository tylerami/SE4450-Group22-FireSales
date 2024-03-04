// make the interface more concrete, with only certain options for getting/setting images (categories)

import { Conversion } from "src/models/Conversion";

export interface ImageService {
  getImageUrl(path: string): Promise<string | null>;
  uploadImage(
    path: string,
    file: File,
    renameFile?: string | null
  ): Promise<string>;
  uploadConversionAttachments(
    conversion: Conversion,
    attachments: File[]
  ): Promise<Conversion>;
}
