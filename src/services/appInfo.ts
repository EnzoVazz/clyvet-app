import Constants from 'expo-constants';

export function getGitCommitHash() {
  const extra = Constants.expoConfig?.extra as { gitCommit?: string } | undefined;
  const hash = extra?.gitCommit?.trim();
  return hash && hash.length > 0 ? hash : 'nao-disponivel';
}

export function getAppVersion() {
  return Constants.expoConfig?.version ?? '1.0.0';
}
