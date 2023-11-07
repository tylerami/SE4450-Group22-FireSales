import { storage } from "../config/firebase"; // Import your firebase configuration
import { ref, getDownloadURL } from "firebase/storage";

export const getImageUrl = async (path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw new Error("Unable to fetch image");
  }
};
