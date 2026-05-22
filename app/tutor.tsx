import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router'; 

type Pet = {
  nome: string;
  idade: string;
  especie: string;
  peso: string;
};

export default function PainelTutor() {
  const [docSalvo, setDocSalvo] = useState('');
  
  const [nomePet, setNomePet] = useState('');
  const [idadePet, setIdadePet] = useState('');
  const [especiePet, setEspeciePet] = useState('');
  const [pesoPet, setPesoPet] = useState('');
  
  const [listaPets, setListaPets] = useState<Pet[]>([]);

  useEffect(() => {
    async function buscarDados() {
      const doc = await AsyncStorage.getItem("DOCUMENTO");
      if (doc) setDocSalvo(doc);
    }
    buscarDados();
    buscarPets();
  }, []);

  async function buscarPets() {
    const dados = await AsyncStorage.getItem("PETS");
    if (dados) {
      setListaPets(JSON.parse(dados));
    }
  }

  async function cadastrarPet() {
    if (!nomePet || nomePet.trim() === "") {
      Alert.alert("Erro", "Por favor, informe o nome do pet");
      return;
    }
    if (!idadePet || idadePet.trim() === "") {
      Alert.alert("Erro", "Por favor, informe a idade do pet");
      return;
    }
    if (!especiePet || especiePet.trim() === "") {
      Alert.alert("Erro", "Por favor, informe a espécie do pet");
      return;
    }

    let pets: Pet[] = [];
    const petsSalvos = await AsyncStorage.getItem("PETS");
    if (petsSalvos !== null) {
      pets = JSON.parse(petsSalvos);
    }

    pets.push({ 
      nome: nomePet.trim(), 
      idade: idadePet.trim(), 
      especie: especiePet.trim(),
      peso: pesoPet.trim()
    });

    await AsyncStorage.setItem("PETS", JSON.stringify(pets));
    
    Alert.alert("Sucesso", "Pet cadastrado com sucesso!");

    setNomePet('');
    setIdadePet('');
    setEspeciePet('');
    setPesoPet('');
    
    buscarPets();
  }

  async function deletarPet(indexParaDeletar: number) {
    Alert.alert(
      "Excluir Pet",
      "Tem certeza que deseja remover este pet da sua lista?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: async () => {
            const novaLista = listaPets.filter((_, index) => index !== indexParaDeletar);
            setListaPets(novaLista);
            await AsyncStorage.setItem("PETS", JSON.stringify(novaLista));
          }
        }
      ]
    );
  }

  function sair() {
    router.replace('/'); 
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listaPets}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }} 
        
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.titulo}>Painel do Tutor</Text>
            <Text style={styles.doc}>CPF vinculado: {docSalvo}</Text>
            
            <Text style={styles.subtitulo}>CADASTRAR NOVO PET</Text>
            
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
            <TextInput
              placeholder='Peso (Opcional, ex: 5kg)'
              style={styles.input}
              value={pesoPet}
              onChangeText={(value) => setPesoPet(value)}
            />
            
            <TouchableOpacity style={styles.btn} onPress={cadastrarPet}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>CADASTRAR PET</Text>
            </TouchableOpacity>

            {listaPets.length > 0 && (
              <Text style={styles.subtituloLista}>MEUS PETS</Text>
            )}
          </View>
        }

        renderItem={({ item, index }) => {
          if (!item || !item.nome) return null;
          return (
            <View style={styles.cardPet}>
              <View style={styles.linhaCard}>
                <Text style={styles.labelCard}>NOME:</Text>
                <Text style={styles.valorCard}>{item.nome}</Text>
              </View>
              <View style={styles.linhaCard}>
                <Text style={styles.labelCard}>IDADE:</Text>
                <Text style={styles.valorCard}>{item.idade}</Text>
              </View>
              <View style={styles.linhaCard}>
                <Text style={styles.labelCard}>ESPÉCIE:</Text>
                <Text style={styles.valorCard}>{item.especie}</Text>
              </View>
              <View style={styles.linhaCard}>
                <Text style={styles.labelCard}>PESO:</Text>
                <Text style={styles.valorCard}>{item.peso ? item.peso : 'Não informado'}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.btnExcluir} 
                onPress={() => deletarPet(index)}
              >
                <Text style={styles.textoBtnExcluir}>Excluir Pet</Text>
              </TouchableOpacity>
            </View>
          );
        }}

        ListFooterComponent={
          <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.btnSairGrande} onPress={sair}>
              <Text style={styles.textoBtnSairGrande}>SAIR DA CONTA</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 50,
    gap: 15,
    width: '100%',
    paddingBottom: 20,
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'blue'
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10
  },
  subtituloLista: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'center'
  },
  doc: {
    fontSize: 14,
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
    alignItems: 'center',
    marginBottom: 10
  },
  cardPet: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    width: 320,
    marginVertical: 10,
    borderLeftWidth: 6,
    borderLeftColor: 'blue',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, 
  },
  linhaCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelCard: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#888',
  },
  valorCard: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  btnExcluir: {
    marginTop: 15,
    paddingVertical: 8,
    backgroundColor: '#ff4444',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textoBtnExcluir: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  footerContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
    paddingBottom: 40,
  },
  btnSairGrande: {
    backgroundColor: '#e53935', 
    width: 300,
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBtnSairGrande: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1, 
  }
});