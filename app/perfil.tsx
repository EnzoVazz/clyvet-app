import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function Perfil() {
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [tipoPerfil, setTipoPerfil] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    async function carregarDados() {
      const doc = await AsyncStorage.getItem("DOCUMENTO");
      const perfilUser = await AsyncStorage.getItem("PERFIL");

      if (doc) {
        setDocumento(doc);
        
        const nomeSalvo = await AsyncStorage.getItem(`NOME_${doc}`);
        if (nomeSalvo) {
          setNome(nomeSalvo);
        }

        const telefoneSalvo = await AsyncStorage.getItem(`TELEFONE_${doc}`);
        if (telefoneSalvo) {
          setTelefone(telefoneSalvo);
        }
      }

      if (perfilUser) {
        setTipoPerfil(perfilUser);
      }
    }
    carregarDados();
  }, []);

  async function salvarTelefone() {
    if (!telefone.trim()) {
      Alert.alert("Erro", "Por favor, digite um telefone válido.");
      return;
    }

    await AsyncStorage.setItem(`TELEFONE_${documento}`, telefone.trim());
    Alert.alert("Sucesso", "Telefone atualizado com sucesso!");
    Keyboard.dismiss();
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.titulo}>Meu Perfil</Text>

        <View style={styles.cardDados}>
          <Text style={styles.label}>NOME:</Text>
          <Text style={styles.valor}>{nome || 'Nome não informado'}</Text>

          <Text style={styles.label}>TIPO DE CONTA:</Text>
          <Text style={styles.valor}>{tipoPerfil}</Text>

          <Text style={styles.label}>DOCUMENTO VINCULADO:</Text>
          <Text style={styles.valor}>{documento}</Text>
        </View>

        <Text style={styles.subtitulo}>DADOS DE CONTATO</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu telefone (Ex: 11999999999)"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.btnSalvar} onPress={salvarTelefone}>
          <Text style={styles.textoBtnSalvar}>SALVAR TELEFONE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnVoltar} onPress={() => router.back()}>
          <Text style={styles.textoBtnVoltar}>VOLTAR AO PAINEL</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 60
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20
  },
  cardDados: {
    backgroundColor: '#f5f5f5',
    width: 320,
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#333',
    marginBottom: 30
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 2
  },
  valor: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 15
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 15
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: 50,
    width: 320,
    borderRadius: 15,
    paddingHorizontal: 15,
    textAlign: 'center',
    marginBottom: 15,
    backgroundColor: '#fafafa'
  },
  btnSalvar: {
    height: 50,
    width: 320,
    borderRadius: 15,
    backgroundColor: '#2e7d32',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  textoBtnSalvar: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1
  },
  btnVoltar: {
    height: 50,
    width: 320,
    borderRadius: 15,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textoBtnVoltar: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16
  }
});