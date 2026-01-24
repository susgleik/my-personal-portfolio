# Documentación: Feature Avanzado de Portafolio

## Índice
1. [Resumen](#resumen)
2. [APIs de Traducción - Análisis Completo](#apis-de-traducción---análisis-completo)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Modelo de Datos](#modelo-de-datos)
5. [Flujos de Usuario](#flujos-de-usuario)
6. [Configuración Requerida](#configuración-requerida)
7. [Estructura de Archivos](#estructura-de-archivos)

---

## Resumen

Este feature transforma el portafolio actual (datos hardcodeados en el componente) en un sistema dinámico completo con:

- **Panel Admin**: CRUD completo de proyectos con editor Markdown
- **Rutas Dinámicas**: `/portfolio/[slug]` para cada proyecto
- **Traducción Automática**: Español → Inglés usando Google Cloud Translation API
- **Nuevo Diseño**: Tarjetas grandes (1 por fila) con descripción visible
- **Firebase Integration**: Firestore (datos), Storage (imágenes), Auth (admin)

---

## APIs de Traducción - Análisis Completo

### Comparativa de Opciones

| Característica | Google Translate | DeepL | Microsoft Translator |
|----------------|------------------|-------|----------------------|
| **Free Tier** | 500K chars/mes | 500K chars/mes | 2M chars/mes |
| **Permanente** | ✅ Sí | ✅ Sí | ✅ Sí |
| **Costo Pagado** | $20/millón chars | $5.49/mes + $25/millón chars | $10/millón chars |
| **Idiomas** | 130+ | ~30 (europeos) | 100+ |
| **Calidad ES→EN** | Buena | Excelente | Buena |

### Decisión: Google Cloud Translation API

**Razones de la elección:**

1. **Costo $0 para uso típico**
   - Free tier: 500,000 caracteres/mes (permanente)
   - Portafolio típico: ~50,000 chars/mes (muy por debajo)

2. **Cálculo de uso estimado:**
   ```
   Por proyecto:
   - Título: ~50 caracteres
   - Descripción: ~200 caracteres
   - Contenido: ~2,000 caracteres
   - Total: ~2,250 caracteres

   Con 20 proyectos:
   - Traducción inicial: 45,000 caracteres
   - Margen restante: 455,000 caracteres (90%)
   ```

3. **Si se excede el límite:**
   - Costo: $20 por cada millón adicional
   - Para exceder necesitarías: ~220 proyectos nuevos por mes

### Precios Detallados

#### Google Cloud Translation API
- **Basic (v2)**: $20/millón de caracteres
- **Advanced (v3)**: $20/millón de caracteres
  - Incluye: glossarios, traducción batch, documentos

#### DeepL API
- **Free**: 500K chars/mes
- **Pro**: $5.49/mes base + $25/millón chars
- **Ventaja**: Mejor calidad en idiomas europeos
- **Desventaja**: Más caro a largo plazo

#### Microsoft Translator
- **Free**: 2M chars/mes (el más generoso)
- **Pagado**: $10/millón chars (el más barato)
- **Desventaja**: Requiere cuenta Azure

### Fuentes
- [Google Translate API Pricing](https://costgoat.com/pricing/google-translate)
- [DeepL vs Google Comparison](https://taia.io/resources/blog/deepl-vs-google-translate-vs-microsoft-translator-2025/)
- [Translation API Price Comparison](https://www.machinetranslation.com/blog/price-comparison-of-popular-machine-translation-apis)

---

## Arquitectura del Sistema

### Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN FLOW                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Admin → /admin/projects/new                                     │
│     │                                                            │
│     ▼                                                            │
│  ┌─────────────────────────────────────────┐                    │
│  │  Formulario de Proyecto                  │                    │
│  │  - Título (ES)                           │                    │
│  │  - Descripción corta (ES)                │                    │
│  │  - Contenido Markdown (ES)               │                    │
│  │  - Thumbnail + Imágenes                  │                    │
│  │  - Categoría, tecnologías, links         │                    │
│  └─────────────────────────────────────────┘                    │
│     │                                                            │
│     ▼ [Guardar]                                                  │
│  ┌─────────────────────────────────────────┐                    │
│  │  1. Subir imágenes a Firebase Storage    │                    │
│  │  2. Traducir campos con Google API       │                    │
│  │  3. Guardar en Firestore                 │                    │
│  └─────────────────────────────────────────┘                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       VISITOR FLOW                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Visitante → Home (scroll a #portfolio)                          │
│     │                                                            │
│     ▼                                                            │
│  ┌─────────────────────────────────────────┐                    │
│  │  Sección Portafolio (Home)               │                    │
│  │  - 5 proyectos destacados                │                    │
│  │  - Diseño: 1 por fila (grande)           │                    │
│  │  - Thumbnail + descripción visible       │                    │
│  │  - Botón "Ver más portafolio"            │                    │
│  └─────────────────────────────────────────┘                    │
│     │                                                            │
│     ├─── [Click en proyecto] ──▶ /portfolio/[slug]              │
│     │                                                            │
│     └─── [Ver más] ──▶ /portfolio (lista completa)              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Stack Tecnológico

| Capa | Tecnología | Uso |
|------|------------|-----|
| Frontend | Next.js 15 (App Router) | SSR, rutas dinámicas |
| UI | Tailwind CSS + Radix UI | Estilos y componentes |
| Base de datos | Firebase Firestore | Almacenamiento de proyectos |
| Archivos | Firebase Storage | Imágenes de proyectos |
| Auth | Firebase Auth | Protección de admin |
| i18n | next-intl | Internacionalización |
| Traducción | Google Cloud Translation | ES → EN automático |

---

## Modelo de Datos

### Interface Project (TypeScript)

```typescript
export interface Project {
  id: string;

  // Contenido en español (original)
  title: string;
  description: string;        // Resumen para tarjeta (~200 chars)
  content: string;            // Contenido completo (Markdown)

  // Contenido traducido (automático)
  title_en?: string;
  description_en?: string;
  content_en?: string;

  // Identificación
  slug: string;               // URL-friendly: "mi-proyecto"

  // Multimedia
  thumbnail: string;          // URL imagen principal
  images: string[];           // URLs galería adicional

  // Clasificación
  category: 'product' | 'marketing';
  technologies: string[];     // ["React", "Firebase", "TypeScript"]

  // Enlaces externos
  liveUrl?: string;           // Demo en vivo
  githubUrl?: string;         // Repositorio
  mediumUrl?: string;         // Artículo relacionado

  // Estado y visibilidad
  featured: boolean;          // Mostrar en home
  isPublished: boolean;       // Visible públicamente
  status: 'completed' | 'in-progress' | 'planned';
  order: number;              // Orden manual de aparición

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### Estructura Firestore

```
firestore/
└── projects/
    └── {projectId}/
        ├── title: "Trebly"
        ├── title_en: "Trebly"
        ├── description: "Plataforma de loterías..."
        ├── description_en: "Lottery platform..."
        ├── content: "## Descripción\n..."
        ├── content_en: "## Description\n..."
        ├── slug: "trebly"
        ├── thumbnail: "https://storage.../trebly.png"
        ├── images: ["url1", "url2"]
        ├── category: "product"
        ├── technologies: ["React", "Solidity"]
        ├── featured: true
        ├── isPublished: true
        ├── status: "completed"
        ├── order: 1
        ├── createdAt: Timestamp
        └── updatedAt: Timestamp
```

---

## Flujos de Usuario

### 1. Visitante - Ver Portafolio en Home

1. Usuario navega a la página principal
2. Hace click en "Portafolio" en el nav
3. Se desplaza a la sección `#portfolio`
4. Ve 5 proyectos destacados en formato grande (1 por fila)
5. Cada tarjeta muestra: thumbnail, título, descripción corta
6. Click en tarjeta → navega a `/portfolio/[slug]`
7. Click en "Ver más" → navega a `/portfolio`

### 2. Visitante - Ver Proyecto Individual

1. Usuario llega a `/portfolio/trebly`
2. Se carga el proyecto desde Firestore por slug
3. Se muestra según el locale actual (ES o EN)
4. Contenido incluye:
   - Título y descripción
   - Galería de imágenes
   - Contenido Markdown renderizado
   - Tecnologías usadas
   - Links a demo/github/medium
5. Navegación para volver a `/portfolio`

### 3. Visitante - Ver Todos los Proyectos

1. Usuario navega a `/portfolio`
2. Se cargan todos los proyectos publicados
3. Filtros por categoría (Product Design / Marketing)
4. Grid de proyectos con paginación o infinite scroll
5. Click en proyecto → `/portfolio/[slug]`

### 4. Admin - Crear Proyecto

1. Admin navega a `/admin/projects/new`
2. Completa el formulario:
   - Título (español)
   - Descripción corta (español)
   - Contenido Markdown (español)
   - Sube thumbnail e imágenes
   - Selecciona categoría y tecnologías
   - Agrega links opcionales
3. Click en "Guardar"
4. Sistema:
   - Sube imágenes a Firebase Storage
   - Traduce campos con Google Translate API
   - Guarda todo en Firestore
5. Redirige a lista de proyectos

### 5. Admin - Editar Proyecto

1. Admin navega a `/admin/projects`
2. Click en "Editar" en un proyecto
3. Se carga el formulario con datos existentes
4. Modifica campos necesarios
5. Click en "Actualizar"
6. Sistema re-traduce si hubo cambios en español
7. Actualiza en Firestore

---

## Configuración Requerida

### Variables de Entorno

```env
# Firebase (ya configurado)
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx

# Google Cloud Translation API (NUEVO)
GOOGLE_CLOUD_API_KEY=tu-api-key
# O alternativamente con service account:
# GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```

### Pasos para Configurar Google Translate API

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear proyecto o usar existente
3. Habilitar "Cloud Translation API"
4. Crear API Key o Service Account
5. Agregar la key a `.env.local`

### Reglas de Firestore (actualizar)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Proyectos: lectura pública, escritura solo admin
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null &&
                   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

### Reglas de Storage (actualizar)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Imágenes de proyectos
    match /images/projects/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## Estructura de Archivos

### Archivos Nuevos a Crear

```
app/
├── [locale]/
│   └── portfolio/
│       ├── page.tsx                    # Lista completa de proyectos
│       └── [slug]/
│           └── page.tsx                # Detalle de proyecto
├── admin/
│   └── projects/
│       ├── new/
│       │   └── page.tsx                # Crear proyecto
│       └── edit/
│           └── [id]/
│               └── page.tsx            # Editar proyecto

components/
├── portfolio-card.tsx                  # Tarjeta de proyecto (home + lista)
├── portfolio-detail.tsx                # Vista completa del proyecto
├── project-form.tsx                    # Formulario admin reutilizable
└── markdown-editor.tsx                 # Editor con preview

lib/
└── translate.ts                        # Integración Google Translate

docs/
└── PORTFOLIO_FEATURE.md                # Este archivo
```

### Archivos a Modificar

| Archivo | Cambios |
|---------|---------|
| `types/index.ts` | Actualizar interface Project |
| `lib/firestore.ts` | Agregar queries de proyectos |
| `components/portfolio-section.tsx` | Usar Firebase, nuevo diseño |
| `messages/es.json` | Agregar traducciones de UI |
| `messages/en.json` | Agregar traducciones de UI |
| `firestore.rules` | Reglas para proyectos |
| `storage.rules` | Reglas para imágenes |

---

## Notas Adicionales

### Migración de Datos Existentes

Los 20 proyectos actualmente hardcodeados en `portfolio-section.tsx` deberán migrarse a Firebase. Se creará un script de migración que:

1. Lee los datos hardcodeados
2. Descarga las imágenes de `/public/images/portfolio/`
3. Sube las imágenes a Firebase Storage
4. Crea los documentos en Firestore
5. Traduce automáticamente al inglés

### Consideraciones de SEO

- Las rutas `/portfolio/[slug]` tendrán metadata dinámica
- Se generará sitemap dinámico con todos los proyectos
- Open Graph tags para compartir en redes sociales

### Performance

- Imágenes optimizadas con Next.js Image
- ISR (Incremental Static Regeneration) para páginas de proyectos
- Lazy loading de imágenes en galería

---

## Archivos Creados (Implementación Completada)

### Nuevos Archivos

| Archivo | Descripción |
|---------|-------------|
| `lib/translate.ts` | Servicio de traducción con Google Cloud Translation API |
| `components/project-form.tsx` | Formulario reutilizable para crear/editar proyectos |
| `components/portfolio-card.tsx` | Componente de tarjeta de proyecto (variantes: default y large) |
| `app/admin/projects/new/page.tsx` | Página para crear nuevo proyecto |
| `app/admin/projects/edit/[id]/page.tsx` | Página para editar proyecto existente |
| `app/[locale]/portfolio/page.tsx` | Página con lista completa de proyectos |
| `app/[locale]/portfolio/[slug]/page.tsx` | Página de detalle de proyecto individual |

### Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `types/index.ts` | Nuevo modelo Project con campos i18n y nuevos campos |
| `lib/firestore.ts` | Nuevas funciones: `getProjectsByCategory`, `getPublishedProjects`, `getFeaturedProjects` |
| `components/portfolio-section.tsx` | Usa Firebase, nuevo diseño con tarjetas grandes |
| `messages/es.json` | Nuevas claves de traducción para portafolio |
| `messages/en.json` | Nuevas claves de traducción para portafolio |
| `firestore.indexes.json` | Índices compuestos para queries de proyectos |

---

## Pasos para Usar el Feature

### 1. Configurar Google Cloud Translation API

```bash
# Agregar a .env.local
GOOGLE_CLOUD_API_KEY=tu-api-key-aqui
```

**Obtener API Key:**
1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear o seleccionar proyecto
3. Buscar "Cloud Translation API" y habilitarla
4. Ir a "APIs & Services" → "Credentials"
5. Click "Create Credentials" → "API Key"
6. Copiar la key generada

### 2. Desplegar Índices de Firestore

```bash
firebase deploy --only firestore:indexes
```

### 3. Crear Proyectos desde el Admin

1. Navegar a `/admin/projects/new`
2. Llenar el formulario en español
3. Al guardar, el sistema traduce automáticamente al inglés
4. Los proyectos aparecen en `/portfolio` y en la sección de home

### 4. Verificar Funcionamiento

- Home (`/`) → Sección portafolio muestra proyectos de Firebase
- `/portfolio` → Lista completa con filtros por categoría
- `/portfolio/[slug]` → Detalle del proyecto
- Cambiar idioma (ES/EN) → Contenido se muestra traducido

---

## Notas Importantes

### Traducción Automática

- **Solo se traduce una vez** al crear/editar proyecto
- Los campos traducidos se guardan en Firestore (`title_en`, `description_en`, `content_en`)
- Si la API no está configurada, se usa el texto original en español
- Costo estimado: $0/mes para uso normal (500K chars gratis)

### Internacionalización

- **UI estática**: Usa `next-intl` con archivos `messages/*.json`
- **Proyectos dinámicos**: Campos `_en` en Firestore, seleccionados según `locale`

### Fallback

Si no hay proyectos en Firebase, la sección de portafolio muestra un mensaje indicando que no hay proyectos disponibles.