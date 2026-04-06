<template>
  <div class="text-h5 text-bold">
    <div class="q-py-md">RELATÓRIO DE VENDAS</div>
    <div class="col-12">
      <div class="row col-2 q-mt-md">
        <q-input class="col-2" label="Código do Produto" outlined dense />
        <q-input class="col-3 q-px-md" label="Cliente" outlined dense />
        <q-input class="col-3" label="CPF/CNPJ" outlined dense />
      </div>
      <div class="col-12 row justify-between items-center">
        <div class="row col-9 q-mt-md">
          <q-select class="col-3" label="Status Venda" outlined dense />
          <q-input
            class="col-4 q-px-md"
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
        <div class="row q-gutter-md">
          <q-btn icon="search" class="text-white verde-escuro" rounded />
        </div>
      </div>

      <div>
        <q-table
          :columns="this.colunasRelatorioVenda"
          row-key="codigo"
          flat
          bordered
          class="q-mt-lg"
        >
          <!-- Coluna Ações -->
          <template v-slot:body-cell-acoes="props">
            <q-td align="center">
              <q-btn
                icon="edit"
                size="sm"
                color="primary"
                flat
                round
                @click="editar(props.row)"
              />
              <q-btn
                icon="delete"
                size="sm"
                color="negative"
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
import listRelatorioVenda from '../../config/listRelatorioVenda.json'

@Component
export default class ModuleComponent extends Vue {
   // ===== data =====

  colunasRelatorioVenda = listRelatorioVenda.columns
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
