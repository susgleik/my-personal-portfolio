import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export const uploadImage = async (
  file: File,
  path: string
): Promise<string> => {
  try {
    const storageRef = ref(storage, `images/${path}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteImage = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

export const uploadMultipleImages = async (
  files: FileList | File[],
  basePath: string
): Promise<string[]> => {
  try {
    const uploadPromises = Array.from(files).map((file, index) => {
      const fileName = `${Date.now()}-${index}-${file.name}`;
      return uploadImage(file, `${basePath}/${fileName}`);
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};