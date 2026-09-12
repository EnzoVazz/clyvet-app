import { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { TextField } from '../../src/components/TextField';
import { getErrorMessage } from '../../src/utils/errors';
import { colors } from '../../src/theme';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function entrar() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Validação', 'Preencha e-mail e senha.');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, senha);
      router.replace('/');
    } catch (error) {
      Alert.alert('Não foi possível entrar', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.title}>Acesso Clyvet</Text>
        <Text style={styles.subtitle}>Entre com sua conta para continuar o cuidado do pet.</Text>

        <TextField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="voce@email.com"
        />
        <TextField
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder="Mínimo 6 caracteres"
        />

        <PrimaryButton title="ENTRAR" onPress={entrar} loading={loading} />

        <Link href="/cadastro" style={styles.link}>
          Não tem conta? Cadastre-se aqui
        </Link>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 24,
    gap: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 8,
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },
});
