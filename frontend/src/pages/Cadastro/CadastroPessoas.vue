<template>
  <div class="text-h5 text-bold">
    <div class="q-py-md">CADASTRO PESSOAS</div>
    <div class="col-12">
      <div class="row col-3">
        <q-select
          class="col-3 verde"
          v-model="tipoPessoa"
          :options="this.opcoesTipoPessoa"
          label="Tipo de Pessoa"
          outlined
          option-value="value"
          option-label="label"
          emit-value
          map-options
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

      <div v-if="mostrarFormCadastroPF">
        <div class="row col-12 q-mt-md">
          <div class="q-pb-md q-mt-md">
            <q-title class="text-h6">Dados Gerais</q-title>
          </div>
          <div class="row col-12 q-gutter-md">
            <q-input
              class="col-2"
              label="Data de Nascimento"
              type="date"
              outlined
              dense
            />
            <q-input class="col-3" label="Nome Social" outlined dense />
            <q-select
              class="col-2"
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
            <q-input
              class="col-3"
              label="Telefone 1"
              mask="(##) #####-####"
              outlined
              dense
            />
            <q-input
              class="col-3"
              label="Telefone 2"
              mask="(##) #####-####"
              outlined
              dense
            />
            <q-input class="col-3" label="E-mail" outlined dense />
          </div>
        </div>

        <div class="row col-12 q-mt-md">
          <div class="q-pb-md q-mt-md">
            <q-title class="text-h6">Dados de Endereço</q-title>
          </div>
          <div class="row col-12 q-gutter-md">
            <q-input
              class="col-3"
              label="CEP"
              mask="#####-###"
              outlined
              dense
            />
            <q-input class="col-3" label="Endereço" outlined dense />
            <q-input class="col-3" label="Número" outlined dense />
            <q-input class="col-3" label="Bairro" outlined dense />
            <q-input class="col-3" label="Cidade" outlined dense />
            <q-select
              class="col-2"
              v-model="ufSelect"
              :options="this.uf_select"
              label="UF"
              outlined
              dense
            />
          </div>
        </div>

        <div class="row col-12 q-mt-md">
          <div class="q-pb-md q-mt-md">
            <q-title class="text-h6">Observações</q-title>
          </div>
          <div class="row col-12 q-gutter-md">
            <q-input
              class="row col-10"
              v-model="text"
              outlined
              dense
              type="textarea"
              input-style="resize: none;"
            />
          </div>
        </div>

        <div class="row col-12 q-mt-lg q-gutter-md">
          <q-btn class="bg-green text-white text-bold">Salvar</q-btn>
          <q-btn class="bg-red text-white text-bold" @click="abrirDialogCancelar()">Cancelar</q-btn>
        </div>
      </div>

      <div v-if="mostrarFormCadastroPJ">
        <div class="row col-12 q-mt-md">
          <div class="q-pb-md q-mt-md">
            <q-title class="text-h6">Dados Gerais</q-title>
          </div>
          <div class="row col-12 q-gutter-md">
            <q-input class="col-3" label="Razão Social" outlined dense />
            <q-input class="col-3" label="Nome do responsável" outlined dense />
            <q-select
              class="col-2"
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
            <q-input
              class="col-3"
              label="Telefone 1"
              mask="(##) #####-####"
              outlined
              dense
            />
            <q-input
              class="col-3"
              label="Telefone 2"
              mask="(##) #####-####"
              outlined
              dense
            />
            <q-input class="col-3" label="E-mail" outlined dense />
          </div>
        </div>

        <div class="row col-12 q-mt-md">
          <div class="q-pb-md q-mt-md">
            <q-title class="text-h6">Dados de Endereço</q-title>
          </div>
          <div class="row col-12 q-gutter-md">
            <q-input
              class="col-3"
              label="CEP"
              mask="#####-###"
              outlined
              dense
            />
            <q-input class="col-3" label="Endereço" outlined dense />
            <q-input class="col-3" label="Número" outlined dense />
            <q-input class="col-3" label="Bairro" outlined dense />
            <q-input class="col-3" label="Cidade" outlined dense />
            <q-select
              class="col-2"
              v-model="ufSelect"
              :options="this.uf_select"
              label="Ativo/Inativo"
              outlined
              dense
            />
          </div>
        </div>

        <div class="row col-12 q-mt-md">
          <div class="q-pb-md q-mt-md">
            <q-title class="text-h6">Observações</q-title>
          </div>
          <div class="row col-12 q-gutter-md">
            <q-input
              class="row col-10"
              v-model="text"
              outlined
              dense
              type="textarea"
              input-style="resize: none;"
            />
          </div>
        </div>

        <div class="row col-12 q-mt-lg q-gutter-md">
          <q-btn class="bg-green text-white text-bold">Salvar</q-btn>
          <q-btn class="bg-red text-white text-bold" @click="abrirDialogCancelar()">Cancelar</q-btn>
        </div>

      </div>

      <div>
        <q-table
          :columns="this.colunasCadastroPessoas"
          row-key="codigo"
          flat
          bordered
          class="q-mt-lg"
          v-if="!mostrarFormCadastroPF && !mostrarFormCadastroPJ"
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

      <q-dialog v-model="dialogCancelar">
          <q-card style="min-width: 300px">
            <q-card-section class="text-h6">
              Confirmar Cancelamento
            </q-card-section>

            <q-card-section>
              Você tem certeza que deseja cancelar? Os dados não salvos serão perdidos.
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Não" color="primary" v-close-popup />
              <q-btn
                flat
                label="Sim, cancelar"
                color="negative"
                @click="confirmarCancelamento()"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
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
  ufSelect: string | null = null
  mostrarFormCadastroPF = false
  mostrarFormCadastroPJ = false
  dialogCancelar = false

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

  uf_select = [
    { label: 'DF', value: 'DF' },
    { label: 'Outro', value: 'Outro' }
  ]

  mostrarFormulario(){
    if(this.tipoPessoa === 'PF'){
      this.mostrarFormCadastroPF = true
      this.mostrarFormCadastroPJ = false
    }
    if(this.tipoPessoa === 'PJ'){
      this.mostrarFormCadastroPF = false
      this.mostrarFormCadastroPJ = true
    }
    if(!this.tipoPessoa){
      this.$q.notify({
        type: 'negative',
        message: 'Selecione o tipo de pessoa',
        position: 'bottom'
      })
    return
    }
  }

  abrirDialogCancelar(){
    this.dialogCancelar = true
  }

  confirmarCancelamento() {
  this.dialogCancelar = false

  // volta pra tabela
  this.mostrarFormCadastroPF = false
  this.mostrarFormCadastroPJ = false

  // opcional: limpa dados
  this.tipoPessoa = null
}
}
</script>

<style scoped>

</style>
