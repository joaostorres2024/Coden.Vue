import api from './api';

export const authService = {

async login(dados: { usuario: string; senha: string }) {
  const response = await api.post('/auth/login', dados);
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('nomeUsuario', response.data.nome)
  return response.data;
},

  register(dados: any) {
    return api.post('/auth/register', dados);
  },

  registerEstabelecimento(dados: any) {
    return api.post('/auth/registerestabelecimento', dados);
  },

  logout() {
    localStorage.removeItem('token');
  },

  async solicitarCodigoRecuperacao(usuario: string) {
    const response = await api.post('/auth/recuperar-senha/solicitar', { usuario });
    return response.data;
  },

  async validarCodigoRecuperacao(usuario: string, codigo: string) {
    const response = await api.post('/auth/recuperar-senha/validar', { usuario, codigo });
    return response.data.valido;
  },

  async redefinirSenha(dados: { usuario: string; codigo: string; novaSenha: string }) {
    const response = await api.post('/auth/recuperar-senha/redefinir', dados);
    return response.data;
  }

};
