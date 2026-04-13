<template>
  <div class="text-h5 text-bold">
    <div class="q-py-md">Cadastro de Produtos</div>

    <div class="col-12">
      <div class="col-12 row justify-between items-center q-mt-md">
        <div class="row col-7 ">
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
            v-model="nome"
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
              type="money"
              v-model="precoVendaTable"
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
          <q-btn
            class="bg-negative text-white text-bold"
            @click="abrirDialogCancelar()"
            >Cancelar</q-btn
          >
        </div>
      </div>

      <div>
        <q-table
          :data="this.rowsFiltradas"
          :columns="this.colunasCadastroProdutos"
          row-key="codigo"
          flat
          bordered
          class="q-mt-lg text-weight-medium"
          no-data-label="Nenhum registro encontrado"
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
  // ===== data =====
  colunasCadastroProdutos = listCadastroProdutos.columns
  precoCusto: number | null = null
  precoVenda: number | null = null
  ativoInativo: string | null = null
  cadastroProdutoForm = false
  dialogCancelar = false

  rowsFiltradas: any[] = []

    // Dados Gerais
  nome = ''
  codigo = ''
  grupo = ''
  estoque = ''
  fornecedor = ''
  status = ''
  precoVendaTable: number | null = null
  dialogExcluir = false

  created(){
    this.rowsFiltradas = this.rowsProdutos
  }

  ativo_inativo = [
    { label: 'Ativo', value: 'A' },
    { label: 'Inativo', value: 'I' }
  ]

  rowsProdutos = [
    {
      codigo: '1SB807221CGRU',
      nome: 'Parachoque',
      grupo: 'Lanternagem',
      precoVendaTable: '1200',
      estoque: '20',
      fornecedor: 'Volkswagen',
      status: 'Ativo'
    },
    {
      codigo: '5Z0807221ADGRU',
      nome: 'Parachoque',
      grupo: 'Lanternagem',
      precoVendaTable: '1200',
      estoque: '20',
      fornecedor: 'Volkswagen',
      status: 'Ativo'
    },
    {
      codigo: '2G5601025041',
      nome: 'Roda',
      grupo: 'Lanternagem',
      precoVendaTable: '1200',
      estoque: '20',
      fornecedor: 'Volkswagen',
      status: 'Inativo'
    }
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

pesquisar() {
  this.rowsFiltradas = this.rowsProdutos.filter((row: any) => {
    const nomeMatch =
      !this.nome ||
      row.nome.toLowerCase().includes(this.nome.toLowerCase())

    const codigoMatch =
      !this.codigo ||
      row.codigo.toLowerCase().includes(this.codigo.toLowerCase())

      return nomeMatch && codigoMatch
  });
}

editar(row: any) {
  // Preenche os campos do formulário com os dados do usuário
  this.codigo = row.codigo
  this.nome = row.nome
  this.grupo = row.grupo
  this.estoque = row.estoque
  this.fornecedor = row.fornecedor
  this.precoVendaTable = row.precoVendaTable
  this.ativoInativo = row.status === 'Ativo' ? 'Ativo' : 'Inativo'

  this.cadastroProdutoForm = true
}

confirmarExcluir() {
  this.dialogExcluir = true
}

refreshTable(){
  this.codigo = ""
  this.nome = ""

  this.rowsFiltradas = this.rowsProdutos
}
}
</script>

<style scoped>
.border{
  border: 1px solid black;
}
</style>
