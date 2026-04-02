<template>
  <div class="text-h5 text-bold">
    <div class="q-py-md">CADASTRO PESSOAS</div>
    <div class="col-12">
      <div class="row col-3">
        <q-select
          class="col-3"
          v-model="tipoPessoa"
          :options="this.opcoesTipoPessoa"
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
          <q-btn
            color="white"
            icon="add"
            class="text-black"
            @click="mostrarFormulario()"
          />
        </div>
      </div>

      <div v-if="mostrarFormCadastroGeral">
        <div class="row col-12 q-mt-md">
          <div class="q-pb-md q-mt-md">
            <q-title class="text-h6">Dados Gerais</q-title>
          </div>
          <div class="row col-12 q-gutter-md">
            <q-input class="col-2" label="RG" outlined dense />
            <q-input
              class="col-2"
              label="Data de Nascimento"
              type="date"
              outlined
              dense
            />
            <q-select
              class="col-2"
              v-model="sexo"
              :options="this.tipoSexo"
              label="Sexo"
              outlined
              dense
            />
            <q-input class="col-3" label="Nome Social" outlined dense />
            <q-select
              class="col-3"
              v-model="ativoInativo"
              :options="this.ativo_inativo"
              label="Ativo/Inativo"
              outlined
              dense
            />
          </div>
        </div>

        <div class="row col-12 q-mt-md">
          <div class="q-pb-md q-mt-md">
            <q-title class="text-h6">Dados de Contato</q-title>
          </div>
          <div class="row col-12 q-gutter-md">
            <q-input class="col-3" label="Telefone 1" outlined dense />
            <q-input class="col-3" label="Telefone 2" outlined dense />
            <q-input class="col-3" label="E-mail" outlined dense />
          </div>
        </div>
      </div>

      <div>
        <q-table
          :columns="this.colunasCadastroPessoas"
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
import listCadastroPessoas from '../../config/listCadastroPessoas.json'

@Component
export default class ModuleComponent extends Vue {
  // ===== data =====

  colunasCadastroPessoas = listCadastroPessoas.columns
  tipoPessoa: string | null = null
  sexo: string | null = null
  ativoInativo: string | null = null
  mostrarFormCadastroGeral = false

  opcoesTipoPessoa = [
      { label: 'Pessoa Física', value: 'PF' },
      { label: 'Pessoa Jurídica', value: 'PJ' }
    ]
  tipoSexo = [
    { label: 'Masculino', value: 'M' },
    { label: 'Feminino', value: 'F' },
    { label: 'Não informado', value: 'NI' }
  ]
  ativo_inativo = [
    { label: 'Ativo', value: 'A' },
    { label: 'Inativo', value: 'I' }
  ]

  mostrarFormulario() {
    this.mostrarFormCadastroGeral = true
  }
}
</script>

<style scoped></style>
