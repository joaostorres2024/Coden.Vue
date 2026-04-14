import api from './api';
import {
  LoginRequest,
  RegisterRequest,
  RegisterEstabelecimentoRequest,
  AuthResponse
} from '../types/authTypes';

export const authService = {
  async login(dados: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', dados);

    localStorage.setItem('token', response.data.token);

    return response.data;
  },

  async register(dados: RegisterRequest) {
    return api.post('/register', dados);
  },

  async registerEstabelecimento(dados: RegisterEstabelecimentoRequest) {
    return api.post('/registerestabelecimento', dados);
  },

  logout() {
    localStorage.removeItem('token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
};