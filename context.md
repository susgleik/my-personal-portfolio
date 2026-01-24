# Firebase Local Development - Portafolio Web

## Descripción del Proyecto

Portafolio web inspirado en https://www.mrdbourke.com/ con funcionalidad de blog tipo Medium y gestión de proyectos. 

**Stack Tecnológico:**
- Frontend: Next.js 14 (App Router) + Tailwind CSS
- Backend: Firebase (Firestore, Auth, Storage)
- Hosting: Vercel
- Desarrollo Local: Firebase Emulator Suite

## Estructura del Proyecto

```
mi-portfolio/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Layout principal
│   ├── globals.css                 # Estilos globales
│   ├── blog/
│   │   ├── page.tsx                # Lista de posts del blog
│   │   └── [slug]/
│   │       └── page.tsx            # Post individual
│   ├── projects/
│   │   ├── page.tsx                # Lista de proyectos
│   │   └── [slug]/
│   │       └── page.tsx            # Proyecto individual
│   ├── about/
│   │   └── page.tsx                # Página sobre mí
│   └── admin/
│       ├── page.tsx                # Dashboard admin
│       ├── layout.tsx              # Layout del admin
│       ├── login/
│       │   └── page.tsx            # Login del admin
│       ├── posts/
│       │   ├── page.tsx            # Gestión de posts
│       │   ├── new/
│       │   │   └── page.tsx        # Crear nuevo post
│       │   └── edit/
│       │       └── [id]/
│       │           └── page.tsx    # Editar post
│       └── projects/
│           ├── page.tsx            # Gestión de proyectos
│           ├── new/
│           │   └── page.tsx        # Crear nuevo proyecto
│           └── edit/
│               └── [id]/
│                   └── page.tsx    # Editar proyecto
├── components/
│   ├── ui/                         # Componentes reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   └── Modal.tsx
│   ├── admin/                      # Componentes del admin
│   │   ├── PostForm.tsx
│   │   ├── ProjectForm.tsx
│   │   └── AdminLayout.tsx
│   ├── blog/                       # Componentes del blog
│   │   ├── PostCard.tsx
│   │   ├── PostContent.tsx
│   │   └── TagList.tsx
│   └── projects/                   # Componentes de proyectos
│       ├── ProjectCard.tsx
│       └── ProjectGallery.tsx
├── lib/
│   ├── firebase.ts                 # Configuración Firebase
│   ├── firebase-admin.ts           # Admin SDK (si es necesario)
│   ├── auth.ts                     # Funciones de autenticación
│   ├── firestore.ts               # Funciones de Firestore
│   ├── storage.ts                  # Funciones de Storage
│   ├── config.ts                   # Configuraciones
│   └── utils.ts                    # Utilidades generales
├── types/
│   └── index.ts                    # Tipos TypeScript
├── hooks/
│   ├── useAuth.ts                  # Hook de autenticación
│   └── useFirestore.ts             # Hook para Firestore
├── scripts/
│   ├── seed-local.ts               # Script para datos de prueba
│   └── backup-data.ts              # Script para backup
├── public/
│   ├── images/
│   └── icons/
├── firebase.json                   # Configuración Firebase
├── .env.local                      # Variables de entorno
├── .env.example                    # Ejemplo de variables
└── README.md
```

## Setup Inicial

### 1. Instalación de Dependencias

```bash
# Crear proyecto Next.js
npx create-next-app@latest mi-portfolio --typescript --tailwind --app
cd mi-portfolio

# Instalar Firebase y dependencias
npm install firebase
npm install react-hook-form @hookform/resolvers/zod zod
npm install react-markdown remark-gfm
npm install lucide-react
npm install -D concurrently tsx

# Instalar Firebase CLI globalmente
npm install -g firebase-tools
```

### 2. Configuración de Firebase

```bash
# Login en Firebase
firebase login

# Inicializar Firebase en el proyecto
firebase init

# Seleccionar:
# - Firestore
# - Storage
# - Emulators
```

### 3. Configuración de Emuladores

**firebase.json:**
```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  },
  "emulators": {
    "firestore": {
      "port": 8080
    },
    "auth": {
      "port": 9099
    },
    "storage": {
      "port": 9199
    },
    "ui": {
      "enabled": true,
      "port": 4000
    },
    "singleProjectMode": true
  }
}
```

## Configuración de Firebase

### lib/firebase.ts

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Conectar a emuladores en desarrollo
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Verificar que no estén ya conectados para evitar errores
  let isFirestoreConnected = false;
  let isAuthConnected = false;
  let isStorageConnected = false;

  try {
    if (!isFirestoreConnected) {
      connectFirestoreEmulator(db, 'localhost', 8080);
      isFirestoreConnected = true;
    }
  } catch (error) {
    // Ya conectado o error
  }

  try {
    if (!isAuthConnected) {
      connectAuthEmulator(auth, 'http://localhost:9099');
      isAuthConnected = true;
    }
  } catch (error) {
    // Ya conectado o error
  }

  try {
    if (!isStorageConnected) {
      connectStorageEmulator(storage, 'localhost', 9199);
      isStorageConnected = true;
    }
  } catch (error) {
    // Ya conectado o error
  }
}

export { app };
```

### Variables de Entorno

**.env.local:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin credentials para desarrollo local
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
```

## Modelos de Datos

### types/index.ts

```typescript
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
  readTime?: number; // minutos estimados de lectura
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string; // Descripción corta
  longDescription: string; // Descripción detallada
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  images: string[]; // URLs de imágenes
  featured: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  uid: string;
  email: string;
  isAdmin: boolean;
}

// Tipos para formularios
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
  longDescription: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  images?: FileList | string[];
}
```

## Funciones de Firestore

### lib/firestore.ts

```typescript
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { Post, Project } from '@/types';

// Posts
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
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Post;
  } catch (error) {
    console.error('Error getting post by slug:', error);
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

// Projects
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
  limit?: number;
} = {}) => {
  try {
    const { featured, limit: limitCount = 10 } = options;
    
    let q = query(
      collection(db, 'projects'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    if (featured !== undefined) {
      q = query(
        collection(db, 'projects'),
        where('featured', '==', featured),
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

export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  try {
    const q = query(collection(db, 'projects'), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Project;
  } catch (error) {
    console.error('Error getting project by slug:', error);
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

// Utilidades
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno
    .replace(/^-+|-+$/g, ''); // Remover guiones al inicio/final
};

export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};
```

## Scripts de Desarrollo

### package.json scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:emulators": "firebase emulators:start",
    "dev:full": "concurrently \"firebase emulators:start\" \"next dev\"",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "seed": "tsx scripts/seed-local.ts",
    "backup": "tsx scripts/backup-data.ts",
    "emulators:export": "firebase emulators:export ./backup",
    "emulators:import": "firebase emulators:start --import ./backup"
  }
}
```

### scripts/seed-local.ts

```typescript
import { createPost, createProject, generateSlug, calculateReadTime } from '../lib/firestore';

const samplePosts = [
  {
    title: "Mi primer post en el blog",
    content: "Este es el contenido completo del primer post. Aquí escribiría sobre desarrollo, tecnología y proyectos personales.",
    excerpt: "Un post introductorio sobre el blog y mis objetivos.",
    tags: ["desarrollo", "personal", "blog"],
    isPublished: true,
    publishedAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Trabajando con Next.js y Firebase",
    content: "En este post explico cómo configuré este blog usando Next.js 14 y Firebase, incluyendo el desarrollo local con emuladores.",
    excerpt: "Guía técnica sobre la implementación de este blog.",
    tags: ["nextjs", "firebase", "tutorial"],
    isPublished: true,
    publishedAt: new Date(Date.now() - 86400000), // Ayer
    updatedAt: new Date(Date.now() - 86400000)
  }
];

const sampleProjects = [
  {
    title: "Portfolio Personal",
    description: "Mi sitio web personal con blog integrado",
    longDescription: "Un portafolio completo desarrollado con Next.js y Firebase, que incluye sistema de blog, gestión de proyectos y panel de administración.",
    technologies: ["Next.js", "Firebase", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/usuario/portfolio",
    liveUrl: "https://miportfolio.com",
    images: [],
    featured: true,
    status: "in-progress" as const,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "App de Tareas",
    description: "Aplicación de gestión de tareas con React",
    longDescription: "Una aplicación completa para gestionar tareas diarias con características como categorías, fechas límite y sincronización en la nube.",
    technologies: ["React", "Node.js", "MongoDB"],
    githubUrl: "https://github.com/usuario/task-app",
    featured: false,
    status: "completed" as const,
    createdAt: new Date(Date.now() - 172800000), // Hace 2 días
    updatedAt: new Date(Date.now() - 172800000)
  }
];

const seedData = async () => {
  console.log('🌱 Iniciando seed de datos locales...');

  try {
    // Crear posts
    for (const postData of samplePosts) {
      const post = {
        ...postData,
        slug: generateSlug(postData.title),
        readTime: calculateReadTime(postData.content)
      };
      const postId = await createPost(post);
      console.log(`✅ Post creado: ${post.title} (ID: ${postId})`);
    }

    // Crear proyectos
    for (const projectData of sampleProjects) {
      const project = {
        ...projectData,
        slug: generateSlug(projectData.title)
      };
      const projectId = await createProject(project);
      console.log(`✅ Proyecto creado: ${project.title} (ID: ${projectId})`);
    }

    console.log('🎉 Seed completado exitosamente!');
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  }
};

seedData();
```

## Reglas de Seguridad

### firestore.rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Posts - lectura pública, escritura solo admins
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Projects - lectura pública, escritura solo admins
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Users - solo el usuario puede leer/escribir sus datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### storage.rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Imágenes públicas de posts y proyectos
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## Comandos de Desarrollo

### Desarrollo Local Completo

```bash
# Iniciar emuladores y Next.js
npm run dev:full

# Solo emuladores
npm run dev:emulators

# Solo Next.js (usar con emuladores ya iniciados)
npm run dev
```

### Gestión de Datos

```bash
# Poblar datos de prueba
npm run seed

# Backup de datos locales
npm run backup

# Exportar datos de emuladores
npm run emulators:export

# Importar datos en emuladores
npm run emulators:import
```

### URLs de Desarrollo

- **Next.js App**: http://localhost:3000
- **Firebase Emulator UI**: http://localhost:4000
- **Firestore Emulator**: http://localhost:8080
- **Auth Emulator**: http://localhost:9099
- **Storage Emulator**: http://localhost:9199

## Consideraciones Importantes

### Desarrollo Local
- Los emuladores no requieren conexión a internet
- Los datos persisten entre reinicios
- Usar siempre `NODE_ENV=development` para conectar emuladores
- Los emuladores tienen sus propias bases de datos separadas de producción

### Autenticación Admin
- Crear usuario admin manualmente en Auth Emulator UI
- Configurar custom claims para el rol admin
- En producción, usar Firebase Admin SDK para gestionar roles

### Deployment
- Usar `npm run build` para verificar antes del deploy
- Variables de entorno diferentes para producción
- Firebase CLI para deploy de reglas y functions

### Best Practices
- Siempre validar datos antes de escribir a Firestore
- Usar tipos TypeScript para consistencia
- Manejar estados de loading y error en UI
- Implementar paginación para listas grandes

## Próximos Pasos

1. **Setup inicial** del proyecto
2. **Configuración** de Firebase y emuladores
3. **Implementación** de components UI básicos
4. **Sistema de autenticación** admin
5. **CRUD** de posts y proyectos
6. **UI/UX** del portafolio público
7. **Optimización** y testing
8. **Deployment** a producción

Este archivo debe servir como referencia completa para todo el desarrollo del proyecto.s