<template>
  <!-- Container principal para centralizar o card na tela -->
  <div class="row justify-center items-center">
    <q-card class="col-11 col-md-10 col-lg-9 shadow-2" style="width: 1500px">
      <!-- Cabeçalho do Card -->
      <q-card-section class="bg-primary text-white q-pb-none">
        <div class="text-h5 text-bold">Vendas Balcão</div>
        <q-toolbar class="q-pa-none">
          <q-breadcrumbs
            active-color="white"
            style="font-size: 14px"
            class="q-mb-md"
          >
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="white" />
            </template>
            <q-breadcrumbs-el label="Home" icon="home" to="/" />
            <q-breadcrumbs-el label="Vendas Balcão" icon="point_of_sale" />
          </q-breadcrumbs>
        </q-toolbar>
      </q-card-section>

      <q-separator />

      <!-- Corpo do Card -->
      <q-card-section class="q-pa-lg">
        <!-- Filtros e Ações (Visíveis apenas quando não está em modo de venda) -->
        <div class="column q-col-gutter-md">

          <!-- Filtros e Botões (Estrutura col-9 e col-3) -->
          <div class="row items-center q-col-gutter-md">

            <!-- Inputs (col-9) -->
            <div class="col-9">
              <div class="row q-col-gutter-md items-center">
                <div class="col-4">
                  <q-input
                    v-model="codigo"
                    label="Código do Cliente"
                    outlined
                    dense
                  />
                </div>

                <div class="col-4">
                  <q-input
                    v-model="nome"
                    label="Nome Completo"
                    outlined
                    dense
                  />
                </div>

                <div class="col-4">
                  <q-input
                    v-model="documento"
                    label="CNPJ/CPF"
                    outlined
                    dense
                  />
                </div>
              </div>
            </div>

            <!-- Botões (col-3) -->
            <div v-if="!procurarProduto" class="col-3">
              <div class="row justify-end items-center q-gutter-sm">
                <q-btn
                  icon="search"
                  color="primary"
                  unelevated
                  @click="pesquisar()"
                />
                <q-btn
                  icon="delete"
                  color="warning"
                  unelevated
                  @click="refreshTable()"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Tabela de Clientes (Seleção para Venda) -->
        <div v-if="!procurarProduto" class="q-mt-xl">
          <q-table
            :data="rowsFiltradas"
            :columns="colunaCliente"
            row-key="codigo"
            flat
            bordered
            no-data-label="Nenhum registro encontrado"
            class="text-weight-medium"
          >
            <!-- Coluna Ações -->
            <template v-slot:body-cell-acoes="props">
              <q-td align="center">
                <q-btn
                  icon="point_of_sale"
                  size="sm"
                  color="warning"
                  flat
                  round
                  @click="realizarVenda(props.row)"
                />
              </q-td>
            </template>

            <!-- Coluna Status -->
            <template v-slot:body-cell-status="props">
              <q-td align="center">
                <q-badge
                  :color="props.row.status === 'Ativo' ? 'positive' : 'negative'"
                >
                  {{ props.row.status }}
                </q-badge>
              </q-td>
            </template>
          </q-table>
        </div>

        <!-- Fluxo de Venda: Procurar Produto -->
        <div v-if="procurarProduto" class="q-mt-md">
          <div class="text-h6 q-mb-sm">Produto</div>
          <div class="row items-center q-col-gutter-md">
            <div class="col-9">
              <div class="row q-col-gutter-md items-center">
                <div class="col-4">
                  <q-input v-model="codigoProduto" label="Código do Produto" outlined dense />
                </div>
                <div class="col-8">
                  <q-input v-model="nomeProduto" label="Nome do Produto" outlined dense />
                </div>
              </div>
            </div>
            <div class="col-3">
              <div class="row justify-end items-center q-gutter-sm">
                <q-btn icon="search" color="primary" unelevated @click="pesquisarProduto()" />
              </div>
            </div>
          </div>

          <!-- Tabela de Busca de Produtos -->
          <div class="q-mt-lg">
            <q-table
              :data="rowsProduto"
              :columns="colunaProduto"
              row-key="codigo"
              flat
              bordered
              no-data-label="Nenhum registro encontrado"
            >
              <template v-slot:body-cell-acoes="props">
                <q-td align="center">
                  <q-btn icon="o_add_box" size="sm" color="warning" flat round @click="abrirDialogQuantidade(props.row)" />
                  <q-btn icon="percent" size="sm" color="blue" flat round @click="abrirDialogDesconto(props.row)" />
                  <q-btn icon="add" size="sm" color="positive" flat round @click="adicionarProduto(props.row)" />
                </q-td>
              </template>
              <template v-slot:body-cell-valorUnitario="props">
                <q-td align="center">{{ formatarReais(props.row.valorUnitario) }}</q-td>
              </template>
              <template v-slot:body-cell-total="props">
                <q-td align="center">{{ formatarReais(props.row.total) }}</q-td>
              </template>
            </q-table>
          </div>
        </div>

        <!-- SEÇÃO: PRODUTOS ADICIONADOS (A TABELA QUE FALTAVA) -->
        <div v-if="produtosAdicionados.length > 0" class="q-mt-xl">
          <div class="text-h6 q-mb-sm">Produtos Adicionados</div>
          <q-table
            :data="produtosAdicionados"
            :columns="colunasTabelProduto"
            row-key="codigo"
            flat
            bordered
            no-data-label="Nenhum produto adicionado"
          >
            <template v-slot:body-cell-acoes="props">
              <q-td align="center">
                <q-btn icon="delete" size="sm" color="negative" flat round @click="removerProduto(props.row)" />
              </q-td>
            </template>
            <template v-slot:body-cell-valorUnitario="props">
              <q-td align="center">{{ formatarReais(props.row.valorUnitario) }}</q-td>
            </template>
            <template v-slot:body-cell-total="props">
              <q-td align="center">{{ formatarReais(props.row.total) }}</q-td>
            </template>
          </q-table>
        </div>

        <!-- Revisão e Finalização -->
        <div v-if="finalizacaoVenda" class="q-mt-xl">
          <div class="text-h6 q-mb-sm">Revisar Itens</div>
          <div class="row items-center justify-between q-mt-md">
            <div class="row q-gutter-md">
              <q-btn icon="o_credit_card" label="Realizar Pagamento" color="positive" unelevated />
              <q-btn icon="close" label="Cancelar Venda" color="negative" unelevated @click="abrirDialogCancelar()" />
            </div>
            <div class="row q-gutter-sm">
              <q-input v-model="totalItens" label="Produtos" style="width: 100px" outlined readonly dense />
              <q-input v-model="valorBruto" label="Valor Bruto" style="width: 150px" outlined readonly dense />
              <q-input v-model="descontoReais" label="Desconto (R$)" style="width: 150px" outlined readonly dense />
              <q-input v-model="descontoPercent" label="Desconto (%)" style="width: 120px" outlined readonly dense />
              <q-input v-model="valorTotalVenda" label="Valor Total" style="width: 180px" outlined readonly dense bg-color="grey-2" />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Dialogs -->
    <q-dialog v-model="dialogCancelar" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Deseja realmente cancelar a operação?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Não" color="primary" v-close-popup />
          <q-btn flat label="Sim, Cancelar" color="negative" @click="confirmarCancelamento()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import listVendaBalcao from '../../config/listVendaBalcao.json'

@Component
export default class VendasBalcaoComponent extends Vue {
  colunaCliente = listVendaBalcao.columns
  colunaProduto = listVendaBalcao.columnsTableProduto

  // ===== data =====
  codigo = ''
  nome = ''
  documento = ''

  // Controle de Fluxo
  procurarProduto = false
  finalizacaoVenda = false
  dialogCancelar = false

  // Dados de Venda
  codigoProduto = ''
  nomeProduto = ''
  totalItens = '0'
  valorBruto = 'R$ 0,00'
  descontoReais = 'R$ 0,00'
  descontoPercent = '0%'
  valorTotalVenda = 'R$ 0,00'

  // Configuração da Tabela
  colunasVendaBalcao = [
    { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
    { name: 'nome', label: 'Nome Completo', field: 'nome', align: 'left', sortable: true },
    { name: 'documento', label: 'CPF/CNPJ', field: 'documento', align: 'left' },
    { name: 'status', label: 'Status', field: 'status', align: 'center' },
    { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
  ]

  colunasTabelProduto = [
    { name: 'codigo', label: 'Cód. Produto', field: 'codigo', align: 'left' },
    { name: 'nome', label: 'Produto', field: 'nome', align: 'left' },
    { name: 'valorUnitario', label: 'Vlr. Unit.', field: 'valorUnitario', align: 'center' },
    { name: 'total', label: 'Total', field: 'total', align: 'center' },
    { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
  ]

  rowsClientes = [
    { codigo: '001', nome: 'Antônio Carlos', documento: '123.456.789-10', status: 'Ativo' },
    { codigo: '002', nome: 'Matheus Tech', documento: '12.342.278/0001-10', status: 'Ativo' }
  ]

  rowsProduto = [
    { codigo: 'PROD001', nome: 'Peça de Motor', valorUnitario: 500.00, total: 500.00 }
  ]

  produtosAdicionados: any[] = []
  rowsFiltradas: any[] = []

  created() {
    this.rowsFiltradas = this.rowsClientes
  }

  // ===== Métodos =====
  formatarReais(valor: string | number): string {
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  pesquisar() {
    this.rowsFiltradas = this.rowsClientes.filter((row: any) => {
      const nomeMatch = !this.nome || row.nome.toLowerCase().includes(this.nome.toLowerCase())
      const codigoMatch = !this.codigo || row.codigo.includes(this.codigo)
      return nomeMatch && codigoMatch
    })
  }

  realizarVenda(row: any) {
    this.procurarProduto = true
  }

  adicionarProduto(row: any) {
    this.produtosAdicionados.push({ ...row })
    this.finalizacaoVenda = true
    this.totalItens = this.produtosAdicionados.length.toString()
  }

  removerProduto(row: any) {
    const index = this.produtosAdicionados.indexOf(row)
    if (index > -1) {
      this.produtosAdicionados.splice(index, 1)
    }
    if (this.produtosAdicionados.length === 0) {
      this.finalizacaoVenda = false
    }
    this.totalItens = this.produtosAdicionados.length.toString()
  }

  abrirDialogCancelar() {
    this.dialogCancelar = true
  }

  confirmarCancelamento() {
    this.dialogCancelar = false
    this.procurarProduto = false
    this.finalizacaoVenda = false
    this.produtosAdicionados = []
    this.limparCampos()
  }

  limparCampos() {
    this.codigo = ''
    this.nome = ''
    this.documento = ''
  }

  refreshTable() {
    this.limparCampos()
    this.rowsFiltradas = this.rowsClientes
  }

  pesquisarProduto() { console.log('Pesquisando produto...') }
  abrirDialogQuantidade(row: any) { console.log('Qtd:', row) }
  abrirDialogDesconto(row: any) { console.log('Desconto:', row) }
}
</script>

<style scoped>
</style>
