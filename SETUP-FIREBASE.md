# Guía de Configuración de Firebase Local

Esta guía te ayudará a configurar Firebase y los emuladores locales paso a paso.

## Requisitos Previos

- Node.js 18 o superior instalado
- pnpm instalado (o npm)
- Cuenta de Google para Firebase

## Paso 1: Instalar Firebase CLI

Instala Firebase CLI globalmente:

```bash
npm install -g firebase-tools
```

Verifica la instalación:

```bash
firebase --version
```

## Paso 2: Login en Firebase

Inicia sesión con tu cuenta de Google:

```bash
firebase login
```

Esto abrirá tu navegador para autenticarte.

## Paso 3: Crear Proyecto en Firebase Console (Opcional para desarrollo local)

Para desarrollo local con emuladores, puedes trabajar sin crear un proyecto real. Sin embargo, para producción necesitarás uno.

### Para Producción:
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Click en "Agregar proyecto" o "Add project"
3. Dale un nombre a tu proyecto (ej: "mi-portfolio")
4. Sigue los pasos del asistente
5. Una vez creado, ve a "Project Settings" (⚙️ > Configuración del proyecto)
6. En la sección "Tus aplicaciones", click en el ícono web (</>)
7. Registra tu app y copia las credenciales de configuración

## Paso 4: Configurar Variables de Entorno

### Para Desarrollo Local (Emuladores)

Crea el archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.example .env.local
```

Para **desarrollo local con emuladores**, puedes usar estas credenciales dummy:

```env
# Variables para desarrollo local con emuladores
NEXT_PUBLIC_FIREBASE_API_KEY=demo-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=demo-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=demo-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=demo-app-id

# Credenciales admin para desarrollo (opcional)
ADMIN_EMAIL=admin@test.com
ADMIN_PASSWORD=password123
```

### Para Producción

Edita `.env.local` con las credenciales reales de tu proyecto Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:...
```

## Paso 5: Inicializar Firebase en el Proyecto (Ya está hecho)

Este proyecto ya tiene los archivos de configuración de Firebase, pero si necesitas reinicializar:

```bash
firebase init
```

Selecciona:
- ✅ Firestore: Configurar reglas y índices
- ✅ Storage: Configurar reglas de Storage
- ✅ Emulators: Configurar emuladores

**IMPORTANTE**: Si ya tienes los archivos `firebase.json`, `firestore.rules`, etc., Firebase preguntará si quieres sobrescribirlos. Responde **NO** para mantener la configuración existente.

## Paso 6: Instalar Dependencias del Proyecto

```bash
pnpm install
```

## Paso 7: Iniciar los Emuladores de Firebase

Hay varias formas de iniciar el proyecto:

### Opción A: Todo en uno (Recomendado)

Inicia los emuladores Y Next.js simultáneamente:

```bash
pnpm run dev:full
```

### Opción B: Por separado

**Terminal 1** - Iniciar solo emuladores:
```bash
pnpm run dev:emulators
```

**Terminal 2** - Iniciar Next.js:
```bash
pnpm run dev
```

### Opción C: Solo Next.js (sin emuladores)

Si ya tienes un proyecto de Firebase en producción configurado:

```bash
pnpm run dev
```

## Paso 8: Verificar que los Emuladores Están Corriendo

Una vez iniciados los emuladores, verás algo como:

```
┌─────────────────────────────────────────────────────────────┐
│ ✔  All emulators ready! It is now safe to connect.         │
├─────────────────────────────────────────────────────────────┤
│ Emulator       │ Host:Port      │ View in Emulator UI      │
├────────────────┼────────────────┼──────────────────────────┤
│ Authentication │ localhost:9099 │ http://localhost:4000    │
│ Firestore      │ localhost:8080 │ http://localhost:4000    │
│ Storage        │ localhost:9199 │ http://localhost:4000    │
└─────────────────────────────────────────────────────────────┘
```

### URLs Importantes:

- **Next.js App**: http://localhost:3000
- **Firebase Emulator UI**: http://localhost:4000 (Interfaz visual para gestionar datos)
- **Firestore**: http://localhost:8080
- **Authentication**: http://localhost:9099
- **Storage**: http://localhost:9199

## Paso 9: Poblar Datos de Prueba

Con los emuladores corriendo, en otra terminal ejecuta:

```bash
pnpm run seed
```

Esto creará:
- ✅ 3 posts de ejemplo
- ✅ 3 proyectos de ejemplo

## Paso 10: Crear Usuario Admin

### Opción 1: Usando Firebase Emulator UI (Recomendado)

1. Ve a http://localhost:4000
2. Click en "Authentication" en el menú lateral
3. Click en "Add user"
4. Ingresa:
   - Email: `admin@test.com`
   - Password: `password123`
5. Click "Save"

### Opción 2: Desde la aplicación

1. Ve a http://localhost:3000/admin/login
2. Intenta hacer login (fallará la primera vez)
3. Ve al Emulator UI y crea el usuario manualmente
4. Vuelve a intentar el login

## Paso 11: Acceder al Panel de Administración

1. Ve a http://localhost:3000/admin/login
2. Ingresa las credenciales del admin:
   - Email: `admin@test.com`
   - Password: `password123`
3. Deberías ser redirigido a http://localhost:3000/admin

## Comandos Útiles

### Gestión de Datos

```bash
# Poblar datos de prueba
pnpm run seed

# Hacer backup de datos locales
pnpm run backup

# Exportar datos de emuladores
pnpm run emulators:export

# Importar datos en emuladores
pnpm run emulators:import
```

### Desarrollo

```bash
# Iniciar todo
pnpm run dev:full

# Solo emuladores
pnpm run dev:emulators

# Solo Next.js
pnpm run dev

# Build para producción
pnpm run build

# Iniciar en modo producción
pnpm run start
```

## Solución de Problemas

### Error: "Port already in use"

Si algún puerto está en uso, puedes:

1. Matar el proceso que usa ese puerto
2. O cambiar los puertos en `firebase.json`:

```json
{
  "emulators": {
    "firestore": { "port": 8080 },
    "auth": { "port": 9099 },
    "storage": { "port": 9199 },
    "ui": { "port": 4000 }
  }
}
```

### Error al conectar con emuladores

Verifica que:
1. Los emuladores estén corriendo
2. Los puertos en `firebase.json` coincidan con los de `lib/firebase.ts`
3. NODE_ENV está en 'development'

### No puedo hacer login como admin

En desarrollo local con emuladores:
1. Las reglas de seguridad son más permisivas
2. Los custom claims de admin no funcionan igual que en producción
3. Para pruebas locales, el usuario solo necesita existir en Auth

## Persistencia de Datos

Los emuladores **NO persisten datos** por defecto entre reinicios. Si quieres guardar datos:

### Exportar datos antes de cerrar:

```bash
pnpm run emulators:export
```

### Importar datos al iniciar:

```bash
pnpm run emulators:import
```

Esto guardará/cargará los datos en la carpeta `./backup`

## Deployment a Producción

Cuando estés listo para producción:

### 1. Configurar variables de entorno en Vercel/hosting

Usa las credenciales **reales** de Firebase (no las dummy).

### 2. Configurar reglas de Firestore y Storage

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage
```

### 3. Configurar Custom Claims para Admin

Necesitarás usar Firebase Admin SDK o Functions para asignar el rol admin:

```javascript
// Firebase Functions
admin.auth().setCustomUserClaims(uid, { admin: true });
```

### 4. Deploy de Next.js

```bash
# En Vercel
vercel --prod

# O build local
pnpm run build
```

## Estructura de Datos

### Posts Collection

```javascript
posts/
  {postId}/
    - title: string
    - slug: string
    - content: string
    - excerpt: string
    - coverImage: string (URL)
    - tags: array
    - isPublished: boolean
    - publishedAt: timestamp
    - updatedAt: timestamp
    - readTime: number
```

### Projects Collection

```javascript
projects/
  {projectId}/
    - title: string
    - slug: string
    - description: string
    - longDescription: string
    - technologies: array
    - githubUrl: string
    - liveUrl: string
    - images: array
    - featured: boolean
    - status: string (completed/in-progress/planned)
    - createdAt: timestamp
    - updatedAt: timestamp
```

## Recursos Adicionales

- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Next.js + Firebase](https://firebase.google.com/docs/web/setup)

## Soporte

Si encuentras problemas:
1. Revisa la consola del navegador (F12)
2. Revisa la terminal donde corren los emuladores
3. Verifica el Firebase Emulator UI en http://localhost:4000

---

¡Ahora estás listo para desarrollar tu portafolio con Firebase! 🚀