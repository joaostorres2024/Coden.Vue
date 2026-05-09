import api from './api'

export interface Estabelecimento {
  id?: number
  nome?: string
  nome_fantasia?: string
  cnpj?: string
  inscricao_estadual?: string
  inscricao_municipal?: string
  regime_tributario?: string
  cep?: string
  endereco?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  uf?: string
  telefone?: string
  email?: string
  site?: string
  responsavel?: string
  cargo?: string
}

const estabelecimentoService = {
  async buscar(): Promise<Estabelecimento> {
    return api.get('/api/estabelecimento').then(r => r.data)
  },

  async atualizar(data: Estabelecimento): Promise<void> {
    return api.put('/api/estabelecimento', data).then(() => undefined)
  },

  async listar(filtros?: { nome?: string; cnpj?: string; cep?: string }): Promise<Estabelecimento[]> {
  const params = new URLSearchParams()
  if (filtros?.nome) params.append('nome', filtros.nome)
  if (filtros?.cnpj) params.append('cnpj', filtros.cnpj)
  if (filtros?.cep) params.append('cep', filtros.cep)
  return api.get(`/api/estabelecimentos?${params.toString()}`).then(r => r.data)
}
}

export default estabelecimentoService
