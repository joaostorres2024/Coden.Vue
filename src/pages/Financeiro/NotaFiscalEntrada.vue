<template>
  <div class="q-pa-md">

    <!-- Cabeçalho -->
    <div class="text-bold text-black row items-center nfe-cabecalho" style="font-size: 28px">
      <q-icon name="trending_up" class="q-mr-md text-primary" size="28px" />NF Entrada
    </div>
    <p class="text-grey-7 text-body2 q-mb-md nfe-subtitulo">
      Registre e consulte as notas fiscais de entrada. Adicione produtos manualmente ou importe via XML para atualizar o estoque automaticamente.
    </p>
    <q-separator class="q-mb-lg" />

    <!-- Filtros -->
    <div v-if="!formNotaFiscalEntrada" class="row q-col-gutter-md q-mb-md nfe-filtros">
      <div class="col-12 col-md-4">
        <q-input v-model="filtro.numeroNF" label="Número NF" outlined dense input-id="nfe-input-filtro-numero" class="nfe-input-filtro-numero" />
      </div>
      <div class="col-12 col-md-4">
        <q-input v-model="filtro.fornecedor" label="Fornecedor" outlined dense input-id="nfe-input-filtro-fornecedor" class="nfe-input-filtro-fornecedor" />
      </div>
      <div class="col-12 col-md-4">
        <q-input v-model="filtro.produto" label="Nome do Produto" outlined dense input-id="nfe-input-filtro-produto" class="nfe-input-filtro-produto" />
      </div>
    </div>

    <!-- Botões listagem -->
    <div v-if="!formNotaFiscalEntrada" class="row justify-start q-gutter-sm q-mb-md nfe-acoes">
      <q-btn id="nfe-btn-adicionar" class="nfe-btn-adicionar" label="Adicionar" icon="add" color="positive" unelevated @click="mostrarFormulario()" />
      <q-btn id="nfe-btn-limpar" class="nfe-btn-limpar text-grey-7" label="Limpar" icon="delete_sweep" flat @click="limparFiltros()" />
    </div>

    <!-- Formulário -->
    <div v-if="formNotaFiscalEntrada" class="q-mt-lg nfe-form-cadastro">
      <q-form @submit.prevent="salvar()">

        <!-- Dados da Nota -->
        <q-card flat bordered class="b-r-10 q-mb-md">
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div class="row items-center q-gutter-sm">
                <q-icon name="receipt_long" color="primary" size="20px" />
                <span class="text-subtitle1 text-bold">Dados da Nota</span>
              </div>
              <q-file
                outlined dense label="Carregar XML"
                v-model="arquivoXML"
                accept=".xml"
                @input="lerXML"
                clearable
                style="width: 180px"
                id="nfe-file-xml"
                class="nfe-file-xml"
              >
                <template v-slot:prepend><q-icon name="attach_file" /></template>
              </q-file>
            </div>
            <div class="row q-col-gutter-md nfe-dados-nota">
              <div class="col-12 col-sm-3">
                <q-input v-model="form.numeroNF" label="Número NF" outlined dense input-id="nfe-input-numero" class="nfe-input-numero" />
              </div>
              <div class="col-12 col-sm-3">
                <q-input v-model="form.serie" label="Série" outlined dense input-id="nfe-input-serie" class="nfe-input-serie" />
              </div>
              <div class="col-12 col-sm-3">
                <q-input v-model="form.dataEmissao" label="Data Emissão" type="date" outlined dense input-id="nfe-input-data-emissao" class="nfe-input-data-emissao" />
              </div>
              <div class="col-12 col-sm-3">
                <q-input v-model="dataHoje" label="Data Entrada" type="date" outlined dense readonly input-id="nfe-input-data-entrada" class="nfe-input-data-entrada" />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Origem -->
        <q-card flat bordered class="b-r-10 q-mb-md">
          <q-card-section>
            <div class="row items-center q-gutter-sm q-mb-md">
              <q-icon name="store" color="primary" size="20px" />
              <span class="text-subtitle1 text-bold">Origem</span>
            </div>
            <div class="row q-col-gutter-md nfe-dados-origem">
              <div class="col-12 col-sm-4">
                <q-input v-model="form.fornecedor" label="Fornecedor" outlined dense input-id="nfe-input-fornecedor" class="nfe-input-fornecedor" />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="form.cnpjCpf" label="CNPJ/CPF" outlined dense input-id="nfe-input-cnpj" class="nfe-input-cnpj" />
              </div>
              <div class="col-12 col-sm-2">
                <q-input v-model="form.inscricaoEstadual" label="Inscrição Estadual" outlined dense input-id="nfe-input-ie" class="nfe-input-ie" />
              </div>
              <div class="col-12 col-sm-2">
                <q-select v-model="form.uf" label="UF" outlined dense :options="opcoesUF" id="nfe-select-uf" class="nfe-select-uf" />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Produtos -->
        <q-card flat bordered class="b-r-10 q-mb-md">
          <q-card-section>
            <div class="row items-center justify-between q-mb-md nfe-produtos-cabecalho">
              <div class="row items-center q-gutter-sm">
                <q-icon name="inventory_2" color="primary" size="20px" />
                <span class="text-subtitle1 text-bold">Produtos</span>
                <q-badge color="primary" rounded :label="itens.length" />
              </div>
              <q-btn
                id="nfe-btn-adicionar-produto"
                class="nfe-btn-adicionar-produto"
                label="Adicionar Produto"
                icon="add"
                color="primary"
                unelevated
                size="md"
                @click="adicionarItemForm()"
              />
            </div>

            <div v-for="(item, index) in itens" :key="index" class="q-mb-sm nfe-item-produto">
              <q-expansion-item
                :label="`Produto ${index + 1}${item.nomeProduto ? ' — ' + item.nomeProduto : ''}`"
                :default-opened="index === 0"
                dense
                expand-separator
                header-class="bg-grey-1 b-r-8"
                class="border b-r-8"
              >
                <template v-slot:header>
                  <q-item-section>
                    <div class="row items-center q-gutter-xs">
                      <q-icon name="inventory_2" size="16px" color="grey-6" />
                      <span class="text-weight-medium text-grey-8" style="font-size: 13px">
                        Produto {{ index + 1 }}
                        <span v-if="item.nomeProduto" class="text-grey-6"> — {{ item.nomeProduto }}</span>
                      </span>
                    </div>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn
                      v-if="itens.length > 1"
                      icon="delete"
                      flat round size="sm"
                      color="negative"
                      class="nfe-btn-remover-produto"
                      @click.stop="removerItemForm(index)"
                    />
                  </q-item-section>
                </template>

                <div class="q-pa-md">
                  <div class="row q-col-gutter-sm q-mb-sm">
                    <div class="col-12 col-sm-3">
                      <q-input v-model="item.codigoProduto" label="Código" outlined dense :input-id="`nfe-input-item-codigo-${index}`" class="nfe-input-item-codigo" />
                    </div>
                    <div class="col-12 col-sm-9">
                      <q-input v-model="item.nomeProduto" label="Nome do Produto" outlined dense :input-id="`nfe-input-item-nome-${index}`" class="nfe-input-item-nome" />
                    </div>
                  </div>

                  <div class="row q-col-gutter-sm q-mb-sm">
                    <div class="col-6 col-sm-2">
                      <q-input v-model.number="item.quantidade" label="Qtd." type="number" outlined dense :input-id="`nfe-input-item-quantidade-${index}`" class="nfe-input-item-quantidade" @change="calcularTotais(item)" />
                    </div>
                    <div class="col-6 col-sm-3">
                      <q-input v-model.number="item.valorUnitario" label="Vlr. Unitário" type="number" outlined dense :input-id="`nfe-input-item-valor-unitario-${index}`" class="nfe-input-item-valor-unitario" @change="calcularTotais(item)" />
                    </div>
                    <div class="col-6 col-sm-3">
                      <q-input v-model="item.valorTotal" label="Vlr. Total" outlined dense readonly :input-id="`nfe-input-item-valor-total-${index}`" class="nfe-input-item-valor-total" />
                    </div>
                    <div class="col-6 col-sm-2">
                      <q-input v-model.number="item.valorVenda" label="Preço Venda" type="number" outlined dense :input-id="`nfe-input-item-valor-venda-${index}`" class="nfe-input-item-valor-venda" @change="calcularMargem(item)" />
                    </div>
                    <div class="col-6 col-sm-2">
                      <q-input v-model="item.margem" label="Margem" outlined dense readonly :input-id="`nfe-input-item-margem-${index}`" class="nfe-input-item-margem" />
                    </div>
                  </div>

                  <div class="row q-col-gutter-sm q-mb-sm">
                    <div class="col-12 col-sm-4">
                      <q-input v-model="item.codigoBarras" label="Código de Barras" outlined dense :input-id="`nfe-input-item-codigo-barras-${index}`" class="nfe-input-item-codigo-barras" />
                    </div>
                    <div class="col-12 col-sm-4">
                      <q-input v-model="item.fornecedor" label="Fornecedor" outlined dense :input-id="`nfe-input-item-fornecedor-${index}`" class="nfe-input-item-fornecedor" />
                    </div>
                    <div class="col-12 col-sm-4">
                      <q-select v-model="item.grupo_id" :options="grupos" option-label="nome" option-value="id" emit-value map-options label="Grupo" outlined dense clearable class="nfe-select-item-grupo" />
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-12">
                      <q-input v-model="item.observacoes" label="Observações do Produto" type="textarea" outlined dense input-style="resize: none;" rows="2" :input-id="`nfe-input-item-observacoes-${index}`" class="nfe-input-item-observacoes" />
                    </div>
                  </div>
                </div>
              </q-expansion-item>
            </div>
          </q-card-section>
        </q-card>

        <!-- Tributação -->
        <q-card flat bordered class="b-r-10 q-mb-md">
          <q-card-section>
            <div class="row items-center q-gutter-sm q-mb-md">
              <q-icon name="account_balance" color="primary" size="20px" />
              <span class="text-subtitle1 text-bold">Tributação</span>
            </div>
            <div class="row q-col-gutter-md nfe-dados-tributacao">
              <div class="col-6 col-sm-2">
                <q-input v-model="form.origemTributaria" label="Origem" outlined dense input-id="nfe-input-origem-tributaria" class="nfe-input-origem-tributaria" />
              </div>
              <div class="col-6 col-sm-2">
                <q-input v-model="form.icms" label="ICMS" outlined dense input-id="nfe-input-icms" class="nfe-input-icms" />
              </div>
              <div class="col-6 col-sm-2">
                <q-input v-model="form.ipi" label="IPI" outlined dense input-id="nfe-input-ipi" class="nfe-input-ipi" />
              </div>
              <div class="col-6 col-sm-2">
                <q-input v-model="form.pis" label="PIS" outlined dense input-id="nfe-input-pis" class="nfe-input-pis" />
              </div>
              <div class="col-6 col-sm-2">
                <q-input v-model="form.cofins" label="COFINS" outlined dense input-id="nfe-input-cofins" class="nfe-input-cofins" />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Observações Gerais -->
        <q-card flat bordered class="b-r-10 q-mb-md">
          <q-card-section>
            <div class="row items-center q-gutter-sm q-mb-md">
              <q-icon name="notes" color="primary" size="20px" />
              <span class="text-subtitle1 text-bold">Observações Gerais</span>
            </div>
            <q-input v-model="form.observacoes" type="textarea" outlined dense input-style="resize: none;" rows="3" input-id="nfe-input-observacoes" class="nfe-input-observacoes nfe-observacoes" />
          </q-card-section>
        </q-card>

        <!-- Resumo + Botões -->
        <div class="row items-center justify-between q-mt-md nfe-form-acoes">
          <div class="row q-gutter-sm">
            <q-btn id="nfe-btn-salvar" class="nfe-btn-salvar" label="Salvar Entrada" icon="save" color="positive" unelevated type="submit" :loading="salvando" />
            <q-btn id="nfe-btn-cancelar" class="nfe-btn-cancelar" label="Cancelar" icon="close" color="negative" flat @click="abrirDialogCancelar()" />
          </div>
          <q-card flat bordered class="b-r-10 q-pa-md nfe-resumo">
            <div class="row q-gutter-xl items-center">
              <div class="text-center">
                <div class="text-caption text-grey-6">Produtos</div>
                <div class="text-h6 text-bold text-primary">{{ itens.length }}</div>
              </div>
              <q-separator vertical />
              <div class="text-center">
                <div class="text-caption text-grey-6">Valor Total NF</div>
                <div class="text-h6 text-bold text-positive nfe-valor-total">{{ formatarReais(valorTotalNF) }}</div>
              </div>
            </div>
          </q-card>
        </div>

      </q-form>
    </div>

    <!-- Tabela -->
    <div v-if="!formNotaFiscalEntrada" class="q-mt-xl nfe-tabela">
      <q-table
        :data="rowsFiltradas"
        :columns="colunasNotaFiscalEntrada"
        row-key="id"
        flat bordered
        no-data-label="Nenhum registro encontrado"
        class="text-weight-medium nfe-tabela-lista"
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
            <q-btn icon="description" size="sm" color="green" flat round class="nfe-btn-ver-detalhes" @click="verDetalhes(props.row)">
              <q-tooltip>Ver Detalhes</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Dialog Cancelar -->
    <q-dialog v-model="dialogCancelar" persistent class="nfe-dialog-cancelar">
      <q-card style="min-width: 380px; border-radius: 12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Cancelar operação</div>
        </q-card-section>
        <q-card-section class="text-grey-7" style="font-size: 14px">
          Deseja realmente cancelar? As alterações não salvas serão perdidas.
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn id="nfe-dialog-cancelar-voltar" class="nfe-dialog-cancelar-voltar" label="Voltar" unelevated style="border: 1px solid #ccc; border-radius: 8px; min-width: 100px" color="white" text-color="dark" v-close-popup />
          <q-btn id="nfe-dialog-cancelar-confirmar" class="nfe-dialog-cancelar-confirmar" label="Sim, Cancelar" unelevated color="negative" style="border-radius: 8px; min-width: 130px" @click="confirmarCancelamento()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Detalhes -->
    <q-dialog v-model="dialogDetalhes" persistent class="nfe-dialog-detalhes">
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
            class="nfe-tabela-detalhes"
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
                <span class="text-positive nfe-detalhes-total">{{ formatarReais(nfSelecionada?.valor_total) }}</span>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn id="nfe-dialog-detalhes-fechar" class="nfe-dialog-detalhes-fechar" label="Fechar" flat v-close-popup />
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
