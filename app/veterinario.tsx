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

export default function PainelVeterinario() {
    const [crmvSalvo, setCrmvSalvo] = useState('');
    const [cpfBusca, setCpfBusca] = useState('');
    const [listaPetsResult, setListaPetsResult] = useState<Pet[]>([]);
    const [buscou, setBuscou] = useState(false);

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
            Alert.alert("Erro", "Por favor, digite um CPF válido com 11 ou 14 dígitos.");
            return;
        }

        const chaveUsuario = `PETS_${cpfLimpo}`;
        const dados = await AsyncStorage.getItem(chaveUsuario);

        setBuscou(true);

        if (dados !== null) {
            setListaPetsResult(JSON.parse(dados));
        } else {
            setListaPetsResult([]);
        }
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

                renderItem={({ item }) => {
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
        shadowOffset: {
            width: 0,
            height: 2
        },
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
    }
});