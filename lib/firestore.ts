import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { Post, Project, Category } from '@/types';

/**
 * Genera un ID único para un nuevo proyecto (sin crear el documento)
 * Útil para subir imágenes antes de crear el documento
 */
export const generateProjectId = (): string => {
  const docRef = doc(collection(db, 'projects'));
  return docRef.id;
};

/**
 * Crea un proyecto con un ID específico (pre-generado)
 */
export const createProjectWithId = async (id: string, projectData: Omit<Project, 'id'>) => {
  try {
    const docRef = doc(db, 'projects', id);
    await setDoc(docRef, {
      ...projectData,
      createdAt: Timestamp.fromDate(projectData.createdAt),
      updatedAt: Timestamp.fromDate(projectData.updatedAt)
    });
    return id;
  } catch (error) {
    console.error('Error creating project with id:', error);
    throw error;
  }
};

export const createPost = async (postData: Omit<Post, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      publishedAt: Timestamp.fromDate(postData.publishedAt),
      updatedAt: Timestamp.fromDate(postData.updatedAt)
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const getPosts = async (options: {
  published?: boolean;
  limit?: number;
} = {}) => {
  try {
    const { published = true, limit: limitCount = 10 } = options;

    let q = query(
      collection(db, 'posts'),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );

    if (published !== undefined) {
      q = query(
        collection(db, 'posts'),
        where('isPublished', '==', published),
        orderBy('publishedAt', 'desc'),
        limit(limitCount)
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as Post[];
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    const q = query(collection(db, 'posts'), where('slug', '==', slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docData = snapshot.docs[0];
    return {
      id: docData.id,
      ...docData.data(),
      publishedAt: docData.data().publishedAt?.toDate(),
      updatedAt: docData.data().updatedAt?.toDate()
    } as Post;
  } catch (error) {
    console.error('Error getting post by slug:', error);
    throw error;
  }
};

export const getPostById = async (id: string): Promise<Post | null> => {
  try {
    const docRef = doc(db, 'posts', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...docSnap.data(),
      publishedAt: docSnap.data().publishedAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate()
    } as Post;
  } catch (error) {
    console.error('Error getting post by id:', error);
    throw error;
  }
};

export const updatePost = async (id: string, postData: Partial<Post>) => {
  try {
    const docRef = doc(db, 'posts', id);
    await updateDoc(docRef, {
      ...postData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const deletePost = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'posts', id));
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

export const createProject = async (projectData: Omit<Project, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'projects'), {
      ...projectData,
      createdAt: Timestamp.fromDate(projectData.createdAt),
      updatedAt: Timestamp.fromDate(projectData.updatedAt)
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const getProjects = async (options: {
  featured?: boolean;
  published?: boolean;
  limit?: number;
} = {}) => {
  try {
    const { featured, published, limit: limitCount = 10 } = options;

    let q = query(
      collection(db, 'projects'),
      orderBy('order', 'asc'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    if (featured !== undefined && published !== undefined) {
      q = query(
        collection(db, 'projects'),
        where('featured', '==', featured),
        where('isPublished', '==', published),
        orderBy('order', 'asc'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    } else if (featured !== undefined) {
      q = query(
        collection(db, 'projects'),
        where('featured', '==', featured),
        orderBy('order', 'asc'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    } else if (published !== undefined) {
      q = query(
        collection(db, 'projects'),
        where('isPublished', '==', published),
        orderBy('order', 'asc'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as Project[];
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
};

export const getProjectsByCategory = async (
  category: string,
  options: { published?: boolean; limit?: number } = {}
): Promise<Project[]> => {
  try {
    const { published = true, limit: limitCount = 20 } = options;

    const q = query(
      collection(db, 'projects'),
      where('category', '==', category),
      where('isPublished', '==', published),
      orderBy('order', 'asc'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as Project[];
  } catch (error) {
    console.error('Error getting projects by category:', error);
    throw error;
  }
};

export const getPublishedProjects = async (limitCount: number = 20): Promise<Project[]> => {
  return getProjects({ published: true, limit: limitCount });
};

export const getFeaturedProjects = async (limitCount: number = 5): Promise<Project[]> => {
  // Los primeros proyectos por orden son los que aparecen en Home
  return getProjects({ published: true, limit: limitCount });
};

export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  try {
    const q = query(collection(db, 'projects'), where('slug', '==', slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docData = snapshot.docs[0];
    return {
      id: docData.id,
      ...docData.data(),
      createdAt: docData.data().createdAt?.toDate(),
      updatedAt: docData.data().updatedAt?.toDate()
    } as Project;
  } catch (error) {
    console.error('Error getting project by slug:', error);
    throw error;
  }
};

export const getProjectById = async (id: string): Promise<Project | null> => {
  try {
    const docRef = doc(db, 'projects', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate()
    } as Project;
  } catch (error) {
    console.error('Error getting project by id:', error);
    throw error;
  }
};

export const updateProject = async (id: string, projectData: Partial<Project>) => {
  try {
    const docRef = doc(db, 'projects', id);
    await updateDoc(docRef, {
      ...projectData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'projects', id));
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// ==================== CATEGORIES ====================

export const createCategory = async (categoryData: Omit<Category, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), {
      ...categoryData,
      createdAt: Timestamp.fromDate(categoryData.createdAt)
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const q = query(
      collection(db, 'categories'),
      orderBy('order', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    })) as Category[];
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    const q = query(collection(db, 'categories'), where('slug', '==', slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docData = snapshot.docs[0];
    return {
      id: docData.id,
      ...docData.data(),
      createdAt: docData.data().createdAt?.toDate()
    } as Category;
  } catch (error) {
    console.error('Error getting category by slug:', error);
    throw error;
  }
};

export const updateCategory = async (id: string, categoryData: Partial<Category>) => {
  try {
    const docRef = doc(db, 'categories', id);
    await updateDoc(docRef, categoryData);
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'categories', id));
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};