<template>
  <div class="row justify-center items-center">
    <q-card
      class="col-11 col-md-10 col-lg-9 no-shadow border b-r-10"
      style="width: 1500px"
    >
      <q-card-section class="bg-white text-black q-pb-none">
        <div class="text-h5 text-bold">Vendas Balcão</div>
        <q-toolbar class="q-pa-none">
          <q-breadcrumbs active-color="black" style="font-size: 14px" class="q-mb-md">
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="black" />
            </template>
            <q-breadcrumbs-el label="Home" icon="home" to="/" />
            <q-breadcrumbs-el label="Vendas Balcão" icon="point_of_sale" />
          </q-breadcrumbs>
        </q-toolbar>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-lg">

        <!-- ===== TELA 1: SELEÇÃO DE CLIENTE ===== -->
        <div v-if="!procurarProduto">
          <div class="row items-center q-col-gutter-md">
            <div class="col-9">
              <div class="row q-col-gutter-md">
                <div class="col-4">
                  <q-input v-model="codigo" label="Código do Cliente" outlined dense />
                </div>
                <div class="col-4">
                  <q-input v-model="nome" label="Nome Completo" outlined dense />
                </div>
                <div class="col-4">
                  <q-input v-model="documento" label="CNPJ/CPF" outlined dense />
                </div>
              </div>
            </div>
            <div class="col-3">
              <div class="row justify-end q-gutter-sm">
                <q-btn unelevated class="bg-primary b-r-8" @click="refreshTable()">
                  <q-icon name="delete_sweep" color="white" />
                  <q-tooltip>Limpar</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>

          <div class="q-mt-lg">
            <q-table
              :data="rowsFiltradas"
              :columns="colunaCliente"
              row-key="codigo"
              flat
              bordered
              no-data-label="Nenhum registro encontrado"
              class="text-weight-medium"
              :rows-per-page-options="[10, 20, 50]"
            >
              <template v-slot:body-cell-acoes="props">
                <q-td align="center">
                  <q-btn icon="point_of_sale" size="sm" color="warning" flat round @click="realizarVenda(props.row)">
                    <q-tooltip>Iniciar Venda</q-tooltip>
                  </q-btn>
                </q-td>
              </template>
              <template v-slot:body-cell-documento="props">
                <q-td align="center">{{ formatarDocumento(props.row) }}</q-td>
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
        </div>

        <!-- ===== TELA 2: FLUXO DE VENDA ===== -->
        <div v-if="procurarProduto">

          <!-- Banner do Cliente Selecionado -->
          <div class="row items-center justify-between q-pa-md q-mb-lg b-r-8 border">
            <div class="row items-center q-gutter-md">
              <q-avatar color="primary" text-color="white" icon="person" size="42px" />
              <div>
                <div class="text-weight-bold text-body1">{{ clienteSelecionado?.nome_cliente }}</div>
                <div class="text-caption text-grey-6">
                  {{ clienteSelecionado?.codigo_cliente }} &nbsp;|&nbsp; {{ formatarDocumento(clienteSelecionado) }}
                </div>
              </div>
            </div>
            <q-btn
              flat
              dense
              icon="close"
              color="negative"
              label="Cancelar Venda"
              class="b-r-8"
              @click="abrirDialogCancelar()"
            />
          </div>

          <!-- Busca de Produtos -->
          <div class="row items-center q-col-gutter-md q-mb-md">
            <div class="col-4">
              <q-input v-model="codigoProduto" label="Código do Produto" outlined dense>
              </q-input>
            </div>
            <div class="col-6">
              <q-input v-model="nomeProduto" label="Nome do Produto" outlined dense>
              </q-input>
            </div>
          </div>

          <!-- Layout de duas colunas: Produtos | Carrinho -->
          <div class="row q-col-gutter-md">

            <!-- Coluna Esquerda: Tabela de Produtos -->
            <div :class="produtosAdicionados.length > 0 ? 'col-7' : 'col-12'">
              <div class="row items-center text-subtitle1 text-weight-bold q-ml-xs q-my-md">
                <q-icon name="inventory_2" class="q-mr-md" />Produtos disponíveis
              </div>
              <q-table
                :data="rowsProdutoFiltradas"
                :columns="colunaProduto"
                row-key="codigo"
                class="b-r-8"
                flat
                bordered
                no-data-label="Nenhum produto encontrado"
                :rows-per-page-options="[10, 15, 30]"
              >
                <template v-slot:body-cell-acoes="props">
                  <q-td align="center">
                    <q-btn icon="o_add_box" size="sm" color="warning" flat round @click="abrirDialogQuantidade(props.row)">
                      <q-tooltip>Definir quantidade</q-tooltip>
                    </q-btn>
                    <q-btn icon="percent" size="sm" color="blue" flat round @click="abrirDialogDesconto(props.row)">
                      <q-tooltip>Desconto no item</q-tooltip>
                    </q-btn>
                    <q-btn icon="add_shopping_cart" size="sm" color="positive" flat round @click="adicionarProduto(props.row)">
                      <q-tooltip>Adicionar</q-tooltip>
                    </q-btn>
                  </q-td>
                </template>
                <template v-slot:body-cell-valorUnitario="props">
                  <q-td align="center">{{ formatarReais(props.row.valorUnitario) }}</q-td>
                </template>
                <template v-slot:body-cell-total="props">
                  <q-td align="center">{{ formatarReais(props.row.total) }}</q-td>
                </template>
              </q-table>
            </div>

            <!-- Coluna Direita: Carrinho -->
            <div class="col-5" v-if="produtosAdicionados.length > 0">
              <div class="row items-center text-subtitle1 text-weight-bold q-ml-xs q-my-md">
                <q-icon name="shopping_cart" class="q-mr-md" />Carrinho
                <q-badge color="primary" class="q-ml-sm">{{ produtosAdicionados.length }}</q-badge>
              </div>

              <q-card flat bordered class="b-r-8">
                <q-list separator>
                  <q-item v-for="item in produtosAdicionados" :key="item.item_id" class="q-py-sm">
                    <q-item-section>
                      <q-item-label class="text-weight-medium">{{ item.nome }}</q-item-label>
                      <q-item-label caption>
                        {{ item.quantidade }}x {{ formatarReais(item.valorUnitario) }}
                        <span v-if="item.desconto > 0" class="text-negative"> - {{ formatarReais(item.desconto) }}</span>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <div class="column items-end">
                        <span class="text-weight-bold text-positive">{{ formatarReais(item.total) }}</span>
                        <q-btn icon="delete" size="xs" flat round color="negative" @click="removerProduto(item)" />
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>

                <!-- Totais -->
                <q-separator />
                <div class="q-pa-md">
                  <div class="row justify-between text-caption text-grey-7 q-mb-xs">
                    <span>Subtotal</span>
                    <span>{{ valorBruto }}</span>
                  </div>
                  <div class="row justify-between text-caption text-negative q-mb-xs" v-if="descontoReais !== 'R$\u00a00,00'">
                    <span>Desconto</span>
                    <span>- {{ descontoReais }}</span>
                  </div>
                  <q-separator class="q-my-sm" />
                  <div class="row justify-between text-weight-bold text-body1">
                    <span>Total</span>
                    <span class="text-positive">{{ valorTotalVenda }}</span>
                  </div>
                </div>

                <!-- Botão Pagamento -->
                <div class="q-pa-md q-pt-none">
                  <q-btn
                    label="Realizar Pagamento"
                    icon="credit_card"
                    color="positive"
                    unelevated
                    class="full-width b-r-8"
                    size="md"
                    @click="abrirDialogPagamento()"
                  />
                </div>
              </q-card>
            </div>
          </div>

        </div>
      </q-card-section>
    </q-card>

    <!-- Dialog Cancelar -->
    <q-dialog v-model="dialogCancelar" persistent>
      <q-card style="min-width: 380px; border-radius: 12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Cancelar Venda</div>
        </q-card-section>
        <q-card-section class="text-grey-7" style="font-size: 14px">
          Deseja realmente cancelar a venda? Todos os itens adicionados serão removidos e o estoque será restaurado.
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn label="Voltar" unelevated style="border: 1px solid #ccc; border-radius: 8px; min-width: 100px" color="white" text-color="dark" v-close-popup />
          <q-btn label="Sim, Cancelar" unelevated color="negative" class="b-r-8" style="min-width: 130px" @click="confirmarCancelamento()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Quantidade -->
    <q-dialog v-model="dialogQuantidade" persistent>
      <q-card style="min-width: 320px; border-radius: 12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Quantidade</div>
          <div class="text-caption text-grey-6 q-mt-xs">{{ produtoSelecionado?.nome_produto }}</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model.number="quantidadeInput" type="number" label="Quantidade" outlined dense min="1" autofocus />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn label="Cancelar" flat v-close-popup />
          <q-btn label="Confirmar" unelevated color="primary" class="b-r-8" @click="confirmarQuantidade()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Desconto -->
    <q-dialog v-model="dialogDescontoItem" persistent>
      <q-card style="min-width: 320px; border-radius: 12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Desconto no Item</div>
          <div class="text-caption text-grey-6 q-mt-xs">{{ produtoSelecionado?.nome_produto }}</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model.number="descontoInput" type="number" label="Desconto (R$)" outlined dense min="0" autofocus />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn label="Cancelar" flat v-close-popup />
          <q-btn label="Confirmar" unelevated color="primary" class="b-r-8" @click="confirmarDesconto()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Pagamento -->
    <q-dialog v-model="dialogPagamento" persistent>
      <q-card style="min-width: 380px; border-radius: 12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Forma de Pagamento</div>
          <div class="text-caption text-grey-6 q-mt-xs">Total a pagar: <strong class="text-positive">{{ valorTotalVenda }}</strong></div>
        </q-card-section>
        <q-card-section>
          <div class="row q-gutter-md justify-center q-mt-sm">
            <q-btn
              :unelevated="formaPagamentoSelecionada === 'dinheiro'"
              :outline="formaPagamentoSelecionada !== 'dinheiro'"
              :color="formaPagamentoSelecionada === 'dinheiro' ? 'primary' : 'grey-7'"
              icon="payments"
              label="Dinheiro"
              class="b-r-8"
              style="min-width: 100px"
              @click="formaPagamentoSelecionada = 'dinheiro'"
            />
            <q-btn
              :unelevated="formaPagamentoSelecionada === 'cartao'"
              :outline="formaPagamentoSelecionada !== 'cartao'"
              :color="formaPagamentoSelecionada === 'cartao' ? 'primary' : 'grey-7'"
              icon="credit_card"
              label="Cartão"
              class="b-r-8"
              style="min-width: 100px"
              @click="formaPagamentoSelecionada = 'cartao'"
            />
            <q-btn
              :unelevated="formaPagamentoSelecionada === 'pix'"
              :outline="formaPagamentoSelecionada !== 'pix'"
              :color="formaPagamentoSelecionada === 'pix' ? 'primary' : 'grey-7'"
              icon="pix"
              label="Pix"
              class="b-r-8"
              style="min-width: 100px"
              @click="formaPagamentoSelecionada = 'pix'"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn label="Voltar" unelevated style="border: 1px solid #ccc; border-radius: 8px; min-width: 100px" color="white" text-color="dark" v-close-popup />
          <q-btn label="Confirmar Pagamento" unelevated color="positive" class="b-r-8" style="min-width: 160px" :loading="carregando" @click="confirmarPagamento()" />
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
      const ativoOk = c.status === 'Ativo'
      return nomeOk && codigoOk && docOk && ativoOk
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
.b-r-8 {
  border-radius: 8px;
}
.border {
  border: 1px solid #ccc;
}
</style>
