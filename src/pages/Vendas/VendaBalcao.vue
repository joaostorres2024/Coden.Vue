<template>
  <!-- Container principal para centralizar o card na tela -->
  <div class="row justify-center items-center">
    <q-card
      class="col-11 col-md-10 col-lg-9 no-shadow border b-r-10"
      style="width: 1500px"
    >
      <!-- Cabeçalho do Card -->
      <q-card-section class="bg-white text-primary q-pb-none">
        <div class="text-h5 text-bold">Vendas Balcão</div>
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
            <q-breadcrumbs-el label="Vendas Balcão" icon="point_of_sale" />
          </q-breadcrumbs>
        </q-toolbar>
      </q-card-section>

      <q-separator />
      <q-card-section class="q-pa-lg">
        <div class="column q-col-gutter-md">
          <div class="row items-center q-col-gutter-md">
            <div class="col-9" v-if="!procurarProduto">
              <div class="row q-col-gutter-md items-center">
                <div class="col-4">
                  <q-input
                    v-model="codigo"
                    label="Código do Cliente"
                    outlined
                    dense
                  />
                </div>
                <div class="col-4">
                  <q-input
                    v-model="nome"
                    label="Nome Completo"
                    outlined
                    dense
                  />
                </div>
                <div class="col-4">
                  <q-input
                    v-model="documento"
                    label="CNPJ/CPF"
                    outlined
                    dense
                  />
                </div>
              </div>
            </div>

            <div class="col-9" v-if="procurarProduto && clienteSelecionado">
              <div class="row q-col-gutter-md items-center">
                <div class="col-4">
                  <q-input
                    :value="clienteSelecionado.codigo_cliente"
                    label="Código do Cliente"
                    outlined
                    dense
                    readonly
                  />
                </div>
                <div class="col-4">
                  <q-input
                    :value="clienteSelecionado.nome_cliente"
                    label="Nome Completo"
                    outlined
                    dense
                    readonly
                  />
                </div>
                <div class="col-4">
                  <q-input
                    :value="formatarDocumento(clienteSelecionado)"
                    label="CNPJ/CPF"
                    outlined
                    dense
                    readonly
                  />
                </div>
              </div>
            </div>

            <!-- Botões (col-3) -->
            <div v-if="!procurarProduto" class="col-3">
              <div class="row justify-end items-center q-gutter-sm">
                <q-btn
                  unelevated
                  class="btn-outline-primary"
                  @click="pesquisar()"
                >
                  <q-icon name="search" color="primary" />
                  <q-tooltip>Pesquisar</q-tooltip>
                </q-btn>

                <q-btn
                  unelevated
                  class="btn-outline-primary"
                  @click="refreshTable()"
                >
                  <q-icon name="delete" color="primary" />
                  <q-tooltip>Limpar</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabela de Clientes (Seleção para Venda) -->
        <div v-if="!procurarProduto" class="q-mt-xl">
          <q-table
            :data="rowsFiltradas"
            :columns="colunaCliente"
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
                  icon="point_of_sale"
                  size="sm"
                  color="warning"
                  flat
                  round
                  @click="realizarVenda(props.row)"
                />
              </q-td>
            </template>

            <!-- Coluna Status -->
            <template v-slot:body-cell-documento="props">
              <q-td align="center">
                {{ formatarDocumento(props.row) }}
              </q-td>
            </template>
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

        <!-- Fluxo de Venda: Procurar Produto -->
        <div v-if="procurarProduto" class="q-mt-md">
          <div class="text-h6 q-mb-sm">Produto</div>
          <div class="row items-center q-col-gutter-md">
            <div class="col-9">
              <div class="row q-col-gutter-md items-center">
                <div class="col-4">
                  <q-input
                    v-model="codigoProduto"
                    label="Código do Produto"
                    outlined
                    dense
                  />
                </div>
                <div class="col-8">
                  <q-input
                    v-model="nomeProduto"
                    label="Nome do Produto"
                    outlined
                    dense
                  />
                </div>
              </div>
            </div>
            <div class="col-3">
              <div class="row justify-end items-center q-gutter-sm">
                <q-btn
                  unelevated
                  class="btn-outline-primary"
                  @click="pesquisar()"
                >
                  <q-icon name="search" color="primary" />
                  <q-tooltip>Pesquisar</q-tooltip>
                </q-btn>

                <q-btn
                  unelevated
                  class="btn-outline-primary"
                  @click="abrirDialogCancelar()"
                >
                  <q-icon name="close" color="primary" />
                  <q-tooltip>Cancelar</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>

          <!-- Tabela de Busca de Produtos -->
          <div class="q-mt-lg">
            <q-table
              :data="rowsProdutoFiltradas"
              :columns="colunaProduto"
              row-key="codigo"
              flat
              bordered
              no-data-label="Nenhum registro encontrado"
            >
              <template v-slot:body-cell-acoes="props">
                <q-td align="center">
                  <q-btn
                    icon="o_add_box"
                    size="sm"
                    color="warning"
                    flat
                    round
                    @click="abrirDialogQuantidade(props.row)"
                  />
                  <q-btn
                    icon="percent"
                    size="sm"
                    color="blue"
                    flat
                    round
                    @click="abrirDialogDesconto(props.row)"
                  />
                  <q-btn
                    icon="add"
                    size="sm"
                    color="positive"
                    flat
                    round
                    @click="adicionarProduto(props.row)"
                  />
                </q-td>
              </template>
              <template v-slot:body-cell-valorUnitario="props">
                <q-td
                  align="center"
                  >{{ formatarReais(props.row.valorUnitario) }}</q-td
                >
              </template>
              <template v-slot:body-cell-total="props">
                <q-td align="center">{{ formatarReais(props.row.total) }}</q-td>
              </template>
            </q-table>
          </div>
        </div>

        <!-- SEÇÃO: PRODUTOS ADICIONADOS (A TABELA QUE FALTAVA) -->
        <div v-if="produtosAdicionados.length > 0" class="q-mt-xl">
          <div class="text-h6 q-mb-md">Produtos Adicionados</div>
          <q-table
            :data="produtosAdicionados"
            :columns="colunasProdutosAdicionados"
            row-key="codigo"
            flat
            bordered
            no-data-label="Nenhum produto adicionado"
          >
            <template v-slot:body-cell-acoes="props">
              <q-td align="center">
                <q-btn
                  icon="delete"
                  size="sm"
                  color="negative"
                  flat
                  round
                  @click="removerProduto(props.row)"
                />
              </q-td>
            </template>
            <template v-slot:body-cell-valorUnitario="props">
              <q-td
                align="center"
                >{{ formatarReais(props.row.valorUnitario) }}</q-td
              >
            </template>
            <template v-slot:body-cell-total="props">
              <q-td align="center">{{ formatarReais(props.row.total) }}</q-td>
            </template>
          </q-table>
        </div>

        <!-- Revisão e Finalização -->
        <div v-if="finalizacaoVenda" class="q-mt-xl">
          <div class="text-h6 q-mb-sm">Revisar Itens</div>
          <div class="row items-center justify-between q-mt-md">
            <div class="row q-gutter-md">
              <q-btn
                icon="o_credit_card"
                label="Realizar Pagamento"
                color="positive"
                unelevated
                @click="abrirDialogPagamento()"
              />
              <q-btn
                flat
                icon="close"
                label="Cancelar Venda"
                color="negative"
                unelevated
                @click="abrirDialogCancelar()"
              />
            </div>
            <div class="row q-gutter-sm">
              <q-input
                v-model="totalItens"
                label="Produtos"
                style="width: 100px"
                outlined
                readonly
                dense
              />
              <q-input
                v-model="valorBruto"
                label="Valor Bruto"
                style="width: 150px"
                outlined
                readonly
                dense
              />
              <q-input
                v-model="descontoReais"
                label="Desconto (R$)"
                style="width: 150px"
                outlined
                readonly
                dense
              />
              <q-input
                v-model="descontoPercent"
                label="Desconto (%)"
                style="width: 120px"
                outlined
                readonly
                dense
              />
              <q-input
                v-model="valorTotalVenda"
                label="Valor Total"
                style="width: 180px"
                outlined
                readonly
                dense
                bg-color="grey-2"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Dialogs -->
    <q-dialog v-model="dialogCancelar" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Deseja realmente cancelar a operação?</span>
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

    <!-- Dialog Quantidade -->
    <q-dialog v-model="dialogQuantidade" persistent>
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Quantidade</div>
          <div class="text-caption text-grey-6">
            {{ produtoSelecionado?.nome_produto }}
          </div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model.number="quantidadeInput"
            type="number"
            label="Quantidade"
            outlined
            dense
            min="1"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn
            unelevated
            color="primary"
            label="Confirmar"
            @click="confirmarQuantidade()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Desconto por Item -->
    <q-dialog v-model="dialogDescontoItem" persistent>
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Desconto no Item</div>
          <div class="text-caption text-grey-6">
            {{ produtoSelecionado?.nome_produto }}
          </div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model.number="descontoInput"
            type="number"
            label="Desconto (R$)"
            outlined
            dense
            min="0"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn
            unelevated
            color="primary"
            label="Confirmar"
            @click="confirmarDesconto()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Pagamento -->
    <q-dialog v-model="dialogPagamento" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Forma de Pagamento</div>
          <div class="text-caption text-grey-6">
            Total: {{ valorTotalVenda }}
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row q-gutter-md justify-center">
            <q-btn
              :outline="formaPagamentoSelecionada !== 'dinheiro'"
              :color="formaPagamentoSelecionada === 'dinheiro' ? 'primary' : 'grey-7'"
              icon="payments"
              label="Dinheiro"
              unelevated
              @click="formaPagamentoSelecionada = 'dinheiro'"
            />
            <q-btn
              :outline="formaPagamentoSelecionada !== 'cartao'"
              :color="formaPagamentoSelecionada === 'cartao' ? 'primary' : 'grey-7'"
              icon="credit_card"
              label="Cartão"
              unelevated
              @click="formaPagamentoSelecionada = 'cartao'"
            />
            <q-btn
              :outline="formaPagamentoSelecionada !== 'pix'"
              :color="formaPagamentoSelecionada === 'pix' ? 'primary' : 'grey-7'"
              icon="pix"
              label="Pix"
              unelevated
              @click="formaPagamentoSelecionada = 'pix'"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn
            unelevated
            color="positive"
            label="Confirmar Pagamento"
            :loading="carregando"
            @click="confirmarPagamento()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import listVendaBalcao from '../../config/listVendaBalcao.json'
import clienteService, { Cliente } from '../../services/clienteService'
import productService, { Product } from '../../services/productService'
import vendasService from '../../services/vendasService'

@Component
export default class VendasBalcaoComponent extends Vue {

  colunaCliente = listVendaBalcao.columns
  colunaProduto = listVendaBalcao.columnsTableProduto
  colunasProdutosAdicionados = listVendaBalcao.colunasProdutosAdicionados

  // ===== data =====
  codigo = ''
  nome = ''
  documento = ''
  clienteSelecionado: any = null
  vendaAtual: any = null // ← venda criada no backend

  // Controle de Fluxo
  procurarProduto = false
  finalizacaoVenda = false
  dialogCancelar = false
  dialogPagamento = false
  formaPagamentoSelecionada = ''
  carregando = false

  // Dados de Venda
  codigoProduto = ''
  nomeProduto = ''

  rows: Cliente[] = []
  rowsProduto: Product[] = []
  produtosAdicionados: any[] = [] // itens locais com item_id do backend

  // Dialog quantidade/desconto
  dialogQuantidade = false
  dialogDescontoItem = false
  produtoSelecionado: any = null
  quantidadeInput = 1
  descontoInput = 0

  async created() {
    await this.carregarClientes()
  }

  // ===== Computed =====
  get rowsFiltradas() {
    return this.rows.filter((c: Cliente) => {
      const nomeOk = !this.nome || c.nome_cliente.toLowerCase().startsWith(this.nome.toLowerCase())
      const codigoOk = !this.codigo || c.codigo_cliente?.toLowerCase().startsWith(this.codigo.toLowerCase())
      const docOk = !this.documento || c.cpf?.includes(this.documento) || c.cnpj?.includes(this.documento)
      return nomeOk && codigoOk && docOk
    })
  }

  get rowsProdutoFiltradas() {
    return this.rowsProduto.filter((p: any) => {
      const nomeOk = !this.nomeProduto || p.nome_produto.toLowerCase().includes(this.nomeProduto.toLowerCase())
      const codigoOk = !this.codigoProduto || p.codigo_produto?.toLowerCase().startsWith(this.codigoProduto.toLowerCase())
      return nomeOk && codigoOk
    })
  }

  get totalItens() {
    return this.produtosAdicionados.length
  }

  get valorBruto() {
    const total = this.produtosAdicionados.reduce((acc, p) => acc + p.total, 0)
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  get descontoReais() {
    const total = this.produtosAdicionados.reduce((acc, p) => acc + (p.desconto || 0), 0)
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  get descontoPercent() {
    const bruto = this.produtosAdicionados.reduce((acc, p) => acc + (p.valorUnitario * p.quantidade), 0)
    const desc = this.produtosAdicionados.reduce((acc, p) => acc + (p.desconto || 0), 0)
    if (!bruto) return '0%'
    return ((desc / bruto) * 100).toFixed(1) + '%'
  }

  get valorTotalVenda() {
    const total = this.produtosAdicionados.reduce((acc, p) => acc + p.total, 0)
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  // ===== Métodos =====
  async carregarClientes() {
    try {
      this.rows = await clienteService.listarClientes()
    } catch {
      this.$q.notify({ type: 'negative', message: 'Erro ao carregar clientes!' })
    }
  }

async carregarProdutos() {
  try {
    const produtos = await productService.getAllProducts()
    this.rowsProduto = produtos.map((p: any) => ({
      ...p,
      codigo: p.codigo_produto,
      nome: p.nome_produto,
      valorUnitario: p.preco,
      total: p.preco
    }))
  } catch {
    this.$q.notify({ type: 'negative', message: 'Erro ao carregar produtos!' })
  }
}

  async realizarVenda(row: any) {
    try {
      this.carregando = true
      // Cria venda no backend ao selecionar cliente
      this.vendaAtual = await vendasService.criarVenda({
        cliente_id: row.id,
        itens: [],
        forma_pagamento: 'pendente' // será atualizado ao finalizar
      })
      this.clienteSelecionado = row
      this.procurarProduto = true
      await this.carregarProdutos()
    } catch {
      this.$q.notify({ type: 'negative', message: 'Erro ao iniciar venda!' })
    } finally {
      this.carregando = false
    }
  }

  abrirDialogQuantidade(row: any) {
    this.produtoSelecionado = row
    this.quantidadeInput = 1
    this.descontoInput = 0
    this.dialogQuantidade = true
  }

  abrirDialogDesconto(row: any) {
    this.produtoSelecionado = row
    this.descontoInput = 0
    this.dialogDescontoItem = true
  }

  async confirmarQuantidade() {
    this.dialogQuantidade = false
    await this.adicionarProduto(this.produtoSelecionado, this.quantidadeInput, 0)
  }

  async confirmarDesconto() {
    this.dialogDescontoItem = false
    await this.adicionarProduto(this.produtoSelecionado, 1, this.descontoInput)
  }

  async adicionarProduto(row: any, quantidade = 1, desconto = 0) {
    try {
      await vendasService.adicionarItem({
        venda_id: this.vendaAtual.id,
        produto_id: row.id,
        quantidade,
        desconto
      })

      // Recarrega itens do backend para pegar item_id correto
      const itens = await vendasService.listarItens(this.vendaAtual.id)
      this.produtosAdicionados = itens.map((i: any) => ({
        item_id: i.id,
        codigo: i.codigo_produto,
        nome: i.nome_produto,
        quantidade: i.quantidade,
        valorUnitario: i.preco_unitario,
        desconto: i.desconto,
        total: i.subtotal
      }))

      this.finalizacaoVenda = true
      this.$q.notify({ type: 'positive', message: 'Produto adicionado!' })
    } catch (err: any) {
      this.$q.notify({ type: 'negative', message: err.response?.data?.error || 'Erro ao adicionar produto' })
    }
  }

  async removerProduto(row: any) {
    try {
      await vendasService.removerItem(row.item_id)
      this.produtosAdicionados = this.produtosAdicionados.filter(p => p.item_id !== row.item_id)
      if (this.produtosAdicionados.length === 0) this.finalizacaoVenda = false
      this.$q.notify({ type: 'positive', message: 'Produto removido!' })
    } catch {
      this.$q.notify({ type: 'negative', message: 'Erro ao remover produto' })
    }
  }

  abrirDialogPagamento() {
    if (this.produtosAdicionados.length === 0) {
      this.$q.notify({ type: 'warning', message: 'Adicione ao menos um produto!' })
      return
    }
    this.formaPagamentoSelecionada = ''
    this.dialogPagamento = true
  }

  async confirmarPagamento() {
    if (!this.formaPagamentoSelecionada) {
      this.$q.notify({ type: 'warning', message: 'Selecione a forma de pagamento!' })
      return
    }
    try {
      this.carregando = true
      // Atualiza forma de pagamento e finaliza
      await vendasService.finalizarVenda(this.vendaAtual.id, this.formaPagamentoSelecionada)
      this.$q.notify({ type: 'positive', message: 'Venda finalizada com sucesso!' })
      this.dialogPagamento = false
      this.confirmarCancelamento() // limpa tudo
    } catch {
      this.$q.notify({ type: 'negative', message: 'Erro ao finalizar venda!' })
    } finally {
      this.carregando = false
    }
  }

  abrirDialogCancelar() {
    this.dialogCancelar = true
  }

  async confirmarCancelamento() {
    if (this.vendaAtual?.id) {
      try {
        await vendasService.cancelarVenda(this.vendaAtual.id)
      } catch { /* ignora */ }
    }
    this.dialogCancelar = false
    this.procurarProduto = false
    this.finalizacaoVenda = false
    this.produtosAdicionados = []
    this.clienteSelecionado = null
    this.vendaAtual = null
    this.limparCampos()
  }

  limparCampos() {
    this.codigo = ''
    this.nome = ''
    this.documento = ''
    this.codigoProduto = ''
    this.nomeProduto = ''
  }

  refreshTable() {
    this.limparCampos()
  }

  pesquisar() {
    // filtros já são reativos via computed
  }

  formatarReais(valor: string | number): string {
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  formatarDocumento(row: any): string {
    if (row.tipo_pessoa === 'PF') {
      const cpf = (row.cpf ?? '').replace(/\D/g, '')
      if (!cpf) return '-'
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    } else {
      const cnpj = (row.cnpj ?? '').replace(/\D/g, '')
      if (!cnpj) return '-'
      return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
  }
}
</script>

<style scoped>
.b-r-10 {
  border-radius: 10px;
}
.border {
  border: 1px solid #ccc;
}
.btn-outline-primary {
  border: 1.5px solid #ccc;
  background-color: #f0e9f5 !important;
}
</style>
