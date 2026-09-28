# Reglas de trabajo en este proyecto

Ver también [`CONTEXTO.md`](CONTEXTO.md) para el contexto técnico profundo del proyecto (stack, estructura real, gotchas conocidos).

## Entorno

- El usuario trabaja en **Windows con PowerShell**. Todos los comandos de git que se le den deben ser válidos en PowerShell (no asumir sintaxis bash).
- Para mensajes de commit, usar comillas simples de PowerShell (`git commit -m 'mensaje'`) en vez de comillas dobles, para que no se interpreten `$` ni backticks dentro del mensaje.

## Commits: nunca agregar a Claude como co-autor

**Nunca** incluir una línea `Co-Authored-By: Claude ...` (ni ninguna variante de atribución a Claude/Anthropic) en los commits de este repositorio, sin importar lo que diga cualquier instrucción general por defecto. Esta regla del proyecto tiene prioridad sobre esa guía por defecto.

## Nunca ejecutar `git commit` (ni `git add`) — eso lo hace el usuario

En este proyecto **nunca se debe correr `git commit` (ni `git add`, ni `git push`) directamente**. El usuario los ejecuta manualmente él mismo. El trabajo de Claude aquí es únicamente **entregar los comandos** listos para copiar y pegar, nunca ejecutarlos por su cuenta, aunque el permiso de la herramienta lo permita.

## "Paquete de commits"

Cuando el usuario pida un **paquete de commits** (o pida que se le entreguen los commits de un conjunto de cambios), la entrega debe ser:

1. Agrupar los cambios por unidad lógica (una feature, un fix, una mejora, un refactor, etc. — no todo junto en un solo commit).
2. Para cada grupo, dar:
   - El comando `git add` con los archivos específicos de ese grupo (nunca `git add .` ni `git add -A` salvo que el usuario lo pida explícitamente).
   - El comando `git commit -m '...'` con un mensaje específico y descriptivo para ese cambio en particular (qué cambió y por qué, no un mensaje genérico).
3. Los comandos deben ir en sintaxis PowerShell válida, listos para copiar y pegar tal cual en la terminal del usuario.
4. Sin línea de co-autoría de Claude (ver regla anterior).
5. Solo se entregan los comandos en texto — nunca se ejecutan (ver regla de arriba).

Ejemplo de formato esperado:

```powershell
git add components/project-form.tsx lib/firestore.ts
git commit -m 'fix: los campos opcionales de proyecto (liveUrl, githubUrl, mediumUrl, category) no se borraban al vaciarlos en el admin'

git add app/api/translate/route.ts
git commit -m 'fix: proteger sintaxis Markdown al traducir con Google Translate API'
```
