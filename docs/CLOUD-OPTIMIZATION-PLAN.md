# Plan de Optimización de Recursos Cloud

## Resumen

Este documento describe las mejoras planificadas para optimizar el consumo de recursos en Firebase y mejorar el rendimiento general de la aplicación.

---

## 1. Caché de Datos de Firestore

### 1.1 Implementar React Query / TanStack Query

**Problema**: Cada navegación hace una nueva petición a Firestore.

**Solución**: Usar TanStack Query para cachear datos en memoria.

```bash
npm install @tanstack/react-query
```

**Archivos a modificar**:
- `app/layout.tsx` - Añadir QueryClientProvider
- `lib/hooks/useProjects.ts` - Nuevo hook con cache
- `lib/hooks/usePosts.ts` - Nuevo hook con cache
- `lib/hooks/useCategories.ts` - Nuevo hook con cache

**Configuración recomendada**:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 30 * 60 * 1000,   // 30 minutos en cache
      refetchOnWindowFocus: false,
    },
  },
});
```

**Beneficios**:
- Reduce lecturas de Firestore en ~70%
- Navegación instantánea entre páginas
- Datos frescos cuando se necesitan

---

### 1.2 Firestore Offline Persistence

**Problema**: Sin conexión, la app no funciona.

**Solución**: Habilitar persistencia offline de Firestore.

**Archivo a modificar**: `lib/firebase.ts`

```typescript
import { enableIndexedDbPersistence } from 'firebase/firestore';

// Después de inicializar db
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('Persistence failed: multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.log('Persistence not available');
    }
  });
}
```

**Beneficios**:
- App funciona offline
- Menos lecturas al recargar
- Mejor experiencia de usuario

---

## 2. Optimización de Imágenes

### 2.1 Next.js Image Optimization

**Estado actual**: Las imágenes de Firebase Storage se cargan directamente.

**Mejora**: Configurar dominios en `next.config.js` para optimización automática.

**Archivo a modificar**: `next.config.ts`

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
    // Formatos modernos
    formats: ['image/avif', 'image/webp'],
    // Cache de imágenes por 1 año
    minimumCacheTTL: 31536000,
  },
};
```

**Beneficios**:
- Imágenes convertidas a WebP/AVIF automáticamente
- Tamaños optimizados para cada dispositivo
- Cache agresivo reduce descargas

---

### 2.2 Lazy Loading de Imágenes

**Archivo a modificar**: `components/portfolio-card.tsx`

```typescript
<Image
  src={image}
  alt={title}
  fill
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBD..."
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

**Beneficios**:
- Carga diferida de imágenes fuera de viewport
- Placeholder blur mientras carga
- Sizes correcto para responsive

---

### 2.3 Usar CDN para Imágenes (Cloudinary/Imgix)

**Problema**: Firebase Storage no tiene transformación de imágenes.

**Solución alternativa**: Migrar imágenes a Cloudinary (tier gratuito generoso).

**Beneficios**:
- Transformación on-the-fly (resize, crop, format)
- CDN global
- Tier gratuito: 25GB storage, 25GB bandwidth/mes

---

## 3. Reducir Lecturas de Firestore

### 3.1 Implementar Paginación

**Problema**: Se cargan todos los proyectos/posts de una vez.

**Solución**: Implementar paginación con cursor.

**Archivos a modificar**:
- `lib/firestore.ts` - Añadir funciones con paginación
- `app/[locale]/portfolio/page.tsx` - UI de paginación

```typescript
export const getProjectsPaginated = async (
  lastDoc: DocumentSnapshot | null,
  pageSize: number = 6
) => {
  let q = query(
    collection(db, 'projects'),
    where('isPublished', '==', true),
    orderBy('order', 'asc'),
    limit(pageSize)
  );

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snapshot = await getDocs(q);
  return {
    projects: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
    hasMore: snapshot.docs.length === pageSize,
  };
};
```

**Beneficios**:
- Reduce lecturas iniciales
- Carga bajo demanda
- Mejor rendimiento en listas grandes

---

### 3.2 Denormalización de Datos

**Problema**: Múltiples queries para obtener datos relacionados.

**Ejemplo**: Categorías se cargan separadamente de proyectos.

**Solución**: Guardar nombre de categoría directamente en proyecto.

```typescript
// En lugar de solo category: "desarrollo-web"
// Guardar también:
categoryName: "Desarrollo Web",
categoryEmoji: "💻",
```

**Beneficios**:
- Una sola lectura en lugar de dos
- Menos joins en cliente

---

## 4. Caché en el Servidor (ISR)

### 4.1 Incremental Static Regeneration

**Problema**: Páginas públicas se renderizan en cada request.

**Solución**: Usar ISR para páginas públicas.

**Archivos a modificar**:
- `app/[locale]/page.tsx` (Home)
- `app/[locale]/portfolio/page.tsx`
- `app/[locale]/portfolio/[slug]/page.tsx`

```typescript
// En cada page.tsx pública
export const revalidate = 3600; // Revalidar cada hora

// O usar generateStaticParams para SSG
export async function generateStaticParams() {
  const projects = await getProjects({ published: true });
  return projects.map((project) => ({
    slug: project.slug,
  }));
}
```

**Beneficios**:
- Páginas pre-renderizadas
- Reducción drástica de lecturas Firestore
- Mejor SEO y rendimiento

---

### 4.2 Route Handlers con Cache

**Archivo nuevo**: `app/api/projects/route.ts`

```typescript
import { NextResponse } from 'next/server';

export const revalidate = 3600; // 1 hora

export async function GET() {
  const projects = await getProjects({ published: true });
  return NextResponse.json(projects);
}
```

**Beneficios**:
- API cacheada en edge
- Reduce llamadas a Firestore

---

## 5. Optimización de Firebase Storage

### 5.1 Compresión de Imágenes antes de Subir

**Archivo a modificar**: `components/project-form.tsx`

```typescript
import imageCompression from 'browser-image-compression';

const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  return await imageCompression(file, options);
};
```

**Beneficios**:
- Reduce tamaño de almacenamiento
- Menor bandwidth de descarga
- Subidas más rápidas

---

### 5.2 Generar Thumbnails

**Solución**: Cloud Function que genera thumbnails automáticamente.

```typescript
// functions/src/generateThumbnail.ts
import * as functions from 'firebase-functions';
import * as sharp from 'sharp';

export const generateThumbnail = functions.storage
  .object()
  .onFinalize(async (object) => {
    // Generar thumbnail 400x300
    // Guardar en /thumbnails/
  });
```

**Beneficios**:
- Cargar thumbnails pequeños en listados
- Imagen completa solo en detalle

---

## 6. Monitoring y Alertas

### 6.1 Configurar Firebase Usage Alerts

1. Ir a Firebase Console → Usage and billing
2. Configurar alertas en:
   - Firestore reads > 10,000/día
   - Storage downloads > 1GB/día
   - Auth operations > 1,000/día

### 6.2 Implementar Analytics de Performance

**Archivo nuevo**: `lib/analytics.ts`

```typescript
import { getPerformance } from 'firebase/performance';

export const perf = typeof window !== 'undefined'
  ? getPerformance(app)
  : null;
```

**Beneficios**:
- Métricas de Core Web Vitals
- Identificar cuellos de botella

---

## 7. Resumen de Prioridades

| Prioridad | Mejora | Impacto | Esfuerzo |
|-----------|--------|---------|----------|
| 🔴 Alta | React Query (caché) | Alto | Medio |
| 🔴 Alta | ISR para páginas públicas | Alto | Bajo |
| 🟡 Media | Optimización de imágenes Next.js | Medio | Bajo |
| 🟡 Media | Compresión antes de subir | Medio | Bajo |
| 🟡 Media | Paginación | Medio | Medio |
| 🟢 Baja | Firestore offline persistence | Bajo | Bajo |
| 🟢 Baja | Cloud Functions thumbnails | Bajo | Alto |
| 🟢 Baja | Denormalización | Bajo | Medio |

---

## 8. Estimación de Ahorro

Con las mejoras de prioridad alta implementadas:

| Métrica | Antes | Después | Ahorro |
|---------|-------|---------|--------|
| Lecturas Firestore/día | ~5,000 | ~500 | 90% |
| Bandwidth Storage/mes | ~10GB | ~3GB | 70% |
| Tiempo carga inicial | ~2.5s | ~0.8s | 68% |

---

## 9. Próximos Pasos

1. [ ] Instalar y configurar TanStack Query
2. [ ] Configurar next.config.ts para imágenes
3. [ ] Añadir ISR a páginas públicas
4. [ ] Implementar compresión de imágenes
5. [ ] Configurar alertas de uso en Firebase
6. [ ] Implementar paginación en portfolio
7. [ ] Evaluar migración a Cloudinary (opcional)

---

*Documento creado: 2026-01-30*
*Última actualización: 2026-01-30*
