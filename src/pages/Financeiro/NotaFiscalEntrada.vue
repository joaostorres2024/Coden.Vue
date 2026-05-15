<template>
  <div class="q-pa-md">

    <!-- Cabeçalho -->
    <div class="text-bold text-black row items-center" style="font-size: 32px">
      <q-icon name="trending_up" class="q-mr-md" size="32px" />NF Entrada
    </div>
    <p class="text-grey-7 text-body2 q-mb-md">
      Registre e consulte as notas fiscais de entrada. Adicione produtos manualmente ou importe via XML para atualizar o estoque automaticamente.
    </p>
    <q-separator class="q-mb-lg" />

    <!-- Filtros -->
    <div v-if="!formNotaFiscalEntrada" class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4">
        <q-input v-model="filtro.numeroNF" label="Número NF" outlined dense />
      </div>
      <div class="col-12 col-md-4">
        <q-input v-model="filtro.fornecedor" label="Fornecedor" outlined dense />
      </div>
      <div class="col-12 col-md-4">
        <q-input v-model="filtro.produto" label="Nome do Produto" outlined dense />
      </div>
    </div>

    <!-- Botões listagem -->
    <div v-if="!formNotaFiscalEntrada" class="row justify-start q-gutter-sm q-mb-md">
      <q-btn label="Adicionar" icon="add" color="positive" unelevated @click="mostrarFormulario()" />
      <q-btn label="Limpar" icon="delete_sweep" flat class="text-grey-7" @click="limparFiltros()" />
    </div>

    <!-- Formulário -->
    <div v-if="formNotaFiscalEntrada" class="q-mt-lg">
      <q-form @submit.prevent="salvar()">

        <!-- Dados da Nota -->
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h6">Dados da Nota</div>
          <q-file
            outlined dense label="Carregar XML"
            v-model="arquivoXML"
            accept=".xml"
            @input="lerXML"
            clearable
            style="width: 200px"
          >
            <template v-slot:prepend><q-icon name="attach_file" /></template>
          </q-file>
        </div>
        <div class="row q-col-gutter-md q-mb-lg">
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
        <div class="text-h6 q-mb-md">Origem</div>
        <div class="row q-col-gutter-md q-mb-lg">
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
            <q-select v-model="form.uf" label="UF" outlined dense :options="opcoesUF" />
          </div>
        </div>

        <!-- Produtos -->
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h6">Produtos</div>
          <q-btn label="Adicionar Produto" icon="add" color="primary" unelevated @click="adicionarItemForm()" />
        </div>

        <div v-for="(item, index) in itens" :key="index" class="q-mb-md">
          <q-card flat bordered class="q-pa-md b-r-10">
            <div class="row items-center justify-between q-mb-sm">
              <span class="text-weight-bold text-grey-7">Produto {{ index + 1 }}</span>
              <q-btn
                v-if="itens.length > 1"
                icon="delete" flat round size="sm" color="negative"
                @click="removerItemForm(index)"
              />
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <q-input v-model="item.codigoProduto" label="Código do Produto" outlined dense />
              </div>
              <div class="col-12 col-sm-8">
                <q-input v-model="item.nomeProduto" label="Nome do Produto" outlined dense />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model.number="item.quantidade" label="Quantidade" type="number" outlined dense @change="calcularTotais(item)" />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model.number="item.valorUnitario" label="Valor Unitário" type="number" outlined dense @change="calcularTotais(item)" />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="item.valorTotal" label="Valor Total" outlined dense readonly />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model.number="item.valorVenda" label="Preço de Venda" type="number" outlined dense @change="calcularMargem(item)" />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="item.margem" label="Margem (%)" outlined dense readonly />
              </div>
              <div class="col-12 col-sm-4">
                <q-select
                  v-model="item.grupo_id"
                  :options="grupos"
                  option-label="nome"
                  option-value="id"
                  emit-value map-options
                  label="Grupo"
                  outlined dense clearable
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="item.codigoBarras" label="Código de Barras" outlined dense />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="item.fornecedor" label="Fornecedor" outlined dense />
              </div>
              <div class="col-12">
                <q-input v-model="item.observacoes" label="Observações do Produto" type="textarea" outlined dense input-style="resize: none;" rows="2" />
              </div>
            </div>
          </q-card>
        </div>

        <!-- Total da NF -->
        <div class="row justify-end q-mb-lg">
          <div class="column q-gutter-xs" style="min-width: 220px">
            <div class="row q-mt-md justify-between text-caption text-grey-6">
              <span>Total de Produtos</span>
              <span>{{ itens.length }}</span>
            </div>
            <q-separator />
            <div class="row justify-between text-weight-bold text-body1">
              <span>Valor Total NF</span>
              <span class="text-positive">{{ formatarReais(valorTotalNF) }}</span>
            </div>
          </div>
        </div>

        <!-- Tributação -->
        <div class="text-h6 q-mb-md">Tributação</div>
        <div class="row q-col-gutter-md q-mb-lg">
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
        <div class="text-h6 q-mb-md">Observações Gerais</div>
        <div class="row q-mb-lg">
          <div class="col-12">
            <q-input v-model="form.observacoes" type="textarea" outlined dense input-style="resize: none;" rows="3" />
          </div>
        </div>

        <!-- Botões -->
        <div class="row justify-end q-gutter-sm">
          <q-btn label="Salvar Entrada" icon="save" color="positive" unelevated type="submit" :loading="salvando" />
          <q-btn label="Cancelar" icon="close" color="negative" flat @click="abrirDialogCancelar()" />
        </div>

      </q-form>
    </div>

    <!-- Tabela -->
    <div v-if="!formNotaFiscalEntrada" class="q-mt-xl">
      <q-table
        :data="rowsFiltradas"
        :columns="colunasNotaFiscalEntrada"
        row-key="id"
        flat bordered
        no-data-label="Nenhum registro encontrado"
        class="text-weight-medium"
        :rows-per-page-options="[10, 20, 50]"
        :loading="carregando"
      >
        <template v-slot:body-cell-valor_total="props">
          <q-td align="center">{{ formatarReais(props.row.valor_total) }}</q-td>
        </template>
        <template v-slot:body-cell-data_emissao="props">
          <q-td align="center">{{ formatarData(props.row.data_emissao) }}</q-td>
        </template>
        <template v-slot:body-cell-data_entrada="props">
          <q-td align="center">{{ formatarData(props.row.data_entrada) }}</q-td>
        </template>
        <template v-slot:body-cell-acoes="props">
          <q-td align="center">
            <q-btn icon="description" size="sm" color="green" flat round @click="verDetalhes(props.row)">
              <q-tooltip>Ver Detalhes</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

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
          <q-btn label="Voltar" unelevated style="border: 1px solid #ccc; border-radius: 8px; min-width: 100px" color="white" text-color="dark" v-close-popup />
          <q-btn label="Sim, Cancelar" unelevated color="negative" style="border-radius: 8px; min-width: 130px" @click="confirmarCancelamento()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Detalhes -->
    <q-dialog v-model="dialogDetalhes" persistent>
      <q-card style="min-width: 650px; max-width: 700px; border-radius: 12px">
        <div class="q-pa-lg row items-center justify-between" style="background: #f8f9fa">
          <div>
            <div class="text-h6 text-bold">NF {{ nfSelecionada?.numero_nf }}</div>
            <div class="text-caption text-grey-6">Entrada em {{ formatarData(nfSelecionada?.data_entrada) }}</div>
          </div>
          <div class="text-right">
            <div class="text-caption text-grey-6">Fornecedor</div>
            <div class="text-weight-bold">{{ nfSelecionada?.fornecedor || '-' }}</div>
          </div>
        </div>
        <q-separator />
        <q-card-section class="q-pa-lg">
          <div class="text-caption text-grey-5 text-uppercase q-mb-sm">Itens</div>
          <q-table
            :data="nfSelecionada?.itens || []"
            :columns="colunasItensDetalhe"
            flat bordered hide-bottom dense
          >
            <template v-slot:body-cell-valor_unitario="props">
              <q-td align="center">{{ formatarReais(props.row.valor_unitario) }}</q-td>
            </template>
            <template v-slot:body-cell-valor_total="props">
              <q-td align="center">{{ formatarReais(props.row.valor_total) }}</q-td>
            </template>
          </q-table>
          <div class="row justify-end q-mt-md">
            <div class="column q-gutter-xs" style="min-width: 220px">
              <q-separator />
              <div class="row justify-between text-weight-bold text-body1">
                <span>Total</span>
                <span class="text-positive">{{ formatarReais(nfSelecionada?.valor_total) }}</span>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn label="Fechar" flat v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import listNotaFiscalEntrada from '../../config/listNotaFiscalEntrada.json'
import productService from '../../services/productService'
import nfEntradaService from '../../services/nfEntradaService'
import api from '../../services/api'

interface ItemForm {
  codigoProduto: string
  nomeProduto: string
  quantidade: number
  valorUnitario: number
  valorTotal: string
  valorVenda: number
  margem: string
  grupo_id: number | null
  codigoBarras: string
  observacoes: string
}

@Component
export default class ModuleComponent extends Vue {
  colunasNotaFiscalEntrada = listNotaFiscalEntrada.columns

  colunasItensDetalhe = [
    { name: 'codigo_produto', label: 'Código', field: 'codigo_produto', align: 'left' },
    { name: 'nome_produto', label: 'Produto', field: 'nome_produto', align: 'left' },
    { name: 'quantidade', label: 'Qtd.', field: 'quantidade', align: 'center' },
    { name: 'valor_unitario', label: 'Vlr. Unit.', field: 'valor_unitario', align: 'center' },
    { name: 'valor_total', label: 'Total', field: 'valor_total', align: 'center' }
  ]

  filtro = { numeroNF: '', fornecedor: '', produto: '' }

  form = {
    numeroNF: '', serie: '', dataEmissao: '',
    fornecedor: '', cnpjCpf: '', inscricaoEstadual: '', uf: '',
    origemTributaria: '', icms: '', ipi: '', pis: '', cofins: '',
    observacoes: ''
  }

  itens: ItemForm[] = [this.novoItem()]

  arquivoXML: any = null
  dataHoje = new Date().toISOString().substr(0, 10)
  grupos: any[] = []
  rows: any[] = []
  carregando = false
  salvando = false
  formNotaFiscalEntrada = false
  dialogCancelar = false
  dialogDetalhes = false
  nfSelecionada: any = null

  opcoesUF = [
    'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
    'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
    'RS','RO','RR','SC','SP','SE','TO'
  ]

  async created() {
    await this.carregarNfs()
    await this.carregarGrupos()
  }

  get rowsFiltradas() {
    return this.rows.filter((r: any) => {
      const nfOk = !this.filtro.numeroNF || r.numero_nf?.includes(this.filtro.numeroNF)
      const fornOk = !this.filtro.fornecedor || r.fornecedor?.toLowerCase().includes(this.filtro.fornecedor.toLowerCase())
      return nfOk && fornOk
    })
  }

  get valorTotalNF() {
    return this.itens.reduce((acc, i) => acc + (i.quantidade * i.valorUnitario || 0), 0)
  }

  novoItem(): ItemForm {
    return {
      codigoProduto: '', nomeProduto: '', quantidade: 1,
      valorUnitario: 0, valorTotal: '', valorVenda: 0, margem: '',
      grupo_id: null, codigoBarras: '', observacoes: ''
    }
  }

  adicionarItemForm() {
    this.itens.push(this.novoItem())
  }

  removerItemForm(index: number) {
    this.itens.splice(index, 1)
  }

  calcularTotais(item: ItemForm) {
    const total = (item.quantidade || 0) * (item.valorUnitario || 0)
    item.valorTotal = this.formatarReais(total)
    this.calcularMargem(item)
  }

  calcularMargem(item: ItemForm) {
    if (item.valorUnitario > 0 && item.valorVenda > 0) {
      const margem = ((item.valorVenda - item.valorUnitario) / item.valorUnitario) * 100
      item.margem = margem.toFixed(2) + '%'
    } else {
      item.margem = ''
    }
  }

  async carregarGrupos() {
    try {
      const grupos = await productService.listarGrupos()
      this.grupos = [{ id: null, nome: 'Nenhum' }, ...grupos]
    } catch { /* ignora */ }
  }

async carregarNfs() {
  try {
    this.carregando = true
    this.rows = await nfEntradaService.listar()
  } catch {
    this.$q.notify({ type: 'negative', message: 'Erro ao carregar NFs!' })
  } finally {
    this.carregando = false
  }
}

async salvar() {
  if (this.itens.some(i => !i.nomeProduto || !i.quantidade || !i.valorUnitario)) {
    this.$q.notify({ type: 'warning', message: 'Preencha todos os campos obrigatórios dos produtos!' })
    return
  }
  try {
    this.salvando = true
    await nfEntradaService.criar({
      numero_nf: this.form.numeroNF,
      serie: this.form.serie,
      data_emissao: this.form.dataEmissao || undefined,
      fornecedor: this.form.fornecedor,
      cnpj_cpf: this.form.cnpjCpf,
      inscricao_estadual: this.form.inscricaoEstadual,
      uf: this.form.uf,
      valor_total: this.valorTotalNF,
      observacoes: this.form.observacoes,
      origem_tributaria: this.form.origemTributaria,
      icms: Number(this.form.icms) || 0,
      ipi: Number(this.form.ipi) || 0,
      pis: Number(this.form.pis) || 0,
      cofins: Number(this.form.cofins) || 0,
      itens: this.itens.map(i => ({
        codigo_produto: i.codigoProduto,
        nome_produto: i.nomeProduto,
        quantidade: i.quantidade,
        valor_unitario: i.valorUnitario,
        valor_total: i.quantidade * i.valorUnitario,
        preco_venda: i.valorVenda,
        margem: parseFloat(i.margem) || 0,
        grupo_id: i.grupo_id,
        codigo_barras: i.codigoBarras
      }))
    })
    this.$q.notify({ type: 'positive', message: 'NF de entrada salva com sucesso!' })
    await this.carregarNfs()
    this.confirmarCancelamento()
  } catch {
    this.$q.notify({ type: 'negative', message: 'Erro ao salvar NF!' })
  } finally {
    this.salvando = false
  }
}

async verDetalhes(row: any) {
  try {
    this.nfSelecionada = await nfEntradaService.buscar(row.id)
    this.dialogDetalhes = true
  } catch {
    this.$q.notify({ type: 'negative', message: 'Erro ao carregar detalhes!' })
  }
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

  limparFiltros() {
    this.filtro = { numeroNF: '', fornecedor: '', produto: '' }
  }

  limparCampos() {
    this.form = {
      numeroNF: '', serie: '', dataEmissao: '',
      fornecedor: '', cnpjCpf: '', inscricaoEstadual: '', uf: '',
      origemTributaria: '', icms: '', ipi: '', pis: '', cofins: '',
      observacoes: ''
    }
    this.itens = [this.novoItem()]
    this.arquivoXML = null
  }

  formatarReais(valor: any): string {
    const numero = typeof valor === 'string' ? parseFloat(valor) : Number(valor)
    if (isNaN(numero)) return 'R$ 0,00'
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  formatarData(data: any): string {
    if (!data) return '-'
    return new Date(data).toLocaleDateString('pt-BR')
  }

  lerXML(file: File) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e: any) => {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(e.target.result, 'text/xml')

      const getVal = (tag: string, parent: Element | Document = xmlDoc) => {
        const el = parent.getElementsByTagName(tag)[0]
        return el ? el.textContent || '' : ''
      }

      this.form.numeroNF = getVal('nNF')
      this.form.serie = getVal('serie')
      const dhEmi = getVal('dhEmi') || getVal('dEmi')
      if (dhEmi) this.form.dataEmissao = dhEmi.substring(0, 10)

      const emit = xmlDoc.getElementsByTagName('emit')[0]
      if (emit) {
        this.form.fornecedor = getVal('xNome', emit)
        this.form.cnpjCpf = getVal('CNPJ', emit) || getVal('CPF', emit)
        this.form.inscricaoEstadual = getVal('IE', emit)
        this.form.uf = getVal('UF', emit)
      }

      // Carrega múltiplos itens do XML
      const dets = xmlDoc.getElementsByTagName('det')
      if (dets.length > 0) {
        this.itens = []
        Array.from(dets).forEach(det => {
          const prod = det.getElementsByTagName('prod')[0]
          const imposto = det.getElementsByTagName('imposto')[0]
          const item = this.novoItem()

          if (prod) {
            item.codigoProduto = getVal('cProd', prod)
            item.nomeProduto = getVal('xProd', prod)
            item.quantidade = parseFloat(getVal('qCom', prod)) || 1
            item.valorUnitario = parseFloat(getVal('vUnCom', prod)) || 0
            item.codigoBarras = getVal('cEAN', prod)
            this.calcularTotais(item)
          }

          if (imposto && !this.form.icms) {
            this.form.icms = getVal('vICMS', imposto)
            this.form.ipi = getVal('vIPI', imposto)
            this.form.pis = getVal('vPIS', imposto)
            this.form.cofins = getVal('vCOFINS', imposto)
            this.form.origemTributaria = getVal('orig', imposto)
          }

          this.itens.push(item)
        })
      }

      this.$q.notify({ type: 'positive', message: `XML carregado! ${dets.length} produto(s) encontrado(s).` })
    }
    reader.readAsText(file)
  }
}
</script>

<style scoped>
.b-r-10 { border-radius: 10px; }
.border { border: 1px solid #ccc; }
</style>
