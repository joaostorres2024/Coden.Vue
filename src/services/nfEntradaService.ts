import api from './api'

export interface NfEntradaItem {
  id?: number
  nf_entrada_id?: number
  produto_id?: number | null
  codigo_produto?: string
  nome_produto?: string
  quantidade?: number
  valor_unitario?: number
  valor_total?: number
  preco_venda?: number
  margem?: number
  grupo_id?: number | null
  codigo_barras?: string
}

export interface NfEntrada {
  id?: number
  numero_nf?: string
  serie?: string
  data_emissao?: string
  data_entrada?: string
  fornecedor?: string
  cnpj_cpf?: string
  inscricao_estadual?: string
  uf?: string
  valor_total?: number
  observacoes?: string
  origem_tributaria?: string
  icms?: number
  ipi?: number
  pis?: number
  cofins?: number
  estabelecimento_id?: number
  itens?: NfEntradaItem[]
}

const nfEntradaService = {
  async listar(): Promise<NfEntrada[]> {
    return api.get('/api/nf-entrada').then(r => r.data)
  },

  async buscar(id: number): Promise<NfEntrada> {
    return api.get(`/api/nf-entrada/${id}`).then(r => r.data)
  },

  async criar(data: NfEntrada): Promise<any> {
    return api.post('/api/nf-entrada', data).then(r => r.data)
  }
}

export default nfEntradaService
