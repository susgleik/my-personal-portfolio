# Solución de Problemas - Instalación Rápida

## Error: "Java version before 21"

### Paso 1: Instalar Java 21

Tienes 3 opciones:

#### Opción A: Usando Scoop (Más Rápido) ⚡

```powershell
# 1. Instalar Scoop (si no lo tienes)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

# 2. Instalar Java 21
scoop bucket add java
scoop install openjdk21

# 3. Verificar instalación
java -version
```

#### Opción B: Usando Chocolatey

```powershell
# 1. Instalar Chocolatey (si no lo tienes)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# 2. Instalar Java 21
choco install openjdk21

# 3. Verificar instalación
java -version
```

#### Opción C: Descarga Manual

1. Ve a [Adoptium Temurin 21](https://adoptium.net/temurin/releases/?version=21)
2. Selecciona:
   - **Operating System**: Windows
   - **Architecture**: x64
   - **Package Type**: JDK
   - **Version**: 21 (LTS)
3. Descarga el instalador `.msi`
4. Ejecuta el instalador (doble click)
5. Durante la instalación, asegúrate de marcar:
   - ✅ Set JAVA_HOME variable
   - ✅ Add to PATH
6. Reinicia tu terminal PowerShell
7. Verifica:

```powershell
java -version
```

Deberías ver:
```
openjdk version "21.x.x" 2024-xx-xx LTS
```

### Paso 2: Autenticarse en Firebase

```powershell
firebase login
```

Esto abrirá tu navegador. Inicia sesión con tu cuenta de Google.

### Paso 3: Configurar Variables de Entorno

Crea el archivo `.env.local` (copia desde `.env.example`):

```powershell
Copy-Item .env.example .env.local
```

El archivo ya tiene configuración para desarrollo local. No necesitas cambiar nada si solo vas a usar emuladores.

### Paso 4: Reiniciar el Proyecto

```powershell
pnpm run dev:full
```

Deberías ver:

```
[0] ┌─────────────────────────────────────────────────────────────┐
[0] │ ✔  All emulators ready! It is now safe to connect.         │
[0] ├─────────────────────────────────────────────────────────────┤
[0] │ Emulator       │ Host:Port      │ View in Emulator UI      │
[0] ├────────────────┼────────────────┼──────────────────────────┤
[0] │ Authentication │ localhost:9099 │ http://localhost:4000    │
[0] │ Firestore      │ localhost:8080 │ http://localhost:4000    │
[0] │ Storage        │ localhost:9199 │ http://localhost:4000    │
[0] └─────────────────────────────────────────────────────────────┘
[1] ▲ Next.js 15.5.9
[1] - Local:        http://localhost:3000
```

## Otros Errores Comunes

### Error: "Port already in use"

Si algún puerto está ocupado:

1. **Encontrar el proceso usando el puerto:**

```powershell
# Para puerto 3000
netstat -ano | findstr :3000

# Para puerto 4000
netstat -ano | findstr :4000
```

2. **Matar el proceso:**

```powershell
# Reemplaza XXXX con el PID que encontraste
taskkill /PID XXXX /F
```

3. **O cambiar el puerto en firebase.json:**

```json
{
  "emulators": {
    "ui": {
      "port": 4001  // Cambiar a otro puerto
    }
  }
}
```

### Error: "MODULE_NOT_FOUND"

Reinstala las dependencias:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force pnpm-lock.yaml
pnpm install
```

### Error: Emulators no se conectan

1. Verifica que `.env.local` exista
2. Verifica que los puertos en `firebase.json` coincidan con `lib/firebase.ts`
3. Reinicia completamente:

```powershell
# Ctrl+C para detener
# Luego:
pnpm run dev:full
```

### Warning: peer dependencies (React 19)

Esto es solo una advertencia. El paquete `vaul` aún no declara soporte oficial para React 19, pero funciona correctamente. Puedes ignorar este warning.

## Verificación Final

Una vez que todo esté corriendo:

1. **Next.js**: http://localhost:3000
2. **Firebase Emulator UI**: http://localhost:4000
3. **Poblar datos de prueba** (en otra terminal):

```powershell
pnpm run seed
```

4. **Crear usuario admin** en http://localhost:4000:
   - Ve a "Authentication"
   - Click "Add user"
   - Email: `admin@test.com`
   - Password: `password123`

5. **Login en admin panel**: http://localhost:3000/admin/login

## Comando para Desarrollo Diario

Una vez configurado todo, solo necesitas:

```powershell
pnpm run dev:full
```

¡Listo! 🚀

## Necesitas Ayuda?

Si sigues teniendo problemas:

1. Verifica la versión de Java: `java -version` (debe ser 21+)
2. Verifica Firebase CLI: `firebase --version`
3. Verifica que estés autenticado: `firebase login`
4. Lee el archivo completo [SETUP-FIREBASE.md](./SETUP-FIREBASE.md)