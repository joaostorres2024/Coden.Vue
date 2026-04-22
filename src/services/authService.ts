import api from './api';

export const authService = {

async login(dados: { email: string; senha: string }) {
  const response = await api.post('/auth/login', dados);
  localStorage.setItem('token', response.data.token);
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
  }
};
