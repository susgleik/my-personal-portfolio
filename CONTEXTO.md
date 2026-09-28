# CONTEXTO del Proyecto

Este archivo es la referencia profunda del estado **real y actual** del código (a diferencia de `docs/context.md`, que es un documento de planeación inicial ya desactualizado — no lo uses como fuente de verdad).

## Qué es

Portafolio personal con blog tipo Medium y gestión de proyectos.

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **i18n**: `next-intl` — rutas públicas bajo `app/[locale]/` (es/en), configuradas en `i18n/routing.ts` y `i18n/request.ts`, con `middleware.ts` enrutando `/`, `/(es|en)/:path*` y excluyendo `_next`, `_vercel`, `api` y `admin`.
- **Backend**: Firebase (Firestore, Auth, Storage), vía SDK cliente (`lib/firebase.ts`)
- **Estilos**: Tailwind CSS v4 + Radix UI
- **Formularios**: React Hook Form + Zod
- **Traducción automática**: Google Cloud Translation API v2, llamada desde `app/api/translate/route.ts` (la API key nunca se expone al cliente)
- **Hosting**: Vercel
- **Package manager**: pnpm (ver `packageManager` en `package.json`)

## Estructura real (no la de docs/context.md)

```
app/
├── [locale]/                # Rutas públicas localizadas (es/en) vía next-intl
│   ├── layout.tsx
│   ├── page.tsx              # Home
│   └── portfolio/
│       ├── page.tsx           # Lista de proyectos
│       └── [slug]/page.tsx    # Detalle de proyecto
├── admin/                    # Panel admin — NO localizado, fuera del middleware de next-intl
│   ├── login/
│   ├── posts/
│   ├── projects/
│   │   ├── new/
│   │   └── edit/[id]/
│   └── categories/
└── api/
    ├── translate/route.ts     # Proxy server-side a Google Translate
    ├── projects/route.ts
    ├── projects/[slug]/route.ts
    ├── categories/route.ts
    └── medium-posts/route.ts

lib/
├── firebase.ts        # Init de Firebase + conexión a emuladores en dev
├── firestore.ts        # CRUD de posts/projects/categories (usa updateDoc — ver Gotchas)
├── auth.ts             # loginWithEmail, logout, checkIsAdmin
├── storage.ts          # upload/delete de imágenes en Firebase Storage
├── translate.ts        # Cliente que llama a /api/translate
└── utils.ts

components/
├── project-form.tsx     # Form de crear/editar proyecto (admin)
├── portfolio-card.tsx   # Tarjeta pública de proyecto
├── hero-section.tsx     # Sección hero del home
└── ui/                  # Componentes Radix

hooks/
├── useAuth.ts
├── useFirestore.ts
├── use-mobile.ts
└── use-scroll-animation.tsx
```

## Autenticación / Admin

- `lib/auth.ts` → `checkIsAdmin()` decide admin por **lista hardcodeada de emails** (`admin@test.com`, `admin@example.com`, `angelhernades26@gmail.com`) **o** por custom claim `admin` en el token. No hay un sistema de roles en Firestore.
- Para producción real, lo correcto es migrar completamente a custom claims (`admin.auth().setCustomUserClaims`) y quitar la lista hardcodeada, pero hoy coexisten ambos mecanismos.

## Reglas de seguridad — estado actual (IMPORTANTE)

`firestore.rules` y `storage.rules` actualmente permiten escritura a **cualquier usuario autenticado**, no solo admins:

```
allow write: if request.auth != null;
```

Los comentarios en el propio archivo dicen explícitamente "En producción: cambiar a `request.auth.token.admin == true`". Esto **no se ha hecho todavía** — es una tarea pendiente, no un bug del código de la app.

## Modelo de datos: `Project` (types/index.ts)

Campos relevantes para el flujo de guardado:
- `title`, `description`, `content` (español, obligatorios)
- `title_en`, `description_en`, `content_en` (inglés, generados automáticamente al guardar)
- `category?`, `liveUrl?`, `githubUrl?`, `mediumUrl?` — **todos opcionales**, se guardan siempre como string (posiblemente `''`) desde el fix de octubre 2025, nunca se omiten del payload (ver Gotchas)
- `thumbnail`, `images[]` — URLs de Firebase Storage
- `featured` — se calcula automáticamente (`order < 5`), no lo edita el usuario
- `isPublished`, `status`, `order`

## Gotcha conocido y ya corregido: `updateDoc` hace merge parcial

`lib/firestore.ts` → `updateProject()` usa `updateDoc()`, que en Firestore **solo modifica las claves presentes en el objeto que le pasas** — si una clave no está, el valor existente en el documento **no se toca**.

`components/project-form.tsx` originalmente construía el payload así:

```ts
...(data.liveUrl && { liveUrl: data.liveUrl })
```

Si el usuario borraba el campo (quedaba `''`, falsy), la clave se omitía del todo del payload, así que `updateDoc` nunca limpiaba el campo en Firestore — el link viejo quedaba para siempre aunque el formulario se guardara vacío. Mismo problema afectaba a `category`, `githubUrl`, `mediumUrl`.

**Fix aplicado**: esos 4 campos ahora siempre se incluyen explícitamente (`data.campo || ''`).

**Regla general para el futuro**: cualquier campo opcional de un formulario de edición que use `updateDoc` debe escribirse siempre explícitamente (aunque sea `''`), nunca omitirse condicionalmente — de lo contrario "borrar" un campo en la UI no lo borra en Firestore.

## Traducción y Markdown

`app/api/translate/route.ts` traduce `content` (Markdown) protegiendo la sintaxis antes de mandarla a Google Translate y restaurándola después (`protectMarkdown` / `restoreMarkdown`):
- Code blocks con lenguaje (```python) → protegidos completos
- Fences sin lenguaje (``` solo) → solo el marcador se protege, el contenido se traduce
- Tablas → separadores protegidos, celdas traducidas (pipes reemplazados por `[[P]]` para no romper el parseo)
- Blockquotes (`>`) → marcador reemplazado por `[[BQ]]`, contenido traducido
- Inline code (`` `code` ``) → protegido completo

Esto se agregó porque Google Translate rompía la sintaxis Markdown al traducir texto plano sin protección (ver commit `90728f9`).

## Desarrollo local

```bash
pnpm install
cp .env.example .env.local   # completar credenciales de Firebase + GOOGLE_CLOUD_API_KEY
pnpm run dev:full             # emuladores + Next.js
```

- App: http://localhost:3000
- Firebase Emulator UI: http://localhost:4000 (Firestore :8080, Auth :9099, Storage :9199)
- También existe soporte Docker (`pnpm run docker:up`, ver `docs/DOCKER-SETUP.md`)

## Docs relacionados (revisar si hace falta más detalle)

- `docs/SETUP-FIREBASE.md`, `docs/TROUBLESHOOTING.md`, `docs/QUICK-FIX.md`, `docs/PORTFOLIO_FEATURE.md`, `docs/MIGRATION_I18N.md`, `docs/CLOUD-OPTIMIZATION-PLAN.md`
- `docs/context.md` está **desactualizado** (describe una estructura de proyecto antigua sin i18n, sin categorías, sin traducción automática) — no confiar en él para el estado actual.

## Reglas de trabajo en este proyecto

Ver [`CLAUDE.md`](CLAUDE.md) para las reglas de cómo se deben preparar commits en este repo.
