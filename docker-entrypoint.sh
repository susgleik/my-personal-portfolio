#!/bin/sh
set -e

echo "🚀 Iniciando Firebase Emulators..."
echo "📍 Proyecto: demo-project"
echo "🌐 UI disponible en: http://localhost:4000"
echo ""

# Iniciar emuladores con configuración para Docker
exec firebase emulators:start \
  --project demo-project \
  --only auth,firestore,storage