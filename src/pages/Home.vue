<template>
  <div class="q-pa-md">

    <!-- Cabeçalho -->
    <div class="text-bold text-black row items-center" style="font-size: 28px">
      <q-icon name="dashboard" class="q-mr-md text-primary" size="28px" />Dashboard
    </div>
    <p class="text-grey-7 text-body2 q-mb-md">
      Acompanhe os principais indicadores e métricas do seu negócio em tempo real.
    </p>
    <q-separator class="q-mb-lg" />

    <!-- Filtro de datas -->
    <div class="row q-col-gutter-md q-mb-lg items-center">
      <div class="col-12 col-sm-2">
        <q-input v-model="dataInicio" label="De" type="date" outlined dense />
      </div>
      <div class="col-12 col-sm-2">
        <q-input v-model="dataFim" label="Até" type="date" outlined dense />
      </div>
      <div class="col-12 col-sm-6 q-gutter-sm row items-end">
        <q-btn label="Filtrar" icon="search" color="primary" unelevated @click="carregarDados()" />
        <q-btn label="Limpar" icon="delete_sweep" flat class="text-grey-7" @click="refreshTable()" />
      </div>
    </div>

    <!-- Cards de Métricas -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-6 col-sm-3" v-for="metrica in metricas" :key="metrica.label">
        <q-card flat bordered class="b-r-10 q-pa-md" style="position: relative;">
          <q-inner-loading :showing="carregando" size="24px" />
          <div class="row items-center justify-between q-mb-xs">
            <div class="text-caption text-grey-6 text-weight-medium">{{ metrica.label }}</div>
            <q-icon :name="metrica.icon" size="20px" color="primary" />
          </div>
          <div class="text-h5 text-bold text-black">{{ metrica.valor || '—' }}</div>
          <div class="row items-center justify-between q-mt-xs">
            <q-badge v-if="metrica.variacao" color="positive" outline>{{ metrica.variacao }}</q-badge>
            <div class="text-caption text-grey-5">{{ metrica.falta ? 'Faltam ' + metrica.falta : '' }}</div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Gráfico + Situação -->
    <div class="row q-col-gutter-md q-mb-lg">

      <!-- Gráfico com Tabs -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="b-r-10" style="position: relative;">
          <q-tabs
            v-model="abaGrafico"
            dense
            align="left"
            class="text-grey-7 q-px-md q-pt-sm"
            active-color="primary"
            indicator-color="primary"
          >
            <q-tab name="vendas" label="Vendas por dia" />
            <q-tab name="clientes" label="Vendas por cliente" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="abaGrafico" animated>

            <!-- Aba: Gráfico de linha -->
            <q-tab-panel name="vendas" class="q-pa-md">
              <div style="height: 260px; position: relative;">
                <canvas ref="graficoVendas" style="width: 100%; height: 100%;"></canvas>
              </div>
            </q-tab-panel>

            <!-- Aba: Vendas por Cliente -->
            <q-tab-panel name="clientes" class="q-pa-none">
              <q-inner-loading :showing="carregandoClientes" size="28px" />
              <q-table
                :data="vendasClientes"
                :columns="colunasClientes"
                row-key="nome_cliente"
                flat
                dense
                :loading="carregandoClientes"
                no-data-label="Nenhuma venda encontrada"
                class="q-px-sm"
                style="max-height: 320px;"
                virtual-scroll
              >
                <template v-slot:body-cell-total="props">
                  <q-td :props="props" class="text-bold text-positive">
                    {{ formatarReais(props.value) }}
                  </q-td>
                </template>
                <template v-slot:body-cell-data="props">
                  <q-td :props="props">
                    {{ formatarData(props.value) }}
                  </q-td>
                </template>
              </q-table>
            </q-tab-panel>

          </q-tab-panels>
        </q-card>
      </div>

      <!-- Situação dos Pedidos -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="b-r-10 q-pa-md" style="position: relative;">
          <q-inner-loading :showing="carregando" size="24px" />
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-bold">Situação</div>
            <q-btn label="Todos os pedidos" flat size="sm" color="primary" @click="irParaPedidos()" />
          </div>
          <div class="column q-gutter-md">
            <div v-for="sit in situacoes" :key="sit.label">
              <div class="row items-center justify-between q-mb-xs">
                <div class="row items-center q-gutter-xs">
                  <div :style="'width:8px;height:8px;border-radius:50%;background:' + sit.cor" />
                  <span class="text-body2 text-weight-medium">{{ sit.label }}</span>
                </div>
                <span class="text-body2 text-bold">{{ formatarReais(sit.valor) }}</span>
              </div>
              <q-linear-progress
                :value="totalSituacoes > 0 ? sit.valor / totalSituacoes : 0"
                :color="sit.qColor"
                track-color="grey-2"
                rounded
                size="6px"
              />
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Resumo Financeiro -->
    <div class="text-subtitle1 text-bold q-mb-md">Resumo financeiro</div>
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-6 col-sm-4 col-md-3" v-for="fin in financeiro" :key="fin.label">
        <q-card flat bordered class="b-r-10 q-pa-md text-center" style="position: relative;">
          <q-inner-loading :showing="carregando" size="20px" />
          <div
            class="text-caption text-weight-bold q-mb-xs"
            :class="fin.positivo ? 'text-positive' : 'text-negative'"
          >
            {{ fin.variacao || '—' }}
          </div>
          <div class="text-body1 text-bold text-black">{{ fin.valor || '—' }}</div>
          <div class="text-caption text-grey-6 q-mt-xs">{{ fin.label }}</div>
        </q-card>
      </div>
    </div>

    <!-- Relatório de Estoque -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-subtitle1 text-bold">Relatório de estoque</div>
    </div>

    <!-- Filtros de estoque -->
    <div class="row q-col-gutter-md q-mb-md items-center">
      <div class="col-12 col-sm-4">
        <q-input
          v-model="filtroEstoque.nome_produto"
          label="Buscar produto"
          outlined
          dense
          clearable
          @keyup.enter="carregarEstoque()"
          @clear="carregarEstoque()"
        >
          <template v-slot:append>
            <q-icon name="search" class="cursor-pointer" @click="carregarEstoque()" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-3">
        <q-select
          v-model="filtroEstoque.status"
          :options="opcoesStatusEstoque"
          label="Status"
          outlined
          dense
          clearable
          emit-value
          map-options
          @input="carregarEstoque()"
        />
      </div>
      <div class="col-12 col-sm-2">
        <q-btn label="Filtrar" icon="search" color="primary" unelevated dense @click="carregarEstoque()" />
      </div>
    </div>

    <q-card flat bordered class="b-r-10 q-mb-xl" style="position: relative;">
      <q-inner-loading :showing="carregandoEstoque" size="28px" />
      <q-table
        :data="estoque"
        :columns="colunasEstoque"
        row-key="id"
        flat
        dense
        :loading="carregandoEstoque"
        no-data-label="Nenhum produto encontrado"
        :rows-per-page-options="[10, 20, 50]"
      >
        <!-- Estoque atual com alerta se abaixo do mínimo -->
        <template v-slot:body-cell-estoque_atual="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-xs">
              <q-icon
                v-if="props.row.estoque_minimo && props.value <= props.row.estoque_minimo"
                name="warning"
                color="warning"
                size="16px"
              >
                <q-tooltip>Estoque abaixo do mínimo</q-tooltip>
              </q-icon>
              <span
                :class="props.row.estoque_minimo && props.value <= props.row.estoque_minimo
                  ? 'text-warning text-bold'
                  : 'text-black'"
              >
                {{ props.value ?? '—' }}
              </span>
            </div>
          </q-td>
        </template>

        <!-- Preço formatado -->
        <template v-slot:body-cell-preco="props">
          <q-td :props="props" class="text-bold">
            {{ formatarReais(props.value) }}
          </q-td>
        </template>
      </q-table>
    </q-card>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import Chart from 'chart.js'
import dashboardService from '../services/dashboardService'
import vendasService from '../services/vendasService'
import productService from '../services/productService'
import moment from 'moment'

@Component
export default class ModuleComponent extends Vue {

  // ── Filtros ──────────────────────────────────────────────
  dataInicio = moment().startOf('month').format('YYYY-MM-DD')
  dataFim    = ''

  // ── Loading ──────────────────────────────────────────────
  carregando         = false
  carregandoClientes = false
  carregandoEstoque  = false
  exportandoPDF      = false

  // ── Tabs do gráfico ──────────────────────────────────────
  abaGrafico = 'vendas'

  // ── Métricas ─────────────────────────────────────────────
  metricas = [
    { label: 'Total de Vendas',   icon: 'attach_money',  valor: '', variacao: '', falta: '' },
    { label: 'Total de Pedidos',  icon: 'shopping_cart', valor: '', variacao: '', falta: '' },
    { label: 'Produtos Vendidos', icon: 'inventory_2',   valor: '', variacao: '', falta: '' },
    { label: 'Ticket Médio',      icon: 'trending_up',   valor: '', variacao: '', falta: '' }
  ]

  // ── Situação dos pedidos ──────────────────────────────────
  situacoes = [
    { label: 'Cancelados',   valor: 0, cor: '#c0392b', qColor: 'negative' },
    { label: 'Em aberto',    valor: 0, cor: '#e67e22', qColor: 'warning'  },
    { label: 'Em andamento', valor: 0, cor: '#3498db', qColor: 'primary'  },
    { label: 'Verificados',  valor: 0, cor: '#27ae60', qColor: 'positive' }
  ]

  get totalSituacoes () {
    return this.situacoes.reduce((s, x) => s + x.valor, 0)
  }

  // ── Resumo financeiro ─────────────────────────────────────
  financeiro = [
    { label: 'Faturamento s/ Frete', valor: '', variacao: '', positivo: true  },
    { label: 'Preço de Custo',       valor: '', variacao: '', positivo: true  },
    { label: 'Markup',               valor: '', variacao: '', positivo: true  },
    { label: 'Lucro',                valor: '', variacao: '', positivo: false }
  ]

  // ── Vendas por Cliente ────────────────────────────────────
  vendasClientes: any[] = []

  colunasClientes = [
    { name: 'nome_cliente', label: 'Cliente', field: 'nome_cliente', align: 'left' as const,   sortable: true },
    { name: 'total',        label: 'Valor',   field: 'total',        align: 'right' as const,  sortable: true },
    { name: 'data',         label: 'Data',    field: 'data',         align: 'center' as const, sortable: true }
  ]

  // ── Estoque ───────────────────────────────────────────────
  estoque: any[] = []

  filtroEstoque = {
    nome_produto: '',
    status: ''
  }

  opcoesStatusEstoque = [
    { label: 'Ativo',    value: 'ativo'    },
    { label: 'Inativo',  value: 'inativo'  },
    { label: 'Suspenso', value: 'suspenso' }
  ]

  colunasEstoque = [
    {
      name: 'nome_produto',
      label: 'Produto',
      field: 'nome_produto',
      align: 'left' as const,
      sortable: true
    },
    {
      name: 'estoque_atual',
      label: 'Estoque Atual',
      field: 'estoque_atual',
      align: 'center' as const,
      sortable: true
    },
    {
      name: 'estoque_minimo',
      label: 'Estoque Mínimo',
      field: 'estoque_minimo',
      align: 'center' as const,
      sortable: true
    },
    {
      name: 'preco',
      label: 'Preço',
      field: 'preco',
      align: 'right' as const,
      sortable: true
    }
  ]

  // ── Gráfico ───────────────────────────────────────────────
  chart: any = null

  // ── Watcher: troca de aba ────────────────────────────────
  @Watch('abaGrafico')
  onAbaGraficoChange (aba: string) {
    if (aba === 'clientes') {
      this.carregarVendasClientes()
    } else if (aba === 'vendas') {
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.chart) {
            this.chart.destroy()
            this.chart = null
          }
          this.carregarDados()
        }, 150)
      })
    }
  }

  // ── Lifecycle ────────────────────────────────────────────

  async mounted () {
    await Promise.all([
      this.carregarDados(),
      this.carregarEstoque()
    ])
  }

  beforeDestroy () {
    if (this.chart) this.chart.destroy()
  }

  // ── Métodos ───────────────────────────────────────────────

  async carregarDados () {
    try {
      this.carregando = true

      const [metricas, situacao, grafico, financeiro] = await Promise.all([
        dashboardService.getMetricas(this.dataInicio, this.dataFim),
        dashboardService.getSituacaoPedidos(),
        dashboardService.getGraficoVendas(this.dataInicio, this.dataFim),
        dashboardService.getFinanceiro(
          this.dataInicio || undefined,
          this.dataFim    || undefined
        )
      ])

      this.metricas[0].valor = this.formatarReais(metricas.totalVendas)
      this.metricas[1].valor = String(metricas.totalPedidos)
      this.metricas[2].valor = String(metricas.produtosVendidos)
      this.metricas[3].valor = this.formatarReais(metricas.ticketMedio)

      this.aplicarSituacao(situacao)
      this.atualizarGrafico(grafico)
      this.aplicarFinanceiro(financeiro)

    } catch (error) {
      this.$q.notify({ type: 'negative', message: 'Erro ao carregar dashboard' })
    } finally {
      this.carregando = false
    }
  }

  async carregarEstoque () {
    try {
      this.carregandoEstoque = true

      const dados = await productService.relatorioEstoque({
        nome_produto: this.filtroEstoque.nome_produto || undefined,
        status:       this.filtroEstoque.status       || undefined
      })

      this.estoque = dados

    } catch (error) {
      this.$q.notify({ type: 'negative', message: 'Erro ao carregar estoque' })
    } finally {
      this.carregandoEstoque = false
    }
  }

  async exportarEstoquePDF () {
    try {
      this.exportandoPDF = true

      await productService.relatorioEstoquePDF({
        nome_produto: this.filtroEstoque.nome_produto || undefined,
        status:       this.filtroEstoque.status       || undefined
      })

    } catch (error) {
      this.$q.notify({ type: 'negative', message: 'Erro ao exportar PDF' })
    } finally {
      this.exportandoPDF = false
    }
  }

  async carregarVendasClientes () {
    try {
      this.carregandoClientes = true

      const dados = await vendasService.relatorioVendas({
        de:  this.dataInicio || undefined,
        ate: this.dataFim    || undefined
      })

      this.vendasClientes = dados.map((v: any) => ({
        nome_cliente: v.nome_cliente || v.cliente || '—',
        total:        v.total        ?? v.valor   ?? 0,
        data:         v.data         ?? v.created_at ?? ''
      }))

    } catch (error) {
      this.$q.notify({ type: 'negative', message: 'Erro ao carregar vendas por cliente' })
    } finally {
      this.carregandoClientes = false
    }
  }

  aplicarSituacao (dados: any[]) {
    this.situacoes.forEach(s => { s.valor = 0 })
    dados.forEach(item => {
      switch (item.status) {
        case 'cancelada':  this.situacoes[0].valor = item.valor; break
        case 'aberta':     this.situacoes[1].valor = item.valor; break
        case 'andamento':  this.situacoes[2].valor = item.valor; break
        case 'concluida':  this.situacoes[3].valor = item.valor; break
      }
    })
  }

  aplicarFinanceiro (data: any) {
    this.financeiro[0].valor = this.formatarReais(data.faturamentoSemFrete)
    this.financeiro[1].valor = this.formatarReais(data.precoCusto)
    this.financeiro[2].valor    = data.markup + '%'
    this.financeiro[2].positivo = data.markup >= 0
    this.financeiro[3].label    = `Lucro (${data.percentualLucro}%)`
    this.financeiro[3].valor    = this.formatarReais(data.lucro)
    this.financeiro[3].positivo = data.lucro >= 0
  }

  atualizarGrafico (data: any[]) {
    const labels = data.map((d: any) => d.data)
    const dados  = data.map((d: any) => d.valor)
    this.$nextTick(() => {
      setTimeout(() => {
        this.inicializarGrafico(labels, dados)
      }, 100)
    })
  }

inicializarGrafico (labels: string[], dados: number[]) {
  const canvas = this.$refs.graficoVendas as HTMLCanvasElement
  if (!canvas) return

  if (this.chart) {
    this.chart.destroy()
    this.chart = null
  }

  const dark       = this.$q.dark.isActive
  const gridColor  = dark ? '#2a2a42' : '#f5f5f5'
  const tickColor  = dark ? '#7070a0' : '#aaaaaa'
  const tooltipBg  = dark ? '#1a1a2e' : '#ffffff'
  const tooltipBorder = dark ? '#2a2a42' : '#eeeeee'

  this.chart = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data: dados,
        borderColor: '#1976D2',
        backgroundColor: dark
          ? 'rgba(25,118,210,0.15)'
          : 'rgba(25,118,210,0.07)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#1976D2',
        pointBorderColor: dark ? '#1a1a2e' : '#ffffff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: { display: false },
      scales: {
        xAxes: [{
          gridLines: { color: gridColor },
          ticks: { fontSize: 11, fontColor: tickColor, padding: 8 }
        }],
        yAxes: [{
          gridLines: { color: gridColor },
          ticks: {
            fontSize: 11,
            fontColor: tickColor,
            padding: 8,
            callback: (v: number) => 'R$ ' + v.toLocaleString('pt-BR')
          }
        }]
      },
      tooltips: {
        backgroundColor: tooltipBg,
        titleFontColor: tickColor,
        bodyFontColor: dark ? '#e8e8f0' : '#222222',
        borderColor: tooltipBorder,
        borderWidth: 1,
        callbacks: {
          label: (item: any) =>
            ' R$ ' + Number(item.yLabel).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
        }
      }
    }
  })
}

@Watch('$q.dark.isActive')
onDarkModeChange () {
  this.$nextTick(() => {
    setTimeout(() => {
      if (this.chart) {
        this.chart.destroy()
        this.chart = null
      }
      this.carregarDados()
    }, 100)
  })
}

  irParaPedidos () {
    // this.$router.push('/pedidos')
  }

  formatarReais (valor: number): string {
    if (!valor && valor !== 0) return '—'
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  formatarData (data: string): string {
    if (!data) return '—'
    const d = new Date(data)
    if (isNaN(d.getTime())) return data
    return d.toLocaleDateString('pt-BR')
  }

  async refreshTable () {
    this.limparCampos()
    await Promise.all([
      this.carregarDados(),
      this.carregarEstoque()
    ])
    if (this.abaGrafico === 'clientes') {
      await this.carregarVendasClientes()
    }
  }

  limparCampos () {
    this.dataInicio = ''
    this.dataFim    = ''
  }
}
</script>

<style scoped>
.b-r-10 { border-radius: 10px; }
</style>
