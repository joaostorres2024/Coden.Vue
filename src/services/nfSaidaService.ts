import api from './api'

export interface NfSaida {
  id?: number
  numero_nf?: string
  venda_id?: number
  codigo_venda?: string
  cliente_id?: number
  nome_cliente?: string
  data_emissao?: string
  forma_pagamento?: string
  subtotal?: number
  desconto?: number
  total?: number
  status?: string
  itens?: NfSaidaItem[]
}

export interface NfSaidaItem {
  id?: number
  nf_saida_id?: number
  produto_id?: number
  nome_produto?: string
  quantidade?: number
  preco_unitario?: number
  desconto?: number
  subtotal?: number
}

const nfSaidaService = {
  async listar(): Promise<NfSaida[]> {
    return api.get('/api/nf-saida').then(r => r.data)
  },

  async buscar(id: number): Promise<NfSaida> {
    return api.get(`/api/nf-saida/${id}`).then(r => r.data)
  },

  async gerarPDF(id: number): Promise<void> {
  const response = await api.get(`/api/nf-saida/${id}/pdf`, {
    responseType: 'blob'
  })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `NF_${id}.pdf`)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
}

export default nfSaidaService
