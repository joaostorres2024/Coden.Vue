<template>
  <div class="text-h5 text-bold">
    <div class="q-py-md">NF ENTRADA</div>
    <div class="col-12">
      <div class="col-12 row justify-between items-center q-mt-md">
        <div class="row col-7" v-if="!formNotaFiscalEntrada">
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
            class="text-black border"
            label="Limpar"
            unelevated
            @click="refreshTable()"
          />
          <q-btn
            icon="add"
            label="Cadastrar"
            class="text-black border"
            unelevated
            @click="mostrarFormulario()"
          />
          <q-btn
            icon="search"
            class="text-white bg-primary"
            label="Pesquisar"
            unelevated
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
          no-data-label="Nenhum registro encontrado"
          v-if="!formNotaFiscalEntrada"
        >
          <!-- Coluna Ações -->
          <template v-slot:body-cell-acoes="props">
            <q-td align="center">
              <q-btn
                icon="picture_as_pdf"
                size="sm"
                color="negative"
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
              <q-file
                outlined
                dense
                label="Carregar XML"
                class="col-5"
                v-model="arquivoXML"
                accept=".xml"
                clearable
                @input="lerXML"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
            <div class="row col-12 q-gutter-md">
              <q-input
                class="col-2"
                label="Número NF"
                v-model="form.numeroNF"
                outlined
                dense
              />
              <q-input
                class="col-2"
                label="Série"
                v-model="form.serie"
                outlined
                dense
              />
              <q-input
                class="col-2"
                label="Data Emissão"
                type="date"
                v-model="form.dataEmissao"
                outlined
                dense
              />
              <q-input
                class="col-2"
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
                  v-model="form.codigoProduto"
                  outlined
                  dense
                />
                <q-input
                  class="col-3 q-px-md"
                  label="Nome do Produto"
                  v-model="form.nomeProduto"
                  outlined
                  dense
                />
                <q-input
                  class="col-2"
                  label="Quantidade"
                  v-model="form.quantidade"
                  outlined
                  dense
                />
              </div>
              <div class="row">
                <q-input
                  class="col-6"
                  label="Código de Barras"
                  v-model="form.codigoBarras"
                  outlined
                  dense
                />
                <q-btn icon="add" label="Gerar" class="text-white bg-primary q-mx-md" unelevated />
              </div>
              <div class="row">
                <q-input
                  class="col-2"
                  label="Valor Unitário"
                  v-model="form.valorUnitario"
                  outlined
                  dense
                />
                <q-input
                  class="col-2 q-px-md"
                  label="Valor Total"
                  v-model="form.valorTotal"
                  outlined
                  dense
                />
                <q-input
                  class="col-2"
                  label="Valor de Venda"
                  v-model="form.valorVenda"
                  outlined
                  dense
                />
                <q-input
                  class="col-2 q-px-md"
                  label="Margem"
                  v-model="form.margem"
                  outlined
                  dense
                  readonly
                />
              </div>
              <div class="row">
                <q-select
                  class="col-2"
                  label="Grupo"
                  v-model="form.grupo"
                  outlined
                  dense
                />
                <q-btn icon="add" label="Criar" class="text-white bg-primary q-mx-md" unelevated />
              </div>
            </div>
            <div class="q-pb-md q-mt-md">
              <q-title class="text-h6">Origem</q-title>
            </div>
            <div class="column col-12 q-gutter-md">
              <div class="row">
                <q-input
                  class="col-3"
                  label="Fornecedor"
                  v-model="form.fornecedor"
                  outlined
                  dense
                />
                <q-input
                  class="col-2 q-px-md"
                  label="CNPJ/CPF"
                  v-model="form.cnpjCpf"
                  outlined
                  dense
                />
                <q-input
                  class="col-2"
                  label="Inscrição Estadual"
                  v-model="form.inscricaoEstadual"
                  outlined
                  dense
                />
                <q-select
                  class="col-1 q-px-md"
                  label="UF"
                  v-model="form.uf"
                  outlined
                  dense
                />
              </div>
            </div>
            <div class="q-pb-md q-mt-md">
              <q-title class="text-h6">Tributação</q-title>
            </div>
            <div class="column col-12 q-gutter-md">
              <div class="row">
                <q-input
                  class="col-3"
                  label="Origem"
                  v-model="form.origemTributaria"
                  outlined
                  dense
                />
              </div>
              <div class="row">
                <q-input
                  class="col-2"
                  label="ICMS"
                  v-model="form.icms"
                  outlined
                  dense
                />
                <q-input
                  class="col-2 q-px-md"
                  label="IPI"
                  v-model="form.ipi"
                  outlined
                  dense
                />
                <q-input
                  class="col-2"
                  label="PIS"
                  v-model="form.pis"
                  outlined
                  dense
                />
                <q-input
                  class="col-2 q-px-md"
                  label="COFINS"
                  v-model="form.cofins"
                  outlined
                  dense
                />
              </div>
            </div>
            <div class="q-pb-md q-mt-md">
              <q-title class="text-h6">Observações</q-title>
            </div>
            <div class="row col-12 q-gutter-md">
              <q-input
                class="row col-10"
                v-model="form.observacoes"
                outlined
                dense
                type="textarea"
                input-style="resize: none;"
              />
            </div>
          </div>

          <div class="row col-12 q-mt-lg q-gutter-md">
            <q-btn class="bg-green text-white text-bold" unelevated>Salvar</q-btn>
            <q-btn
              class="bg-negative text-white text-bold"
              unelevated
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
  codigo = ''
  produto = ''

  arquivoXML: File | null = null

  form = {
    numeroNF: '',
    serie: '',
    dataEmissao: '',
    codigoProduto: '',
    nomeProduto: '',
    quantidade: '',
    codigoBarras: '',
    valorUnitario: '',
    valorTotal: '',
    valorVenda: '',
    margem: '',
    grupo: null,
    fornecedor: '',
    cnpjCpf: '',
    inscricaoEstadual: '',
    uf: null,
    origemTributaria: '',
    icms: '',
    ipi: '',
    pis: '',
    cofins: '',
    observacoes: ''
  }

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
      numeroNF: '003',
      produto: 'Mouse Gamer Pro',
      quantidade: '3',
      valorUnitario: '149.90',
      valorTotal: '449.70',
      icms: '17'
    }
  ]

  created() {
    this.rowsFiltradas = this.rowsNfEntrada
  }

  pesquisar() {
    this.rowsFiltradas = this.rowsNfEntrada.filter((row: any) => {
      const numeroNFMatch = !this.numeroNF || row.numeroNF.toLowerCase().includes(this.numeroNF.toLowerCase())
      const produtoMatch = !this.produto || row.produto.toLowerCase().includes(this.produto.toLowerCase())
      return numeroNFMatch && produtoMatch
    })
  }

  refreshTable() {
    this.numeroNF = ''
    this.produto = ''
    this.codigo = ''

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
    this.formNotaFiscalEntrada = false
  }

  lerXML(file: File) {

    if (!file){
      this.form.numeroNF = '',
      this.form.serie = '',
    this.form.dataEmissao = '',
    this.form.codigoProduto = '',
    this.form.nomeProduto = '',
    this.form.quantidade = '',
    this.form.codigoBarras = '',
    this.form.valorUnitario = '',
    this.form.valorTotal = '',
    this.form.valorVenda = '',
    this.form.margem = '',
    this.form.grupo = null,
    this.form.fornecedor = '',
    this.form.cnpjCpf = '',
    this.form.inscricaoEstadual = '',
    this.form.uf = null,
    this.form.origemTributaria = '',
    this.form.icms = '',
    this.form.ipi = '',
    this.form.pis = '',
    this.form.cofins = '',
    this.form.observacoes = ''
    }

    const reader = new FileReader()
    reader.onload = (e: any) => {
      const content = e.target.result
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(content, 'text/xml')

      const getVal = (tagName: string, parent: Element | Document = xmlDoc) => {
        const el = parent.getElementsByTagName(tagName)[0]
        return el ? el.textContent : ''
      }

      this.form.numeroNF = getVal('nNF') || ''
      this.form.serie = getVal('serie') || ''
      const dhEmi = getVal('dhEmi') || getVal('dEmi') || ''
      if (dhEmi) {
        this.form.dataEmissao = dhEmi.substring(0, 10)
      }

      const emit = xmlDoc.getElementsByTagName('emit')[0]
      if (emit) {
        this.form.fornecedor = getVal('xNome', emit) || ''
        this.form.cnpjCpf = getVal('CNPJ', emit) || getVal('CPF', emit) || ''
        this.form.inscricaoEstadual = getVal('IE', emit) || ''
        this.form.uf = getVal('UF', emit) as any
      }

      const det = xmlDoc.getElementsByTagName('det')[0]
      if (det) {
        const prod = det.getElementsByTagName('prod')[0]
        if (prod) {
          this.form.codigoProduto = getVal('cProd', prod) || ''
          this.form.nomeProduto = getVal('xProd', prod) || ''
          this.form.quantidade = getVal('qCom', prod) || ''
          this.form.codigoBarras = getVal('cEAN', prod) || ''
          this.form.valorUnitario = getVal('vUnCom', prod) || ''
          this.form.valorTotal = getVal('vProd', prod) || ''
        }

        const imposto = det.getElementsByTagName('imposto')[0]
        if (imposto) {

          this.form.icms = getVal('vICMS', imposto) || ''
          this.form.ipi = getVal('vIPI', imposto) || ''
          this.form.pis = getVal('vPIS', imposto) || ''
          this.form.cofins = getVal('vCOFINS', imposto) || ''
          this.form.origemTributaria = getVal('orig', imposto) || ''
        }
      }

      this.$q.notify({
        type: 'positive',
        message: 'XML carregado com sucesso!'
      })
    }
    reader.readAsText(file)
  }
}
</script>

<style scoped>
.border{
  border: 1px solid black;
}
</style>
