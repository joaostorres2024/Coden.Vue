<template>
  <div class="q-pa-md">

    <!-- Cabeçalho -->
    <div class="text-bold text-black row items-center" style="font-size:28px">
      <q-icon name="webhook" class="q-mr-md text-primary" size="28px" />Integrações
    </div>
    <p class="text-grey-7 text-body2 q-mb-md">
      Conecte e gerencie integrações com marketplaces e outras plataformas para sincronizar produtos, preços e pedidos automaticamente.
    </p>
    <q-separator class="q-mb-lg" />

    <!-- TELA 1: LISTA DE MARKETPLACES -->
    <div v-if="tela === 'inicio'">
      <div class="row q-pb-md items-center">
        Caso não saiba como fazer uma integração, clique aqui para ver o tutorial:
        <span>
          <q-icon class="cursor-pointer" color="orange" name="o_info" size="18px" style="margin-bottom: 1.5px; margin-left: 5px" />
        </span>
      </div>
      <div class="row items-center justify-between q-gutter-sm">
        <q-input class="col-3" label="Pesquise pelo nome da integração" outlined v-model="busca" dense />
      </div>
      <div class="q-mt-lg">

        <!-- Minhas Integrações -->
        <div>
          <div class="text-bold q-pb-md" style="font-size: 18px">Minhas Integrações</div>
          <div v-if="minhasIntegracoes.length" class="row q-col-gutter-md">
            <div v-for="m in minhasIntegracoes" :key="m.nome" class="col-12 col-sm-6 col-md-4">
              <q-card class="row items-center justify-between q-pa-md b-r-10 border no-shadow">
                <q-inner-loading :showing="verificandoConexao" />
                <div class="row items-center q-col-gutter-md">
                  <img :src="m.logo" style="width: 50px" />
                  <div class="column">
                    <p class="text-h6 text-bold q-ma-none">{{ m.nome }}</p>
                    <p class="q-ma-none">{{ m.tipo }}</p>
                  </div>
                </div>
                <q-btn label="Gerenciar" unelevated class="bg-primary text-white" @click="irParaDashboard(m)" />
              </q-card>
            </div>
          </div>
          <div v-else class="text-grey-6">Nenhuma integração conectada ainda.</div>
        </div>

        <!-- Integrações disponíveis -->
        <div class="q-mt-xl">
          <div class="text-bold q-pb-md" style="font-size: 18px">Integrações disponíveis</div>
          <div v-if="integracoesDisponiveis.length" class="row q-col-gutter-md">
            <div v-for="m in integracoesDisponiveis" :key="m.nome" class="col-12 col-sm-6 col-md-4">
              <q-card class="row items-center justify-between q-pa-md b-r-10 border no-shadow">
                <div class="row items-center q-col-gutter-md">
                  <img :src="m.logo" style="width: 50px" />
                  <div class="column">
                    <p class="text-h6 text-bold q-ma-none">{{ m.nome }}</p>
                    <p class="q-ma-none">{{ m.tipo }}</p>
                  </div>
                </div>
                <div class="column items-center q-gutter-xs">
                  <q-badge v-if="m.emBreve" color="positive" class="q-mb-xs">Em breve</q-badge>
                  <q-btn
                    :label="m.emBreve ? 'Indisponível' : 'Adicionar'"
                    unelevated
                    :disable="m.emBreve"
                    class="bg-primary text-white"
                    @click="!m.emBreve && irParaConectar(m)"
                  />
                </div>
              </q-card>
            </div>
          </div>
          <div v-else class="text-grey-6">Nenhuma integração disponível encontrada.</div>
        </div>

      </div>
    </div>

    <!-- TELA 2: CONECTAR -->
    <div v-if="tela === 'conectar'">
      <div class="row items-center q-gutter-md q-mb-md">
        <img :src="marketplaceSelecionado.logo" style="width: 40px" alt="" />
        <div class="text-bold text-h5">Integração com {{ marketplaceSelecionado.nome }}</div>
      </div>
      <div class="row q-gutter-sm q-mt-md">
        <q-input
          class="col-4"
          label="Nome da Integração"
          v-model="formularioIntegracao.nome"
          outlined dense
        />
        <q-btn
          class="bg-primary text-white"
          unelevated
          :loading="carregando"
          :label="'Conectar com ' + marketplaceSelecionado.nome"
          @click="conectarML()"
        />
      </div>
      <div class="q-py-md q-pl-xs" style="font-size: 12px">
        <p>
          Ao clicar no botão, você será redirecionado para a página do
          {{ marketplaceSelecionado.nome }} para realizar a autenticação e conectar sua conta com segurança.
        </p>
      </div>
      <div class="row justify-start">
        <q-btn label="Cancelar" color="negative" flat @click="abrirDialogCancelar()" />
      </div>
    </div>

    <!-- TELA 3: DASHBOARD -->
    <div v-if="tela === 'dashboard'">
      <div class="row items-center justify-between q-mb-md">
        <div class="row items-center q-gutter-md">
          <img :src="marketplaceSelecionado.logo" style="width: 40px" alt="" />
          <div>
            <div class="text-h6 text-bold">{{ marketplaceSelecionado.nome }}</div>
            <q-badge color="positive" text-color="white" class="q-px-sm q-py-xs">
              <q-icon name="circle" size="10px" class="q-mr-xs" />
              Conectado
            </q-badge>
          </div>
        </div>
      </div>

      <q-tabs
        v-model="abaAtiva"
        dense align="left"
        active-color="primary"
        indicator-color="primary"
        class="q-mb-md"
      >
        <q-tab name="visao" label="Visão Geral" />
        <q-tab name="config" label="Configurações" />
        <q-tab name="logs" label="Logs" />
        <q-tab name="produtos" label="Produtos" />
      </q-tabs>

      <q-tab-panels v-model="abaAtiva" animated>

        <!-- ABA: VISÃO GERAL -->
        <q-tab-panel name="visao" class="q-pa-none">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6 col-md-3">
              <q-card class="no-shadow border b-r-10 q-pa-md">
                <div class="text-h5 text-bold text-black">{{ totalProdutos }}</div>
                <div class="text-caption text-grey-6">Produtos sincronizados</div>
              </q-card>
            </div>
            <div class="col-6 col-md-3">
              <q-card class="no-shadow border b-r-10 q-pa-md">
                <div class="text-h5 text-bold text-black">{{ totalPedidos }}</div>
                <div class="text-caption text-grey-6">Total de pedidos</div>
              </q-card>
            </div>
          </div>
          <div class="row items-center justify-between">
            <div class="text-caption text-grey-6">
              Token expira em: <strong class="text-black">{{ tokenExpiraEm }}</strong>
            </div>
            <q-btn label="Renovar token" unelevated class="bg-primary text-white" />
          </div>
        </q-tab-panel>

        <!-- ABA: CONFIGURAÇÕES -->
        <q-tab-panel name="config" class="q-pa-none">
          <q-card class="no-shadow border b-r-10 q-pa-md q-mb-md">
            <div class="text-caption text-grey-6 q-mb-md">SINCRONIZAÇÃO</div>
            <div class="column q-gutter-sm">
              <q-toggle v-model="config.sincEstoque" label="Sincronizar estoque automaticamente" color="primary" />
              <q-toggle v-model="config.sincPrecos" label="Sincronizar preços automaticamente" color="primary" />
              <q-toggle v-model="config.publicarAuto" label="Publicar novos produtos automaticamente" color="primary" />
              <q-separator class="q-my-sm" />
              <div class="row items-center q-gutter-md">
                <span class="text-body2 text-grey-7">Frequência de sincronização</span>
                <q-select v-model="config.frequencia" :options="opcoesFrequencia" outlined dense style="min-width: 200px" />
              </div>
            </div>
          </q-card>

          <q-card class="no-shadow border b-r-10 q-pa-md q-mb-md">
            <div class="text-caption text-grey-6 q-mb-md">REGRAS DE PREÇO</div>
            <div class="row q-gutter-md items-center">
              <q-select v-model="config.tipoAjuste" :options="opcoesTipoAjuste" label="Tipo de ajuste" outlined dense class="col-3" />
              <q-input v-model="config.valorAjuste" label="Valor (%)" type="number" outlined dense class="col-2" />
              <span class="text-caption text-grey-6">
                Ex: produto R$100 → R${{ 100 + Number(config.valorAjuste) }} no {{ marketplaceSelecionado.nome }}
              </span>
            </div>
          </q-card>

          <q-card class="no-shadow border b-r-10 q-pa-md q-mb-md">
            <div class="text-caption text-grey-6 q-mb-md">MAPEAMENTO DE CATEGORIAS</div>
            <div class="column q-gutter-sm">
              <div v-for="(cat, i) in config.categorias" :key="i" class="row items-center q-gutter-md">
                <span class="text-body2 text-grey-7" style="min-width: 140px">{{ cat.origem }}</span>
                <q-icon name="arrow_forward" color="grey-5" />
                <q-select v-model="cat.destino" :options="cat.opcoes" outlined dense style="min-width: 220px" />
              </div>
            </div>
          </q-card>

          <q-card class="no-shadow border b-r-10 q-pa-md q-mb-md">
            <div class="text-caption text-grey-6 q-mb-md">DESCONECTAR INTEGRAÇÃO</div>
            <q-btn unelevated label="Desconectar" class="bg-negative text-white" @click="desconectar()" />
          </q-card>

          <div class="row justify-start q-gutter-sm">
            <q-btn label="Cancelar" flat color="grey-7" />
            <q-btn label="Salvar configurações" unelevated color="primary" />
          </div>
        </q-tab-panel>

        <!-- ABA: LOGS -->
        <q-tab-panel name="logs" class="q-pa-none">
          <div class="row items-center justify-between q-mb-md">
            <q-btn-toggle
              v-model="filtroLog"
              unelevated
              toggle-color="primary"
              color="white"
              text-color="grey-7"
              :options="[
                { label: 'Todos', value: 'todos' },
                { label: 'Erros', value: 'erro' },
                { label: 'Avisos', value: 'aviso' },
                { label: 'Sucesso', value: 'sucesso' }
              ]"
              dense
              class="border b-r-10"
            />
            <q-select
              v-model="periodoLog"
              :options="['Últimas 24h', 'Últimos 7 dias', 'Últimos 30 dias']"
              outlined dense
              style="min-width: 160px"
            />
          </div>
          <q-card class="no-shadow border b-r-10">
            <q-list separator />
          </q-card>
        </q-tab-panel>

        <!-- ABA: PRODUTOS -->
        <q-tab-panel name="produtos" class="q-pa-none">
          <div class="row items-center justify-between q-mb-md q-gutter-sm">
            <q-input v-model="buscaProduto" label="Pesquisar produto..." outlined dense style="min-width: 240px">
              <template v-slot:prepend><q-icon name="search" /></template>
            </q-input>
            <div class="row q-gutter-sm items-center">
              <q-select
                v-model="filtroProduto"
                :options="[
                  { label: 'Todos os status', value: 'todos' },
                  { label: 'Ativo', value: 'active' },
                  { label: 'Pausado', value: 'paused' },
                  { label: 'Encerrado', value: 'closed' }
                ]"
                option-label="label"
                option-value="value"
                emit-value map-options
                outlined dense
                style="min-width: 160px"
              />
              <q-btn label="Publicar selecionados" unelevated color="primary" />
            </div>
          </div>

          <q-card class="no-shadow border b-r-10">
            <q-inner-loading :showing="carregandoProdutos" />
            <q-table
              flat
              :data="produtosFiltrados"
              :columns="colunaProdutosMercadoLivre"
              :hide-bottom="produtosFiltrados.length > 0"
              bordered
              no-data-label="Nenhum registro encontrado"
              class="text-weight-medium"
            >
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge :color="props.value === 'active' ? 'positive' : props.value === 'paused' ? 'orange' : 'negative'">
                    {{ props.value === 'active' ? 'Ativo' : props.value === 'paused' ? 'Pausado' : props.value }}
                  </q-badge>
                </q-td>
              </template>
              <template v-slot:body-cell-price="props">
                <q-td :props="props" align="center">{{ formatarReais(props.row.price) }}</q-td>
              </template>
              <template v-slot:body-cell-acoes="props">
                <q-td :props="props">
                  <q-btn flat dense icon="pause" color="dark-blue" @click="pausarProduto(props.row.id)" v-if="props.row.status === 'active'" />
                  <q-btn flat dense icon="play_arrow" color="dark-blue" @click="ativarProduto(props.row.id)" v-if="props.row.status === 'paused'" />
                  <q-btn flat dense icon="open_in_new" color="primary" :href="props.row.permalink" target="_blank" />
                </q-td>
              </template>
            </q-table>
          </q-card>
        </q-tab-panel>

      </q-tab-panels>
    </div>

    <!-- Dialog Cancelar -->
    <q-dialog v-model="dialogCancelar" persistent>
      <q-card style="min-width: 380px; border-radius: 12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Cancelar operação</div>
        </q-card-section>
        <q-card-section class="text-grey-7" style="font-size: 14px">
          Deseja realmente cancelar? As alterações não salvas serão perdidas.
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn label="Voltar" unelevated style="border: 1px solid #ccc; border-radius: 8px; min-width: 100px" color="white" text-color="dark" v-close-popup />
          <q-btn label="Sim, Cancelar" unelevated color="negative" style="border-radius: 8px; min-width: 130px" @click="confirmarCancelamento()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Desconectar -->
    <q-dialog v-model="dialogDesconectar" persistent>
      <q-card style="min-width: 380px; border-radius: 12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Desconectar integração</div>
        </q-card-section>
        <q-card-section class="text-grey-7" style="font-size: 14px">
          Deseja desconectar a integração com <strong>{{ marketplaceSelecionado?.nome }}</strong>? Isso interromperá a sincronização.
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn label="Voltar" unelevated style="border: 1px solid #ccc; border-radius: 8px; min-width: 100px" color="white" text-color="dark" v-close-popup />
          <q-btn label="Sim, Desconectar" unelevated color="negative" style="border-radius: 8px; min-width: 130px" @click="confirmarDesconexao()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import gridProdutosMercadoLivre from '../config/produtosMercadoLivre.json'
import mlService, { StatusML, ProdutoML, PedidoML } from '../services/mlService'
import { NOMEM } from 'dns'

@Component
export default class ModuleComponent extends Vue {
  tela: 'inicio' | 'conectar' | 'dashboard' = 'inicio'
  abaAtiva = 'visao'
  dialogCancelar = false
  dialogDesconectar = false
  carregando = false

  marketplaceSelecionado: any = null
  statusML: StatusML | null = null
  verificandoConexao = false

  formularioIntegracao: any = { nome: '' }

  busca = ''
  buscaProduto = ''
  filtroProduto = 'todos'
  filtroLog = 'todos'
  periodoLog = 'Últimas 24h'

  colunaProdutosMercadoLivre = gridProdutosMercadoLivre.columns

  config = {
    sincEstoque: true,
    sincPrecos: true,
    publicarAuto: false,
    frequencia: 'A cada 1 hora',
    tipoAjuste: 'Markup (%)',
    valorAjuste: 10,
    categorias: [] as any[]
  }

  opcoesFrequencia = ['A cada 30 minutos', 'A cada 1 hora', 'A cada 4 horas', 'Diariamente']
  opcoesTipoAjuste = ['Sem ajuste', 'Markup (%)', 'Desconto (%)', 'Preço fixo']

  // Produtos vindos da API do ML
  produtos: ProdutoML[] = []
  totalProdutos = 0
  carregandoProdutos = false

  // Pedidos vindos da API do ML
  pedidos: PedidoML[] = []
  totalPedidos = 0

marketplaces = [
  {
    nome: 'Mercado Livre',
    tipo: 'Marketplace',
    conectado: false,
    emBreve: false,
    logo: 'https://cdn.iconscout.com/icon/free/png-256/free-mercado-livre-icon-svg-download-png-14549372.png'
  },
  {
    nome: 'Shopee',
    tipo: 'Marketplace',
    emBreve: true,
    conectado: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopee_logo.svg/1920px-Shopee_logo.svg.png'
  },
  {
    nome: 'Shopify',
    tipo: 'Marketplace',
    conectado: false,
    emBreve: true,
    logo: 'https://img.icons8.com/color/512/shopify.png'
  }
]

  // ─── LIFECYCLE ─────────────────────────────────────────────────────────────

async created() {
  await this.verificarConexaoML()
}


  // ─── COMPUTED ──────────────────────────────────────────────────────────────

  get marketplacesFiltrados() {
    if (!this.busca) return this.marketplaces
    return this.marketplaces.filter(m =>
      m.nome.toLowerCase().startsWith(this.busca.toLowerCase())
    )
  }

  formatarReais(valor: string | number): string {
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

get produtosFiltrados() {
  return this.produtos.filter(p => {
    const matchBusca = !this.buscaProduto ||
      p.title.toLowerCase().includes(this.buscaProduto.toLowerCase())
    const matchFiltro = this.filtroProduto === 'todos' || p.status === this.filtroProduto
    return matchBusca && matchFiltro
  })
}

  get tokenExpiraEm() {
    if (!this.statusML?.expira_em) return '-'
    return new Date(this.statusML.expira_em).toLocaleDateString('pt-BR')
  }

  // ─── MÉTODOS ───────────────────────────────────────────────────────────────

async verificarConexaoML() {
  const index = this.marketplaces.findIndex(m => m.nome === 'Mercado Livre')

  try {
    this.statusML = await mlService.getStatus()
    Vue.set(this.marketplaces, index, {
      ...this.marketplaces[index],
      conectado: this.statusML.conectado ?? false
    })

    if (this.statusML?.conectado) {
      await this.carregarProdutos()
      await this.carregarPedidos()
    }
  } catch {
    Vue.set(this.marketplaces, index, {
      ...this.marketplaces[index],
      conectado: false
    })
  }
}

  async irParaConectar(marketplace: any) {
    this.marketplaceSelecionado = marketplace
    this.formularioIntegracao = { nome: marketplace.nome }
    this.tela = 'conectar'
  }

async conectarML() {
  try {
    this.verificandoConexao = true
    const url = await mlService.getLoginUrl()

    this.$q.dialog({
      title: 'Conectar Mercado Livre',
      message: 'Uma janela de autenticação será aberta. Caso queira conectar uma conta diferente, certifique-se de estar deslogado do Mercado Livre antes de continuar.',
      ok: { label: 'Continuar', color: 'primary', unelevated: true },
      cancel: { label: 'Cancelar', flat: true }
    }).onOk(() => {
      const largura = 600
      const altura = 700
      const left = window.screenX + (window.outerWidth - largura) / 2
      const top = window.screenY + (window.outerHeight - altura) / 2

      const popup = window.open(
        url,
        'ml_auth',
        `width=${largura},height=${altura},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
      )

const intervalo = setInterval(async () => {
  if (popup?.closed) {
    clearInterval(intervalo)

    await new Promise(resolve => setTimeout(resolve, 2000))


    await this.verificarConexaoML()
    if (this.statusML?.conectado) {
      this.irParaDashboard(this.marketplaceSelecionado)
    } else {
      this.$q.notify({ message: 'Conexão não detectada, tente novamente', color: 'warning' })
    }
  }
}, 1000)
    })
  } catch (err) {
    this.$q.notify({ message: 'Erro ao conectar com o Mercado Livre', color: 'negative' })
  } finally {
    this.verificandoConexao = false
  }
}

async irParaDashboard(marketplace: any) {
  this.marketplaceSelecionado = marketplace
  this.abaAtiva = 'visao'
  this.tela = 'dashboard'
  const index = this.marketplaces.findIndex(x => x.nome === marketplace.nome)
  Vue.set(this.marketplaces, index, { ...this.marketplaces[index], conectado: true })
  await this.carregarProdutos()
  await this.carregarPedidos()
}

get minhasIntegracoes() {
  return this.marketplacesFiltrados.filter(m => m.conectado)
}

get integracoesDisponiveis() {
  return this.marketplacesFiltrados.filter(m => !m.conectado)
}

async carregarProdutos() {
  try {
    this.carregandoProdutos = true
    const resultado = await mlService.listarProdutos()
    this.totalProdutos = resultado.total
    this.produtos = resultado.produtos
  } catch (err) {
    console.error('Erro ao carregar produtos:', err)
    this.$q.notify({ message: 'Erro ao carregar produtos', color: 'negative' })
  } finally {
    this.carregandoProdutos = false
  }
}

  async carregarPedidos() {
    try {
      const resultado = await mlService.listarPedidos()
      this.pedidos = resultado.pedidos
      this.totalPedidos = resultado.total
    } catch (err) {
      console.error('Erro ao carregar pedidos', err)
    }
  }

  async pausarProduto(itemId: string) {
    try {
      await mlService.pausarProduto(itemId)
      this.$q.notify({ message: 'Produto pausado!', color: 'positive' })
      await this.carregarProdutos()
    } catch {
      this.$q.notify({ message: 'Erro ao pausar produto', color: 'negative' })
    }
  }

  async ativarProduto(itemId: string) {
    try {
      await mlService.ativarProduto(itemId)
      this.$q.notify({ message: 'Produto ativado!', color: 'positive' })
      await this.carregarProdutos()
    } catch {
      this.$q.notify({ message: 'Erro ao ativar produto', color: 'negative' })
    }
  }

  desconectar() {
    this.dialogDesconectar = true
  }

async confirmarDesconexao() {
  await mlService.desconectar()
  const index = this.marketplaces.findIndex(x => x.nome === this.marketplaceSelecionado?.nome)
  Vue.set(this.marketplaces, index, { ...this.marketplaces[index], conectado: false })
  this.statusML = null
  this.dialogDesconectar = false
  this.tela = 'inicio'
  this.$q.notify({ message: 'Desconectado com sucesso!', color: 'positive' })
}

  abrirDialogCancelar() {
    this.dialogCancelar = true
  }

  confirmarCancelamento() {
    this.dialogCancelar = false
    this.tela = 'inicio'
  }
}
</script>

<style scoped>
.border {
  border: 1px solid #ccc;
}
.b-r-10 {
  border-radius: 10px;
}
.btn-outline-primary {
  border: 1.5px solid #ccc;
  background-color: #f0e9f5 !important;
}
</style>
