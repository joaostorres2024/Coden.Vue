import api from './api';
export interface Product {
  id?: number
  nome_produto: string
  preco: number
  grupo_id?: number
  grupo?: string
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
  },

  async listarGrupos(): Promise<{ id: number; nome: string }[]> {
    return api.get('/api/grupos').then(r => r.data)
  },

  async criarGrupo(nome: string): Promise<{ id: number; nome: string }> {
    return api.post('/api/grupos', { nome }).then(r => r.data)
  },

  async relatorioEstoque(filtros: {
  codigo?: string
  nome_produto?: string
  grupo_id?: number | null
  status?: string
  fornecedor?: string
}): Promise<any[]> {
  const params = new URLSearchParams()
  if (filtros.codigo) params.append('codigo', filtros.codigo)
  if (filtros.nome_produto) params.append('nome_produto', filtros.nome_produto)
  if (filtros.grupo_id) params.append('grupo_id', String(filtros.grupo_id))
  if (filtros.status) params.append('status', filtros.status)
  if (filtros.fornecedor) params.append('fornecedor', filtros.fornecedor)

  return api.get(`/api/products/relatorio/estoque?${params.toString()}`).then(r => r.data)
}
}

export default productService
