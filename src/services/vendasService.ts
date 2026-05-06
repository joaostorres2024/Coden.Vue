import api from './api'

export interface ItemVenda {
  produto_id: number
  quantidade: number
  desconto?: number
}

export interface Venda {
  id?: number
  codigo_venda?: string
  cliente_id?: number
  nome_cliente?: string
  forma_pagamento: string
  status?: string
  subtotal?: number
  desconto?: number
  total?: number
  observacoes?: string
  data?: string
  itens?: ItemVenda[]
}

const vendasService = {
  async criarVenda(data: {
    cliente_id?: number
    itens: ItemVenda[]
    forma_pagamento: string
    desconto?: number
    observacoes?: string
  }): Promise<Venda> {
    return api.post('/api/vendas', data).then(r => r.data)
  },

  async listarVendas(): Promise<Venda[]> {
    return api.get('/api/vendas').then(r => r.data)
  },

  async buscarVenda(id: number): Promise<Venda> {
    return api.get(`/api/vendas/${id}`).then(r => r.data)
  },

  async cancelarVenda(id: number): Promise<void> {
    return api.patch(`/api/vendas/${id}/cancelar`).then(() => undefined)
  },

  // Itens
  async adicionarItem(data: {
    venda_id: number
    produto_id: number
    quantidade: number
    desconto?: number
  }): Promise<void> {
    return api.post('/api/itens-venda', data).then(() => undefined)
  },

  async removerItem(item_id: number): Promise<void> {
    return api.delete(`/api/itens-venda/${item_id}`).then(() => undefined)
  },

  async listarItens(venda_id: number): Promise<any[]> {
    return api.get(`/api/vendas/${venda_id}/itens`).then(r => r.data)
  },

  async finalizarVenda(id: number, forma_pagamento: string): Promise<void> {
  return api.patch(`/api/vendas/${id}/finalizar`, { forma_pagamento }).then(() => undefined)
}
}

export default vendasService
