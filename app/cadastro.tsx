import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');

  async function realizarCadastro() {
    if (!nome.trim() || !documento.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    const docLimpo = documento.trim();

    const usuariosSalvos = await AsyncStorage.getItem("USUARIOS_REGISTRADOS");
    let usuariosCadastrados = [];
    if (usuariosSalvos !== null) {
      usuariosCadastrados = JSON.parse(usuariosSalvos);
    }

    if (usuariosCadastrados.includes(docLimpo)) {
      Alert.alert("Aviso", "Este documento já está cadastrado!");
      return;
    }

    usuariosCadastrados.push(docLimpo);
    await AsyncStorage.setItem("USUARIOS_REGISTRADOS", JSON.stringify(usuariosCadastrados));
    await AsyncStorage.setItem(`NOME_${docLimpo}`, nome.trim());

    Alert.alert("Sucesso", "Conta criada com sucesso! Faça seu login.");
    router.back(); 
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.titulo}>Criar Conta</Text>
        <Text style={styles.subtitulo}>Cadastre-se na plataforma</Text>

        <TextInput
          style={styles.input}
          placeholder="Seu Nome Completo"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="Digite seu CPF ou CRMV"
          value={documento}
          onChangeText={setDocumento}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.btn} onPress={realizarCadastro}>
          <Text style={styles.textoBtn}>CADASTRAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnVoltar} onPress={() => router.back()}>
          <Text style={styles.textoBtnVoltar}>Já tenho uma conta (Voltar)</Text>
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
    justifyContent: 'center'
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333'
  },
  subtitulo: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 30
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: 50,
    width: 300,
    borderRadius: 15,
    paddingHorizontal: 15,
    textAlign: 'center',
    marginBottom: 15,
    backgroundColor: '#fafafa'
  },
  btn: {
    height: 50,
    width: 300,
    borderRadius: 15,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  textoBtn: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1
  },
  btnVoltar: {
    padding: 10
  },
  textoBtnVoltar: {
    color: '#666',
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  }
});