<template>
  <!-- Container principal para centralizar o card na tela -->
  <div class="row justify-center items-center">
    <q-card class="col-11 col-md-10 col-lg-9 shadow-2" style="width: 1500px">
      <!-- Cabeçalho do Card -->
      <q-card-section class="bg-primary text-white q-pb-none">
        <div class="text-h5 text-bold">Relatório de Estoque</div>
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
            <q-breadcrumbs-el label="Relatório de Estoque" icon="inventory" />
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
              v-model="codigo"
              class="col-4"
              label="Código do Produto"
              outlined
              dense
            />
            <q-input
              v-model="nomeProduto"
              class="col-4"
              label="Nome do Produto"
              outlined
              dense
            />
            <q-select
              v-model="grupo"
              class="col-4"
              label="Grupo"
              outlined
              dense
              :options="['Tecnologia', 'Periféricos', 'Áudio']"
            />
          </div>

          <!-- Filtros Inferiores e Botões (Estrutura col-9 e col-3) -->
          <div class="row items-center q-col-gutter-md">
            
            <!-- Inputs (col-9) -->
            <div class="col-9">
              <div class="row q-col-gutter-md items-center">
                <div class="col-4">
                  <q-select
                    v-model="status"
                    label="Status Estoque"
                    :options="ativo_inativo"
                    option-label="label"
                    option-value="value"
                    emit-value
                    map-options
                    outlined
                    dense
                  />
                </div>

                <div class="col-4">
                  <q-input
                    v-model="valorCusto"
                    label="Valor de Custo"
                    outlined
                    dense
                  />
                </div>

                <div class="col-4">
                  <q-input
                    v-model="valorVenda"
                    label="Valor de Venda"
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
            :columns="colunasRelatorioEstoque"
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
            <template v-slot:body-cell-valorCusto="props">
              <q-td :props="props" align="center">
                {{ formatarReais(props.row.valorCusto) }}
              </q-td>
            </template>
            <template v-slot:body-cell-valorVenda="props">
              <q-td :props="props" align="center">
                {{ formatarReais(props.row.valorVenda) }}
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
import listRelatorioEstoque from '../../config/listRelatorioEstoque.json'

@Component
export default class RelatorioEstoqueComponent extends Vue {
  colunasRelatorioEstoque = listRelatorioEstoque.columns

  // ===== data =====
  codigo = ''
  nomeProduto = ''
  grupo = ''
  valorCusto = ''
  valorVenda = ''
  status = ''

  rowsEstoque = [
    { codigo: '001', nomeProduto: 'Notebook', grupo: 'Tecnologia', quantidade: '8', valorCusto: '2300', valorVenda: '2990', status: 'Ativo' },
    { codigo: '002', nomeProduto: 'Mouse Gamer', grupo: 'Periféricos', quantidade: '25', valorCusto: '80', valorVenda: '149', status: 'Ativo' },
    { codigo: '003', nomeProduto: 'Teclado Mecânico', grupo: 'Periféricos', quantidade: '15', valorCusto: '200', valorVenda: '350', status: 'Inativo' }
  ]

  rowsFiltradas: any[] = []

  ativo_inativo = [
    { label: 'Ativo', value: 'Ativo' },
    { label: 'Inativo', value: 'Inativo' }
  ]

  created() {
    this.rowsFiltradas = this.rowsEstoque
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
    this.rowsFiltradas = this.rowsEstoque.filter((row: any) => {
      const codigoMatch = !this.codigo || row.codigo.toLowerCase().includes(this.codigo.toLowerCase())
      const nomeMatch = !this.nomeProduto || row.nomeProduto.toLowerCase().includes(this.nomeProduto.toLowerCase())
      const statusMatch = !this.status || row.status === this.status
      return codigoMatch && nomeMatch && statusMatch
    })
  }

  refreshTable() {
    this.codigo = ""
    this.nomeProduto = ""
    this.grupo = ""
    this.valorCusto = ""
    this.valorVenda = ""
    this.status = ""
    this.rowsFiltradas = this.rowsEstoque
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
