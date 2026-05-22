import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PainelTutor() {
  const [docSalvo, setDocSalvo] = useState('');
  
  // Estados separados para o cadastro do pet
  const [nomePet, setNomePet] = useState('');
  const [idadePet, setIdadePet] = useState('');
  const [especiePet, setEspeciePet] = useState(''); // Novo estado

  // Busca o documento salvo no banco local assim que a tela abre
  useEffect(() => {
    async function buscarDados() {
      const doc = await AsyncStorage.getItem("DOCUMENTO");
      if (doc) {
        setDocSalvo(doc);
      }
    }
    buscarDados();
  }, []);

  // Função inicial apenas para validar os campos
  async function cadastrarPet() {
    if (!nomePet || nomePet.trim() === "") {
      Alert.alert("Erro", "Por favor, informe o nome do pet");
      return;
    }
    if (!idadePet || idadePet.trim() === "") {
      Alert.alert("Erro", "Por favor, informe a idade do pet (ex: 2 anos)");
      return;
    }
    if (!especiePet || especiePet.trim() === "") {
      Alert.alert("Erro", "Por favor, informe a espécie do pet (ex: Cachorro, Gato)");
      return;
    }

    Alert.alert("Sucesso", "Campos validados! Pet pronto para ser salvo.");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Painel do Tutor</Text>
      <Text style={styles.doc}>CPF vinculado: {docSalvo}</Text>
      
      <Text style={styles.subtitulo}>CADASTRAR NOVO PET</Text>
      
      {/* Campos de entrada do Pet */}
      <TextInput
        placeholder='Digite o nome do pet'
        style={styles.input}
        value={nomePet}
        onChangeText={(value) => setNomePet(value)}
      />

      <TextInput
        placeholder='Digite a idade (ex: 3 anos)'
        style={styles.input}
        value={idadePet}
        onChangeText={(value) => setIdadePet(value)}
      />

      <TextInput
        placeholder='Digite a espécie (ex: Gato)'
        style={styles.input}
        value={especiePet}
        onChangeText={(value) => setEspeciePet(value)}
      />

      {/* Botão de cadastro */}
      <TouchableOpacity style={styles.btn} onPress={cadastrarPet}>
        <Text style={{ color: 'white' }}>CADASTRAR PET</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos seguindo o padrão das aulas
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
    gap: 15,
  },
  titulo: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'blue'
  },
  subtitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20
  },
  doc: {
    fontSize: 18,
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    height: 50,
    width: 300,
    borderRadius: 15,
    paddingHorizontal: 15,
    textAlign: 'center'
  },
  btn: {
    borderWidth: 1,
    height: 50,
    width: 300,
    borderRadius: 15,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center'
  }
});