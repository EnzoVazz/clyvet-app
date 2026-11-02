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
import { useTheme } from '../../src/contexts/ThemeContext';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { TextField } from '../../src/components/TextField';
import { getErrorMessage } from '../../src/utils/errors';
import type { UserTipo } from '../../src/types';

export default function CadastroScreen() {
  const { signUp } = useAuth();
  const { colors } = useTheme();
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
        style={[styles.flex, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={[styles.title, { color: colors.text }]}>Criar conta</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Cadastre-se para acessar pets e prontuários na API.
          </Text>

          <View style={styles.tipoRow}>
            <Pressable
              onPress={() => setTipo('TUTOR')}
              style={[
                styles.tipoBtn,
                {
                  borderColor: tipo === 'TUTOR' ? colors.primary : colors.border,
                  backgroundColor: tipo === 'TUTOR' ? colors.primary : colors.card,
                },
              ]}
            >
              <Text style={[styles.tipoTexto, { color: tipo === 'TUTOR' ? '#fff' : colors.text }]}>
                Tutor
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setTipo('VETERINARIO')}
              style={[
                styles.tipoBtn,
                {
                  borderColor: tipo === 'VETERINARIO' ? colors.success : colors.border,
                  backgroundColor: tipo === 'VETERINARIO' ? colors.success : colors.card,
                },
              ]}
            >
              <Text
                style={[styles.tipoTexto, { color: tipo === 'VETERINARIO' ? '#fff' : colors.text }]}
              >
                Veterinário
              </Text>
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
  flex: { flex: 1 },
  container: {
    padding: 24,
    gap: 12,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
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
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tipoTexto: {
    fontWeight: '700',
  },
});
