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
    // En desarrollo local, permitir emails específicos como admin
    if (process.env.NODE_ENV === 'development') {
      const adminEmails = ['admin@test.com', 'admin@example.com'];
      if (user.email && adminEmails.includes(user.email)) {
        return true;
      }
    }

    // En producción, verificar custom claims
    const tokenResult = await user.getIdTokenResult();
    return !!tokenResult.claims.admin;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};