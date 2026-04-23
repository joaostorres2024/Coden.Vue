<template>
  <!-- Container principal para centralizar o card na tela -->
  <div class="row justify-center items-center">
    <q-card class="col-11 col-md-10 col-lg-9 shadow-2" style="width: 1500px">
      <!-- Cabeçalho do Card -->
      <q-card-section class="bg-white text-primary q-pb-none">
        <div class="text-h5 text-bold">NF Entrada</div>
        <q-toolbar class="q-pa-none">
          <q-breadcrumbs
            active-color="primary"
            style="font-size: 14px"
            class="q-mb-md"
          >
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el label="Home" icon="home" to="/" />
            <q-breadcrumbs-el label="Financeiro" icon="paid" />
            <q-breadcrumbs-el label="NF Entrada" icon="trending_up" />
          </q-breadcrumbs>
        </q-toolbar>
      </q-card-section>

      <q-separator />

      <!-- Corpo do Card -->
      <q-card-section class="q-pa-lg">
        <!-- Filtros e Ações (Visíveis apenas quando não está em modo de formulário) -->
        <div class="row items-center justify-between no-wrap">
          <!-- Grupo de Inputs (Alinhado à Esquerda) -->
          <div class="row q-gutter-md col">
            <q-input
              v-model="numeroNF"
              style="width: 200px"
              label="Número NF"
              outlined
              dense
            />
            <q-input
              v-model="codigo"
              style="width: 250px"
              label="Código do Produto"
              outlined
              dense
            />
            <q-input
              v-model="produto"
              style="width: 350px"
              label="Nome do Produto"
              outlined
              dense
            />
          </div>

          <!-- Grupo de Botões (Alinhado à Direita) -->
          <div v-if="!formNotaFiscalEntrada" class="row q-gutter-sm">
            <q-btn
              icon="add"
              unelevated
              class="bg-positive text-white"
              @click="mostrarFormulario()"
            />
            <q-btn
              icon="search"
              color="primary"
              unelevated
              @click="pesquisar()"
            />
            <q-btn
              icon="delete"
              unelevated
              class="bg-warning text-white"
              @click="refreshTable()"
            />
          </div>
        </div>

        <!-- Formulário de Cadastro -->
        <div v-if="formNotaFiscalEntrada" class="q-mt-md">
          <q-form @submit.prevent="salvar()">
            <!-- Seção: Dados da Nota -->
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

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-3">
                <q-input
                  v-model="form.numeroNF"
                  label="Número NF"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-3">
                <q-input v-model="form.serie" label="Série" outlined dense />
              </div>
              <div class="col-12 col-sm-3">
                <q-input
                  v-model="form.dataEmissao"
                  label="Data Emissão"
                  type="date"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-3">
                <q-input
                  v-model="dataHoje"
                  label="Data Entrada"
                  type="date"
                  outlined
                  dense
                  readonly
                />
              </div>
            </div>

            <!-- Seção: Produto -->
            <div class="text-h6 q-mt-lg q-mb-sm">Produto</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="form.codigoProduto"
                  label="Código do Produto"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="form.nomeProduto"
                  label="Nome do Produto"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="form.quantidade"
                  label="Quantidade"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-3">
                <q-input
                  v-model="form.valorUnitario"
                  label="Valor Unitário"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-3">
                <q-input
                  v-model="form.valorTotal"
                  label="Valor Total"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-3">
                <q-input
                  v-model="form.valorVenda"
                  label="Preço de Venda"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-3">
                <q-input
                  v-model="form.margem"
                  label="Margem"
                  outlined
                  dense
                  readonly
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-select
                  v-model="form.grupo"
                  label="Grupo"
                  outlined
                  dense
                  :options="['Grupo 1', 'Grupo 2']"
                />
              </div>
              <div class="col-12 col-sm-2">
                <q-btn
                  label="Criar Grupo"
                  color="primary"
                  unelevated
                  class="full-width"
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="form.codigoBarras"
                  label="Código de Barras"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-2">
                <q-btn
                  label="Gerar"
                  color="primary"
                  unelevated
                  class="full-width"
                />
              </div>
              <div class="col-12">
                <q-input label="Observações" v-model="obsProduto" type="textarea" outlined dense input-style="resize: none;" rows="3" />
              </div>
            </div>

            <!-- Seção: Origem -->
            <div class="text-h6 q-mt-lg q-mb-sm">Origem</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="form.fornecedor"
                  label="Fornecedor"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-3">
                <q-input
                  v-model="form.cnpjCpf"
                  label="CNPJ/CPF"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-3">
                <q-input
                  v-model="form.inscricaoEstadual"
                  label="Inscrição Estadual"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-2">
                <q-select
                  v-model="form.uf"
                  label="UF"
                  outlined
                  dense
                  :options="['DF', 'SP', 'RJ']"
                />
              </div>
            </div>

            <!-- Seção: Tributação -->
            <div class="text-h6 q-mt-lg q-mb-sm">Tributação</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="form.origemTributaria"
                  label="Origem"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-2">
                <q-input v-model="form.icms" label="ICMS" outlined dense />
              </div>
              <div class="col-12 col-sm-2">
                <q-input v-model="form.ipi" label="IPI" outlined dense />
              </div>
              <div class="col-12 col-sm-2">
                <q-input v-model="form.pis" label="PIS" outlined dense />
              </div>
              <div class="col-12 col-sm-2">
                <q-input v-model="form.cofins" label="COFINS" outlined dense />
              </div>
            </div>

            <div class="text-h6 q-mt-lg q-mb-sm">Observações</div>
            <div class="row">
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

            <!-- Botões do Formulário -->
            <div class="row q-mt-xl q-gutter-md justify-end">
              <q-btn
                label="Salvar Entrada"
                color="positive"
                unelevated
                type="submit"
              />
              <q-btn
                label="Cancelar"
                color="negative"
                flat
                @click="abrirDialogCancelar()"
              />
            </div>
          </q-form>
        </div>

        <!-- Tabela de Resultados (Visível apenas quando não está em modo de formulário) -->
        <div v-if="!formNotaFiscalEntrada" class="q-mt-xl">
          <q-table
            :data="rowsFiltradas"
            :columns="colunasNotaFiscalEntrada"
            row-key="codigo"
            flat
            bordered
            no-data-label="Nenhum registro encontrado"
            class="text-weight-medium"
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
                />
                <q-btn icon="description" size="sm" color="green" flat round />
              </q-td>
            </template>

            <!-- Colunas de Valor -->
            <template v-slot:body-cell-valorUnitario="props">
              <q-td :props="props" align="center">
                {{ formatarReais(props.row.valorUnitario) }}
              </q-td>
            </template>
            <template v-slot:body-cell-valorTotal="props">
              <q-td :props="props" align="center">
                {{ formatarReais(props.row.valorTotal) }}
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
      </q-card-section>
    </q-card>

    <!-- Dialogs -->
    <q-dialog v-model="dialogCancelar" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"
            >Deseja realmente cancelar? As alterações não salvas serão
            perdidas.</span
          >
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Não" color="primary" v-close-popup />
          <q-btn
            flat
            label="Sim, Cancelar"
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
import listNotaFiscalEntrada from '../../config/listNotaFiscalEntrada.json'

@Component
export default class ModuleComponent extends Vue {
  colunasNotaFiscalEntrada = listNotaFiscalEntrada.columns
  // ===== data =====
  numeroNF = ''
  codigo = ''
  produto = ''
  arquivoXML = null
  dataHoje = new Date().toISOString().substr(0, 10)

  // Controle de UI
  formNotaFiscalEntrada = false
  dialogCancelar = false

  // Dados do Formulário
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


  // ===== Métodos =====
  formatarReais(valor: string | number): string {
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
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
  }

  pesquisar() {
    this.rowsFiltradas = this.rowsNfEntrada.filter((row: any) => {
      const nfMatch = !this.numeroNF || row.numeroNF.includes(this.numeroNF)
      const codigoMatch = !this.codigo || row.codigo.toLowerCase().includes(this.codigo.toLowerCase())
      const produtoMatch = !this.produto || row.produto.toLowerCase().includes(this.produto.toLowerCase())
      return nfMatch && codigoMatch && produtoMatch
    })
  }

  editar(row: any) {
    console.log('Editar:', row)
    this.formNotaFiscalEntrada = true
  }

  excluir(row: any) {
    console.log('Excluir:', row)
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

      // Helper para buscar valor por tag
      const getVal = (tagName: string, parent: Element | Document = xmlDoc) => {
        const el = parent.getElementsByTagName(tagName)[0]
        return el ? el.textContent : ''
      }

      // 1. Dados da Nota (ide)
      this.form.numeroNF = getVal('nNF') || ''
      this.form.serie = getVal('serie') || ''
      const dhEmi = getVal('dhEmi') || getVal('dEmi') || ''
      if (dhEmi) {
        this.form.dataEmissao = dhEmi.substring(0, 10)
      }

      // 2. Dados do Fornecedor (emit)
      const emit = xmlDoc.getElementsByTagName('emit')[0]
      if (emit) {
        this.form.fornecedor = getVal('xNome', emit) || ''
        this.form.cnpjCpf = getVal('CNPJ', emit) || getVal('CPF', emit) || ''
        this.form.inscricaoEstadual = getVal('IE', emit) || ''
        this.form.uf = getVal('UF', emit) as any
      }

      // 3. Dados do Produto (det/prod) - Pegando o primeiro item como exemplo
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

        // 4. Tributação (imposto)
        const imposto = det.getElementsByTagName('imposto')[0]
        if (imposto) {
          // ICMS (simplificado, busca em qualquer subtag de ICMS)
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

<style scoped></style>
