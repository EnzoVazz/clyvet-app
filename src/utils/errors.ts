import axios from 'axios';

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === 'string' && data.trim() && !data.trim().startsWith('<')) {
      return data;
    }
    if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
      return data.message;
    }
    if (error.code === 'ECONNABORTED' || error.message === 'timeout') {
      return 'A API demorou para responder. O Render pode estar acordando — toque em Tentar novamente.';
    }
    if (error.message === 'Network Error') {
      return 'Não foi possível conectar à API Java. Confira se o celular tem internet e se https://clyvet-api.onrender.com está no ar.';
    }
    return error.message;
  }

  if (error && typeof error === 'object' && 'code' in error) {
    const code = String((error as { code?: string }).code);
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
      return 'E-mail ou senha inválidos.';
    }
    if (code === 'auth/email-already-in-use') {
      return 'Este e-mail já está cadastrado.';
    }
    if (code === 'auth/weak-password') {
      return 'A senha precisa ter pelo menos 6 caracteres.';
    }
    if (code === 'auth/invalid-email') {
      return 'Informe um e-mail válido.';
    }
    if (code === 'auth/invalid-api-key' || code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
      return 'Firebase não configurado. Preencha o arquivo .env com as chaves do projeto.';
    }
    if (code === 'auth/requires-recent-login') {
      return 'Por segurança, saia e entre de novo. Depois toque em excluir conta.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Não foi possível concluir a operação.';
}
