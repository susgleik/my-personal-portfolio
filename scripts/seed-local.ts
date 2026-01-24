import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { createPost, createProject, generateSlug, calculateReadTime } from '../lib/firestore';

const firebaseConfig = {
  apiKey: 'demo-key',
  authDomain: 'demo-project.firebaseapp.com',
  projectId: 'demo-project',
  storageBucket: 'demo-project.appspot.com',
  messagingSenderId: '123456789',
  appId: 'demo-app-id'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
connectFirestoreEmulator(db, 'localhost', 8080);

const samplePosts = [
  {
    title: "Mi primer post en el blog",
    content: "Este es el contenido completo del primer post. Aquí escribiría sobre desarrollo, tecnología y proyectos personales. Este es un ejemplo de contenido más largo para demostrar el funcionamiento del blog.",
    excerpt: "Un post introductorio sobre el blog y mis objetivos.",
    tags: ["desarrollo", "personal", "blog"],
    isPublished: true,
    publishedAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Trabajando con Next.js y Firebase",
    content: "En este post explico cómo configuré este blog usando Next.js 15 y Firebase, incluyendo el desarrollo local con emuladores. Firebase proporciona una excelente infraestructura para aplicaciones web modernas.",
    excerpt: "Guía técnica sobre la implementación de este blog.",
    tags: ["nextjs", "firebase", "tutorial"],
    isPublished: true,
    publishedAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000)
  },
  {
    title: "Introducción a TypeScript",
    content: "TypeScript añade tipado estático a JavaScript, lo que ayuda a prevenir errores y mejorar la experiencia de desarrollo. En este post exploramos las características principales y mejores prácticas.",
    excerpt: "Aprende los fundamentos de TypeScript y cómo mejora tu código.",
    tags: ["typescript", "javascript", "tutorial"],
    isPublished: true,
    publishedAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000)
  }
];

const sampleProjects = [
  {
    title: "Portfolio Personal",
    description: "Mi sitio web personal con blog integrado",
    longDescription: "Un portafolio completo desarrollado con Next.js y Firebase, que incluye sistema de blog, gestión de proyectos y panel de administración. Utiliza Tailwind CSS para el diseño y está optimizado para SEO.",
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
    longDescription: "Una aplicación completa para gestionar tareas diarias con características como categorías, fechas límite y sincronización en la nube. Incluye autenticación de usuarios y almacenamiento persistente.",
    technologies: ["React", "Node.js", "MongoDB", "Express"],
    githubUrl: "https://github.com/usuario/task-app",
    featured: false,
    status: "completed" as const,
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000)
  },
  {
    title: "E-commerce Platform",
    description: "Plataforma de comercio electrónico full-stack",
    longDescription: "Sistema completo de comercio electrónico con carrito de compras, procesamiento de pagos, gestión de inventario y panel de administración. Incluye autenticación, autorización y sistema de búsqueda avanzada.",
    technologies: ["Next.js", "PostgreSQL", "Stripe", "Redis"],
    githubUrl: "https://github.com/usuario/ecommerce",
    liveUrl: "https://mystore.com",
    featured: true,
    status: "completed" as const,
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(Date.now() - 259200000)
  }
];

const seedData = async () => {
  console.log('🌱 Iniciando seed de datos locales...');

  try {
    for (const postData of samplePosts) {
      const post = {
        ...postData,
        slug: generateSlug(postData.title),
        readTime: calculateReadTime(postData.content)
      };
      const postId = await createPost(post);
      console.log(`✅ Post creado: ${post.title} (ID: ${postId})`);
    }

    for (const projectData of sampleProjects) {
      const project = {
        ...projectData,
        slug: generateSlug(projectData.title)
      };
      const projectId = await createProject(project);
      console.log(`✅ Proyecto creado: ${project.title} (ID: ${projectId})`);
    }

    console.log('🎉 Seed completado exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  }
};

seedData();