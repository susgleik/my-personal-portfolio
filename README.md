# Portafolio Personal con Next.js 15 y Firebase

Portafolio web profesional con sistema de blog tipo Medium y gestión de proyectos, desarrollado con Next.js 15, Firebase y Tailwind CSS.

## Características

- Sistema de blog con soporte para Markdown
- Gestión de proyectos con portafolio
- Panel de administración completo
- Autenticación con Firebase Auth
- Base de datos Firestore
- Almacenamiento de imágenes con Firebase Storage
- Desarrollo local con Firebase Emulators
- TypeScript para type safety
- Diseño responsive con Tailwind CSS

## Stack Tecnológico

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Estilos**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Formularios**: React Hook Form + Zod
- **Hosting**: Vercel

## Requisitos Previos

- Node.js 18+ instalado
- pnpm (recomendado) o npm
- Firebase CLI: `npm install -g firebase-tools`
- Cuenta de Firebase (para producción)

## Instalación

### 1. Clonar e instalar dependencias

\`\`\`bash
cd personal-portfolio-website
pnpm install
\`\`\`

### 2. Configurar Variables de Entorno

Copia el archivo de ejemplo y completa con tus credenciales de Firebase:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edita `.env.local` con tus credenciales de Firebase:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
\`\`\`

### 3. Inicializar Firebase (opcional si ya está configurado)

\`\`\`bash
firebase login
firebase init
\`\`\`

Selecciona:
- Firestore
- Storage
- Emulators

## Desarrollo Local

### Opción 1: Desarrollo completo con emuladores

\`\`\`bash
pnpm run dev:full
\`\`\`

Esto iniciará:
- Firebase Emulators (Firestore, Auth, Storage)
- Next.js en modo desarrollo

### Opción 2: Iniciar por separado

Terminal 1 - Emuladores:
\`\`\`bash
pnpm run dev:emulators
\`\`\`

Terminal 2 - Next.js:
\`\`\`bash
pnpm run dev
\`\`\`

### URLs de Desarrollo

- **Aplicación**: http://localhost:3000
- **Firebase Emulator UI**: http://localhost:4000
- **Firestore Emulator**: http://localhost:8080
- **Auth Emulator**: http://localhost:9099
- **Storage Emulator**: http://localhost:9199

## Poblar Datos de Prueba

Para agregar datos de ejemplo en el emulador local:

\`\`\`bash
# Asegúrate de que los emuladores estén corriendo
pnpm run seed
\`\`\`

Esto creará:
- 3 posts de ejemplo
- 3 proyectos de ejemplo

## Estructura del Proyecto

\`\`\`
personal-portfolio-website/
├── app/                          # Next.js App Router
│   ├── admin/                    # Panel de administración
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard
│   │   ├── login/                # Login admin
│   │   ├── posts/                # Gestión de posts
│   │   └── projects/             # Gestión de proyectos
│   ├── blog/                     # Blog público
│   └── projects/                 # Proyectos públicos
├── components/                   # Componentes React
│   ├── ui/                       # Componentes UI (Radix)
│   └── ...                       # Otros componentes
├── lib/                          # Utilidades y configuración
│   ├── firebase.ts               # Config de Firebase
│   ├── firestore.ts              # Funciones de Firestore
│   ├── auth.ts                   # Funciones de Auth
│   └── storage.ts                # Funciones de Storage
├── hooks/                        # Custom React Hooks
│   ├── useAuth.ts
│   └── useFirestore.ts
├── types/                        # Tipos TypeScript
│   └── index.ts
├── scripts/                      # Scripts de utilidad
│   ├── seed-local.ts             # Seed de datos
│   └── backup-data.ts            # Backup de datos
├── firebase.json                 # Config Firebase
├── firestore.rules               # Reglas Firestore
├── storage.rules                 # Reglas Storage
└── .env.local                    # Variables de entorno
\`\`\`

## Autenticación Admin

### Desarrollo Local

1. Inicia los emuladores
2. Ve a Firebase Emulator UI: http://localhost:4000
3. En la sección "Authentication", crea un nuevo usuario
4. Usa ese email/password para login en `/admin/login`

**Nota**: En desarrollo local con emuladores, las reglas de admin no se aplican estrictamente. Para producción, necesitas configurar custom claims.

### Producción

Para dar permisos de admin a un usuario en producción, necesitas usar Firebase Admin SDK o la consola de Firebase:

\`\`\`javascript
// Usando Firebase Admin SDK
admin.auth().setCustomUserClaims(uid, { admin: true });
\`\`\`

## Scripts Disponibles

\`\`\`bash
# Desarrollo
pnpm run dev                 # Solo Next.js
pnpm run dev:emulators       # Solo emuladores
pnpm run dev:full            # Next.js + Emuladores

# Build y producción
pnpm run build               # Build para producción
pnpm run start               # Iniciar en producción

# Utilidades
pnpm run seed                # Poblar datos de prueba
pnpm run backup              # Backup de datos locales
pnpm run lint                # Ejecutar ESLint

# Emuladores
pnpm run emulators:export    # Exportar datos de emuladores
pnpm run emulators:import    # Importar datos en emuladores
\`\`\`

## Rutas Principales

### Públicas
- `/` - Homepage
- `/blog` - Lista de posts
- `/blog/[slug]` - Post individual
- `/projects` - Lista de proyectos
- `/projects/[slug]` - Proyecto individual

### Admin (requiere autenticación)
- `/admin` - Dashboard
- `/admin/login` - Login
- `/admin/posts` - Lista de posts
- `/admin/posts/new` - Crear post
- `/admin/posts/edit/[id]` - Editar post
- `/admin/projects` - Lista de proyectos
- `/admin/projects/new` - Crear proyecto
- `/admin/projects/edit/[id]` - Editar proyecto

## Despliegue

### Vercel (Recomendado para Next.js)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel
3. Despliega

### Firebase Hosting

1. Build del proyecto:
\`\`\`bash
pnpm run build
\`\`\`

2. Deploy a Firebase:
\`\`\`bash
firebase deploy
\`\`\`

## Próximos Pasos

Para completar el proyecto, considera:

1. **Crear páginas públicas**:
   - Página de blog (`/blog`)
   - Página de proyectos (`/projects`)
   - Páginas individuales de posts y proyectos

2. **Componentes de formularios**:
   - `PostForm.tsx` para crear/editar posts
   - `ProjectForm.tsx` para crear/editar proyectos
   - Integración con upload de imágenes

3. **Mejorar el diseño**:
   - Personalizar componentes existentes
   - Agregar animaciones
   - Optimizar responsive design

4. **SEO y Performance**:
   - Metadata para cada página
   - Optimización de imágenes
   - Sitemap dinámico

5. **Testing**:
   - Tests unitarios
   - Tests de integración
   - Tests E2E

## Soporte

Para más información, revisa:
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Firebase](https://firebase.google.com/docs)
- [Guía de Firebase Emulators](https://firebase.google.com/docs/emulator-suite)

## Licencia

MIT