# Firebase Emulators con Docker 🐳

Esta guía te permite usar Firebase Emulators con Docker, **sin necesidad de instalar Java localmente**. Similar a como usas Supabase local con Docker.

## Ventajas de usar Docker

✅ No necesitas instalar Java en tu máquina
✅ Entorno aislado y reproducible
✅ Fácil de compartir con tu equipo
✅ Similar al workflow de Supabase local
✅ Fácil de limpiar y reiniciar

## Requisitos Previos

- Docker Desktop instalado y corriendo
- Node.js y pnpm instalados (solo para Next.js)

Si no tienes Docker:
- **Windows/Mac**: Descarga [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: `sudo apt install docker.io docker-compose` o equivalente

## Configuración Inicial

### Paso 1: Copiar Variables de Entorno

```bash
Copy-Item .env.example .env.local
```

El archivo `.env.local` ya tiene configuración para desarrollo local. No necesitas cambiar nada.

### Paso 2: Construir la Imagen de Docker

```bash
docker-compose build
```

Esto creará una imagen con Node.js, Java 21 y Firebase CLI.

## Uso Diario

### Opción A: Todo en Uno (Recomendado) 🚀

Inicia los emuladores en Docker Y Next.js en un solo comando:

```bash
pnpm run dev:docker
```

Esto hace:
1. Levanta los emuladores de Firebase en Docker (background)
2. Inicia Next.js en tu máquina local

### Opción B: Control Manual

**Terminal 1** - Levantar solo los emuladores:
```bash
pnpm run docker:up
```

**Terminal 2** - Iniciar Next.js:
```bash
pnpm run dev
```

## Comandos Disponibles

```bash
# Levantar emuladores (en background)
pnpm run docker:up

# Bajar emuladores
pnpm run docker:down

# Ver logs de los emuladores
pnpm run docker:logs

# Reconstruir imagen (si cambias configuración)
pnpm run docker:rebuild

# Iniciar todo (emuladores + Next.js)
pnpm run dev:docker
```

## Comandos Docker Directos

Si prefieres usar Docker directamente:

```bash
# Levantar
docker-compose up -d

# Bajar
docker-compose down

# Ver logs
docker-compose logs -f firebase-emulators

# Ver estado
docker-compose ps

# Reiniciar
docker-compose restart

# Eliminar completamente (incluye volúmenes)
docker-compose down -v
```

## Verificar que Funciona

Una vez iniciado (`pnpm run docker:up`), verifica:

```bash
# Ver logs
pnpm run docker:logs
```

Deberías ver:

```
✔  All emulators ready! It is now safe to connect.
┌─────────────────────────────────────────────────────────────┐
│ Emulator       │ Host:Port      │ View in Emulator UI      │
├────────────────┼────────────────┼──────────────────────────┤
│ Authentication │ 0.0.0.0:9099   │ http://localhost:4000    │
│ Firestore      │ 0.0.0.0:8080   │ http://localhost:4000    │
│ Storage        │ 0.0.0.0:9199   │ http://localhost:4000    │
└─────────────────────────────────────────────────────────────┘
```

### URLs Importantes

- **Next.js App**: http://localhost:3000
- **Firebase Emulator UI**: http://localhost:4000
- **Firestore Emulator**: http://localhost:8080
- **Auth Emulator**: http://localhost:9099
- **Storage Emulator**: http://localhost:9199

## Poblar Datos de Prueba

Con los emuladores corriendo en Docker:

```bash
pnpm run seed
```

Esto crea:
- ✅ 3 posts de ejemplo
- ✅ 3 proyectos de ejemplo

## Crear Usuario Admin

### Opción 1: Desde Firebase Emulator UI

1. Ve a http://localhost:4000
2. Click en "Authentication"
3. Click en "Add user"
4. Ingresa:
   - **Email**: `admin@test.com`
   - **Password**: `password123`
5. Click "Save"

### Opción 2: Programáticamente

Puedes agregar código en `scripts/seed-local.ts` para crear el usuario automáticamente.

## Estructura de Archivos Docker

```
.
├── docker-compose.yml        # Orquestación de servicios
├── Dockerfile.emulators      # Imagen de emuladores
├── firebase.json             # Config de Firebase (copiada al contenedor)
├── firestore.rules           # Reglas de Firestore (copiada al contenedor)
├── firestore.indexes.json    # Índices (copiados al contenedor)
├── storage.rules             # Reglas de Storage (copiadas al contenedor)
└── backup/                   # Persistencia de datos (montado como volumen)
```

## Persistencia de Datos

Los datos en los emuladores **NO persisten** por defecto. Para guardar datos:

### Exportar desde contenedor:

```bash
docker-compose exec firebase-emulators firebase emulators:export /app/backup
```

### Importar al iniciar:

Modifica `docker-compose.yml`:

```yaml
services:
  firebase-emulators:
    command: ["firebase", "emulators:start", "--project", "demo-project", "--import", "/app/backup"]
```

O crea un nuevo archivo `docker-compose.import.yml`:

```yaml
services:
  firebase-emulators:
    extends:
      file: docker-compose.yml
      service: firebase-emulators
    command: ["firebase", "emulators:start", "--project", "demo-project", "--import", "/app/backup"]
```

Y úsalo:
```bash
docker-compose -f docker-compose.import.yml up -d
```

## Solución de Problemas

### Puerto en uso

Si ves `port is already allocated`:

```bash
# Detener todos los contenedores
docker-compose down

# O encontrar qué está usando el puerto
netstat -ano | findstr :4000
```

### Contenedor no inicia

Verifica los logs:

```bash
pnpm run docker:logs
```

### Reinicio limpio

```bash
# Detener y eliminar todo (incluidos volúmenes)
docker-compose down -v

# Reconstruir desde cero
pnpm run docker:rebuild
```

### No puedo conectarme desde Next.js

Verifica que `.env.local` exista con las variables correctas. Los emuladores deben ser accesibles en `localhost` desde tu máquina host.

### Ver procesos de Docker

```bash
docker ps
```

Deberías ver `portfolio-firebase-emulators` corriendo.

## Comparación: Docker vs Local

| Aspecto | Docker 🐳 | Local ☕ |
|---------|-----------|---------|
| Instalar Java | ❌ No necesario | ✅ Requerido (JDK 21+) |
| Setup inicial | `docker-compose build` | `firebase login` |
| Inicio | `pnpm run docker:up` | `pnpm run dev:emulators` |
| Aislamiento | ✅ Contenedor | ❌ Global |
| Portabilidad | ✅ 100% reproducible | ⚠️ Depende del sistema |
| Velocidad | ⚠️ Ligeramente más lento | ✅ Nativo |
| Cleanup | ✅ `docker-compose down` | ⚠️ Matar procesos |

## Recomendación

**Usa Docker si:**
- No quieres instalar Java localmente
- Estás acostumbrado al workflow de Supabase/Docker
- Trabajas en equipo (fácil de compartir)
- Quieres entorno aislado

**Usa instalación local si:**
- Ya tienes Java instalado
- Necesitas máxima velocidad
- Prefieres herramientas nativas

## Workflow Completo de Desarrollo

```bash
# 1. Primera vez - construir imagen
docker-compose build

# 2. Copiar variables de entorno
Copy-Item .env.example .env.local

# 3. Iniciar emuladores y Next.js
pnpm run dev:docker

# 4. En otra terminal - poblar datos
pnpm run seed

# 5. Crear usuario admin en http://localhost:4000

# 6. Login en http://localhost:3000/admin/login
```

## Detener Todo

```bash
# Ctrl+C para detener Next.js

# Detener emuladores
pnpm run docker:down
```

## Integración con VS Code

Puedes agregar tasks en `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Firebase Emulators (Docker)",
      "type": "shell",
      "command": "pnpm run docker:up",
      "problemMatcher": []
    },
    {
      "label": "Stop Firebase Emulators (Docker)",
      "type": "shell",
      "command": "pnpm run docker:down",
      "problemMatcher": []
    }
  ]
}
```

## Docker Compose Completo

El archivo `docker-compose.yml` está configurado para:
- ✅ Exponer todos los puertos necesarios
- ✅ Montar archivos de configuración
- ✅ Persistir datos en carpeta `./backup`
- ✅ Health check automático
- ✅ Red aislada

## Próximos Pasos

1. ✅ Iniciar emuladores: `pnpm run docker:up`
2. ✅ Iniciar Next.js: `pnpm run dev`
3. ✅ Poblar datos: `pnpm run seed`
4. ✅ Crear admin en http://localhost:4000
5. ✅ Empezar a desarrollar!

---

**¿Necesitas ayuda?** Revisa los logs con `pnpm run docker:logs` o consulta [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

🚀 ¡Ahora tienes Firebase Emulators corriendo en Docker, como Supabase!