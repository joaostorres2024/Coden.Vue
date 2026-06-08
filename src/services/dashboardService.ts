import api from './api'

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// ─── TIPOS ─────────────────────────────────────────────

export interface DashboardResponse {
  totalVendas: number
  totalPedidos: number
  ticketMedio: number
  produtosVendidos: number
}

export interface GraficoResponse {
  data: string
  valor: number
}

export interface SituacaoResponse {
  status: string
  quantidade: number
  valor: number
}

export interface FinanceiroResponse {
  faturamentoSemFrete: number
  precoCusto:          number
  markup:              number
  impostos:            number
  percentualImpostos:  number
  taxaVenda:           number
  percentualTaxa:      number
  lucro:               number
  percentualLucro:     number
}


// ─── SERVICE ──────────────────────────────────────────

const dashboardService = {

  async getFinanceiro(
  de?: string,
  ate?: string
): Promise<FinanceiroResponse> {
  const params = new URLSearchParams()
  if (de)  params.append('de', de)
  if (ate) params.append('ate', ate)
  return api
    .get(`/api/dashboard/financeiro?${params.toString()}`)
    .then(r => r.data)
},

  async getMetricas(
    de?: string,
    ate?: string
  ): Promise<DashboardResponse> {

    const params = new URLSearchParams()

    if (de) params.append('de', de)
    if (ate) params.append('ate', ate)

    return api
      .get(`/api/dashboard?${params.toString()}`)
      .then(r => r.data)
  },

  async getGraficoVendas(
    de?: string,
    ate?: string
  ): Promise<GraficoResponse[]> {

    const params = new URLSearchParams()

    if (de) params.append('de', de)
    if (ate) params.append('ate', ate)

    return api
      .get(`/api/dashboard/grafico?${params.toString()}`)
      .then(r => r.data)
  },

  async getSituacaoPedidos(): Promise<SituacaoResponse[]> {
    return api
      .get('/api/dashboard/situacao')
      .then(r => r.data)
  }

}

export default dashboardService
