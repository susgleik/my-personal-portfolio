import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from './firebase';

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = (): Promise<FirebaseUser | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

export const checkIsAdmin = async (user: FirebaseUser): Promise<boolean> => {
  try {
    // Lista de emails de administradores permitidos
    const adminEmails = [
      'admin@test.com',
      'admin@example.com',
      'angelhernades26@gmail.com', // Tu email
    ];

    // Verificar si el email está en la lista de admins
    if (user.email && adminEmails.includes(user.email)) {
      return true;
    }

    // También verificar custom claims (para mayor seguridad en producción)
    const tokenResult = await user.getIdTokenResult();
    if (tokenResult.claims.admin) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};