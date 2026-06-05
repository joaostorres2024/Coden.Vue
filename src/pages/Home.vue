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
      <div class="col-12 col-sm-2 row items-end">
        <q-btn
          label="Filtrar"
          icon="search"
          color="primary"
          unelevated
          @click="carregarDados()"
        />
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

    <!-- Metas + Situação -->
    <div class="row q-col-gutter-md q-mb-lg">

      <!-- Metas em andamento -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="b-r-10 q-pa-md" style="position: relative;">
          <q-inner-loading :showing="carregandoMetas" size="24px" />
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-bold">Metas em andamento</div>
            <q-btn
              label="Nova meta"
              icon="add"
              color="primary"
              unelevated
              size="sm"
              @click="dialogNovaMeta = true"
            />
          </div>

          <div v-if="!carregandoMetas && metas.length" class="column q-gutter-md">
            <div v-for="meta in metas" :key="meta.id">
              <div class="row items-center justify-between q-mb-xs">
                <span class="text-body2 text-weight-medium">{{ meta.nome }}</span>
                <span class="text-caption text-grey-6">
                  {{ formatarReais(meta.atual) }} / {{ formatarReais(meta.objetivo) }}
                </span>
              </div>
              <q-linear-progress
                :value="meta.atual / meta.objetivo"
                color="primary"
                track-color="grey-3"
                rounded
                size="8px"
              />
              <div class="row justify-between q-mt-xs">
                <span class="text-caption text-grey-6">{{ Math.round((meta.atual / meta.objetivo) * 100) }}%</span>
                <span class="text-caption text-grey-6">Faltam {{ formatarReais(meta.objetivo - meta.atual) }}</span>
              </div>
            </div>
          </div>

          <div v-if="!carregandoMetas && !metas.length" class="column items-center q-py-lg text-grey-5">
            <q-icon name="flag" size="36px" />
            <div class="q-mt-sm text-body2">Nenhuma meta cadastrada</div>
          </div>
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

    <!-- Gráfico -->
    <q-card flat bordered class="b-r-10 q-mb-lg" style="position: relative;">
      <q-inner-loading size="24px" />
      <div class="q-pa-md">
        <div class="text-subtitle1 text-bold q-mb-md">Valor total de pedidos por dia</div>>
      </div>
    </q-card>

    <!-- Resumo Financeiro -->
    <div class="text-subtitle1 text-bold q-mb-md">Resumo financeiro</div>
    <div class="row q-col-gutter-md">
      <div class="col-6 col-sm-4 col-md-2" v-for="fin in financeiro" :key="fin.label">
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

    <!-- Dialog Nova Meta -->
    <q-dialog v-model="dialogNovaMeta" persistent>
      <q-card style="min-width: 380px; border-radius: 12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Nova Meta</div>
        </q-card-section>
        <q-card-section>
          <div class="column q-gutter-md">
            <q-input v-model="novaMeta.nome" label="Nome da meta" outlined dense />
            <q-input v-model.number="novaMeta.objetivo" label="Valor objetivo (R$)" type="number" outlined dense />
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn
            label="Cancelar"
            unelevated
            style="border: 1px solid #ccc; border-radius: 8px; min-width: 100px"
            color="white"
            text-color="dark"
            v-close-popup
          />
          <q-btn
            label="Salvar"
            unelevated
            color="primary"
            style="border-radius: 8px; min-width: 100px"
            :loading="salvandoMeta"
            @click="salvarMeta()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as Chart from 'chart.js'
// import dashboardService from '../../services/dashboardService'

@Component
export default class ModuleComponent extends Vue {

  // ── Filtros ──────────────────────────────────────────────
  dataInicio = ''
  dataFim    = ''

  // ── Loading ──────────────────────────────────────────────
  carregando      = false
  carregandoMetas = false
  salvandoMeta    = false

  // ── Métricas ─────────────────────────────────────────────
  metricas = [
    { label: 'Total de Vendas',   icon: 'attach_money',  valor: '', variacao: '', falta: '' },
    { label: 'Total de Pedidos',  icon: 'shopping_cart', valor: '', variacao: '', falta: '' },
    { label: 'Produtos Vendidos', icon: 'inventory_2',   valor: '', variacao: '', falta: '' },
    { label: 'Ticket Médio',      icon: 'trending_up',   valor: '', variacao: '', falta: '' }
  ]

  // ── Metas ────────────────────────────────────────────────
  dialogNovaMeta = false
  novaMeta = { nome: '', objetivo: 0 }
  metas: any[] = []

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
    { label: 'Impostos',             valor: '', variacao: '', positivo: false },
    { label: 'Taxa Venda',           valor: '', variacao: '', positivo: false },
    { label: 'Lucro',                valor: '', variacao: '', positivo: false }
  ]

  // ── Gráfico ───────────────────────────────────────────────
  chart: any = null

  // ── Lifecycle ────────────────────────────────────────────
  async created () {
    // await this.carregarDados()
    // await this.carregarMetas()
  }

  mounted () {
    this.inicializarGrafico([], [])
  }

  beforeDestroy () {
    if (this.chart) this.chart.destroy()
  }

  // ── Métodos ───────────────────────────────────────────────

  async carregarDados () {
    // try {
    //   this.carregando = true
    //   const [metricas, situacao, grafico, financeiro] = await Promise.all([
    //     dashboardService.getMetricas(this.dataInicio, this.dataFim),
    //     dashboardService.getSituacaoPedidos(this.dataInicio, this.dataFim),
    //     dashboardService.getGraficoVendas(this.dataInicio, this.dataFim),
    //     dashboardService.getResumoFinanceiro(this.dataInicio, this.dataFim)
    //   ])
    //   this.aplicarMetricas(metricas)
    //   this.aplicarSituacao(situacao)
    //   this.aplicarFinanceiro(financeiro)
    //   this.atualizarGrafico(grafico)
    // } catch {
    //   this.$q.notify({ type: 'negative', message: 'Erro ao carregar dados do dashboard!' })
    // } finally {
    //   this.carregando = false
    // }
  }

  async carregarMetas () {
    // try {
    //   this.carregandoMetas = true
    //   this.metas = await dashboardService.getMetas()
    // } catch {
    //   this.$q.notify({ type: 'negative', message: 'Erro ao carregar metas!' })
    // } finally {
    //   this.carregandoMetas = false
    // }
  }

  aplicarMetricas (data: any) {
    this.metricas[0].valor    = this.formatarReais(data.totalVendas)
    this.metricas[0].variacao = data.variacaoVendas
    this.metricas[0].falta    = this.formatarReais(data.metaFaltaVendas)

    this.metricas[1].valor    = String(data.totalPedidos)
    this.metricas[1].variacao = data.variacaoPedidos
    this.metricas[1].falta    = data.metaFaltaPedidos + ' pedidos'

    this.metricas[2].valor    = String(data.totalProdutosVendidos)
    this.metricas[2].variacao = data.variacaoProdutos
    this.metricas[2].falta    = data.metaFaltaProdutos + ' unidades'

    this.metricas[3].valor    = this.formatarReais(data.ticketMedio)
    this.metricas[3].variacao = data.variacaoTicket
    this.metricas[3].falta    = this.formatarReais(data.metaFaltaTicket)
  }

  aplicarSituacao (data: any) {
    this.situacoes[0].valor = data.cancelados
    this.situacoes[1].valor = data.emAberto
    this.situacoes[2].valor = data.emAndamento
    this.situacoes[3].valor = data.verificados
  }

  aplicarFinanceiro (data: any) {
    this.financeiro[0].valor    = this.formatarReais(data.faturamentoSemFrete)
    this.financeiro[0].variacao = data.variacaoFaturamento
    this.financeiro[0].positivo = data.variacaoFaturamento?.startsWith('+') ?? true

    this.financeiro[1].valor    = this.formatarReais(data.precoCusto)
    this.financeiro[1].variacao = data.variacaoCusto
    this.financeiro[1].positivo = data.variacaoCusto?.startsWith('+') ?? true

    this.financeiro[2].valor    = data.markup + '%'
    this.financeiro[2].variacao = data.variacaoMarkup
    this.financeiro[2].positivo = data.variacaoMarkup?.startsWith('+') ?? true

    this.financeiro[3].label    = `Impostos (${data.percentualImpostos}%)`
    this.financeiro[3].valor    = this.formatarReais(data.impostos)
    this.financeiro[3].variacao = data.variacaoImpostos

    this.financeiro[4].label    = `Taxa Venda (${data.percentualTaxa}%)`
    this.financeiro[4].valor    = this.formatarReais(data.taxaVenda)
    this.financeiro[4].variacao = data.variacaoTaxa

    this.financeiro[5].label    = `Lucro (${data.percentualLucro}%)`
    this.financeiro[5].valor    = this.formatarReais(data.lucro)
    this.financeiro[5].variacao = data.variacaoLucro
    this.financeiro[5].positivo = data.variacaoLucro?.startsWith('+') ?? false
  }

  atualizarGrafico (data: any[]) {
    const labels = data.map((d: any) => d.data)
    const dados  = data.map((d: any) => d.valor)
    this.inicializarGrafico(labels, dados)
  }

  inicializarGrafico (labels: string[], dados: number[]) {
    const canvas = this.$refs.graficoVendas as HTMLCanvasElement
    if (!canvas) return
    if (this.chart) this.chart.destroy()

    this.chart = new (Chart as any)(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: dados,
          borderColor: '#1976D2',
          backgroundColor: 'rgba(25,118,210,0.07)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: '#1976D2',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          xAxes: [{
            gridLines: { color: '#f5f5f5' },
            ticks: { fontSize: 11, fontColor: '#aaa', padding: 8 }
          }],
          yAxes: [{
            gridLines: { color: '#f5f5f5' },
            ticks: {
              fontSize: 11,
              fontColor: '#aaa',
              padding: 8,
              callback: (v: number) => 'R$ ' + v.toLocaleString('pt-BR')
            }
          }]
        },
        tooltips: {
          backgroundColor: '#fff',
          titleFontColor: '#999',
          bodyFontColor: '#222',
          borderColor: '#eee',
          borderWidth: 1,
          callbacks: {
            label: (item: any) =>
              ' R$ ' + Number(item.yLabel).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
          }
        }
      }
    })
  }

  async salvarMeta () {
    if (!this.novaMeta.nome || !this.novaMeta.objetivo) {
      this.$q.notify({ type: 'warning', message: 'Preencha todos os campos!' })
      return
    }
    // try {
    //   this.salvandoMeta = true
    //   await dashboardService.criarMeta(this.novaMeta)
    //   this.$q.notify({ type: 'positive', message: 'Meta criada com sucesso!' })
    //   this.novaMeta = { nome: '', objetivo: 0 }
    //   this.dialogNovaMeta = false
    //   await this.carregarMetas()
    // } catch {
    //   this.$q.notify({ type: 'negative', message: 'Erro ao salvar meta!' })
    // } finally {
    //   this.salvandoMeta = false
    // }
  }

  irParaPedidos () {
    // this.$router.push('/pedidos')
  }

  formatarReais (valor: number): string {
    if (!valor && valor !== 0) return '—'
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }
}
</script>

<style scoped>
.b-r-10 { border-radius: 10px; }
</style>
