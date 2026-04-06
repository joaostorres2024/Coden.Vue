<template>
  <div class="text-h5 text-bold">
    <div class="q-py-md">NF ENTRADA</div>
    <div class="col-12">
      <div class="row col-2 q-mt-md">
        <q-input class="col-4" label="Número NF" outlined dense />
      </div>
      <div class="col-12 row justify-between items-center">
        <div class="row col-9 q-mt-md">
          <q-input class="col-4" label="Nome Completo" outlined dense />
          <q-input class="col-4 q-px-md" label="CNPJ/CPF" outlined dense />
          <q-input class="col-2" label="Código do Cliente" outlined dense />
        </div>
        <div class="row q-gutter-md">
          <q-btn icon="search" class="text-white verde-escuro" rounded />
          <q-btn
            rounded
            icon="add"
            class="text-white verde"
            @click="mostrarFormulario()"
          />
        </div>
      </div>

      <div>
        <q-table
          :columns="this.colunasNotaFiscalEntrada"
          row-key="codigo"
          flat
          bordered
          class="q-mt-lg"
          v-if="!formNotaFiscalEntrada"
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

      <form action="">
        <div v-if="formNotaFiscalEntrada">
          <div class="row col-12 q-mt-md">
            <div class="q-pb-md q-mt-md">
              <q-title class="text-h6">Origem</q-title>
            </div>
            <div class="row col-12 q-gutter-md">
              <q-input class="col-3" label="Fornecedor" outlined dense />
              <q-input class="col-3" label="CNPJ Fornecedor" outlined dense />
              <q-input class="col-3" label="ICMS" outlined dense />
              <q-input class="col-3" label="IPI" outlined dense />
              <q-input class="col-3" label="PIS/COFINS" outlined dense />
              <q-input class="col-3" label="Frete" outlined dense />
              <q-input class="col-3" label="Desconto" outlined dense />
              <q-input class="col-3" label="Valor Total" outlined dense />
              <q-input
                class="col-3"
                label="Natureza da Operação"
                outlined
                dense
              />
            </div>
          </div>

          <div class="row col-12 q-mt-lg q-gutter-md">
            <q-btn class="bg-green text-white text-bold">Salvar</q-btn>
            <q-btn
              class="bg-red text-white text-bold"
              @click="abrirDialogCancelar()"
              >Cancelar</q-btn
            >
          </div>
        </div>
      </form>

      <q-dialog v-model="dialogCancelar">
        <q-card style="min-width: 300px">
          <q-card-section class="text-h6">
            Confirmar Cancelamento
          </q-card-section>

          <q-card-section>
            Você tem certeza que deseja cancelar? Os dados não salvos serão
            perdidos.
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
import moment from 'moment'
import listNotaFiscalEntrada from '../../config/listNotaFiscalEntrada.json'

@Component
export default class ModuleComponent extends Vue {
   // ===== data =====

   colunasNotaFiscalEntrada = listNotaFiscalEntrada.columns
  formNotaFiscalEntrada = false
  dataHoje = moment().format('YYYY-MM-DD')
  dialogCancelar = false

  created(){
    console.log(this.dataHoje)
  }

  mostrarFormulario(){
    this.formNotaFiscalEntrada = true
  }

  abrirDialogCancelar(){
      this.dialogCancelar = true
    }

  confirmarCancelamento() {
    this.dialogCancelar = false

    // volta pra tabela
    this.formNotaFiscalEntrada = false
}

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
