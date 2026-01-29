/**
 * Script para establecer custom claims de admin en Firebase Auth
 *
 * USO:
 * 1. Descarga tu service account key desde Firebase Console:
 *    Project Settings → Service Accounts → Generate new private key
 *
 * 2. Guarda el archivo como 'serviceAccountKey.json' en la carpeta scripts/
 *
 * 3. Ejecuta: node scripts/set-admin-claim.js tu-email@ejemplo.com
 */

const admin = require('firebase-admin');
const path = require('path');

// Inicializar Firebase Admin
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

try {
  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error('❌ Error: No se encontró serviceAccountKey.json');
  console.log('\nPasos para obtenerlo:');
  console.log('1. Ve a Firebase Console → Project Settings → Service Accounts');
  console.log('2. Click en "Generate new private key"');
  console.log('3. Guarda el archivo como scripts/serviceAccountKey.json');
  console.log('4. ⚠️  NUNCA subas este archivo a Git (ya está en .gitignore)');
  process.exit(1);
}

async function setAdminClaim(email) {
  try {
    // Obtener usuario por email
    const user = await admin.auth().getUserByEmail(email);

    // Establecer custom claim
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    console.log(`✅ Usuario ${email} ahora es admin`);
    console.log(`   UID: ${user.uid}`);
    console.log('\n⚠️  El usuario debe cerrar sesión y volver a iniciar para que tome efecto.');

  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ Usuario no encontrado: ${email}`);
      console.log('   Asegúrate de crear el usuario primero en Firebase Console → Authentication');
    } else {
      console.error('❌ Error:', error.message);
    }
  }

  process.exit(0);
}

// Obtener email del argumento
const email = process.argv[2];

if (!email) {
  console.log('USO: node scripts/set-admin-claim.js <email>');
  console.log('Ejemplo: node scripts/set-admin-claim.js admin@midominio.com');
  process.exit(1);
}

setAdminClaim(email);
