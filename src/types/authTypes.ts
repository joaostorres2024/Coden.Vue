export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  estabelecimento_id: number;
}

export interface RegisterEstabelecimentoRequest {
  id: number;
  nome: string;
  cnpj: string;
  cep: string;
}

export interface AuthResponse {
  token: string;
}
``