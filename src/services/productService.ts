import api from './api';

export interface CreateProductRequest {
  nome: string;
  preco: number;
  tipo: 'produto' | 'servico';
}

export const productService = {
  listar() {
    return api.get('/products');
  },

  buscarPorId(id: number) {
    return api.get(`/products/${id}`);
  },

  criar(produto: any) {
    return api.post('/products', produto);
  },

  atualizar(id: number, produto: any) {
    return api.put(`/products/${id}`, produto);
  },

  excluir(id: number) {
    return api.delete(`/products/${id}`);
  }
};