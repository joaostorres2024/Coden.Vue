import api from './api';

export interface NFItem {
  produto_id: number
  quantidade: number
  valor_unitario: number
  preco_venda: number
}

export interface NFEntrada {
  id?: number
  numero_nf: string
  serie: string
  data_emissao: string
  fornecedor: string
  itens: NFItem[]
  valor_total?: number
}

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const nfEntradaService = {

  criarNota(data: NFEntrada): Promise<NFEntrada> {
    return api.post('/api/nf-entrada', data).then(r => r.data)
  },

  listarNotas(): Promise<NFEntrada[]> {
    return api.get('/api/nf-entrada').then(r => r.data)
  },

  buscarNota(id: number): Promise<NFEntrada> {
    return api.get(`/api/nf-entrada/${id}`).then(r => r.data)
  },

  cancelarNota(id: number): Promise<void> {
    return api.delete(`/api/nf-entrada/${id}`).then(() => undefined)
  }

}

export default nfEntradaService
