import api from './api';
export interface Product {
  id?: number
  nome_produto: string
  preco: number
  grupo: string
  codigo_produto?: string
  codigo_barras?: string
  preco_custo?: number
  margem_percentual?: number
  estoque_atual?: number
  estoque_minimo?: number
  estoque_maximo?: number
  fornecedor?: string
  status?: string
  observacoes?: string
}

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const productService = {
  getAllProducts(): Promise<Product[]> {
    return api.get('/api/products').then(r => r.data)
  },

  getProduct(id: number): Promise<Product> {
    return api.get(`/api/products/${id}`).then(r => r.data)
  },

  createProduct(data: Product): Promise<Product> {
    return api.post('/api/products', data).then(r => r.data.product)
  },

  updateProduct(id: number, data: Product): Promise<Product> {
    return api.put(`/api/products/${id}`, data).then(r => r.data.product)
  },

  deleteProduct(id: number): Promise<void> {
    return api.delete(`/api/products/${id}`).then(() => undefined)
  }
}

export default productService
