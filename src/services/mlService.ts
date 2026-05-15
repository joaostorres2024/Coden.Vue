import api from './api';

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── TIPOS ───────────────────────────────────────────────────────────────────

export interface StatusML {
  conectado: boolean
  ml_user_id?: string
  expira_em?: string
  status?: string
  message?: string
}

export interface ProdutoML {
  id: string
  title: string
  price: number
  available_quantity: number
  sold_quantity: number
  status: string
  permalink: string
  thumbnail: string
  category_id: string
}

export interface PedidoML {
  id: number
  status: string
  date_created: string
  total_amount: number
  buyer: {
    id: number
    nickname: string
    email: string
  }
  order_items: {
    item: { id: string; title: string }
    quantity: number
    unit_price: number
  }[]
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

const mlService = {

  async getLoginUrl(): Promise<string> {
    const { data } = await api.get('/ml/auth/login')
    return data.url
  },

  async getStatus(): Promise<StatusML> {
    return api.get('/ml/status').then(r => r.data)
  },

  // ─── PRODUTOS ──────────────────────────────────────────────────────────────

  async listarProdutos(offset = 0, limit = 50): Promise<{ total: number; produtos: ProdutoML[] }> {
    return api.get(`/ml/produtos?offset=${offset}&limit=${limit}`).then(r => r.data)
  },

  async buscarProduto(itemId: string): Promise<ProdutoML> {
    return api.get(`/ml/produtos/${itemId}`).then(r => r.data)
  },

  async pausarProduto(itemId: string): Promise<void> {
    return api.put(`/ml/produtos/${itemId}/pausar`).then(() => undefined)
  },

  async ativarProduto(itemId: string): Promise<void> {
    return api.put(`/ml/produtos/${itemId}/ativar`).then(() => undefined)
  },

  async encerrarProduto(itemId: string): Promise<void> {
    return api.put(`/ml/produtos/${itemId}/encerrar`).then(() => undefined)
  },

  async atualizarPreco(itemId: string, preco: number): Promise<void> {
    return api.put(`/ml/produtos/${itemId}/preco`, { preco }).then(() => undefined)
  },

  async atualizarEstoque(itemId: string, quantidade: number): Promise<void> {
    return api.put(`/ml/estoque/${itemId}`, { quantidade }).then(() => undefined)
  },

  // ─── PEDIDOS ───────────────────────────────────────────────────────────────

  async listarPedidos(offset = 0, limit = 50): Promise<{ total: number; pedidos: PedidoML[] }> {
    return api.get(`/ml/pedidos?offset=${offset}&limit=${limit}`).then(r => r.data)
  },

  async buscarPedido(orderId: number): Promise<PedidoML> {
    return api.get(`/ml/pedidos/${orderId}`).then(r => r.data)
  },

  async pedidosPorStatus(status: string): Promise<{ total: number; pedidos: PedidoML[] }> {
    return api.get(`/ml/pedidos/status/${status}`).then(r => r.data)
  },

  // ─── ESTOQUE ───────────────────────────────────────────────────────────────

  async estoquesBaixos(minimo = 5): Promise<{ total: number; itens: any[] }> {
    return api.get(`/ml/estoque/baixos?minimo=${minimo}`).then(r => r.data)
  },

  async desconectar(): Promise<void> {
  return api.delete('/ml/auth/desconectar').then(() => undefined)
}
}

export default mlService
