<template>
  <!-- Container principal para centralizar o card na tela -->
  <div class="row justify-center items-center">
    <q-card class="col-11 col-md-10 col-lg-9 shadow-2" style="width: 1500px">
      <!-- Cabeçalho do Card -->
      <q-card-section class="bg-primary text-white q-pb-none">
        <div class="text-h5 text-bold">Relatório de Vendas</div>
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
            <q-breadcrumbs-el label="Relatórios" icon="article" />
            <q-breadcrumbs-el label="Relatório de Vendas" icon="sell" />
          </q-breadcrumbs>
        </q-toolbar>
      </q-card-section>

      <q-separator />

      <!-- Corpo do Card -->
      <q-card-section class="q-pa-lg">
        <div class="column q-col-gutter-md">
          
          <!-- Filtros Superiores -->
          <div class="row items-center q-col-gutter-md col-12 no-wrap">
            <q-input
              v-model="codigoProduto"
              class="col-3"
              label="Código do Produto"
              outlined
              dense
            />
            <q-input
              v-model="nomeProduto"
              class="col-3"
              label="Nome do Produto"
              outlined
              dense
            />
            <q-input
              v-model="nomeCliente"
              class="col-3"
              label="Cliente"
              outlined
              dense
            />
            <q-input
              v-model="cpfCnpj"
              class="col-3"
              label="CPF/CNPJ"
              outlined
              dense
            />
          </div>

          <!-- Filtros Inferiores e Botões (Estrutura col-9 e col-3) -->
          <div class="row items-center q-col-gutter-md">
            
            <!-- Inputs (col-9) -->
            <div class="col-9">
              <div class="row q-col-gutter-md items-center">
                <div class="col-3">
                  <q-input
                    v-model="valorUnitario"
                    label="Valor Unitário"
                    outlined
                    dense
                  />
                </div>

                <div class="col-3">
                  <q-input
                    v-model="valorTotal"
                    label="Valor Total"
                    outlined
                    dense
                  />
                </div>

                <div class="col-3">
                  <q-input
                    v-model="periodoDe"
                    label="Período: De"
                    type="date"
                    outlined
                    dense
                  />
                </div>

                <div class="col-3">
                  <q-input
                    v-model="periodoAte"
                    label="Período: Até"
                    type="date"
                    outlined
                    dense
                  />
                </div>
              </div>
            </div>

            <!-- Botões (col-3) -->
            <div class="col-3">
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

        <!-- Tabela de Resultados -->
        <div class="q-mt-xl">
          <q-table
            :data="rowsFiltradas"
            :columns="colunasRelatorioVendas"
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
                  icon="picture_as_pdf"
                  size="sm"
                  color="negative"
                  flat
                  round
                  @click="gerarPdf(props.row)"
                />
                <q-btn
                  icon="description"
                  size="sm"
                  color="green"
                  flat
                  round
                  @click="verDetalhes(props.row)"
                />
              </q-td>
            </template>

            <!-- Colunas de Valor -->
            <template v-slot:body-cell-valorUnitario="props">
              <q-td :props="props" align="center">
                {{ formatarReais(props.row.valorUnitario) }}
              </q-td>
            </template>
            <template v-slot:body-cell-valorTotal="props">
              <q-td :props="props" align="center">
                {{ formatarReais(props.row.valorTotal) }}
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
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import listRelatorioVendas from '../../config/listRelatorioVenda.json'

@Component
export default class RelatorioVendasComponent extends Vue {

  colunasRelatorioVendas = listRelatorioVendas.columns

  // ===== data =====
  codigoProduto = ''
  nomeProduto = ''
  nomeCliente = ''
  cpfCnpj = ''
  valorUnitario = ''
  valorTotal = ''
  periodoDe = ''
  periodoAte = ''

  rowsVendas = [
    { dataVenda: '06/04/2026', codigoProduto: '001002003004', nomeProduto: 'GTA 5', nomeCliente: 'algumaCoisa', cpfCnpj: '098878881000110', valorUnitario: '179', valorTotal: '199' },
    { dataVenda: '12/03/2026', codigoProduto: '009876543210', nomeProduto: 'Teclado Mecânico RGB', nomeCliente: 'Carlos Eduardo', cpfCnpj: '12345678900199', valorUnitario: '350', valorTotal: '700' },
    { dataVenda: '28/02/2026', codigoProduto: '005544332211', nomeProduto: 'Mouse Gamer Pro', nomeCliente: 'Fernanda Lima', cpfCnpj: '98765432100011', valorUnitario: '149', valorTotal: '298' }
  ]

  rowsFiltradas: any[] = []

  created() {
    this.rowsFiltradas = this.rowsVendas
  }

  // ===== Métodos =====
  formatarReais(valor: string | number): string {
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  pesquisar() {
    this.rowsFiltradas = this.rowsVendas.filter((row: any) => {
      const codigoMatch = !this.codigoProduto || row.codigoProduto.toLowerCase().includes(this.codigoProduto.toLowerCase())
      const nomeMatch = !this.nomeProduto || row.nomeProduto.toLowerCase().includes(this.nomeProduto.toLowerCase())
      const clienteMatch = !this.nomeCliente || row.nomeCliente.toLowerCase().includes(this.nomeCliente.toLowerCase())
      return codigoMatch && nomeMatch && clienteMatch
    })
  }

  refreshTable() {
    this.codigoProduto = ""
    this.nomeProduto = ""
    this.nomeCliente = ""
    this.cpfCnpj = ""
    this.valorUnitario = ""
    this.valorTotal = ""
    this.periodoDe = ""
    this.periodoAte = ""
    this.rowsFiltradas = this.rowsVendas
  }

  gerarPdf(row: any) {
    console.log('Gerar PDF:', row)
  }

  verDetalhes(row: any) {
    console.log('Ver Detalhes:', row)
  }
}
</script>

<style scoped>
</style>
