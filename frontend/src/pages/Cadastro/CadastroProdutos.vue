<template>
  <div class="text-h5 text-bold">
    <div class="q-py-md">CADASTRO DE PRODUTOS</div>

    <div class="col-12">
      <div class="col-12 row justify-between items-center">
        <div class="row col-9 q-mt-md">
          <q-input class="col-4" label="Nome do Produto" outlined dense />
          <q-input
            class="col-4 q-px-md"
            label="Código do Produto"
            outlined
            dense
          />
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

      <div v-if="cadastroProdutoForm">
        <div class="row col-12 q-mt-md">
          <div class="q-pb-md q-mt-md">
            <q-title class="text-h6">Dados Gerais</q-title>
          </div>
          <div class="row col-12 q-gutter-md">
            <q-input class="col-6" label="Código de Barras" outlined dense />
            <q-select class="col-3" label="Categoria" outlined dense />
            <q-select class="col-3" label="Subcategoria" outlined dense />
            <q-select class="col-3" label="Marca" outlined dense />
          </div>
        </div>

        <div class="row col-12 q-mt-md">
          <div class="q-pb-md q-mt-md">
            <q-title class="text-h6">Preço</q-title>
          </div>
          <div class="row col-12 q-gutter-md">
            <q-input
              v-model="precoCusto"
              class="col-3"
              label="Preço de Custo"
              outlined
              dense
            />
            <q-input
              type="money"
              v-model="precoVenda"
              class="col-3"
              label="Preço de Venda"
              outlined
              dense
            />
            <q-input
              class="col-2"
              label="Margem (%)"
              outlined
              dense
              :value="margemCalculada"
              readonly
            />
          </div>
        </div>

        <div class="row col-12 q-mt-md">
          <div class="q-pb-md q-mt-md">
            <q-title class="text-h6">Estoque</q-title>
          </div>
          <div class="row col-12 q-gutter-md">
            <q-input class="col-3" label="Estoque Atual" outlined dense />
            <q-input
              type="money"
              class="col-3"
              label="Estoque Máximo"
              outlined
              dense
            />
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
            <q-title class="text-h6">Dados do Fornecedor</q-title>
          </div>
          <div class="row col-12 q-gutter-md">
            <q-input class="col-3" label="Nome do Fornecedor" outlined dense />
            <q-input class="col-3" label="Garantia" outlined dense />
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
          <q-btn class="bg-green text-white text-bold" rounded>Salvar</q-btn>
          <q-btn
            class="bg-red text-white text-bold"
            rounded
            @click="abrirDialogCancelar()"
            >Cancelar</q-btn
          >
        </div>
      </div>

      <div>
        <q-table
          :columns="this.colunasCadastroProdutos"
          row-key="codigo"
          flat
          bordered
          class="q-mt-lg"
          v-if="!  cadastroProdutoForm"
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
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import listCadastroProdutos from '../../config/listCadastroProdutos.json'

@Component
export default class ModuleComponent extends Vue {
  // ===== data =====
  colunasCadastroProdutos = listCadastroProdutos.columns
  precoCusto: number | null = null
  precoVenda: number | null = null
  ativoInativo: string | null = null
  cadastroProdutoForm = false
  dialogCancelar = false

  ativo_inativo = [
    { label: 'Ativo', value: 'A' },
    { label: 'Inativo', value: 'I' }
  ]

  get margemCalculada(): string {
  if (!this.precoCusto || !this.precoVenda) return ''

  const margem = ((this.precoCusto - this.precoVenda) / this.precoCusto) * 100

  return margem.toFixed(2) + '%'
}

  mostrarFormulario(){
    this.cadastroProdutoForm = true
  }


  abrirDialogCancelar(){
      this.dialogCancelar = true
    }

  confirmarCancelamento() {
    this.dialogCancelar = false

    // volta pra tabela
    this.cadastroProdutoForm = false
}
}
</script>

<style scoped>
.verde {
  background-color: #11b69a;
}

.verde-escuro{
  background-color: #00725F;
}
</style>
