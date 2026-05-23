import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function TelaInicial() {
    const [documento, setDocumento] = useState('');

    useEffect(() => {
        async function carregarUltimoDocumento() {
            const docSalvo = await AsyncStorage.getItem("DOCUMENTO");
            if (docSalvo) {
                setDocumento(docSalvo);
            }
        }
        carregarUltimoDocumento();
    }, []);

    async function acessarSistema() {
        const docLimpo = documento.trim();

        if (!docLimpo) {
            Alert.alert("Erro", "Por favor, informe o seu CPF ou CRMV");
            return;
        }

        const usuariosSalvos = await AsyncStorage.getItem("USUARIOS_REGISTRADOS");
        let usuariosCadastrados = [];
        
        if (usuariosSalvos !== null) {
            usuariosCadastrados = JSON.parse(usuariosSalvos);
        }

        if (!usuariosCadastrados.includes(docLimpo)) {
            Alert.alert("Acesso Negado", "Usuário não encontrado. Por favor, cadastre-se primeiro.");
            return; 
        }

        let perfilUser = '';

        if (docLimpo.length === 11 || docLimpo.length === 14) {
            perfilUser = 'TUTOR';
        } else if (docLimpo.length >= 4 && docLimpo.length <= 7) {
            perfilUser = 'VETERINARIO';
        } else {
            Alert.alert("Erro", "Documento inválido. Digite um CPF ou CRMV válido.");
            return;
        }

        await AsyncStorage.setItem("PERFIL", perfilUser);
        await AsyncStorage.setItem("DOCUMENTO", docLimpo);

        Alert.alert("Sucesso", `Acesso liberado! Entrando como: ${perfilUser}`);

        if (perfilUser === 'TUTOR') {
            router.push('/tutor');
        } else {
            router.push('/veterinario');
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView 
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <Text style={styles.titulo}>ACESSO CLYVET</Text>

                <TextInput
                    placeholder='DIGITE SEU CPF OU CRMV'
                    style={styles.input}
                    value={documento}
                    onChangeText={(value) => setDocumento(value)}
                    keyboardType="numeric" 
                />

                <TouchableOpacity style={styles.btn} onPress={acessarSistema}>
                    <Text style={styles.textoBtn}>ENTRAR</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnLink} onPress={() => router.push('/cadastro')}>
                    <Text style={styles.textoLink}>Não tem conta? Cadastre-se aqui</Text>
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
        justifyContent: 'center',
        gap: 10,
        marginTop: 20
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333'
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
    },
    textoBtn: {
        color: 'white',
        fontWeight: 'bold'
    },
    btnLink: {
        marginTop: 20,
        padding: 10
    },
    textoLink: {
        color: 'gray',
        fontWeight: 'bold'
    }
});