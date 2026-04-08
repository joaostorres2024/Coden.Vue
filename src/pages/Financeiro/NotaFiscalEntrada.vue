v
<template>
  <div class="text-h5 text-bold">
    <div class="q-py-md">NF ENTRADA</div>
    <div class="col-12">
      <div class="col-12 row justify-between items-center q-mt-md">
        <div class="row col-8" v-if="!formNotaFiscalEntrada">
          <q-input
            class="col-2"
            label="Número NF"
            v-model="numeroNF"
            outlined
            dense
          />
          <q-input
            class="col-3 q-px-md"
            label="Código do Produto"
            v-model="codigo"
            outlined
            dense
          />
          <q-input
            class="col-3"
            label="Nome do Produto"
            v-model="produto"
            outlined
            dense
          />
        </div>
        <div class="row q-gutter-md" v-if="!formNotaFiscalEntrada">
          <q-btn
            icon="delete"
            class="text-black"
            label="Limpar"
            @click="refreshTable()"
          />
          <q-btn
            icon="add"
            label="Cadastrar"
            class="text-black"
            @click="mostrarFormulario()"
          />
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
          :data="this.rowsFiltradas"
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

      <form action="">
        <div v-if="formNotaFiscalEntrada">
          <div class="row col-12">
            <div class="row q-gutter-md items-center q-pb-md">
              <q-title class="text-h6">Dados da Nota</q-title>
              <q-btn icon="code" class="text-black" @click="refreshTable()" />
            </div>
            <div class="row col-12 q-gutter-md">
              <q-input class="col-2" label="Número NF" outlined dense />
              <q-input class="col-2" label="Série" outlined dense />
              <q-input
                class="col-2"
                label="Data Emissão"
                type="date"
                outlined
                dense
              />
              <q-input
                class="col-1"
                label="Data Entrada"
                type="date"
                v-model="dataHoje"
                outlined
                dense
                readonly
              />
            </div>
            <div class="q-pb-md q-mt-md">
              <q-title class="text-h6">Produto</q-title>
            </div>
            <div class="column col-12 q-gutter-md">
              <div class="row">
                <q-input
                  class="col-3"
                  label="Código do Produto"
                  outlined
                  dense
                />
                <q-input
                  class="col-3 q-px-md"
                  label="Nome do Produto"
                  outlined
                  dense
                />
                <q-input class="col-2" label="Quantidade" outlined dense />
              </div>
              <div class="row">
                <q-input
                  class="col-6"
                  label="Código de Barras"
                  outlined
                  dense
                />
                <q-btn icon="add" label="Gerar" class="text-black q-mx-md" />
              </div>
              <div class="row">
                <q-input class="col-2" label="Valor Unitário" outlined dense />
                <q-input
                  class="col-2 q-px-md"
                  label="Valor Total"
                  outlined
                  dense
                />
                <q-input class="col-2" label="Valor de Venda" outlined dense />
                <q-input
                  class="col-2 q-px-md"
                  label="Margem"
                  outlined
                  dense
                  readonly
                />
              </div>
              <div class="row">
                <q-select class="col-2" label="Grupo" outlined dense />
                <q-btn icon="add" label="Criar" class="text-black q-mx-md" />
              </div>
            </div>
            <div class="q-pb-md q-mt-md">
              <q-title class="text-h6">Origem</q-title>
            </div>
            <div class="column col-12 q-gutter-md">
              <div class="row">
                <q-input class="col-3" label="Fornecedor" outlined dense />
                <q-input
                  class="col-2 q-px-md"
                  label="CNPJ/CPF"
                  outlined
                  dense
                />
                <q-input
                  class="col-2"
                  label="Inscrição Estadual"
                  outlined
                  dense
                />
                <q-select class="col-1 q-px-md" label="UF" outlined dense />
              </div>
            </div>
            <div class="q-pb-md q-mt-md">
              <q-title class="text-h6">Tributação</q-title>
            </div>
            <div class="column col-12 q-gutter-md">
              <div class="row">
                <q-input class="col-3" label="Origem" outlined dense />
              </div>
              <div class="row">
                <q-input class="col-2" label="ICMS" outlined dense />
                <q-input class="col-2 q-px-md" label="IPI" outlined dense />
                <q-input class="col-2" label="PIS" outlined dense />
                <q-input class="col-2 q-px-md" label="COFINS" outlined dense />
              </div>
            </div>
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
  numeroNF = ''
  produto = ''
  quantidade = ''
  valorUnitario = ''
  valorTotal = ''
  icms = ''

  rowsFiltradas: any[] = []

  rowsNfEntrada = [
  {
    numeroNF: '002',
    produto: 'Teclado Mecânico RGB',
    quantidade: '1',
    valorUnitario: '350.00',
    valorTotal: '350.00',
    icms: '17'
  },
  {
    numeroNF: '002',
    produto: 'Teclado Mecânico RGB',
    quantidade: '1',
    valorUnitario: '350.00',
    valorTotal: '350.00',
    icms: '17'
  },
  {
    numeroNF: '003',
    produto: 'Mouse Gamer Pro',
    quantidade: '3',
    valorUnitario: '149.90',
    valorTotal: '449.70',
    icms: '17'
  },
  {
    numeroNF: '004',
    produto: 'Monitor 24"',
    quantidade: '1',
    valorUnitario: '1299.00',
    valorTotal: '1299.00',
    icms: '17'
  },
  {
    numeroNF: '005',
    produto: 'Headset Gamer',
    quantidade: '2',
    valorUnitario: '199.90',
    valorTotal: '399.80',
    icms: '17'
  }
]

  created() {
  this.rowsFiltradas = this.rowsNfEntrada
}

pesquisar() {
  this.rowsFiltradas = this.rowsNfEntrada.filter((row: any) => {

    const numeroNFMatch =
      !this.numeroNF ||
      row.numeroNF
        .toLowerCase()
        .includes(this.numeroNF.toLowerCase())

    const produtoMatch =
      !this.produto ||
      row.produto
        .toLowerCase()
        .includes(this.produto.toLowerCase())

    const quantidadeMatch =
      !this.quantidade ||
      row.quantidade
        .toLowerCase()
        .includes(this.quantidade.toLowerCase())

    const valorUnitarioMatch =
      !this.valorUnitario ||
      row.valorUnitario
        .toLowerCase()
        .includes(this.valorUnitario.toLowerCase())

    const valorTotalMatch =
      !this.valorTotal ||
      row.valorTotal
        .toLowerCase()
        .includes(this.valorTotal.toLowerCase())

    const icmsMatch =
      !this.icms ||
      row.icms
        .toLowerCase()
        .includes(this.icms.toLowerCase())

    return (
      numeroNFMatch &&
      produtoMatch &&
      quantidadeMatch &&
      valorUnitarioMatch &&
      valorTotalMatch &&
      icmsMatch
    )
  })
}

refreshTable() {
  this.numeroNF = ''
  this.produto = ''
  this.quantidade = ''
  this.valorUnitario = ''
  this.valorTotal = ''
  this.icms = ''

  this.rowsFiltradas = this.rowsNfEntrada
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
