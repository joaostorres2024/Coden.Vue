<template>
  <div class="text-h5 text-bold">
    <div class="q-py-md">Cadastro de Produtos</div>

    <div class="col-12">
      <div class="col-12 row justify-between items-center q-mt-md">
        <div class="row col-7">
          <q-input
            v-model="codigo"
            class="col-4"
            label="Código do Produto"
            outlined
            dense
          />

          <q-input
            class="col-4 q-px-md"
            label="Nome do Produto"
            v-model="nmeProduto"
            outlined
            dense
          />
        </div>
        <div class="row q-gutter-md" v-if="!cadastroProdutoForm">
          <q-btn
            icon="delete"
            class="text-black border"
            label="Limpar"
            @click="refreshTable()"
            unelevated
          />
          <q-btn
            icon="add"
            label="Cadastrar"
            class="text-black border"
            @click="mostrarFormulario()"
            unelevated
          />
          <q-btn
            icon="search"
            class="text-white bg-primary"
            label="Pesquisar"
            @click="pesquisar()"
            unelevated
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
            <q-select
              class="col-3"
              label="Grupo"
              v-model="grupo"
              outlined
              dense
            />
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
              v-model="precoVendaTabela"
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
            <q-input
              class="col-3"
              label="Estoque Atual"
              v-model="estoque"
              outlined
              dense
            />
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
              :options="ativoInativoOpcoes"
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
            <q-input
              class="col-3"
              label="Nome do Fornecedor"
              v-model="fornecedor"
              outlined
              dense
            />
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
              v-model="obsProduto"
              outlined
              dense
              type="textarea"
              input-style="resize: none;"
            />
          </div>
        </div>

        <div class="row col-12 q-mt-lg q-gutter-md">
          <q-btn class="bg-green text-white text-bold">Salvar</q-btn>
          <q-btn
            class="bg-negative text-white text-bold"
            @click="abrirDialogCancelar()"
            >Cancelar</q-btn
          >
        </div>
      </div>

      <div>
        <q-table
          :data="rowsFiltradas"
          :columns="colunasCadastroProdutos"
          row-key="codigo"
          flat
          bordered
          class="q-mt-lg text-weight-medium"
          no-data-label="Nenhum registro encontrado"
          v-if="!cadastroProdutoForm"
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
                @click="confirmarExcluir(props.row)"
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

    <q-dialog v-model="dialogExcluir">
      <q-card style="min-width: 300px">
        <q-card-section class="text-h6"> Deseja mesmo excluir? </q-card-section>

        <q-card-section> Você tem certeza que deseja excluir? </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Não" color="primary" v-close-popup />
          <q-btn
            flat
            label="Sim, excluir"
            color="negative"
            @click="confirmarExcluir()"
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
  // ===== Campos do Produto =====
  codigo = ''
  nmeProduto = ''
  grupo = ''
  estoque = ''
  fornecedor = ''
  status = ''
  precoCusto: number | null = null
  precoVendaTabela: number | null = null
  ativoInativo: string | null = null
  obsProduto = ''

  // ===== Controle =====
  cadastroProdutoForm = false
  dialogCancelar = false
  dialogExcluir = false

  // ===== Tabela =====
  rowsFiltradas: any[] = []
  colunasCadastroProdutos = listCadastroProdutos.columns

  created () {
    this.rowsFiltradas = this.rowsProdutos
  }

  ativoInativoOpcoes = [
    { label: 'Ativo', value: 'Ativo' },
    { label: 'Inativo', value: 'Inativo' }
  ]

  rowsProdutos = [
    {
      codigo: '1SB807221CGRU',
      nmeProduto: 'Parachoque',
      grupo: 'Lanternagem',
      precoVendaTabela: 1200,
      estoque: '20',
      fornecedor: 'Volkswagen',
      status: 'Ativo'
    }
  ]

  get margemCalculada (): string {
    if (!this.precoCusto || !this.precoVendaTabela) return ''

    const margem =
      ((this.precoVendaTabela - this.precoCusto) / this.precoCusto) * 100

    return margem.toFixed(2) + '%'
  }

  mostrarFormulario () {
    this.cadastroProdutoForm = true
  }

  abrirDialogCancelar () {
    this.dialogCancelar = true
  }

  confirmarCancelamento () {
    this.dialogCancelar = false
    this.cadastroProdutoForm = false
    this.codigo = ''
    this.nmeProduto = ''
    this.rowsFiltradas = this.rowsProdutos
  }

  pesquisar () {
    this.rowsFiltradas = this.rowsProdutos.filter((row: any) => {
      const nomeMatch =
        !this.nmeProduto ||
        row.nmeProduto.toLowerCase().includes(this.nmeProduto.toLowerCase())

      const codigoMatch =
        !this.codigo ||
        row.codigo.toLowerCase().includes(this.codigo.toLowerCase())

      return nomeMatch && codigoMatch
    })
  }

  editar (row: any) {
    this.codigo = row.codigo
    this.nmeProduto = row.nmeProduto
    this.grupo = row.grupo
    this.estoque = row.estoque
    this.fornecedor = row.fornecedor
    this.precoVendaTabela = row.precoVendaTabela
    this.ativoInativo = row.status
    this.cadastroProdutoForm = true
  }

  confirmarExcluir () {
    this.dialogExcluir = true
  }

  refreshTable () {
    this.codigo = ''
    this.nmeProduto = ''
    this.rowsFiltradas = this.rowsProdutos
  }
}
</script>

<style scoped>
.border {
  border: 1px solid black;
}
</style>
