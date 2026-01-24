import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, collection, getDocs } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

const firebaseConfig = {
  apiKey: 'demo-key',
  authDomain: 'demo-project.firebaseapp.com',
  projectId: 'demo-project',
  storageBucket: 'demo-project.appspot.com',
  messagingSenderId: '123456789',
  appId: 'demo-app-id'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
connectFirestoreEmulator(db, 'localhost', 8080);

const backupData = async () => {
  console.log('📦 Iniciando backup de datos...');

  try {
    const backupDir = path.join(process.cwd(), 'backup-data');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const postsSnapshot = await getDocs(collection(db, 'posts'));
    const posts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    fs.writeFileSync(
      path.join(backupDir, 'posts.json'),
      JSON.stringify(posts, null, 2)
    );
    console.log(`✅ ${posts.length} posts respaldados`);

    const projectsSnapshot = await getDocs(collection(db, 'projects'));
    const projects = projectsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    fs.writeFileSync(
      path.join(backupDir, 'projects.json'),
      JSON.stringify(projects, null, 2)
    );
    console.log(`✅ ${projects.length} proyectos respaldados`);

    console.log(`🎉 Backup completado en: ${backupDir}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el backup:', error);
    process.exit(1);
  }
};

backupData();