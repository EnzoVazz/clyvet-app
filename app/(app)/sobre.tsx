import { Platform, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { getAppVersion, getGitCommitHash } from '../../src/services/appInfo';

export default function SobreScreen() {
  const { colors } = useTheme();
  const gitCommit = getGitCommitHash();
  const versao = getAppVersion();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Sobre o App</Text>
      <Text style={[styles.subtitle, { color: colors.muted }]}>
        Identificação da versão publicada no Firebase App Distribution. Este hash deve ser o mesmo
        commit enviado no GitHub.
      </Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderLeftColor: colors.primary }]}>
        <Text style={[styles.label, { color: colors.muted }]}>Aplicativo</Text>
        <Text style={[styles.value, { color: colors.text }]}>Clyvet</Text>
        <Text style={[styles.label, { color: colors.muted }]}>Versão</Text>
        <Text style={[styles.value, { color: colors.text }]}>{versao}</Text>
        <Text style={[styles.label, { color: colors.muted }]}>Hash do commit</Text>
        <Text selectable style={[styles.hash, { color: colors.text }]}>
          {gitCommit}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    marginBottom: 8,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
  },
  hash: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
