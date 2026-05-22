import { StyleSheet, Text, View } from 'react-native';

export default function TelaInicial() {
  return (
    <View style={styles.container}>
      <Text>CLYVET - TELA INICIAL</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});