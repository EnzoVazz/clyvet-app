import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

type Pet = {
  nome: string;
  idade: string;
  especie: string;
  peso: string;
  diagnostico?: string;
};

export default function PainelVeterinario() {
  const [crmvSalvo, setCrmvSalvo] = useState('');
  const [cpfBusca, setCpfBusca] = useState('');
  const [listaPetsResult, setListaPetsResult] = useState<Pet[]>([]);
  const [buscou, setBuscou] = useState(false);

  const [indexEdicao, setIndexEdicao] = useState<number | null>(null);
  const [textoDiagnostico, setTextoDiagnostico] = useState('');

  useEffect(() => {
    async function carregarDadosVeterinario() {
      const doc = await AsyncStorage.getItem("DOCUMENTO");
      if (doc) setCrmvSalvo(doc);
    }
    carregarDadosVeterinario();
  }, []);

  async function buscarPetsDoTutor() {
    const cpfLimpo = cpfBusca.trim();
    
    if (!cpfLimpo || cpfLimpo.length < 11) {
      Alert.alert("Erro", "Por favor, digite um CPF válido.");
      return;
    }

    const chaveUsuario = `PETS_${cpfLimpo}`;
    const dados = await AsyncStorage.getItem(chaveUsuario);
    
    setBuscou(true);
    setIndexEdicao(null);

    if (dados !== null) {
      setListaPetsResult(JSON.parse(dados));
    } else {
      setListaPetsResult([]);
    }
  }

  async function salvarDiagnostico(index: number) {
    if (!textoDiagnostico.trim()) {
      Alert.alert("Aviso", "O diagnóstico não pode ficar vazio.");
      return;
    }

    const novaLista = [...listaPetsResult];
    novaLista[index].diagnostico = textoDiagnostico;

    setListaPetsResult(novaLista);

    const chaveUsuario = `PETS_${cpfBusca.trim()}`;
    await AsyncStorage.setItem(chaveUsuario, JSON.stringify(novaLista));

    setIndexEdicao(null);
    setTextoDiagnostico('');

    Alert.alert("Sucesso", "Prontuário atualizado com o novo diagnóstico!");
  }

  function abrirEdicao(index: number, diagnosticoAtual: string | undefined) {
    setIndexEdicao(index);
    setTextoDiagnostico(diagnosticoAtual || '');
  }

  function sair() {
    router.replace('/'); 
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listaPetsResult}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.titulo}>Painel Veterinário</Text>
            <Text style={styles.doc}>CRMV vinculado: {crmvSalvo}</Text>

            <TouchableOpacity style={styles.btnPerfil} onPress={() => router.push('/perfil')}>
              <Text style={styles.textoBtnPerfil}>👤 Meu Perfil</Text>
            </TouchableOpacity>
            
            <Text style={styles.subtitulo}>CONSULTAR PRONTUÁRIOS</Text>
            
            <TextInput
              placeholder='Digite o CPF do Tutor'
              style={styles.input}
              value={cpfBusca}
              onChangeText={(value) => setCpfBusca(value)}
              keyboardType="numeric"
            />
            
            <TouchableOpacity style={styles.btn} onPress={buscarPetsDoTutor}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>BUSCAR PETS</Text>
            </TouchableOpacity>

            {buscou && listaPetsResult.length === 0 && (
              <Text style={styles.textoVazio}>Nenhum pet encontrado para este CPF.</Text>
            )}
            
            {listaPetsResult.length > 0 && (
              <Text style={styles.subtituloLista}>RESULTADO DA BUSCA</Text>
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
              
              {item.diagnostico && indexEdicao !== index && (
                <View style={styles.containerDiagnostico}>
                  <Text style={styles.labelCard}>DIAGNÓSTICO / RECEITA:</Text>
                  <Text style={styles.textoDiagnosticoSalvo}>{item.diagnostico}</Text>
                </View>
              )}

              {indexEdicao === index ? (
                <View style={styles.areaEdicao}>
                  <TextInput
                    style={styles.inputDiagnostico}
                    placeholder="Digite o diagnóstico ou receita..."
                    value={textoDiagnostico}
                    onChangeText={setTextoDiagnostico}
                    multiline
                  />
                  <View style={styles.botoesEdicao}>
                    <TouchableOpacity 
                      style={[styles.btnAcao, { backgroundColor: '#888' }]} 
                      onPress={() => setIndexEdicao(null)}
                    >
                      <Text style={styles.textoBtnAcao}>Cancelar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.btnAcao, { backgroundColor: 'green' }]} 
                      onPress={() => salvarDiagnostico(index)}
                    >
                      <Text style={styles.textoBtnAcao}>Salvar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.btnEditar} 
                  onPress={() => abrirEdicao(index, item.diagnostico)}
                >
                  <Text style={styles.textoBtnEditar}>
                    {item.diagnostico ? 'Editar Diagnóstico' : 'Adicionar Diagnóstico'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}

        ListFooterComponent={
          <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.btnSairGrande} onPress={sair}>
              <Text style={styles.textoBtnSairGrande}>SAIR DO SISTEMA</Text>
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
    alignItems: 'center'
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 50,
    gap: 15,
    width: '100%',
    paddingBottom: 20
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'green'
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
  textoVazio: {
    color: 'red',
    marginTop: 10,
    fontWeight: 'bold'
  },
  doc: {
    fontSize: 14,
    color: 'gray'
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
    backgroundColor: 'green',
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
    borderLeftColor: 'green',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4
  },
  linhaCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  labelCard: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#888'
  },
  valorCard: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  containerDiagnostico: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  textoDiagnosticoSalvo: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
    fontStyle: 'italic'
  },
  btnEditar: {
    marginTop: 15,
    paddingVertical: 8,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'green'
  },
  textoBtnEditar: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 14
  },
  areaEdicao: {
    marginTop: 15
  },
  inputDiagnostico: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    textAlignVertical: 'top',
    backgroundColor: '#fafafa',
    marginBottom: 10
  },
  botoesEdicao: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  btnAcao: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5
  },
  textoBtnAcao: {
    color: 'white',
    fontWeight: 'bold'
  },
  footerContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
    paddingBottom: 40
  },
  btnSairGrande: {
    backgroundColor: '#e53935',
    width: 300,
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textoBtnSairGrande: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1
  },
  btnPerfil: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'green', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBtnPerfil: {
    color: 'green', 
    fontWeight: 'bold',
    fontSize: 14,
  },
});