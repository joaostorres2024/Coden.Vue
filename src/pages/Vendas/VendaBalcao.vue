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
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-4">
              <q-input v-model="codigo" label="Código do Cliente" outlined dense />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="nome" label="Nome Completo" outlined dense />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="documento" label="CNPJ/CPF" outlined dense />
            </div>
          </div>

          <div class="row justify-start q-gutter-sm q-mb-md">
            <q-btn label="Limpar" icon="delete_sweep" flat class="text-grey-7 b-r-8" @click="refreshTable()" />
          </div>

          <q-table
            :data="rowsFiltradas"
            :columns="colunaCliente"
            row-key="id"
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

        <!-- ===== TELA 2: FLUXO DE VENDA ===== -->
        <div v-if="procurarProduto">

          <!-- Banner do Cliente -->
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
            <q-btn flat dense icon="close" color="negative" label="Cancelar Venda" class="b-r-8" @click="abrirDialogCancelar()" />
          </div>

          <!-- Busca de Produtos -->
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-4">
              <q-input v-model="codigoProduto" label="Código do Produto" outlined dense />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="nomeProduto" label="Nome do Produto" outlined dense />
            </div>
            <div class="col-12 col-md-4">
              <q-btn
                label="Limpar"
                icon="delete_sweep"
                flat
                class="text-grey-7 b-r-8"
                @click="codigoProduto = ''; nomeProduto = ''"
              />
            </div>
          </div>

          <!-- Tabela de Produtos -->
          <div class="row items-center text-subtitle1 text-weight-bold q-ml-xs q-mb-md">
            <q-icon name="inventory_2" class="q-mr-md" />Produtos disponíveis
          </div>
          <q-table
            :data="rowsProdutoFiltradas"
            :columns="colunaProduto"
            row-key="id"
            flat
            bordered
            class="text-weight-medium"
            no-data-label="Nenhum produto encontrado"
            :rows-per-page-options="[10, 15, 30]"
          >
            <template v-slot:body-cell-acoes="props">
              <q-td align="center">
                <q-btn icon="shopping_cart" size="sm" color="positive" flat round @click="adicionarProduto(props.row)">
                  <q-tooltip>Adicionar ao carrinho</q-tooltip>
                </q-btn>
              </q-td>
            </template>
            <template v-slot:body-cell-valorUnitario="props">
              <q-td align="center">{{ formatarReais(props.row.valorUnitario) }}</q-td>
            </template>
          </q-table>

          <!-- Carrinho -->
          <div v-if="produtosAdicionados.length > 0" class="q-mt-lg">
            <div class="row items-center text-subtitle1 text-weight-bold q-ml-xs q-mb-md">
              <q-icon name="shopping_cart" class="q-mr-md" />Carrinho
              <q-badge color="primary" class="q-ml-sm">{{ produtosAdicionados.length }}</q-badge>
            </div>

            <q-card flat bordered class="b-r-8">

              <!-- Itens em cards -->
              <!-- Itens em linha -->
<div class="q-pa-md">
  <div
    v-for="item in produtosAdicionados"
    :key="item.item_id"
    class="row items-center q-py-sm"
    style="border-bottom: 1px solid #f0f0f0"
  >
    <!-- Esquerda: dados do produto -->
    <div class="col">
      <div class="text-weight-bold text-body2" style="font-size: 16px;">{{ item.nome }}</div>
      <div class="text-caption text-grey-6">{{ formatarReais(item.valorUnitario) }} / un.</div>
      <div v-if="item.desconto > 0" class="text-caption text-negative">
        Desconto: - {{ formatarReais(item.desconto) }}
      </div>
    </div>

    <!-- Centro: quantidade -->
    <div class="row items-center q-gutter-xs q-mx-md">
      <q-btn icon="remove" size="xs" flat round dense color="grey-7" @click="alterarQuantidade(item, item.quantidade - 1)" />
      <span class="text-weight-bold" style="min-width: 24px; text-align: center">{{ item.quantidade }}</span>
      <q-btn icon="add" size="xs" flat round dense color="grey-7" @click="alterarQuantidade(item, item.quantidade + 1)" />
    </div>

    <!-- Direita: desconto + total + remover -->
    <div class="row items-center q-gutter-sm">
      <q-btn-toggle
        v-model="item.tipoDesconto"
        dense
        unelevated
        toggle-color="primary"
        color="white"
        text-color="grey-7"
        size="md"
        :options="[{ label: 'R$', value: 'valor' }, { label: '%', value: 'percent' }]"
        class="border b-r-8"
      />
      <q-input
        v-model.number="item.descontoInput"
        type="number"
        dense
        outlined
        style="width: 80px"
        min="0"
        @change="aplicarDesconto(item)"
      />
      <span class="text-weight-bold text-positive" style="min-width: 90px; text-align: right">
        {{ formatarReais(item.total) }}
      </span>
      <q-btn icon="delete" size="xs" flat round color="negative" @click="removerProduto(item)" />
    </div>
  </div>
</div>

              <!-- Totais -->
              <div class="q-pa-md row justify-end">
                <div class="column q-gutter-xs" style="min-width: 220px">
                  <div class="row justify-between text-caption text-grey-7">
                    <span>Subtotal</span>
                    <span>{{ valorBruto }}</span>
                  </div>
                  <div class="row justify-between text-caption text-negative" v-if="descontoReais !== 'R$\u00a00,00'">
                    <span>Desconto</span>
                    <span>- {{ descontoReais }}</span>
                  </div>
                  <q-separator />
                  <div class="row justify-between text-weight-bold text-body1">
                    <span>Total</span>
                    <span class="text-positive">{{ valorTotalVenda }}</span>
                  </div>
                </div>
              </div>

              <!-- Botões -->
              <div class="q-pa-md q-pt-none row q-gutter-sm">
                <q-btn
                  label="Realizar Pagamento"
                  icon="credit_card"
                  color="positive"
                  unelevated
                  class="col b-r-8"
                  size="md"
                  @click="abrirDialogPagamento()"
                />
                <q-btn icon="close" color="negative" flat round class="b-r-8" @click="abrirDialogCancelar()">
                  <q-tooltip>Cancelar Venda</q-tooltip>
                </q-btn>
              </div>
            </q-card>
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

    <!-- Dialog Pagamento -->
    <q-dialog v-model="dialogPagamento" persistent>
      <q-card style="min-width: 380px; border-radius: 12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Forma de Pagamento</div>
          <div class="text-caption text-grey-6 q-mt-xs">Total a pagar: <strong class="text-positive">{{ valorTotalVenda }}</strong></div>
        </q-card-section>
        <q-card-section>
          <div class="row q-gutter-sm justify-center q-mt-sm">
            <q-card
              v-for="forma in formasPagamento"
              :key="forma.value"
              flat
              bordered
              class="cursor-pointer b-r-8 q-pa-md text-center"
              :style="formaPagamentoSelecionada === forma.value ? 'border: 2px solid var(--q-primary)' : ''"
              style="min-width: 100px"
              @click="formaPagamentoSelecionada = forma.value"
            >
              <q-icon :name="forma.icon" :color="formaPagamentoSelecionada === forma.value ? 'primary' : 'grey-6'" size="28px" />
              <div class="text-caption q-mt-xs" :class="formaPagamentoSelecionada === forma.value ? 'text-primary text-weight-bold' : 'text-grey-6'">
                {{ forma.label }}
              </div>
            </q-card>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn label="Voltar" unelevated style="border: 1px solid #ccc; border-radius: 8px; min-width: 100px" color="white" text-color="dark" v-close-popup />
          <q-btn label="Confirmar Pagamento" unelevated color="positive" class="b-r-8" style="min-width: 160px" :loading="carregando" @click="confirmarPagamento()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Loading/Sucesso -->
<q-dialog v-model="dialogProcessando" persistent>
  <q-card style="min-width: 340px; border-radius: 16px; text-align: center" class="q-pa-xl">

    <!-- Ícone animado -->
    <div style="position: relative; width: 72px; height: 72px; margin: 0 auto 1.5rem">

<!-- Spinner -->
<svg v-if="pagamentoStatus === 'loading'"
  viewBox="0 0 72 72" width="72" height="72"
  class="spinner-svg"
  style="position: absolute; top: 0; left: 0">
  <circle cx="36" cy="36" r="30" fill="none" stroke="#e0e0e0" stroke-width="5"/>
  <circle cx="36" cy="36" r="30" fill="none" stroke="#1D9E75" stroke-width="5"
    stroke-linecap="round" stroke-dasharray="60 128" stroke-dashoffset="0"
    transform="rotate(-90 36 36)"/>
</svg>

      <!-- Check -->
      <svg v-if="pagamentoStatus === 'success'" viewBox="0 0 72 72" width="72" height="72"
        style="position: absolute; top: 0; left: 0">
        <circle cx="36" cy="36" r="34" fill="#EAF3DE"/>
        <polyline
          points="20,37 31,48 52,24"
          fill="none" stroke="#3B6D11" stroke-width="5"
          stroke-linecap="round" stroke-linejoin="round"
          :stroke-dasharray="54"
          :stroke-dashoffset="checkOffset"
          style="transition: stroke-dashoffset 0.5s ease"
        />
      </svg>
    </div>

    <!-- Textos -->
    <div class="text-h6 text-bold q-mb-xs">
      {{ pagamentoStatus === 'loading' ? 'Processando pagamento...' : 'Venda realizada!' }}
    </div>
    <div class="text-caption text-grey-6 q-mb-lg">
      {{ pagamentoStatus === 'loading' ? 'Aguarde enquanto a venda é finalizada' : 'Deseja emitir a nota fiscal agora?' }}
    </div>

    <!-- Botões (só aparecem no sucesso) -->
    <div v-if="pagamentoStatus === 'success'" class="row q-gutter-sm justify-center">
      <q-btn
        label="Ver Nota Fiscal"
        icon="receipt_long"
        color="positive"
        unelevated
        class="b-r-8"
        @click="irParaNotaFiscal()"
      />
      <q-btn
        label="Fechar"
        flat
        class="text-grey-7 b-r-8"
        v-close-popup
        @click="limparTela()"
      />
    </div>

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

  codigo = ''
  nome = ''
  documento = ''
  clienteSelecionado: any = null
  vendaAtual: any = null

  procurarProduto = false
  finalizacaoVenda = false
  dialogCancelar = false
  dialogPagamento = false
  formaPagamentoSelecionada = ''
  carregando = false

  codigoProduto = ''
  nomeProduto = ''

  formasPagamento = [
    { label: 'Dinheiro', value: 'dinheiro', icon: 'payments' },
    { label: 'Cartão', value: 'cartao', icon: 'credit_card' },
    { label: 'PIX', value: 'pix', icon: 'pix' }
  ]

  rows: Cliente[] = []
  rowsProduto: Product[] = []
  produtosAdicionados: any[] = []

  async created() {
    await this.carregarClientes()
  }

  get rowsFiltradas() {
    return this.rows.filter((c: Cliente) => {
      const nomeOk = !this.nome || c.nome_cliente.toLowerCase().startsWith(this.nome.toLowerCase())
      const codigoOk = !this.codigo || c.codigo_cliente?.toLowerCase().startsWith(this.codigo.toLowerCase())
      const docOk = !this.documento || c.cpf?.includes(this.documento) || c.cnpj?.includes(this.documento)
      return nomeOk && codigoOk && docOk && c.status === 'Ativo'
    })
  }

  get rowsProdutoFiltradas() {
    return this.rowsProduto.filter((p: any) => {
      const nomeOk = !this.nomeProduto || p.nome_produto.toLowerCase().includes(this.nomeProduto.toLowerCase())
      const codigoOk = !this.codigoProduto || p.codigo_produto?.toLowerCase().startsWith(this.codigoProduto.toLowerCase())
      return nomeOk && codigoOk
    })
  }

  get valorBruto() {
    const total = this.produtosAdicionados.reduce((acc, p) => acc + p.total, 0)
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  get descontoReais() {
    const total = this.produtosAdicionados.reduce((acc, p) => acc + (p.desconto || 0), 0)
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  get valorTotalVenda() {
    const total = this.produtosAdicionados.reduce((acc, p) => acc + p.total, 0)
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

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
      this.vendaAtual = await vendasService.criarVenda({
        cliente_id: row.id,
        itens: [],
        forma_pagamento: 'pendente'
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

  async adicionarProduto(row: any, quantidade = 1, desconto = 0) {
    try {
      await vendasService.adicionarItem({
        venda_id: this.vendaAtual.id,
        produto_id: row.id,
        quantidade,
        desconto
      })
      const itens = await vendasService.listarItens(this.vendaAtual.id)
      this.atualizarCarrinho(itens)
      this.finalizacaoVenda = true
      this.$q.notify({ type: 'positive', message: 'Produto adicionado!' })
    } catch (err: any) {
      this.$q.notify({ type: 'negative', message: err.response?.data?.error || 'Erro ao adicionar produto' })
    }
  }

  async alterarQuantidade(item: any, novaQuantidade: number) {
    if (novaQuantidade < 1) return
    try {
      await vendasService.removerItem(item.item_id)
      await vendasService.adicionarItem({
        venda_id: this.vendaAtual.id,
        produto_id: item.id,
        quantidade: novaQuantidade,
        desconto: item.desconto || 0
      })
      const itens = await vendasService.listarItens(this.vendaAtual.id)
      this.atualizarCarrinho(itens)
    } catch {
      this.$q.notify({ type: 'negative', message: 'Erro ao alterar quantidade!' })
    }
  }

  async aplicarDesconto(item: any) {
    try {
      let desconto = 0
      if (item.tipoDesconto === 'percent') {
        desconto = (item.valorUnitario * item.quantidade) * (item.descontoInput / 100)
      } else {
        desconto = item.descontoInput || 0
      }
      await vendasService.removerItem(item.item_id)
      await vendasService.adicionarItem({
        venda_id: this.vendaAtual.id,
        produto_id: item.id,
        quantidade: item.quantidade,
        desconto
      })
      const itens = await vendasService.listarItens(this.vendaAtual.id)
      this.atualizarCarrinho(itens)
    } catch {
      this.$q.notify({ type: 'negative', message: 'Erro ao aplicar desconto!' })
    }
  }

  atualizarCarrinho(itens: any[]) {
    this.produtosAdicionados = itens.map((i: any) => ({
      item_id: i.id,
      id: i.produto_id,
      nome: i.nome_produto,
      quantidade: i.quantidade,
      valorUnitario: i.preco_unitario,
      desconto: i.desconto,
      descontoInput: i.desconto || 0,
      tipoDesconto: 'valor',
      total: i.subtotal
    }))
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

dialogProcessando = false
pagamentoStatus: 'loading' | 'success' = 'loading'
checkOffset = 54

async confirmarPagamento() {
  if (!this.formaPagamentoSelecionada) {
    this.$q.notify({ type: 'warning', message: 'Selecione a forma de pagamento!' })
    return
  }
  try {
    this.dialogPagamento = false
    this.pagamentoStatus = 'loading'
    this.checkOffset = 54
    this.dialogProcessando = true

    await vendasService.finalizarVenda(this.vendaAtual.id, this.formaPagamentoSelecionada)

    this.pagamentoStatus = 'success'
    // Anima o check
    setTimeout(() => { this.checkOffset = 0 }, 50)

  } catch {
    this.dialogProcessando = false
    this.$q.notify({ type: 'negative', message: 'Erro ao finalizar venda!' })
  }
}

irParaNotaFiscal() {
  const vendaId = this.vendaAtual?.id
  this.dialogProcessando = false
  this.limparTela()
  this.$router.push(`/NotaFiscalSaida`)  // ajuste a rota conforme seu projeto
}

  abrirDialogCancelar() {
    this.dialogCancelar = true
  }

  async confirmarCancelamento() {
    if (this.vendaAtual?.id) {
      try {
        await vendasService.deletarVenda(this.vendaAtual.id)
      } catch { /* ignora */ }
    }
    this.dialogCancelar = false
    this.limparTela()
  }

  limparTela() {
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

  async beforeDestroy() {
    if (this.vendaAtual?.id) {
      try {
        await vendasService.deletarVenda(this.vendaAtual.id)
      } catch { /* ignora */ }
    }
  }

  formatarReais(valor: string | number): string {
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  formatarDocumento(row: any): string {
    if (!row) return '-'
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
.b-r-10 { border-radius: 10px; }
.border { border: 1px solid #ccc; }
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner-svg {
  animation: spin 0.9s linear infinite;
  transform-origin: center;
}
</style>
