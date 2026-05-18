<template>
  <div class="q-pa-md">

    <!-- Cabeçalho -->
    <div class="text-bold text-black row items-center" style="font-size: 28px">
      <q-icon name="sell" class="q-mr-md text-primary" size="28px" />Relatório de Vendas
    </div>
    <p class="text-grey-7 text-body2 q-mb-md">
      Analise as vendas por período, cliente, produto e forma de pagamento. Exporte os dados em PDF ou Excel.
    </p>
    <q-separator class="q-mb-lg" />

    <!-- Filtros -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-4">
        <q-input v-model="filtro.cliente" label="Cliente" outlined dense />
      </div>
      <div class="col-12 col-sm-4">
        <q-input v-model="filtro.produto" label="Produto" outlined dense />
      </div>
      <div class="col-12 col-sm-4">
        <q-select
          v-model="filtro.forma_pagamento"
          :options="opcoesPagamento"
          option-label="label"
          option-value="value"
          emit-value map-options
          label="Forma de Pagamento"
          outlined dense clearable
        />
      </div>
      <div class="col-12 col-sm-4">
        <q-input v-model="filtro.de" label="De" type="date" outlined dense />
      </div>
      <div class="col-12 col-sm-4">
        <q-input v-model="filtro.ate" label="Até" type="date" outlined dense />
      </div>
    </div>

    <!-- Botões -->
    <div class="row justify-between items-center q-mb-lg">
      <div class="row q-gutter-sm">
        <q-btn
          label="Gerar Relatório"
          icon="summarize"
          color="primary"
          unelevated
          :loading="carregando"
          @click="gerarRelatorio()"
        />
        <q-btn
          label="Limpar"
          icon="delete_sweep"
          flat
          class="text-grey-7"
          @click="limparFiltros()"
        />
      </div>
      <div v-if="gerado" class="row q-gutter-sm">
        <q-btn label="Exportar PDF" icon="picture_as_pdf" color="negative" unelevated @click="exportarPDF()" />
        <q-btn label="Exportar Excel" icon="table_view" color="positive" unelevated @click="exportarExcel()" />
      </div>
    </div>

    <!-- Cards de Resumo -->
    <div v-if="gerado" class="row q-col-gutter-md q-mb-lg q-mt-md">
      <div class="col-6 col-sm-3">
        <q-card flat bordered class="b-r-10 q-pa-md">
          <div class="text-caption text-grey-6">Total de Vendas</div>
          <div class="text-h5 text-bold text-black q-mt-xs">{{ rows.length }}</div>
        </q-card>
      </div>
      <div class="col-6 col-sm-3">
        <q-card flat bordered class="b-r-10 q-pa-md">
          <div class="text-caption text-grey-6">Ticket Médio</div>
          <div class="text-h6 text-bold text-black q-mt-xs">{{ ticketMedio }}</div>
        </q-card>
      </div>
      <div class="col-6 col-sm-3">
        <q-card flat bordered class="b-r-10 q-pa-md">
          <div class="text-caption text-grey-6">Total Descontos</div>
          <div class="text-h6 text-bold text-black q-mt-xs">{{ totalDescontos }}</div>
        </q-card>
      </div>
      <div class="col-6 col-sm-3">
        <q-card flat bordered class="b-r-10 q-pa-md">
          <div class="text-caption text-grey-6">Total Geral</div>
          <div class="text-h6 text-bold text-black q-mt-xs">{{ totalGeral }}</div>
        </q-card>
      </div>
    </div>

    <!-- Cards por Forma de Pagamento -->
    <div v-if="gerado && totalPorForma.length" class="row q-col-gutter-md q-mb-lg">
      <div v-for="item in totalPorForma" :key="item.forma" class="col-6 col-sm-4">
        <q-card flat bordered class="b-r-10 q-pa-md">
          <div class="row items-center q-gutter-sm">
            <q-icon :name="iconePagamento(item.forma)" :color="corPagamento(item.forma)" size="24px" />
            <div>
              <div class="text-caption text-grey-6">{{ item.forma }}</div>
              <div class="text-weight-bold">{{ formatarReais(item.total) }}</div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Tabela -->
    <div v-if="gerado">
      <q-table
        :data="rows"
        :columns="colunasRelatorioVendas"
        row-key="id"
        flat bordered
        no-data-label="Nenhuma venda encontrada"
        class="text-weight-medium"
        :rows-per-page-options="[10, 20, 50]"
      >
        <template v-slot:body-cell-data="props">
          <q-td align="center">{{ formatarData(props.row.data) }}</q-td>
        </template>
        <template v-slot:body-cell-forma_pagamento="props">
          <q-td align="center">
            <q-badge :color="corPagamento(labelPagamento(props.row.forma_pagamento))">
              {{ labelPagamento(props.row.forma_pagamento) }}
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-subtotal="props">
          <q-td align="center">{{ formatarReais(props.row.subtotal) }}</q-td>
        </template>
        <template v-slot:body-cell-desconto="props">
          <q-td align="center">
            <span v-if="props.row.desconto > 0" class="text-negative">
              {{ formatarReais(props.row.desconto_total) }}
            </span>
            <span v-else class="text-grey-5">-</span>
          </q-td>
        </template>
        <template v-slot:body-cell-total="props">
          <q-td align="center" class="text-weight-bold text-positive">
            {{ formatarReais(props.row.total) }}
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Empty state -->
    <div v-if="!gerado" class="column items-center q-py-xl text-grey-5">
      <q-icon name="summarize" size="48px" />
      <div class="q-mt-sm">Selecione os filtros e clique em Gerar Relatório</div>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as XLSX from 'xlsx'
import vendasService from '../../services/vendasService'

@Component
export default class RelatorioVendasComponent extends Vue {

  colunasRelatorioVendas = [
    { name: 'codigo_venda', label: 'Cód. Venda', field: 'codigo_venda', align: 'left' },
    { name: 'data', label: 'Data', field: 'data', align: 'center' },
    { name: 'nome_cliente', label: 'Cliente', field: 'nome_cliente', align: 'left' },
    { name: 'forma_pagamento', label: 'Pagamento', field: 'forma_pagamento', align: 'center' },
    { name: 'subtotal', label: 'Subtotal', field: 'subtotal', align: 'center' },
    { name: 'desconto_itens', label: 'Desconto', field: 'desconto_itens', align: 'center' },
    { name: 'total', label: 'Total', field: 'total', align: 'center' }
  ]

  filtro = {
    cliente: '',
    produto: '',
    forma_pagamento: '',
    de: '',
    ate: ''
  }

  opcoesPagamento = [
    { label: 'Dinheiro', value: 'dinheiro' },
    { label: 'Cartão', value: 'cartao' },
    { label: 'PIX', value: 'pix' }
  ]

  rows: any[] = []
  gerado = false
  carregando = false

  get ticketMedio() {
    if (!this.rows.length) return 'R$ 0,00'
    const total = this.rows.reduce((acc, v) => acc + parseFloat(v.total), 0)
    return this.formatarReais(total / this.rows.length)
  }

  get totalDescontos() {
    const total = this.rows.reduce((acc, v) => acc + parseFloat(v.desconto_total || 0), 0)
    return this.formatarReais(total)
  }

  get totalGeral() {
    const total = this.rows.reduce((acc, v) => acc + parseFloat(v.total), 0)
    return this.formatarReais(total)
  }

  get totalPorForma() {
    const mapa: Record<string, number> = {}
    this.rows.forEach(v => {
      const forma = this.labelPagamento(v.forma_pagamento)
      mapa[forma] = (mapa[forma] || 0) + parseFloat(v.total)
    })
    return Object.entries(mapa).map(([forma, total]) => ({ forma, total }))
  }

  async gerarRelatorio() {
    try {
      this.carregando = true
      this.rows = await vendasService.relatorioVendas({
        de: this.filtro.de,
        ate: this.filtro.ate,
        cliente: this.filtro.cliente,
        produto: this.filtro.produto,
        forma_pagamento: this.filtro.forma_pagamento
      })
      this.gerado = true
    } catch {
      this.$q.notify({ type: 'negative', message: 'Erro ao gerar relatório!' })
    } finally {
      this.carregando = false
    }
  }

  limparFiltros() {
    this.filtro = { cliente: '', produto: '', forma_pagamento: '', de: '', ate: '' }
    this.gerado = false
    this.rows = []
  }

  async exportarPDF() {
    try {
      await vendasService.relatorioVendasPDF({
        de: this.filtro.de,
        ate: this.filtro.ate,
        cliente: this.filtro.cliente,
        produto: this.filtro.produto,
        forma_pagamento: this.filtro.forma_pagamento
      })
      this.$q.notify({ type: 'positive', message: 'PDF gerado com sucesso!' })
    } catch {
      this.$q.notify({ type: 'negative', message: 'Erro ao gerar PDF!' })
    }
  }

  exportarExcel() {
    if (!this.rows.length) {
      this.$q.notify({ type: 'warning', message: 'Nenhum dado para exportar!' })
      return
    }
    const dados = this.rows.map(v => ({
      'Cód. Venda': v.codigo_venda || '-',
      'Data': this.formatarData(v.data),
      'Cliente': v.nome_cliente || 'Consumidor Final',
      'Forma de Pagamento': this.labelPagamento(v.forma_pagamento),
      'Subtotal': v.subtotal,
      'Desconto': v.desconto || 0,
      'Total': v.total
    }))
    const ws = XLSX.utils.json_to_sheet(dados)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Vendas')
    ws['!cols'] = [
      { wch: 12 }, { wch: 12 }, { wch: 30 }, { wch: 18 },
      { wch: 14 }, { wch: 14 }, { wch: 14 }
    ]
    XLSX.writeFile(wb, `relatorio_vendas_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.xlsx`)
    this.$q.notify({ type: 'positive', message: 'Excel exportado com sucesso!' })
  }

labelPagamento(forma: string): string {
  const mapa: Record<string, string> = {
    pix: 'PIX',
    cartao: 'Cartão',
    dinheiro: 'Dinheiro',
    pendente: 'Pendente'
  }
  return mapa[forma?.toLowerCase()] || forma || '-'
}

  corPagamento(forma: string): string {
    const mapa: Record<string, string> = { PIX: 'teal', Cartão: 'blue', Dinheiro: 'green' }
    return mapa[forma] || 'grey'
  }

  iconePagamento(forma: string): string {
    const mapa: Record<string, string> = { PIX: 'pix', Cartão: 'credit_card', Dinheiro: 'payments' }
    return mapa[forma] || 'attach_money'
  }

  formatarReais(valor: any): string {
    const numero = typeof valor === 'string' ? parseFloat(valor) : Number(valor)
    if (isNaN(numero)) return 'R$ 0,00'
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  formatarData(data: any): string {
    if (!data) return '-'
    return new Date(data).toLocaleDateString('pt-BR')
  }
}
</script>

<style scoped>
.b-r-10 { border-radius: 10px; }
.border { border: 1px solid #ccc; }
</style>
