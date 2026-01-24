# Fix Rápido - Puerto 4000 Ocupado

## Problema
Hay dos procesos compitiendo por el puerto 4000:
- Docker (PID 35628) ✅ Correcto
- Otro proceso (PID 38716) ❌ Interfiriendo

## Solución 1: Matar el proceso duplicado

```powershell
# Ver qué es el proceso
tasklist | findstr "38716"

# Matarlo
taskkill /PID 38716 /F

# Luego accede a:
http://127.0.0.1:4000
```

## Solución 2: Usar puertos diferentes

Si el proceso 38716 sigue volviendo, cambia los puertos en docker-compose.yml:

```yaml
ports:
  - "4001:4000"   # UI externa en 4001, interna en 4000
  - "8081:8080"   # Firestore externa en 8081, interna en 8080
  - "9098:9099"   # Auth
  - "9198:9199"   # Storage
```

Y actualiza `lib/firebase.ts` para usar los nuevos puertos:

```typescript
connectFirestoreEmulator(db, 'localhost', 8081);
connectAuthEmulator(auth, 'http://localhost:9098');
connectStorageEmulator(storage, 'localhost', 9198);
```

Accede a: http://localhost:4001

## Solución 3: Detener todos los emuladores locales

Si tienes Firebase CLI corriendo localmente:

```powershell
# Buscar todos los procesos de Firebase
Get-Process | Where-Object {$_.ProcessName -like "*firebase*" -or $_.ProcessName -like "*java*"}

# O buscar por puerto
netstat -ano | findstr ":4000"
# Luego matar el PID que no sea de Docker
taskkill /PID XXXXX /F
```

## Solución 4: Reinicio completo

```powershell
# Detener Docker
pnpm run docker:down

# Matar todos los procesos en esos puertos
taskkill /F /IM node.exe
taskkill /F /IM java.exe

# Reiniciar Docker
pnpm run docker:up

# Esperar 30 segundos y acceder
http://127.0.0.1:4000
```

## Verificar que funciona

Una vez que hagas alguna de las soluciones:

1. Verifica procesos:
```powershell
netstat -ano | findstr "4000"
# Solo deberías ver el PID de Docker (35628 o similar)
```

2. Accede a http://127.0.0.1:4000

3. Si ves la interfaz de Firebase Emulator UI, ¡funciona! 🎉

4. Prueba el seed:
```powershell
pnpm run seed
```

## ¿Cuál solución uso?

- **Si solo quieres probar rápido**: Solución 1 (matar proceso)
- **Si el problema persiste**: Solución 2 (cambiar puertos)
- **Si nada funciona**: Solución 4 (reinicio completo)