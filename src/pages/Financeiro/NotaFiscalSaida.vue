<template>
  <!-- Container principal para centralizar o card na tela -->
  <div class="row justify-center items-center">
    <q-card
      class="col-11 col-md-10 col-lg-9 no-shadow border b-r-10"
      style="width: 1500px"
    >
      <!-- Cabeçalho do Card -->
      <q-card-section class="bg-white text-black q-pb-none">
        <div class="text-h5 text-bold">NF Saída</div>
        <q-toolbar class="q-pa-none">
          <q-breadcrumbs
            active-color="black"
            style="font-size: 14px"
            class="q-mb-md"
          >
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="black" />
            </template>
            <q-breadcrumbs-el label="Home" icon="home" to="/" />
            <q-breadcrumbs-el label="Financeiro" icon="paid" />
            <q-breadcrumbs-el label="NF Saída" icon="trending_down" />
          </q-breadcrumbs>
        </q-toolbar>
      </q-card-section>

      <q-separator />

      <!-- Corpo do Card -->
      <q-card-section class="q-pa-lg">
        <div class="column q-col-gutter-md">
          <!-- Filtros Superiores -->
          <div class="row items-center q-col-gutter-md col-12 no-wrap">
            <q-input class="col-4" label="Número NF" outlined dense />
            <q-input
              class="col-4"
              label="Período: De"
              type="date"
              outlined
              dense
            />
            <q-input
              class="col-4"
              label="Período: Até"
              type="date"
              outlined
              dense
            />
          </div>

          <!-- Filtros Inferiores -->
          <div class="row items-center q-col-gutter-md">
            <!-- Inputs -->
            <div class="col-9">
              <div class="row q-col-gutter-md items-center">
                <div class="col-4">
                  <q-input label="Nome do Cliente" outlined dense />
                </div>

                <div class="col-4">
                  <q-input label="CNPJ/CPF do Cliente" outlined dense />
                </div>

                <div class="col-4">
                  <q-input label="Valor" outlined dense />
                </div>
              </div>
            </div>

            <!-- Botões -->
            <div class="col-3">
              <div class="row justify-end items-center q-gutter-sm">
                <q-btn
                  unelevated
                  class="text-white bg-primary"
                  @click="pesquisar()"
                >
                  <q-icon name="search" color="white" />
                  <q-tooltip>Pesquisar</q-tooltip>
                </q-btn>

                <q-btn
                  unelevated
                  class="text-white bg-primary"
                  @click="refreshTable()"
                >
                  <q-icon name="delete" color="white" />
                  <q-tooltip>Limpar</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
        </div>
        <div class="q-mt-xl">
          <q-table
            :data="rowsNfSaida"
            :columns="colunasNotaFiscalSaida"
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
                  @click="editar(props.row)"
                />
                <q-btn
                  icon="description"
                  size="sm"
                  color="green"
                  flat
                  round
                  @click="excluir(props.row)"
                />
              </q-td>
            </template>

            <!-- Coluna Valor -->
            <template v-slot:body-cell-valorNota="props">
              <q-td :props="props" align="center">
                {{ formatarReais(props.row.valorNota) }}
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
import listNotaFiscalSaida from '../../config/listNotaFiscalSaida.json'

@Component
export default class ModuleComponent extends Vue {
   // ===== data =====

  colunasNotaFiscalSaida = listNotaFiscalSaida.columns

  rowsNfSaida = [
  {
    numeroNF: '003',
    dataSaida: '25/04/2026',
    nomeCliente: 'Maria',
    documento: '3487567878',
    valorNota: '150.50'
  },
  {
    numeroNF: '002',
    dataSaida: '15/02/2026',
    nomeCliente: 'Maria Aparecida Souza',
    documento: '34875612900',
    valorNota: '742.50'
  },
  {
    numeroNF: '003',
    dataSaida: '28/03/2026',
    nomeCliente: 'Carlos Eduardo Lima',
    documento: '91234567844',
    valorNota: '189.90'
  }
]

formatarReais(valor: string | number): string {
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }
}
</script>

<style scoped>
.b-r-10 {
  border-radius: 10px;
}
.border {
  border: 1px solid #ccc;
}
.btn-outline-primary {
  border: 1.5px solid #ccc;
  background-color: #f0e9f5 !important;
}
</style>
