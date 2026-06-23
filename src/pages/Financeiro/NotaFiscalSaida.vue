<template>
  <div class="q-pa-md">

    <!-- Cabeçalho -->
    <div class="text-bold text-black row items-center nfs-cabecalho" style="font-size: 28px">
      <q-icon name="trending_down" class="q-mr-md text-primary" size="28px" />NF Saída
    </div>
    <p class="text-grey-7 text-body2 q-mb-md nfs-subtitulo">
      Consulte e exporte as notas fiscais de saída vinculadas às vendas realizadas no sistema.
    </p>
    <q-separator class="q-mb-lg" />

    <!-- Filtros -->
    <div class="row q-col-gutter-md q-mb-md nfs-filtros">
      <div class="col-12 col-sm-3">
        <q-input
          v-model="filtro.numeroNF"
          label="Número NF"
          outlined
          dense
          input-id="nfs-input-filtro-numero"
          class="nfs-input-filtro-numero"
        />
      </div>
      <div class="col-12 col-sm-3">
        <q-input
          v-model="filtro.nomeCliente"
          label="Nome do Cliente"
          outlined
          dense
          input-id="nfs-input-filtro-cliente"
          class="nfs-input-filtro-cliente"
        />
      </div>
      <div class="col-12 col-sm-2">
        <q-input
          v-model="filtro.de"
          label="De"
          type="date"
          outlined
          dense
          input-id="nfs-input-filtro-de"
          class="nfs-input-filtro-de"
        />
      </div>
      <div class="col-12 col-sm-2">
        <q-input
          v-model="filtro.ate"
          label="Até"
          type="date"
          outlined
          dense
          input-id="nfs-input-filtro-ate"
          class="nfs-input-filtro-ate"
        />
      </div>
    </div>

    <!-- Botões -->
    <div class="row justify-start q-gutter-sm q-mb-md nfs-acoes">
      <q-btn
        id="nfs-btn-limpar"
        class="nfs-btn-limpar text-grey-7"
        label="Limpar"
        icon="delete_sweep"
        flat
        @click="limpar()"
      />
    </div>

    <!-- Tabela -->
    <q-table
      :data="rowsFiltradas"
      :columns="colunasNotaFiscalSaida"
      row-key="id"
      flat
      bordered
      no-data-label="Nenhum registro encontrado"
      class="text-weight-medium q-mt-xl nfs-tabela-lista"
      :rows-per-page-options="[10, 20, 50]"
      :loading="carregando"
    >
      <template v-slot:body-cell-total="props">
        <q-td align="center">{{ formatarReais(props.row.total) }}</q-td>
      </template>
      <template v-slot:body-cell-data_emissao="props">
        <q-td align="center">{{ formatarData(props.row.data_emissao) }}</q-td>
      </template>
      <template v-slot:body-cell-forma_pagamento="props">
        <q-td align="center">
          <q-badge
            :color="corFormaPagamento(props.row.forma_pagamento)"
            class="nfs-badge-forma-pagamento"
          >
            {{ labelFormaPagamento(props.row.forma_pagamento) }}
          </q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td align="center">
          <q-badge
            :color="props.row.status === 'emitida' ? 'positive' : 'negative'"
            class="nfs-badge-status"
          >
            {{ labelStatus(props.row.status) }}
          </q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-acoes="props">
        <q-td align="center">
          <q-btn
            icon="picture_as_pdf"
            size="sm"
            color="negative"
            flat
            round
            class="nfs-btn-exportar-pdf"
            @click="gerarPDF(props.row)"
          >
            <q-tooltip>Exportar PDF</q-tooltip>
          </q-btn>
          <q-btn
            icon="topic"
            size="sm"
            color="blue"
            flat
            round
            class="nfs-btn-ver-detalhes"
            @click="verDetalhes(props.row)"
          >
            <q-tooltip>Ver Detalhes</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Dialog Detalhes -->
    <q-dialog v-model="dialogDetalhes" persistent class="nfs-dialog-detalhes">
      <q-card style="min-width: 650px; max-width: 700px; border-radius: 12px">

        <div class="q-pa-lg row items-center justify-between" style="background: #f8f9fa">
          <div>
            <div class="text-h6 text-bold">{{ nfSelecionada?.numero_nf }}</div>
            <div class="text-caption text-grey-6">Emitida em {{ formatarData(nfSelecionada?.data_emissao) }}</div>
            <div class="row q-gutter-sm q-mt-xs">
              <q-badge
                :color="corFormaPagamento(nfSelecionada?.forma_pagamento)"
                class="q-pa-xs nfs-detalhes-badge-pagamento"
              >
                {{ labelFormaPagamento(nfSelecionada?.forma_pagamento) }}
              </q-badge>
              <q-badge
                :color="nfSelecionada?.status === 'emitida' ? 'positive' : 'negative'"
                class="q-pa-xs nfs-detalhes-badge-status"
              >
                {{ labelStatus(nfSelecionada?.status) }}
              </q-badge>
            </div>
          </div>
          <div class="text-right">
            <div class="text-caption text-grey-6">Venda vinculada</div>
            <div class="text-weight-bold text-primary">{{ nfSelecionada?.codigo_venda || '-' }}</div>
          </div>
        </div>

        <q-separator />

        <q-card-section class="q-pa-lg">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12">
              <div class="text-caption text-grey-5 text-uppercase q-mb-xs">Cliente</div>
              <div class="text-weight-bold nfs-detalhes-cliente">{{ nfSelecionada?.nome_cliente || 'Consumidor Final' }}</div>
            </div>
          </div>

          <q-separator class="q-mb-md" />

          <div class="text-caption text-grey-5 text-uppercase q-mb-sm">Itens</div>
          <q-table
            :data="nfSelecionada?.itens || []"
            :columns="colunasItens"
            flat
            bordered
            hide-bottom
            dense
            class="nfs-tabela-detalhes"
          >
            <template v-slot:body-cell-preco_unitario="props">
              <q-td align="center">{{ formatarReais(props.row.preco_unitario) }}</q-td>
            </template>
            <template v-slot:body-cell-desconto="props">
              <q-td align="center">
                <span v-if="props.row.desconto > 0" class="text-negative">
                  - {{ formatarReais(props.row.desconto) }}
                </span>
                <span v-else class="text-grey-5">-</span>
              </q-td>
            </template>
            <template v-slot:body-cell-subtotal="props">
              <q-td align="center" class="text-weight-medium">{{ formatarReais(props.row.subtotal) }}</q-td>
            </template>
          </q-table>

          <div class="row justify-end q-mt-md nfs-detalhes-resumo">
            <div class="column q-gutter-xs" style="min-width: 220px">
              <div class="row justify-between">
                <span class="text-caption text-grey-6">Subtotal</span>
                <span class="text-caption nfs-detalhes-subtotal">{{ formatarReais(nfSelecionada?.subtotal) }}</span>
              </div>
              <div class="row justify-between" v-if="nfSelecionada?.desconto > 0">
                <span class="text-caption text-negative">Desconto</span>
                <span class="text-caption text-negative nfs-detalhes-desconto">- {{ formatarReais(nfSelecionada?.desconto) }}</span>
              </div>
              <q-separator />
              <div class="row justify-between items-center">
                <span class="text-weight-bold">Total</span>
                <span class="text-h6 text-weight-bold text-positive nfs-detalhes-total">{{ formatarReais(nfSelecionada?.total) }}</span>
              </div>
              <div class="row justify-between q-mt-xs">
                <span class="text-caption text-grey-6">Forma de Pagamento</span>
                <q-badge :color="corFormaPagamento(nfSelecionada?.forma_pagamento)" class="nfs-detalhes-forma-pagamento">
                  {{ labelFormaPagamento(nfSelecionada?.forma_pagamento) }}
                </q-badge>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn
            id="nfs-dialog-detalhes-fechar"
            class="nfs-dialog-detalhes-fechar"
            label="Fechar"
            flat
            v-close-popup
          />
          <q-btn
            id="nfs-dialog-detalhes-exportar-pdf"
            class="nfs-dialog-detalhes-exportar-pdf"
            label="Exportar PDF"
            icon="picture_as_pdf"
            color="negative"
            unelevated
            @click="gerarPDF(nfSelecionada)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import listNotaFiscalSaida from '../../config/listNotaFiscalSaida.json'
import nfSaidaService, { NfSaida } from '../../services/nfSaidaService'

@Component
export default class ModuleComponent extends Vue {
  colunasNotaFiscalSaida = listNotaFiscalSaida.columns

colunasItens = [
  { name: 'nome_produto', label: 'Produto', field: 'nome_produto', align: 'left' },
  { name: 'quantidade', label: 'Qtd.', field: 'quantidade', align: 'center' },
  { name: 'preco_unitario', label: 'Vlr. Unit.', field: 'preco_unitario', align: 'center' },
  { name: 'desconto', label: 'Desconto', field: 'desconto', align: 'center' },
  { name: 'subtotal', label: 'Subtotal', field: 'subtotal', align: 'center' }
]

  filtro = {
    numeroNF: '',
    nomeCliente: '',
    de: '',
    ate: ''
  }

  get rowsFiltradas() {
  return this.rows.filter((nf: any) => {
    const nfOk = !this.filtro.numeroNF || nf.numero_nf?.includes(this.filtro.numeroNF)
    const clienteOk = !this.filtro.nomeCliente || nf.nome_cliente?.toLowerCase().includes(this.filtro.nomeCliente.toLowerCase())
    const deOk = !this.filtro.de || new Date(nf.data_emissao) >= new Date(this.filtro.de)
    const ateOk = !this.filtro.ate || new Date(nf.data_emissao) <= new Date(this.filtro.ate)
    return nfOk && clienteOk && deOk && ateOk
  })
}

  rows: NfSaida[] = []
  carregando = false
  dialogDetalhes = false
  nfSelecionada: NfSaida | null = null

  async created() {
    await this.carregarNfs()
  }

  async carregarNfs() {
    try {
      this.carregando = true
      this.rows = await nfSaidaService.listar()
    } catch {
      this.$q.notify({ type: 'negative', message: 'Erro ao carregar NFs!' })
    } finally {
      this.carregando = false
    }
  }

  labelStatus(status: string): string {
  const mapa: Record<string, string> = {
    'emitida': 'Emitida',
    'cancelada': 'Cancelada'
  }
  return mapa[status?.toLowerCase()] || status
}

  limpar() {
    this.filtro = { numeroNF: '', nomeCliente: '', de: '', ate: '' }
  }

  async verDetalhes(row: NfSaida) {
    try {
      this.nfSelecionada = await nfSaidaService.buscar(row.id!)
      this.dialogDetalhes = true
    } catch {
      this.$q.notify({ type: 'negative', message: 'Erro ao carregar detalhes!' })
    }
  }

async gerarPDF(row: any) {
  try {
    await nfSaidaService.gerarPDF(row.id)
    this.$q.notify({ type: 'positive', message: 'PDF gerado com sucesso!' })
  } catch {
    this.$q.notify({ type: 'negative', message: 'Erro ao gerar PDF!' })
  }
}

corFormaPagamento(forma: string): string {
  const mapa: Record<string, string> = {
    'pix': 'teal',
    'cartao': 'blue',
    'dinheiro': 'green'
  }
  return mapa[forma?.toLowerCase()] || 'grey'
}

  labelFormaPagamento(forma: string): string {
  const mapa: Record<string, string> = {
    'pix': 'PIX',
    'cartao': 'Cartão',
    'dinheiro': 'Dinheiro'
  }
  return mapa[forma?.toLowerCase()] || forma
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
.b-r-8 { border-radius: 8px; }
.border { border: 1px solid #ccc; }
</style>
