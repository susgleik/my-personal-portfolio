export interface Category {
  id: string;
  name: string;       // "Desarrollo Web"
  slug: string;       // "desarrollo-web"
  emoji: string;      // "💻"
  color: string;      // "blue" | "purple" | "green" | "yellow" | "red" | "orange"
  order: number;      // Para ordenar en UI
  createdAt: Date;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  readTime?: number;
}

export interface Project {
  id: string;

  // Contenido en español (original)
  title: string;
  description: string;        // Resumen corto para tarjeta
  content: string;            // Contenido completo (Markdown)

  // Contenido traducido automáticamente (inglés)
  title_en?: string;
  description_en?: string;
  content_en?: string;

  // Identificación
  slug: string;

  // Multimedia
  thumbnail: string;          // Imagen principal para tarjeta
  images: string[];           // Galería adicional

  // Clasificación
  category?: string; // Slug de la categoría (opcional, dinámico desde Firebase)
  technologies: string[];

  // Enlaces externos
  liveUrl?: string;
  githubUrl?: string;
  mediumUrl?: string;

  // Estado y visibilidad
  featured?: boolean; // Deprecated: se calcula automáticamente por orden
  isPublished: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  order: number;              // Orden manual de aparición

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  uid: string;
  email: string;
  isAdmin: boolean;
}

export interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  isPublished: boolean;
  coverImage?: File | string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  content: string;
  category?: string; // Slug de la categoría (opcional)
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  mediumUrl?: string;
  featured: boolean;
  isPublished: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  order: number;
  thumbnail?: File | string;
  images?: FileList | string[];
}