import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { User } from 'firebase/auth';
import { queryClient } from '../config/queryClient';
import { authService } from '../services/authService';
import { tutoresService, veterinariosService } from '../services/usersService';
import type { UserProfile, UserTipo } from '../types';

const PROFILE_KEY = '@clyvet/profile';

type SignUpInput = {
  nome: string;
  email: string;
  senha: string;
  tipo: UserTipo;
  documento: string;
  telefone: string;
};

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateApiUserId: (apiUserId: number) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function loadProfile(uid: string): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(`${PROFILE_KEY}:${uid}`);
  if (!raw) {
    return null;
  }
  return JSON.parse(raw) as UserProfile;
}

async function saveProfile(profile: UserProfile) {
  await AsyncStorage.setItem(`${PROFILE_KEY}:${profile.uid}`, JSON.stringify(profile));
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.observe(async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        const stored = await loadProfile(nextUser.uid);
        setProfile(stored);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signIn(email: string, senha: string) {
    const nextUser = await authService.signIn(email, senha);
    const stored = await loadProfile(nextUser.uid);
    setProfile(stored);
  }

  async function signUp(input: SignUpInput) {
    const nextUser = await authService.signUp(input.nome, input.email, input.senha);

    const nextProfile: UserProfile = {
      uid: nextUser.uid,
      nome: input.nome.trim(),
      email: input.email.trim(),
      tipo: input.tipo,
      documento: input.documento.trim(),
      telefone: input.telefone.trim(),
      apiUserId: null,
    };

    try {
      const remoteUser =
        input.tipo === 'TUTOR'
          ? await tutoresService.ensure(nextProfile)
          : await veterinariosService.ensure(nextProfile);
      nextProfile.apiUserId = remoteUser.id;
    } catch {
      // O vínculo com tutor/veterinário na API é refeito ao cadastrar um pet.
    }

    await saveProfile(nextProfile);
    setProfile(nextProfile);
  }

  async function handleSignOut() {
    await authService.signOut();
    queryClient.clear();
    setProfile(null);
  }

  async function handleDeleteAccount() {
    if (!user) {
      throw new Error('Sessão expirada. Entre novamente para excluir a conta.');
    }
    const uid = user.uid;
    await authService.deleteAccount();
    await AsyncStorage.removeItem(`${PROFILE_KEY}:${uid}`);
    queryClient.clear();
    setProfile(null);
    setUser(null);
  }

  async function updateApiUserId(apiUserId: number) {
    if (!profile) {
      return;
    }
    const nextProfile = { ...profile, apiUserId };
    await saveProfile(nextProfile);
    setProfile(nextProfile);
  }

  const value = useMemo(
    () => ({
      user,
      profile,
      isLoading,
      signIn,
      signUp,
      signOut: handleSignOut,
      deleteAccount: handleDeleteAccount,
      updateApiUserId,
    }),
    [user, profile, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
