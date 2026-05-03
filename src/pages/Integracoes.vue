<template>
  <div class="row justify-center items-center">
    <q-card
      class="col-11 col-md-10 col-lg-9 no-shadow border b-r-10"
      style="width: 1500px"
    >
      <!-- HEADER -->
      <q-card-section class="bg-white text-primary q-pb-none">
        <div class="text-h5 text-bold">Integrações</div>
        <q-toolbar class="q-pa-none">
          <q-breadcrumbs
            active-color="primary"
            style="font-size: 14px"
            class="q-mb-md"
          >
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el label="Home" icon="home" to="/" />
            <q-breadcrumbs-el label="Integrações" icon="webhook" />
          </q-breadcrumbs>
        </q-toolbar>
      </q-card-section>

      <q-separator />

      <!-- TELA 1: LISTA DE MARKETPLACES -->
      <q-card-section v-if="tela === 'inicio'" class="q-pa-lg">
        <div class="row q-pb-md items-center" style="margin-top: -10px">
          Caso não saiba como fazer uma integração, clique aqui para ver o
          tutorial:
          <span>
            <q-icon
              class="cursor-pointer"
              color="orange"
              name="o_info"
              size="18px"
              style="margin-bottom: 1.5px; margin-left: 5px"
            />
          </span>
        </div>
        <div class="row items-center justify-between q-gutter-sm">
          <q-input
            class="col-3"
            label="Pesquise pelo nome da integração"
            outlined
            v-model="busca"
            dense
          />
        </div>
        <div class="q-mt-lg">
          <div class="row q-col-gutter-md">
            <div
              v-for="m in marketplacesFiltrados"
              :key="m.nome"
              class="col-12 col-sm-6 col-md-4"
            >
              <q-card
                class="row items-center justify-between q-pa-md b-r-10 border no-shadow"
              >
                <div class="row items-center q-col-gutter-md">
                  <img :src="m.logo" style="width: 50px" />
                  <div class="column">
                    <p class="text-h6 text-bold q-ma-none">{{ m.nome }}</p>
                    <p class="q-ma-none">{{ m.tipo }}</p>
                  </div>
                </div>
                <div class="column items-end q-gutter-xs">
                  <q-btn
                    :label="m.conectado ? 'Gerenciar' : 'Adicionar'"
                    unelevated
                    class="btn-outline-primary text-primary"
                    @click="m.conectado ? irParaDashboard(m) : irParaConectar(m)"
                  />
                </div>
              </q-card>
            </div>
            <div
              v-if="marketplacesFiltrados.length === 0"
              class="col-12 q-pa-md text-grey-6"
            >
              Nenhuma integração encontrada
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- TELA 2: CONECTAR (autenticação) -->
      <q-card-section v-if="tela === 'conectar'" class="q-pa-lg">
        <div class="row items-center q-gutter-md q-mb-md">
          <img :src="marketplaceSelecionado.logo" style="width: 40px" alt="" />
          <div class="text-bold text-h5">
            Integração com {{ marketplaceSelecionado.nome }}
          </div>
        </div>
        <div class="row q-gutter-sm q-mt-md">
          <q-input
            class="col-4"
            label="Nome da Integração"
            v-model="formularioIntegracao.nome"
            outlined
            dense
          />
          <q-btn
            class="btn-outline-primary text-primary"
            unelevated
            :loading="carregando"
            :label="'Conectar com ' + marketplaceSelecionado.nome"
            @click="conectarML()"
          />
        </div>
        <div class="q-py-md q-pl-xs" style="font-size: 12px">
          <p>
            Ao clicar no botão, você será redirecionado para a página do
            {{ marketplaceSelecionado.nome }} para realizar a autenticação e
            conectar sua conta com segurança.
          </p>
        </div>
        <div class="row justify-end">
          <q-btn
            label="Cancelar"
            color="negative"
            flat
            @click="abrirDialogCancelar()"
          />
        </div>
      </q-card-section>

      <!-- TELA 3: DASHBOARD / GERENCIAR INTEGRAÇÃO -->
      <q-card-section v-if="tela === 'dashboard'" class="q-pa-lg">
        <!-- Cabeçalho do marketplace -->
        <div class="row items-center justify-between q-mb-md">
          <div class="row items-center q-gutter-md">
            <img
              :src="marketplaceSelecionado.logo"
              style="width: 40px"
              alt=""
            />
            <div>
              <div class="text-h6 text-bold">
                {{ marketplaceSelecionado.nome }}
              </div>
              <q-badge
                color="green-2"
                text-color="green-9"
                class="q-px-sm q-py-xs"
              >
                <q-icon name="circle" size="10px" class="q-mr-xs" />
                Conectado
              </q-badge>
            </div>
          </div>
        </div>

        <!-- Tabs de navegação -->
        <q-tabs
          v-model="abaAtiva"
          dense
          align="left"
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
                  <div class="text-h5 text-bold text-primary">
                    {{ totalProdutos }}
                  </div>
                  <div class="text-caption text-grey-6">
                    Produtos sincronizados
                  </div>
                </q-card>
              </div>
              <div class="col-6 col-md-3">
                <q-card class="no-shadow border b-r-10 q-pa-md">
                  <div class="text-h5 text-bold text-primary">
                    {{ totalPedidos }}
                  </div>
                  <div class="text-caption text-grey-6">Total de pedidos</div>
                </q-card>
              </div>
            </div>
            <div class="row items-center justify-between">
              <div class="text-caption text-grey-6">
                Token expira em:
                <strong class="text-primary">{{ tokenExpiraEm }}</strong>
              </div>
              <q-btn
                label="Renovar token"
                unelevated
                class="btn-outline-primary text-primary"
              />
            </div>
          </q-tab-panel>
          <!-- ABA: CONFIGURAÇÕES -->
          <q-tab-panel name="config" class="q-pa-none">
            <q-card class="no-shadow border b-r-10 q-pa-md q-mb-md">
              <div class="text-caption text-grey-6 q-mb-md">SINCRONIZAÇÃO</div>
              <div class="column q-gutter-sm">
                <q-toggle
                  v-model="config.sincEstoque"
                  label="Sincronizar estoque automaticamente"
                  color="primary"
                />
                <q-toggle
                  v-model="config.sincPrecos"
                  label="Sincronizar preços automaticamente"
                  color="primary"
                />
                <q-toggle
                  v-model="config.publicarAuto"
                  label="Publicar novos produtos automaticamente"
                  color="primary"
                />
                <q-separator class="q-my-sm" />
                <div class="row items-center q-gutter-md">
                  <span class="text-body2 text-grey-7"
                    >Frequência de sincronização</span
                  >
                  <q-select
                    v-model="config.frequencia"
                    :options="opcoesFrequencia"
                    outlined
                    dense
                    style="min-width: 200px"
                  />
                </div>
              </div>
            </q-card>

            <q-card class="no-shadow border b-r-10 q-pa-md q-mb-md">
              <div class="text-caption text-grey-6 q-mb-md">
                REGRAS DE PREÇO
              </div>
              <div class="row q-gutter-md items-center">
                <q-select
                  v-model="config.tipoAjuste"
                  :options="opcoesTipoAjuste"
                  label="Tipo de ajuste"
                  outlined
                  dense
                  class="col-3"
                />
                <q-input
                  v-model="config.valorAjuste"
                  label="Valor (%)"
                  type="number"
                  outlined
                  dense
                  class="col-2"
                />
                <span class="text-caption text-grey-6">
                  Ex: produto R$100 → R${{ 100 + Number(config.valorAjuste) }}
                  no {{ marketplaceSelecionado.nome }}
                </span>
              </div>
            </q-card>

            <q-card class="no-shadow border b-r-10 q-pa-md q-mb-md">
              <div class="text-caption text-grey-6 q-mb-md">
                MAPEAMENTO DE CATEGORIAS
              </div>
              <div class="column q-gutter-sm">
                <div
                  v-for="(cat, i) in config.categorias"
                  :key="i"
                  class="row items-center q-gutter-md"
                >
                  <span
                    class="text-body2 text-grey-7"
                    style="min-width: 140px"
                    >{{ cat.origem }}</span
                  >
                  <q-icon name="arrow_forward" color="grey-5" />
                  <q-select
                    v-model="cat.destino"
                    :options="cat.opcoes"
                    outlined
                    dense
                    style="min-width: 220px"
                  />
                </div>
              </div>
            </q-card>

            <q-card class="no-shadow border b-r-10 q-pa-md q-mb-md">
              <div class="text-caption text-grey-6 q-mb-md">
                DESCONECTAR INTEGRAÇÃO
              </div>
              <q-btn
                unelevated
                label="Desconectar"
                class="bg-negative text-white"
                @click="desconectar()"
              />
            </q-card>

            <div class="row justify-end q-gutter-sm">
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
                outlined
                dense
                style="min-width: 160px"
              />
            </div>

            <q-card class="no-shadow border b-r-10">
              <q-list separator> </q-list>
            </q-card>
          </q-tab-panel>

          <q-tab-panel name="produtos" class="q-pa-none">
            <div class="row items-center justify-between q-mb-md q-gutter-sm">
              <q-input
                v-model="buscaProduto"
                label="Pesquisar produto..."
                outlined
                dense
                style="min-width: 240px"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
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
  emit-value
  map-options
  outlined
  dense
  style="min-width: 160px"
/>
                <q-btn
                  label="Publicar selecionados"
                  unelevated
                  color="primary"
                />
              </div>
            </div>

            <!-- ABA: PRODUTOS -->
            <q-card class="no-shadow border b-r-10">
              <q-inner-loading :showing="carregandoProdutos" />
              <q-table
                flat
                :rows="produtosFiltrados"
                :columns="[
      { name: 'title', label: 'Produto', field: 'title', align: 'left' },
      { name: 'preco', label: 'Preço', field: 'price', align: 'center', format: v => `R$ ${v.toFixed(2)}` },
      { name: 'estoque', label: 'Estoque', field: 'available_quantity', align: 'center' },
      { name: 'status', label: 'Status', field: 'status', align: 'center' },
      { name: 'acoes', label: 'Ações', field: 'id', align: 'center' }
    ]"
                row-key="id"
                hide-bottom
              >
                <template v-slot:body-cell-status="props">
                  <q-td :props="props">
                    <q-badge
                      :color="props.value === 'active' ? 'green-2' : props.value === 'paused' ? 'orange-2' : 'red-2'"
                      :text-color="props.value === 'active' ? 'green-9' : props.value === 'paused' ? 'orange-9' : 'red-9'"
                    >
                      {{ props.value === 'active' ? 'Ativo' : props.value === 'paused' ? 'Pausado' : props.value }}
                    </q-badge>
                  </q-td>
                </template>
                <template v-slot:body-cell-acoes="props">
                  <q-td :props="props">
                    <q-btn
                      flat
                      dense
                      icon="pause"
                      color="orange"
                      @click="pausarProduto(props.value)"
                      v-if="props.row.status === 'active'"
                    />
                    <q-btn
                      flat
                      dense
                      icon="play_arrow"
                      color="green"
                      @click="ativarProduto(props.value)"
                      v-if="props.row.status === 'paused'"
                    />
                    <q-btn
                      flat
                      dense
                      icon="open_in_new"
                      color="grey"
                      :href="props.row.permalink"
                      target="_blank"
                    />
                  </q-td>
                </template>
              </q-table>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
      <!-- fecha dashboard -->
    </q-card>

    <!-- DIALOG CANCELAR -->
    <q-dialog v-model="dialogCancelar" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"
            >Deseja realmente cancelar? As alterações não salvas serão
            perdidas.</span
          >
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Não" color="primary" v-close-popup />
          <q-btn
            flat
            label="Sim, Cancelar"
            color="negative"
            @click="confirmarCancelamento()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- DIALOG DESCONECTAR -->
    <q-dialog v-model="dialogDesconectar" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span
            >Deseja desconectar a integração com
            <strong>{{ marketplaceSelecionado?.nome }}</strong
            >? Isso interromperá a sincronização.</span
          >
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Não" color="primary" v-close-popup />
          <q-btn
            flat
            label="Sim, Desconectar"
            color="negative"
            @click="confirmarDesconexao()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import mlService, { StatusML, ProdutoML, PedidoML } from '../services/mlService'

@Component
export default class ModuleComponent extends Vue {
  tela: 'inicio' | 'conectar' | 'dashboard' = 'inicio'
  abaAtiva = 'visao'
  dialogCancelar = false
  dialogDesconectar = false
  carregando = false

  marketplaceSelecionado: any = null
  statusML: StatusML | null = null

  formularioIntegracao: any = { nome: '' }

  busca = ''
  buscaProduto = ''
  filtroProduto = 'todos'
  filtroLog = 'todos'
  periodoLog = 'Últimas 24h'

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
      logo: 'https://cdn.iconscout.com/icon/free/png-256/free-mercado-livre-icon-svg-download-png-14549372.png'
    }
  ]

  // ─── LIFECYCLE ─────────────────────────────────────────────────────────────

  async created() {
    await this.verificarConexaoML()
    this.carregarProdutos()
  }

  // ─── COMPUTED ──────────────────────────────────────────────────────────────

  get marketplacesFiltrados() {
    if (!this.busca) return this.marketplaces
    return this.marketplaces.filter(m =>
      m.nome.toLowerCase().startsWith(this.busca.toLowerCase())
    )
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
    try {
      this.statusML = await mlService.getStatus()
      const ml = this.marketplaces.find(m => m.nome === 'Mercado Livre')
      if (ml) ml.conectado = this.statusML.conectado
    } catch {
      // Não conectado ainda, ignora
    }
  }

  async irParaConectar(marketplace: any) {
    this.marketplaceSelecionado = marketplace
    this.formularioIntegracao = { nome: marketplace.nome }
    this.tela = 'conectar'
  }

async conectarML() {
  try {
    this.carregando = true
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
    this.carregando = false
  }
}

  async irParaDashboard(marketplace: any) {
    this.marketplaceSelecionado = marketplace
    this.abaAtiva = 'visao'
    this.tela = 'dashboard'
    const m = this.marketplaces.find(x => x.nome === marketplace.nome)
    if (m) m.conectado = true
    await this.carregarProdutos()
    await this.carregarPedidos()
  }

async carregarProdutos() {
  try {
    this.carregandoProdutos = true
    const resultado = await mlService.listarProdutos()
    this.totalProdutos = resultado.total
    this.$set(this, 'produtos', resultado.produtos)
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
  const m = this.marketplaces.find(x => x.nome === this.marketplaceSelecionado?.nome)
  if (m) m.conectado = false
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
