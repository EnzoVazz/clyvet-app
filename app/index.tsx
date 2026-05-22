import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function TelaInicial() {
  const [documento, setDocumento] = useState('');

  async function acessarSistema() {
    const docLimpo = documento.trim();

    if (!docLimpo) {
      Alert.alert("Erro", "Por favor, informe o seu CPF ou CRMV");
      return;
    }

    let perfilUser = '';

    if (docLimpo.length === 11 || docLimpo.length === 14) {
      perfilUser = 'TUTOR';
    } 
    else if (docLimpo.length >= 4 && docLimpo.length <= 7) {
      perfilUser = 'VETERINARIO';
    } 
    else {
      Alert.alert("Erro", "Documento inválido. Digite um CPF ou CRMV válido.");
      return;
    }

    await AsyncStorage.setItem("PERFIL", perfilUser); 
    await AsyncStorage.setItem("DOCUMENTO", docLimpo);

    Alert.alert("Sucesso", `Acesso liberado! Entrando como: ${perfilUser}`);

    setDocumento('');

    if (perfilUser === 'TUTOR') {
      router.push('/tutor');
    } else {
      router.push('/veterinario');
    }
  }

  return (
    <View style={styles.container}>
      <Text>ACESSO CLYVET</Text> 
      
      <TextInput
        placeholder='DIGITE SEU CPF OU CRMV'
        style={styles.input}
        value={documento}
        onChangeText={(value) => setDocumento(value)}
      />
      
      <TouchableOpacity style={styles.btn} onPress={acessarSistema}>
        <Text style={{ color: 'white' }}>ENTRAR</Text> 
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20
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