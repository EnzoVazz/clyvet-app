import { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { TextField } from '../../src/components/TextField';
import { getErrorMessage } from '../../src/utils/errors';
import { colors } from '../../src/theme';
import type { UserTipo } from '../../src/types';

export default function CadastroScreen() {
  const { signUp } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [documento, setDocumento] = useState('');
  const [tipo, setTipo] = useState<UserTipo>('TUTOR');
  const [loading, setLoading] = useState(false);

  async function cadastrar() {
    if (!nome.trim() || !email.trim() || !senha.trim() || !documento.trim() || !telefone.trim()) {
      Alert.alert('Validação', 'Preencha todos os campos.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Validação', 'A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    try {
      setLoading(true);
      await signUp({ nome, email, senha, tipo, documento, telefone });
      router.replace('/');
    } catch (error) {
      Alert.alert('Não foi possível cadastrar', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Cadastre-se para acessar pets e prontuários na API.</Text>

          <View style={styles.tipoRow}>
            <Pressable
              onPress={() => setTipo('TUTOR')}
              style={[styles.tipoBtn, tipo === 'TUTOR' && styles.tipoAtivo]}
            >
              <Text style={[styles.tipoTexto, tipo === 'TUTOR' && styles.tipoTextoAtivo]}>Tutor</Text>
            </Pressable>
            <Pressable
              onPress={() => setTipo('VETERINARIO')}
              style={[styles.tipoBtn, tipo === 'VETERINARIO' && styles.tipoVetAtivo]}
            >
              <Text style={[styles.tipoTexto, tipo === 'VETERINARIO' && styles.tipoTextoAtivo]}>Veterinário</Text>
            </Pressable>
          </View>

          <TextField label="Nome completo" value={nome} onChangeText={setNome} placeholder="Seu nome" />
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
          <TextField
            label={tipo === 'TUTOR' ? 'CPF' : 'CRMV'}
            value={documento}
            onChangeText={setDocumento}
            keyboardType="numeric"
            placeholder={tipo === 'TUTOR' ? '00000000000' : '12345'}
          />
          <TextField
            label="Telefone"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
            placeholder="11999999999"
          />

          <PrimaryButton title="CADASTRAR" onPress={cadastrar} loading={loading} />
          <PrimaryButton title="Já tenho conta" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    padding: 24,
    gap: 12,
    paddingBottom: 40,
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
  tipoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tipoBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  tipoAtivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tipoVetAtivo: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  tipoTexto: {
    fontWeight: '700',
    color: colors.text,
  },
  tipoTextoAtivo: {
    color: '#fff',
  },
});
