import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PainelVeterinario() {
  const [docSalvo, setDocSalvo] = useState('');

  useEffect(() => {
    async function buscarDados() {
      const doc = await AsyncStorage.getItem("DOCUMENTO");
      if (doc) {
        setDocSalvo(doc);
      }
    }
    buscarDados();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Painel do Médico Veterinário</Text>
      <Text>Gestão de prontuários, consultas e retornos.</Text>
      <Text style={styles.doc}>CRMV vinculado: {docSalvo}</Text>
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
    color: 'green' 
  },
  doc: {
    fontSize: 16,
    color: 'gray',
    marginTop: 20
  }
});