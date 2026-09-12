import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from '../config/firebase';

function assertFirebase() {
  if (!isFirebaseConfigured()) {
    throw new Error('Configure o Firebase no arquivo .env antes de autenticar.');
  }
}

export const authService = {
  observe(callback: (user: User | null) => void) {
    if (!isFirebaseConfigured()) {
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(getFirebaseAuth(), callback);
  },

  async signIn(email: string, password: string) {
    assertFirebase();
    const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
    return credential.user;
  },

  async signUp(nome: string, email: string, password: string) {
    assertFirebase();
    const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
    await updateProfile(credential.user, { displayName: nome.trim() });
    return credential.user;
  },

  async signOut() {
    if (!isFirebaseConfigured()) {
      return;
    }
    await signOut(getFirebaseAuth());
  },

  async deleteAccount() {
    assertFirebase();
    const current = getFirebaseAuth().currentUser;
    if (!current) {
      throw new Error('Sessão expirada. Entre novamente para excluir a conta.');
    }
    await deleteUser(current);
  },
};
