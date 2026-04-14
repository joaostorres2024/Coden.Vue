import api from './api';
import { Product } from '../types/productTypes';

export const productService = {
  getAll() {
    return api.get<Product[]>('/products');
  },

  getById(id: number) {
    return api.get<Product>(`/products/${id}`);
  },

  create(product: Product) {
    return api.post('/products', product);
  },

  update(id: number, product: Product) {
    return api.put(`/products/${id}`, product);
  },

  delete(id: number) {
    return api.delete(`/products/${id}`);
  }
};