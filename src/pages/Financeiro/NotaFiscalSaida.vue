<template>
  <div class="text-h5 text-bold">
    <div class="q-py-md">NF SAÍDA</div>
    <div class="col-12">
      <div class="row col-2 q-mt-md">
        <q-input class="col-2" label="Número NF" outlined dense />
        <q-input
          class="col-2 q-px-md"
          label="Período: De"
          type="date"
          outlined
          dense
        />
        <q-input
          class="col-2"
          label="Período: Até"
          type="date"
          outlined
          dense
        />
      </div>
      <div class="col-12 row justify-between items-center q-mt-md">
        <div class="row col-9">
          <q-input class="col-3" label="Nome do Cliente" outlined dense />
          <q-input
            class="col-3 q-px-md"
            label="CNPJ/CPF do Cliente"
            outlined
            dense
          />
          <q-input class="col-2" label="Valor" outlined dense />
        </div>
        <div class="row q-gutter-md">
          <q-btn
            icon="search"
            class="text-white verde-escuro"
            label="Pesquisar"
            @click="pesquisar()"
          />
        </div>
      </div>

      <div>
        <q-table
          :data="this.rowsNfSaida"
          :columns="this.colunasNotaFiscalSaida"
          row-key="codigo"
          flat
          bordered
          class="q-mt-lg"
        >
          <!-- Coluna Ações -->
          <template v-slot:body-cell-acoes="props">
            <q-td align="center">
              <q-btn
                icon="picture_as_pdf"
                size="sm"
                color="red"
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
    </div>
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
}
</script>

<style scoped>
.verde {
  background-color: #11b69a;
}

.verde-escuro {
  background-color: #00725f;
}
</style>
