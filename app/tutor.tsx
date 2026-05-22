import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PainelTutor() {
  const [docSalvo, setDocSalvo] = useState('');

  
  useEffect(() => {
    async function buscarDados() {
      // Recupera os dados do AsyncStorage [cite: 1605]
      const doc = await AsyncStorage.getItem("DOCUMENTO"); 
      if (doc) {
        setDocSalvo(doc);
      }
    }
    buscarDados();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Painel do Tutor</Text>
      <Text>Bem-vindo à área de cuidados preventivos do seu pet!</Text>
      <Text style={styles.doc}>Documento vinculado: {docSalvo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'blue'
  },
  doc: {
    fontSize: 16,
    color: 'gray',
    marginTop: 20
  }
});