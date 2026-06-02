<template>
  <div class="q-pa-md">

    <!-- Cabeçalho -->
    <div class="text-bold text-black row items-center" style="font-size:28px">
      <q-icon name="inventory_2" class="q-mr-md text-primary" size="28px" />Relatório de Estoque
    </div>
    <p class="text-grey-7 text-body2 q-mb-md">
      Analise a situação atual do estoque por produto, grupo e fornecedor. Exporte os dados em PDF ou Excel.
    </p>
    <q-separator class="q-mb-lg" />

    <!-- Filtros -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-4">
        <q-input v-model="filtro.codigo" label="Código do Produto" outlined dense />
      </div>
      <div class="col-12 col-sm-4">
        <q-input v-model="filtro.nomeProduto" label="Nome do Produto" outlined dense />
      </div>
      <div class="col-12 col-sm-4">
        <q-select
          v-model="filtro.grupo"
          :options="grupos"
          option-label="nome"
          option-value="id"
          emit-value map-options
          label="Grupo"
          outlined dense clearable
        />
      </div>
      <div class="col-12 col-sm-4">
        <q-select
          v-model="filtro.status"
          :options="opcoesStatus"
          option-label="label"
          option-value="value"
          emit-value map-options
          label="Status"
          outlined dense clearable
        />
      </div>
      <div class="col-12 col-sm-4">
        <q-select
          v-model="filtro.situacaoEstoque"
          :options="opcoesSituacaoEstoque"
          option-label="label"
          option-value="value"
          emit-value map-options
          label="Situação do Estoque"
          outlined dense clearable
        />
      </div>
      <div class="col-12 col-sm-4">
        <q-input v-model="filtro.fornecedor" label="Fornecedor" outlined dense />
      </div>
    </div>

    <!-- Botões de ação -->
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
          <div class="text-caption text-grey-6">Total de Produtos</div>
          <div class="text-h5 text-bold text-black q-mt-xs">{{ rowsFiltradas.length }}</div>
        </q-card>
      </div>
      <div class="col-6 col-sm-3">
        <q-card flat bordered class="b-r-10 q-pa-md">
          <div class="text-caption text-grey-6">Produtos Ativos</div>
          <div class="text-h5 text-bold text-black q-mt-xs">{{ totalAtivos }}</div>
        </q-card>
      </div>
      <div class="col-6 col-sm-3">
        <q-card flat bordered class="b-r-10 q-pa-md">
          <div class="text-caption text-grey-6">Estoque Baixo</div>
          <div class="text-h5 text-bold text-black q-mt-xs">{{ totalEstoqueBaixo }}</div>
        </q-card>
      </div>
      <div class="col-6 col-sm-3">
        <q-card flat bordered class="b-r-10 q-pa-md">
          <div class="text-caption text-grey-6">Valor Total em Estoque</div>
          <div class="text-h6 text-bold text-black q-mt-xs">{{ valorTotalEstoque }}</div>
        </q-card>
      </div>
    </div>

    <!-- Tabela -->
    <div v-if="gerado">
      <q-table
        :data="rowsFiltradas"
        :columns="colunasRelatorioEstoque"
        row-key="id"
        flat bordered
        no-data-label="Nenhum produto encontrado com os filtros selecionados"
        class="text-weight-medium"
        :rows-per-page-options="[10, 20, 50]"
      >
        <template v-slot:body-cell-status="props">
          <q-td align="center">
            <q-badge :color="props.row.status === 'Ativo' ? 'positive' : 'negative'">
              {{ props.row.status }}
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-situacao_estoque="props">
          <q-td align="center">
            <q-badge :color="corSituacaoEstoque(props.row)">
              {{ situacaoEstoque(props.row) }}
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-preco_custo="props">
          <q-td align="center">{{ formatarReais(props.row.preco_custo) }}</q-td>
        </template>
        <template v-slot:body-cell-preco="props">
          <q-td align="center">{{ formatarReais(props.row.preco) }}</q-td>
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
import listRelatorioEstoque from '../../config/listRelatorioEstoque.json'
import productService from '../../services/productService'
import * as XLSX from 'xlsx'

@Component
export default class RelatorioEstoqueComponent extends Vue {
  colunasRelatorioEstoque = listRelatorioEstoque.columns

  filtro = {
    codigo: '',
    nomeProduto: '',
    grupo: null as number | null,
    status: '',
    situacaoEstoque: '',
    fornecedor: ''
  }

  opcoesStatus = [
    { label: 'Ativo', value: 'Ativo' },
    { label: 'Inativo', value: 'Inativo' }
  ]

  opcoesSituacaoEstoque = [
    { label: 'Normal', value: 'normal' },
    { label: 'Estoque Baixo', value: 'baixo' },
    { label: 'Zerado', value: 'zerado' }
  ]

  grupos: any[] = []
  rows: any[] = []
  rowsFiltradas: any[] = []
  gerado = false
  carregando = false

  async created() {
    await this.carregarGrupos()
  }

  async carregarGrupos() {
    try {
      const grupos = await productService.listarGrupos()
      this.grupos = [{ id: null, nome: 'Todos' }, ...grupos]
    } catch {
      this.$q.notify({ type: 'negative', message: 'Erro ao carregar grupos!' })
    }
  }

  async gerarRelatorio() {
  try {
    this.carregando = true
    this.rowsFiltradas = await productService.relatorioEstoque({
      codigo: this.filtro.codigo,
      nome_produto: this.filtro.nomeProduto,
      grupo_id: this.filtro.grupo,
      status: this.filtro.status,
      fornecedor: this.filtro.fornecedor
    })
    this.gerado = true
  } catch {
    this.$q.notify({ type: 'negative', message: 'Erro ao gerar relatório!' })
  } finally {
    this.carregando = false
  }
}

exportarExcel() {
  if (this.rowsFiltradas.length === 0) {
    this.$q.notify({ type: 'warning', message: 'Nenhum dado para exportar!' })
    return
  }

  // Monta os dados formatados
  const dados = this.rowsFiltradas.map(p => ({
    'Código': p.codigo_produto || '-',
    'Produto': p.nome_produto,
    'Grupo': p.grupo || '-',
    'Estoque Atual': p.estoque_atual,
    'Estoque Mínimo': p.estoque_minimo,
    'Situação': p.situacao_estoque,
    'Valor Custo': p.preco_custo,
    'Valor Venda': p.preco,
    'Fornecedor': p.fornecedor || '-',
    'Status': p.status
  }))

  const ws = XLSX.utils.json_to_sheet(dados)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Estoque')

  // Define largura das colunas
  ws['!cols'] = [
    { wch: 10 }, { wch: 30 }, { wch: 15 }, { wch: 12 },
    { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 14 },
    { wch: 20 }, { wch: 10 }
  ]

  XLSX.writeFile(wb, `relatorio_estoque_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.xlsx`)

  this.$q.notify({ type: 'positive', message: 'Excel exportado com sucesso!' })
}

  aplicarFiltros() {
    this.rowsFiltradas = this.rows.filter((p: any) => {
      const codigoOk = !this.filtro.codigo || p.codigo_produto?.toLowerCase().includes(this.filtro.codigo.toLowerCase())
      const nomeOk = !this.filtro.nomeProduto || p.nome_produto.toLowerCase().includes(this.filtro.nomeProduto.toLowerCase())
      const grupoOk = !this.filtro.grupo || p.grupo_id === this.filtro.grupo
      const statusOk = !this.filtro.status || p.status === this.filtro.status
      const fornecedorOk = !this.filtro.fornecedor || p.fornecedor?.toLowerCase().includes(this.filtro.fornecedor.toLowerCase())
      const situacaoOk = !this.filtro.situacaoEstoque || this.situacaoEstoque(p).toLowerCase() === this.filtro.situacaoEstoque

      const estoque = Number(p.estoque_atual)
      const minimo = Number(p.estoque_minimo)
      let situacaoMatch = true
      if (this.filtro.situacaoEstoque === 'zerado') situacaoMatch = estoque === 0
      else if (this.filtro.situacaoEstoque === 'baixo') situacaoMatch = estoque > 0 && estoque <= minimo
      else if (this.filtro.situacaoEstoque === 'normal') situacaoMatch = estoque > minimo

      return codigoOk && nomeOk && grupoOk && statusOk && fornecedorOk && situacaoMatch
    })
  }

  situacaoEstoque(row: any): string {
    const estoque = Number(row.estoque_atual)
    const minimo = Number(row.estoque_minimo)
    if (estoque === 0) return 'Zerado'
    if (estoque <= minimo) return 'Baixo'
    return 'Normal'
  }

  corSituacaoEstoque(row: any): string {
    const s = this.situacaoEstoque(row)
    if (s === 'Zerado') return 'negative'
    if (s === 'Baixo') return 'warning'
    return 'positive'
  }

  get totalAtivos() {
    return this.rowsFiltradas.filter(p => p.status === 'Ativo').length
  }

  get totalEstoqueBaixo() {
    return this.rowsFiltradas.filter(p => {
      const estoque = Number(p.estoque_atual)
      const minimo = Number(p.estoque_minimo)
      return estoque <= minimo
    }).length
  }

  get valorTotalEstoque() {
    const total = this.rowsFiltradas.reduce((acc, p) => {
      return acc + (Number(p.preco) * Number(p.estoque_atual))
    }, 0)
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  limparFiltros() {
    this.filtro = {
      codigo: '',
      nomeProduto: '',
      grupo: null,
      status: '',
      situacaoEstoque: '',
      fornecedor: ''
    }
    this.gerado = false
    this.rows = []
    this.rowsFiltradas = []
  }

  async exportarPDF() {
  if (this.rowsFiltradas.length === 0) {
    this.$q.notify({ type: 'warning', message: 'Gere o relatório antes de exportar!' })
    return
  }
  try {
    await productService.relatorioEstoquePDF({
      codigo: this.filtro.codigo,
      nome_produto: this.filtro.nomeProduto,
      grupo_id: this.filtro.grupo,
      status: this.filtro.status,
      fornecedor: this.filtro.fornecedor
    })
    this.$q.notify({ type: 'positive', message: 'PDF gerado com sucesso!' })
  } catch {
    this.$q.notify({ type: 'negative', message: 'Erro ao gerar PDF!' })
  }
}

  formatarReais(valor: string | number): string {
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor
    if (isNaN(numero)) return 'R$ 0,00'
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }
}
</script>

<style scoped>
.b-r-10 { border-radius: 10px; }
.border { border: 1px solid #ccc; }
.btn-outline-primary {
  border: 1.5px solid #ccc;
  background-color: #f0e9f5 !important;
}
</style>
