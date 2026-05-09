<template>
  <div class="row justify-center items-center">
    <q-card
      class="col-11 col-md-10 col-lg-9 no-shadow border b-r-10"
      style="width: 1500px"
    >
      <q-card-section class="bg-white text-black q-pb-none">
        <div class="text-h5 text-bold">NF Entrada</div>
        <q-toolbar class="q-pa-none">
          <q-breadcrumbs active-color="black" style="font-size: 14px" class="q-mb-md">
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="black" />
            </template>
            <q-breadcrumbs-el label="Home" icon="home" to="/" />
            <q-breadcrumbs-el label="Financeiro" icon="paid" />
            <q-breadcrumbs-el label="NF Entrada" icon="trending_up" />
          </q-breadcrumbs>
        </q-toolbar>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-lg">

        <!-- Filtros -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-4">
            <q-input v-model="numeroNF" label="Número NF" outlined dense />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="codigo" label="Código do Produto" outlined dense />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="produto" label="Nome do Produto" outlined dense />
          </div>
        </div>

        <!-- Botões -->
        <div v-if="!formNotaFiscalEntrada" class="row justify-end q-gutter-sm q-mb-md">
          <q-btn
            label="Adicionar"
            icon="add"
            color="positive"
            unelevated
            @click="mostrarFormulario()"
          />
          <q-btn
            label="Limpar"
            icon="delete_sweep"
            flat
            class="text-grey-7"
            @click="refreshTable()"
          />
        </div>

        <!-- Formulário -->
        <div v-if="formNotaFiscalEntrada" class="q-mt-lg">
          <q-form @submit.prevent="salvar()">

            <!-- Dados da Nota -->
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-h6">Dados da Nota</div>
              <q-file
                outlined
                dense
                label="Carregar XML"
                v-model="arquivoXML"
                accept=".xml"
                @input="lerXML"
                clearable
                style="width: 200px"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-sm-4">
                <q-input v-model="form.numeroNF" label="Número NF" outlined dense />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="form.serie" label="Série" outlined dense />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="form.dataEmissao" label="Data Emissão" type="date" outlined dense />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="dataHoje" label="Data Entrada" type="date" outlined dense readonly />
              </div>
            </div>

            <!-- Origem -->
            <div class="text-h6 q-mb-sm">Origem</div>
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-sm-4">
                <q-input v-model="form.fornecedor" label="Fornecedor" outlined dense />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="form.cnpjCpf" label="CNPJ/CPF" outlined dense />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="form.inscricaoEstadual" label="Inscrição Estadual" outlined dense />
              </div>
              <div class="col-12 col-sm-4">
                <q-select v-model="form.uf" label="UF" outlined dense :options="['DF', 'SP', 'RJ', 'MG']" />
              </div>
            </div>

            <!-- Produto -->
            <div class="text-h6 q-mb-sm">Produto</div>
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-sm-4">
                <q-input v-model="form.codigoProduto" label="Código do Produto" outlined dense />
              </div>
              <div class="col-12 col-sm-8">
                <q-input v-model="form.nomeProduto" label="Nome do Produto" outlined dense />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="form.quantidade" label="Quantidade" outlined dense />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="form.valorUnitario" label="Valor Unitário" outlined dense />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="form.valorTotal" label="Valor Total" outlined dense />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="form.valorVenda" label="Preço de Venda" outlined dense />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="form.margem" label="Margem (%)" outlined dense readonly />
              </div>
              <div class="col-12 col-sm-4">
                <q-select v-model="form.grupo" label="Grupo" outlined dense :options="['Grupo 1', 'Grupo 2']" />
              </div>
              <div class="col-12 col-sm-4">
                <q-btn label="Criar Grupo" color="primary" unelevated class="full-width" />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="form.codigoBarras" label="Código de Barras" outlined dense />
              </div>
              <div class="col-12 col-sm-4">
                <q-btn label="Gerar" color="primary" unelevated class="full-width" />
              </div>
              <div class="col-12">
                <q-input
                  label="Observações do Produto"
                  v-model="obsProduto"
                  type="textarea"
                  outlined
                  dense
                  input-style="resize: none;"
                  rows="3"
                />
              </div>
            </div>

            <!-- Tributação -->
            <div class="text-h6 q-mb-sm">Tributação</div>
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-sm-4">
                <q-input v-model="form.origemTributaria" label="Origem" outlined dense />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="form.icms" label="ICMS" outlined dense />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="form.ipi" label="IPI" outlined dense />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="form.pis" label="PIS" outlined dense />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="form.cofins" label="COFINS" outlined dense />
              </div>
            </div>

            <!-- Observações Gerais -->
            <div class="text-h6 q-mb-sm">Observações Gerais</div>
            <div class="row q-mb-md">
              <div class="col-12">
                <q-input
                  v-model="text"
                  type="textarea"
                  outlined
                  dense
                  input-style="resize: none;"
                  rows="3"
                />
              </div>
            </div>

            <!-- Botões -->
            <div class="row q-mt-xl q-gutter-md justify-end">
              <q-btn label="Salvar Entrada" color="positive" unelevated type="submit" />
              <q-btn label="Cancelar" color="negative" flat @click="abrirDialogCancelar()" />
            </div>
          </q-form>
        </div>

        <!-- Tabela -->
        <div v-if="!formNotaFiscalEntrada" class="q-mt-lg">
          <q-table
            :data="rowsFiltradas"
            :columns="colunasNotaFiscalEntrada"
            row-key="codigo"
            flat
            bordered
            no-data-label="Nenhum registro encontrado"
            class="text-weight-medium"
            :rows-per-page-options="[10, 20, 50]"
          >
            <template v-slot:body-cell-acoes="props">
              <q-td align="center">
                <q-btn icon="picture_as_pdf" size="sm" color="negative" flat round>
                  <q-tooltip>Exportar PDF</q-tooltip>
                </q-btn>
                <q-btn icon="description" size="sm" color="green" flat round>
                  <q-tooltip>Ver Detalhes</q-tooltip>
                </q-btn>
              </q-td>
            </template>
            <template v-slot:body-cell-valorUnitario="props">
              <q-td :props="props" align="center">{{ formatarReais(props.row.valorUnitario) }}</q-td>
            </template>
            <template v-slot:body-cell-valorTotal="props">
              <q-td :props="props" align="center">{{ formatarReais(props.row.valorTotal) }}</q-td>
            </template>
            <template v-slot:body-cell-status="props">
              <q-td align="center">
                <q-badge :color="props.row.status === 'Ativo' ? 'positive' : 'negative'">
                  {{ props.row.status }}
                </q-badge>
              </q-td>
            </template>
          </q-table>
        </div>
      </q-card-section>
    </q-card>

    <!-- Dialog Cancelar -->
    <q-dialog v-model="dialogCancelar" persistent>
      <q-card style="min-width: 380px; border-radius: 12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Cancelar operação</div>
        </q-card-section>
        <q-card-section class="text-grey-7" style="font-size: 14px">
          Deseja realmente cancelar? As alterações não salvas serão perdidas.
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn
            label="Voltar"
            unelevated
            style="border: 1px solid #ccc; border-radius: 8px; min-width: 100px"
            color="white"
            text-color="dark"
            v-close-popup
          />
          <q-btn
            label="Sim, Cancelar"
            unelevated
            color="negative"
            class="b-r-8"
            style="min-width: 130px"
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
import listNotaFiscalEntrada from '../../config/listNotaFiscalEntrada.json'

@Component
export default class ModuleComponent extends Vue {
  colunasNotaFiscalEntrada = listNotaFiscalEntrada.columns

  numeroNF = ''
  codigo = ''
  produto = ''
  arquivoXML = null
  dataHoje = new Date().toISOString().substr(0, 10)
  text = ''
  obsProduto = ''

  formNotaFiscalEntrada = false
  dialogCancelar = false

  form = {
    numeroNF: '',
    serie: '',
    dataEmissao: '',
    codigoProduto: '',
    nomeProduto: '',
    quantidade: '',
    valorUnitario: '',
    valorTotal: '',
    valorVenda: '',
    margem: '',
    grupo: '',
    codigoBarras: '',
    fornecedor: '',
    cnpjCpf: '',
    inscricaoEstadual: '',
    uf: '',
    origemTributaria: '',
    icms: '',
    ipi: '',
    pis: '',
    cofins: ''
  }

  rowsNfEntrada = [
    { numeroNF: '101', codigo: 'PROD001', produto: 'Filtro de Óleo', valorUnitario: 45.50, valorTotal: 455.00, status: 'Ativo' },
    { numeroNF: '102', codigo: 'PROD002', produto: 'Pastilha de Freio', valorUnitario: 120.00, valorTotal: 240.00, status: 'Ativo' }
  ]

  rowsFiltradas: any[] = []

  created() {
    this.rowsFiltradas = this.rowsNfEntrada
  }

  formatarReais(valor: string | number): string {
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  mostrarFormulario() {
    this.formNotaFiscalEntrada = true
  }

  abrirDialogCancelar() {
    this.dialogCancelar = true
  }

  confirmarCancelamento() {
    this.dialogCancelar = false
    this.formNotaFiscalEntrada = false
    this.limparCampos()
  }

  limparCampos() {
    this.numeroNF = ''
    this.codigo = ''
    this.produto = ''
    this.text = ''
    this.obsProduto = ''
    this.form = {
      numeroNF: '', serie: '', dataEmissao: '',
      codigoProduto: '', nomeProduto: '', quantidade: '',
      valorUnitario: '', valorTotal: '', valorVenda: '', margem: '',
      grupo: '', codigoBarras: '', fornecedor: '', cnpjCpf: '',
      inscricaoEstadual: '', uf: '', origemTributaria: '',
      icms: '', ipi: '', pis: '', cofins: ''
    }
  }

  refreshTable() {
    this.limparCampos()
    this.rowsFiltradas = this.rowsNfEntrada
  }

  salvar() {
    this.$q.notify({ type: 'positive', message: 'Entrada salva com sucesso!' })
    this.confirmarCancelamento()
  }

  lerXML(file: File) {
    if (!file) return
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
      if (dhEmi) this.form.dataEmissao = dhEmi.substring(0, 10)

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

      this.$q.notify({ type: 'positive', message: 'XML carregado com sucesso!' })
    }
    reader.readAsText(file)
  }
}
</script>

<style scoped>
.b-r-10 { border-radius: 10px; }
.b-r-8 { border-radius: 8px; }
.border { border: 1px solid #ccc; }
.btn-outline-primary {
  border: 1.5px solid #ccc;
  background-color: #f0e9f5 !important;
}
</style>
