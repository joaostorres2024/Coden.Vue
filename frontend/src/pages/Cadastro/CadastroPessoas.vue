<template>
  <div class="text-h5 text-bold">
    <div class="q-py-md">CADASTRO PESSOAS</div>
    <div class="col-12">
      <div class="row col-3">
        <q-select
          class="col-3"
          v-model="tipoPessoa"
          :options="opcoesTipoPessoa"
          label="Tipo de Pessoa"
          outlined
          dense
        />
      </div>
      <div class="col-12 row justify-between items-center">
        <div class="row col-9 q-mt-md">
          <q-input class="col-4" label="Nome Completo" outlined dense />
          <q-input class="col-4 q-px-md" label="CNPJ/CPF" outlined dense />
          <q-input class="col-2" label="Código do Cliente" outlined dense />
        </div>
        <div class="row q-gutter-md">
          <q-btn color="white" icon="search" class="text-black" />
          <q-btn color="white" icon="add" class="text-black" />
        </div>
      </div>
      <div>
        <q-table
          :rows="this.rows"
          :columns="colunasCadastroPessoas"
          row-key="codigo"
          flat
          bordered
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
import listCadastroPessoas from '../../config/listCadastroPessoas.json'

@Component
export default class ModuleComponent extends Vue {
  // ===== data =====

  colunasCadastroPessoas = listCadastroPessoas.columns
  opcoesTipoPessoa = [
      { label: 'Pessoa Física', value: 'PF' },
      { label: 'Pessoa Jurídica', value: 'PJ' }
    ]
}
</script>

<style scoped></style>
