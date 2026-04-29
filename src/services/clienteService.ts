import axios from 'axios'

export interface Cliente {
  id?: number
  tipo_pessoa: string
  nome_cliente: string
  cpf?: string
  cnpj?: string
  codigo_cliente?: string
  status?: string
  data_nascimento?: string
  nome_social?: string
  razao_social?: string
  nome_responsavel?: string
  telefone_1?: string
  telefone_2?: string
  email?: string
  cep?: string
  endereco?: string
  numero?: string
  bairro?: string
  cidade?: string
  uf?: string
  observacoes?: string
}

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const clienteService = {
  listarClientes(): Promise<Cliente[]> {
    return api.get('/clientes').then(r => r.data)
  },

  buscarCliente(id: number): Promise<Cliente> {
    return api.get(`/clientes/${id}`).then(r => r.data)
  },

  criarCliente(data: Cliente): Promise<Cliente> {
    return api.post('/clientes', data).then(r => r.data.cliente)
  },

  atualizarCliente(id: number, data: Cliente): Promise<Cliente> {
    return api.put(`/clientes/${id}`, data).then(r => r.data.cliente)
  },

  deletarCliente(id: number): Promise<void> {
    return api.delete(`/clientes/${id}`).then(() => undefined)
  },
  async proximoCodigo(): Promise<string> {
    const response = await api.get('/clientes/proximo-codigo')
    return String(response.data.codigo).padStart(4, '0')
}
}

export default clienteService
