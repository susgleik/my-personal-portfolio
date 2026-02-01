import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Extrae el path de Storage desde una URL de Firebase Storage
 * Ejemplo: https://firebasestorage.googleapis.com/v0/b/bucket/o/images%2Fprojects%2Fslug%2Fthumbnail.jpg?alt=media
 * Retorna: images/projects/slug/thumbnail.jpg
 */
export const getStoragePathFromUrl = (url: string): string | null => {
  try {
    if (!url || !url.includes('firebasestorage.googleapis.com')) {
      return null;
    }
    // Extraer la parte después de /o/ y antes de ?
    const match = url.match(/\/o\/([^?]+)/);
    if (match && match[1]) {
      // Decodificar URL encoding (%2F -> /)
      return decodeURIComponent(match[1]);
    }
    return null;
  } catch {
    return null;
  }
};

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

/**
 * Elimina una imagen usando su URL de Firebase Storage
 */
export const deleteImageByUrl = async (url: string): Promise<void> => {
  const path = getStoragePathFromUrl(url);
  if (path) {
    await deleteImage(path);
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

/**
 * Elimina todas las imágenes de un proyecto (thumbnail + galería)
 */
export const deleteProjectImages = async (
  thumbnail?: string,
  images?: string[]
): Promise<void> => {
  const deletePromises: Promise<void>[] = [];

  // Eliminar thumbnail
  if (thumbnail) {
    deletePromises.push(
      deleteImageByUrl(thumbnail).catch((err) => {
        console.warn('Could not delete thumbnail:', err);
      })
    );
  }

  // Eliminar imágenes de galería
  if (images && images.length > 0) {
    images.forEach((url) => {
      deletePromises.push(
        deleteImageByUrl(url).catch((err) => {
          console.warn('Could not delete image:', url, err);
        })
      );
    });
  }

  await Promise.all(deletePromises);
};

/**
 * Descarga una imagen desde una URL y la devuelve como File
 */
export const downloadImageAsFile = async (url: string, filename: string): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
};

/**
 * Mueve una imagen de una ubicación a otra (descarga y re-sube)
 * Retorna la nueva URL
 */
export const moveImage = async (
  oldUrl: string,
  newPath: string
): Promise<string> => {
  // Extraer nombre del archivo de la URL
  const urlPath = getStoragePathFromUrl(oldUrl);
  if (!urlPath) throw new Error('Invalid URL');

  const filename = urlPath.split('/').pop() || 'image.jpg';

  // Descargar imagen
  const file = await downloadImageAsFile(oldUrl, filename);

  // Subir a nueva ubicación
  const newUrl = await uploadImage(file, newPath);

  // Eliminar de ubicación anterior
  await deleteImageByUrl(oldUrl);

  return newUrl;
};

/**
 * Mueve todas las imágenes de un proyecto a una nueva carpeta
 */
export const moveProjectImages = async (
  oldSlug: string,
  newSlug: string,
  thumbnail?: string,
  images?: string[]
): Promise<{ newThumbnail?: string; newImages: string[] }> => {
  let newThumbnail: string | undefined;
  const newImages: string[] = [];

  // Mover thumbnail
  if (thumbnail && thumbnail.includes(`/projects/${oldSlug}/`)) {
    try {
      const filename = `thumbnail-${Date.now()}`;
      newThumbnail = await moveImage(thumbnail, `projects/${newSlug}/${filename}`);
    } catch (err) {
      console.warn('Could not move thumbnail:', err);
      newThumbnail = thumbnail; // Mantener la URL original si falla
    }
  } else {
    newThumbnail = thumbnail;
  }

  // Mover imágenes de galería
  if (images && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      const imageUrl = images[i];
      if (imageUrl.includes(`/projects/${oldSlug}/`)) {
        try {
          const filename = `image-${Date.now()}-${i}`;
          const newUrl = await moveImage(imageUrl, `projects/${newSlug}/${filename}`);
          newImages.push(newUrl);
        } catch (err) {
          console.warn('Could not move image:', imageUrl, err);
          newImages.push(imageUrl); // Mantener la URL original si falla
        }
      } else {
        newImages.push(imageUrl);
      }
    }
  }

  return { newThumbnail, newImages };
};