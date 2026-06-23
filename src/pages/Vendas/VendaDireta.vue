<template>
  <div class="q-pa-md">
    <!-- Cabeçalho -->
    <div class="text-bold text-black row items-center vd-cabecalho" style="font-size: 28px">
      <q-icon name="point_of_sale" class="q-mr-md text-primary" size="28px" />Venda Direta
    </div>
    <p class="text-grey-7 text-body2 q-mb-md vd-subtitulo">
      Realize vendas presenciais, adicione produtos ao carrinho, aplique
      descontos e finalize o pagamento com emissão de nota fiscal.
    </p>
    <q-separator class="q-mb-lg" />

    <!-- TELA 1: SELEÇÃO DE CLIENTE -->
    <div v-if="!procurarProduto" class="vd-tela-cliente">
      <div class="row q-col-gutter-md q-mb-md vd-filtros-cliente">
        <div class="col-12 col-md-4">
          <q-input
            v-model="codigo"
            label="Código do Cliente"
            outlined
            dense
            input-id="vd-input-filtro-codigo"
            class="vd-input-filtro-codigo"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-input
            v-model="nome"
            label="Nome Completo"
            outlined
            dense
            input-id="vd-input-filtro-nome"
            class="vd-input-filtro-nome"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-input
            v-model="documento"
            label="CNPJ/CPF"
            outlined
            dense
            input-id="vd-input-filtro-documento"
            class="vd-input-filtro-documento"
          />
        </div>
      </div>

      <div class="row justify-start q-gutter-sm q-mb-md vd-acoes-cliente">
        <q-btn
          id="vd-btn-limpar-cliente"
          class="vd-btn-limpar-cliente text-grey-7"
          label="Limpar"
          icon="delete_sweep"
          flat
          @click="refreshTable()"
        />
      </div>

      <q-table
        :data="rowsFiltradas"
        :columns="colunaCliente"
        row-key="id"
        flat
        bordered
        no-data-label="Nenhum registro encontrado"
        class="text-weight-medium vd-tabela-clientes"
        :rows-per-page-options="[10, 20, 50]"
      >
        <template v-slot:body-cell-acoes="props">
          <q-td align="center">
            <q-btn
              icon="point_of_sale"
              size="sm"
              color="warning"
              flat
              round
              class="vd-btn-iniciar-venda"
              @click="realizarVenda(props.row)"
            >
              <q-tooltip>Iniciar Venda</q-tooltip>
            </q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-documento="props">
          <q-td align="center">{{ formatarDocumento(props.row) }}</q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td align="center">
            <q-badge
              :color="props.row.status === 'Ativo' ? 'positive' : 'negative'"
              class="vd-badge-status-cliente"
            >
              {{ props.row.status }}
            </q-badge>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- TELA 2: FLUXO DE VENDA -->
    <div
      v-if="procurarProduto"
      class="vd-tela-venda"
      :style="finalizacaoVenda ? 'margin-right: 380px; transition: margin-right 0.25s ease' : 'transition: margin-right 0.25s ease'"
    >
      <!-- Banner do Cliente -->
      <div class="row items-center justify-between q-pa-md q-mb-lg border vd-banner-cliente">
        <div class="row items-center q-gutter-md">
          <q-avatar color="primary" text-color="white" icon="person" size="42px" />
          <div>
            <div class="text-weight-bold text-body1 vd-banner-nome-cliente">{{ clienteSelecionado?.nome_cliente }}</div>
            <div class="text-caption text-grey-6">
              {{ clienteSelecionado?.codigo_cliente }} &nbsp;|&nbsp;
              {{ formatarDocumento(clienteSelecionado) }}
            </div>
          </div>
        </div>
        <div class="row items-center q-gutter-sm">
          <q-btn
            v-if="produtosAdicionados.length > 0"
            flat
            dense
            icon="shopping_cart"
            color="primary"
            label="Ver carrinho"
            class="vd-btn-ver-carrinho"
            @click="drawerCarrinho = true"
          >
            <q-badge color="primary" floating rounded :label="produtosAdicionados.length" />
          </q-btn>
          <q-btn
            id="vd-btn-cancelar-venda"
            flat
            dense
            icon="close"
            color="negative"
            label="Cancelar Venda"
            class="vd-btn-cancelar-venda"
            @click="abrirDialogCancelar()"
          />
        </div>
      </div>

      <!-- Busca de Produtos -->
      <div class="row q-col-gutter-md q-mb-md vd-filtros-produto">
        <div class="col-12 col-md-4">
          <q-input
            v-model="codigoProduto"
            label="Código do Produto"
            outlined
            dense
            input-id="vd-input-filtro-codigo-produto"
            class="vd-input-filtro-codigo-produto"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-input
            v-model="nomeProduto"
            label="Nome do Produto"
            outlined
            dense
            input-id="vd-input-filtro-nome-produto"
            class="vd-input-filtro-nome-produto"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-btn
            id="vd-btn-limpar-produto"
            class="vd-btn-limpar-produto text-grey-7"
            label="Limpar"
            icon="delete_sweep"
            flat
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
        class="text-weight-medium vd-tabela-produtos"
        no-data-label="Nenhum produto encontrado"
        :rows-per-page-options="[10, 15, 30]"
      >
        <template v-slot:body-cell-acoes="props">
          <q-td align="center">
            <q-btn
              icon="shopping_cart"
              size="sm"
              color="positive"
              flat
              round
              class="vd-btn-adicionar-produto"
              @click="adicionarProduto(props.row)"
            >
              <q-tooltip>Adicionar ao carrinho</q-tooltip>
            </q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-valorUnitario="props">
          <q-td align="center">{{ formatarReais(props.row.valorUnitario) }}</q-td>
        </template>
      </q-table>
    </div>

    <!-- DRAWER: Carrinho -->
    <q-drawer v-model="drawerCarrinho" side="right" bordered overlay :width="380" class="column vd-drawer-carrinho">
      <div class="column full-height">

        <!-- Cabeçalho do drawer -->
        <div class="row items-center justify-between q-pa-md vd-drawer-cabecalho" style="border-bottom: 0.5px solid #e0e0e0">
          <div class="row items-center q-gutter-sm">
            <q-icon name="shopping_cart" size="20px" color="grey-7" />
            <span style="font-size: 15px; font-weight: 500">Carrinho</span>
            <q-badge color="primary" rounded :label="produtosAdicionados.length" style="font-size: 10px" />
          </div>
          <q-btn
            id="vd-btn-fechar-carrinho"
            class="vd-btn-fechar-carrinho"
            icon="close"
            flat
            dense
            round
            size="sm"
            color="grey-7"
            @click="drawerCarrinho = false"
          />
        </div>

        <!-- Itens do carrinho -->
        <q-scroll-area class="col">
          <div class="q-pa-md">
            <div v-if="produtosAdicionados.length === 0" class="text-center text-grey-6 q-pa-xl vd-carrinho-vazio">
              <q-icon name="shopping_cart" size="40px" color="grey-4" />
              <div class="q-mt-sm" style="font-size: 13px">Nenhum produto adicionado ainda</div>
            </div>

            <div
              v-for="item in produtosAdicionados"
              :key="item.item_id"
              class="q-py-md vd-carrinho-item"
              style="border-bottom: 0.5px solid #f0f0f0"
            >
              <div class="row items-start justify-between">
                <div class="col">
                  <div style="font-size: 14px; font-weight: 500; color: #222">{{ item.nome }}</div>
                  <div style="font-size: 12px; color: #999; margin-top: 2px">{{ formatarReais(item.valorUnitario) }} / un.</div>
                  <div v-if="item.desconto > 0" style="font-size: 12px; color: #c0392b; margin-top: 2px">
                    Desconto: - {{ formatarReais(item.desconto) }}
                  </div>
                </div>
                <q-btn
                  icon="delete_outline"
                  size="sm"
                  flat
                  round
                  dense
                  color="negative"
                  class="vd-btn-remover-item"
                  @click="removerProduto(item)"
                >
                  <q-tooltip>Remover item</q-tooltip>
                </q-btn>
              </div>

              <div class="row items-center justify-between q-mt-sm">
                <div class="row items-center vd-controle-quantidade" style="border: 0.5px solid #ddd; border-radius: 8px; overflow: hidden;">
                  <q-btn
                    icon="remove"
                    size="xs"
                    flat
                    dense
                    color="grey-7"
                    class="vd-btn-diminuir-quantidade"
                    style="padding: 4px 8px; border-radius: 0"
                    @click="alterarQuantidade(item, item.quantidade - 1)"
                  />
                  <span style="min-width: 28px; text-align: center; font-size: 14px; font-weight: 500; padding: 0 4px;">{{ item.quantidade }}</span>
                  <q-btn
                    icon="add"
                    size="xs"
                    flat
                    dense
                    color="grey-7"
                    class="vd-btn-aumentar-quantidade"
                    style="padding: 4px 8px; border-radius: 0"
                    @click="alterarQuantidade(item, item.quantidade + 1)"
                  />
                </div>
                <span style="font-size: 14px; font-weight: 500; color: #1d9e75;" class="vd-item-total">
                  {{ formatarReais(item.total) }}
                </span>
              </div>

              <!-- Desconto -->
              <div class="row items-center q-gutter-sm q-mt-sm vd-desconto-item">
                <q-btn-toggle
                  v-model="item.tipoDesconto"
                  dense
                  unelevated
                  toggle-color="primary"
                  color="white"
                  text-color="grey-7"
                  size="sm"
                  :options="[{ label: 'R$', value: 'valor' }, { label: '%', value: 'percent' }]"
                  style="border: 0.5px solid #ddd; border-radius: 8px; overflow: hidden;"
                  class="vd-toggle-tipo-desconto"
                />
                <q-input
                  v-model.number="item.descontoInput"
                  type="number"
                  dense
                  outlined
                  style="width: 90px"
                  label="Desconto"
                  min="0"
                  :input-id="`vd-input-desconto-${item.item_id}`"
                  class="vd-input-desconto"
                  @change="aplicarDesconto(item)"
                />
              </div>
            </div>
          </div>
        </q-scroll-area>

        <!-- Totais + Ações -->
        <div v-if="produtosAdicionados.length > 0" class="q-pa-md vd-drawer-rodape" style="border-top: 0.5px solid #e0e0e0">
          <div class="q-mb-md vd-resumo-carrinho">
            <div class="row justify-between q-mb-xs" style="font-size: 13px; color: #999">
              <span>Subtotal</span><span class="vd-resumo-subtotal">{{ valorBruto }}</span>
            </div>
            <div v-if="descontoReais !== 'R$\u00a00,00'" class="row justify-between q-mb-xs" style="font-size: 13px; color: #c0392b">
              <span>Desconto</span><span class="vd-resumo-desconto">- {{ descontoReais }}</span>
            </div>
            <q-separator class="q-my-sm" />
            <div class="row justify-between items-center">
              <span style="font-size: 14px; font-weight: 500; color: #222">Total</span>
              <span style="font-size: 18px; font-weight: 500; color: #1d9e75" class="vd-resumo-total">{{ valorTotalVenda }}</span>
            </div>
          </div>

          <div class="row q-gutter-sm items-center">
            <q-btn
              id="vd-btn-realizar-pagamento"
              label="Realizar Pagamento"
              icon="credit_card"
              color="positive"
              unelevated
              class="col vd-btn-realizar-pagamento"
              style="border-radius: 8px; font-size: 14px"
              size="md"
              @click="abrirDialogPagamento()"
            />
            <q-btn
              id="vd-btn-cancelar-carrinho"
              icon="close"
              color="negative"
              flat
              round
              class="vd-btn-cancelar-carrinho"
              style="border: 0.5px solid #ffcccc; border-radius: 8px"
              @click="abrirDialogCancelar()"
            >
              <q-tooltip>Cancelar Venda</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </q-drawer>

    <!-- Botão flutuante carrinho -->
    <q-page-sticky
      v-if="procurarProduto && produtosAdicionados.length > 0 && !drawerCarrinho"
      position="bottom-right"
      :offset="[24, 24]"
    >
      <q-btn
        id="vd-btn-fab-carrinho"
        fab
        color="primary"
        icon="shopping_cart"
        class="vd-btn-fab-carrinho"
        @click="drawerCarrinho = true"
      >
        <q-badge color="negative" floating rounded :label="produtosAdicionados.length" />
      </q-btn>
    </q-page-sticky>

    <!-- Dialog: Forma de Pagamento -->
    <q-dialog v-model="dialogPagamento" persistent class="vd-dialog-pagamento">
      <q-card style="min-width: 400px; border-radius: 12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Forma de Pagamento</div>
          <div class="text-caption text-grey-6 q-mt-xs">
            Total a pagar: <strong class="text-positive">{{ valorTotalVenda }}</strong>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row q-gutter-sm justify-center q-mt-sm vd-opcoes-pagamento">
            <q-card
              v-for="forma in formasPagamento"
              :key="forma.value"
              flat
              bordered
              class="cursor-pointer b-r-10 q-pa-md text-center vd-opcao-pagamento"
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
          <q-btn
            id="vd-dialog-pagamento-voltar"
            class="vd-dialog-pagamento-voltar"
            label="Voltar"
            unelevated
            style="border: 1px solid #ccc; border-radius: 8px; min-width: 100px"
            color="white"
            text-color="dark"
            v-close-popup
          />
          <q-btn
            id="vd-dialog-pagamento-continuar"
            class="vd-dialog-pagamento-continuar"
            label="Continuar"
            unelevated
            color="positive"
            style="border-radius: 8px; min-width: 130px"
            @click="continuarPagamento()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog: Dinheiro -->
    <q-dialog v-model="dialogDinheiro" persistent class="vd-dialog-dinheiro">
      <q-card style="min-width: 380px; border-radius: 12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="row items-center q-gutter-sm">
            <q-icon name="payments" color="positive" size="24px" />
            <div class="text-h6 text-bold">Pagamento em Dinheiro</div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="column q-gutter-md">
            <div class="row justify-between items-center q-pa-md b-r-10" style="background: #f5f5f5">
              <span class="text-body2 text-grey-7">Total a pagar</span>
              <span class="text-h6 text-bold text-positive vd-dinheiro-total">{{ valorTotalVenda }}</span>
            </div>
            <q-input
              v-model.number="valorRecebido"
              label="Valor recebido (R$)"
              type="number"
              outlined
              dense
              min="0"
              autofocus
              input-id="vd-input-valor-recebido"
              class="vd-input-valor-recebido"
              @input="calcularTroco"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" />
              </template>
            </q-input>
            <div
              class="row justify-between items-center q-pa-md b-r-10 vd-dinheiro-troco"
              :style="troco >= 0 ? 'background: #eafaf1' : 'background: #fdf2f2'"
            >
              <span class="text-body2 text-grey-7">Troco</span>
              <span class="text-h6 text-bold" :class="troco >= 0 ? 'text-positive' : 'text-negative'">
                {{ troco >= 0 ? formatarReais(troco) : 'Valor insuficiente' }}
              </span>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn
            id="vd-dialog-dinheiro-voltar"
            class="vd-dialog-dinheiro-voltar"
            label="Voltar"
            unelevated
            style="border: 1px solid #ccc; border-radius: 8px; min-width: 100px"
            color="white"
            text-color="dark"
            @click="voltarParaPagamento()"
          />
          <q-btn
            id="vd-dialog-dinheiro-finalizar"
            class="vd-dialog-dinheiro-finalizar"
            label="Finalizar Venda"
            unelevated
            color="positive"
            style="border-radius: 8px; min-width: 140px"
            :disable="troco < 0 || !valorRecebido"
            :loading="carregando"
            @click="confirmarPagamento()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog: Cartão -->
    <q-dialog v-model="dialogCartao" persistent class="vd-dialog-cartao">
      <q-card style="min-width: 380px; border-radius: 12px; text-align: center" class="q-pa-xl">
        <div style="position: relative; width: 72px; height: 72px; margin: 0 auto 1.5rem;">
          <svg viewBox="0 0 72 72" width="72" height="72" class="spinner-svg" style="position: absolute; top: 0; left: 0">
            <circle cx="36" cy="36" r="30" fill="none" stroke="#e0e0e0" stroke-width="5" />
            <circle cx="36" cy="36" r="30" fill="none" stroke="#1976D2" stroke-width="5"
              stroke-linecap="round" stroke-dasharray="60 128" stroke-dashoffset="0"
              transform="rotate(-90 36 36)" />
          </svg>
          <q-icon name="credit_card" color="primary" size="28px"
            style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)" />
        </div>
        <div class="text-h6 text-bold q-mb-xs">Aguardando Pagamento</div>
        <div class="text-body2 text-grey-6 q-mb-xs">A cobrança foi enviada para o caixa.</div>
        <div class="text-caption text-grey-5 q-mb-lg">Peça ao cliente para aproximar ou inserir o cartão na maquininha.</div>
        <div class="text-h6 text-bold text-primary q-mb-lg vd-cartao-total">{{ valorTotalVenda }}</div>
        <div class="row q-gutter-sm justify-center">
          <q-btn
            id="vd-dialog-cartao-cancelar"
            class="vd-dialog-cartao-cancelar text-grey-7"
            label="Cancelar"
            flat
            @click="voltarParaPagamento()"
          />
          <q-btn
            id="vd-dialog-cartao-confirmar"
            class="vd-dialog-cartao-confirmar"
            label="Pagamento Confirmado"
            icon="check_circle"
            color="primary"
            unelevated
            style="border-radius: 8px"
            :loading="carregando"
            @click="confirmarPagamento()"
          />
        </div>
      </q-card>
    </q-dialog>

    <!-- Dialog: PIX -->
    <q-dialog v-model="dialogPix" persistent class="vd-dialog-pix">
      <q-card style="min-width: 400px; border-radius: 12px; text-align: center" class="q-pa-lg">
        <q-card-section class="q-pb-sm">
          <div class="row items-center justify-center q-gutter-sm q-mb-xs">
            <q-icon name="pix" color="teal" size="24px" />
            <div class="text-h6 text-bold">Pagar com PIX</div>
          </div>
          <div class="text-caption text-grey-6">Escaneie o QR Code com o app do seu banco</div>
        </q-card-section>
        <q-card-section>
          <div class="q-mb-md q-pa-sm b-r-10" style="background: #f0faf6">
            <div class="text-caption text-grey-6">Valor a pagar</div>
            <div class="text-h5 text-bold vd-pix-total" style="color: #009973">{{ valorTotalVenda }}</div>
          </div>
          <div class="row justify-center q-mb-md">
            <div style="padding: 12px; border: 2px solid #e0e0e0; border-radius: 12px; display: inline-block; background: white">
              <canvas ref="qrCanvas" style="display: block;"></canvas>
            </div>
          </div>
          <div class="text-caption text-grey-6 q-mb-xs">Ou copie o código PIX:</div>
          <div class="row items-center q-gutter-sm justify-center">
            <div
              class="text-caption b-r-10 q-pa-sm vd-pix-codigo"
              style="background: #f5f5f5; word-break: break-all; max-width: 300px; font-family: monospace; font-size: 10px; text-align: left"
            >{{ pixCopiaCola }}</div>
            <q-btn
              id="vd-btn-copiar-pix"
              class="vd-btn-copiar-pix"
              icon="content_copy"
              flat
              round
              size="sm"
              color="teal"
              @click="copiarPix()"
            >
              <q-tooltip>Copiar código PIX</q-tooltip>
            </q-btn>
          </div>
          <div v-if="pixAguardando" class="row items-center justify-center q-gutter-xs q-mt-md vd-pix-aguardando">
            <q-spinner-dots color="teal" size="20px" />
            <span class="text-caption text-grey-6">Aguardando pagamento...</span>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn
            id="vd-dialog-pix-cancelar"
            class="vd-dialog-pix-cancelar text-grey-7"
            label="Cancelar"
            flat
            @click="cancelarPix()"
          />
          <q-btn
            id="vd-dialog-pix-confirmar"
            class="vd-dialog-pix-confirmar"
            label="Já Paguei"
            icon="check_circle"
            color="teal"
            unelevated
            style="border-radius: 8px; min-width: 130px"
            :loading="carregando"
            @click="confirmarPagamento()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog: Cancelar Venda -->
    <q-dialog v-model="dialogCancelar" persistent class="vd-dialog-cancelar">
      <q-card style="min-width: 380px; border-radius: 12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Cancelar Venda</div>
        </q-card-section>
        <q-card-section class="text-grey-7" style="font-size: 14px">
          Deseja realmente cancelar a venda? Todos os itens adicionados serão removidos e o estoque será restaurado.
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn
            id="vd-dialog-cancelar-voltar"
            class="vd-dialog-cancelar-voltar"
            label="Voltar"
            unelevated
            style="border: 1px solid #ccc; border-radius: 8px; min-width: 100px"
            color="white"
            text-color="dark"
            v-close-popup
          />
          <q-btn
            id="vd-dialog-cancelar-confirmar"
            class="vd-dialog-cancelar-confirmar"
            label="Sim, Cancelar"
            unelevated
            color="negative"
            style="border-radius: 8px; min-width: 130px"
            @click="confirmarCancelamento()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog: Processando / Sucesso -->
    <q-dialog v-model="dialogProcessando" persistent class="vd-dialog-processando">
      <q-card style="min-width: 340px; border-radius: 16px; text-align: center" class="q-pa-xl">
        <div style="position: relative; width: 72px; height: 72px; margin: 0 auto 1.5rem;">
          <svg v-if="pagamentoStatus === 'loading'" viewBox="0 0 72 72" width="72" height="72" class="spinner-svg" style="position: absolute; top: 0; left: 0">
            <circle cx="36" cy="36" r="30" fill="none" stroke="#e0e0e0" stroke-width="5" />
            <circle cx="36" cy="36" r="30" fill="none" stroke="#1D9E75" stroke-width="5"
              stroke-linecap="round" stroke-dasharray="60 128" stroke-dashoffset="0"
              transform="rotate(-90 36 36)" />
          </svg>
          <svg v-if="pagamentoStatus === 'success'" viewBox="0 0 72 72" width="72" height="72" style="position: absolute; top: 0; left: 0">
            <circle cx="36" cy="36" r="34" fill="#EAF3DE" />
            <polyline points="20,37 31,48 52,24" fill="none" stroke="#3B6D11" stroke-width="5"
              stroke-linecap="round" stroke-linejoin="round"
              :stroke-dasharray="54" :stroke-dashoffset="checkOffset"
              style="transition: stroke-dashoffset 0.5s ease" />
          </svg>
        </div>
        <div class="text-h6 text-bold q-mb-xs">
          {{ pagamentoStatus === 'loading' ? 'Processando pagamento...' : 'Venda realizada!' }}
        </div>
        <div class="text-caption text-grey-6 q-mb-lg">
          {{ pagamentoStatus === 'loading' ? 'Aguarde enquanto a venda é finalizada' : 'Deseja emitir a nota fiscal agora?' }}
        </div>
        <div v-if="pagamentoStatus === 'success'" class="row q-gutter-sm justify-center">
          <q-btn
            id="vd-dialog-sucesso-ver-nf"
            class="vd-dialog-sucesso-ver-nf"
            label="Ver Nota Fiscal"
            icon="receipt_long"
            color="positive"
            unelevated
            @click="irParaNotaFiscal()"
          />
          <q-btn
            id="vd-dialog-sucesso-fechar"
            class="vd-dialog-sucesso-fechar text-grey-7"
            label="Fechar"
            flat
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
import QRCode from 'qrcode'

// ─── Chave PIX do estabelecimento ───────────────────────────────────────────
// Troque pelo valor real: CPF, CNPJ, e-mail, telefone ou chave aleatória
const PIX_CHAVE      = 'chavepixteste@gmail.com'
const PIX_NOME       = 'Seu Estabelecimento'
const PIX_CIDADE     = 'SAO PAULO'
// ─────────────────────────────────────────────────────────────────────────────

@Component
export default class VendasBalcaoComponent extends Vue {

  colunaCliente = listVendaBalcao.columns
  colunaProduto = listVendaBalcao.columnsTableProduto

  codigo    = ''
  nome      = ''
  documento = ''
  clienteSelecionado: any = null
  vendaAtual: any = null

  procurarProduto  = false
  finalizacaoVenda = false
  carregando       = false

  codigoProduto = ''
  nomeProduto   = ''

  // ── Drawer do carrinho ───────────────────────────────────
  drawerCarrinho = false

  // ── Dialogs ──────────────────────────────────────────────
  dialogCancelar    = false
  dialogPagamento   = false
  dialogDinheiro    = false
  dialogCartao      = false
  dialogPix         = false
  dialogProcessando = false

  // ── Pagamento ────────────────────────────────────────────
  formaPagamentoSelecionada = ''
  formasPagamento = [
    { label: 'Dinheiro', value: 'dinheiro', icon: 'payments'     },
    { label: 'Cartão',   value: 'cartao',   icon: 'credit_card'  },
    { label: 'PIX',      value: 'pix',      icon: 'pix'          }
  ]

  // ── Dinheiro ─────────────────────────────────────────────
  valorRecebido = 0
  troco         = 0

  // ── PIX ──────────────────────────────────────────────────
  pixCopiaCola  = ''
  pixAguardando = false

  // ── Processando/Sucesso ──────────────────────────────────
  pagamentoStatus: 'loading' | 'success' = 'loading'
  checkOffset = 54

  // ── Dados ────────────────────────────────────────────────
  rows: Cliente[]  = []
  rowsProduto: Product[] = []
  produtosAdicionados: any[] = []

  // ── Lifecycle ────────────────────────────────────────────

  async created () {
    await this.carregarClientes()
  }

  async beforeDestroy () {
    if (this.vendaAtual?.id) {
      try { await vendasService.deletarVenda(this.vendaAtual.id) } catch { /* ignora */ }
    }
  }

  // ── Computed ─────────────────────────────────────────────

  get rowsFiltradas () {
    return this.rows.filter((c: Cliente) => {
      const nomeOk    = !this.nome      || c.nome_cliente.toLowerCase().startsWith(this.nome.toLowerCase())
      const codigoOk  = !this.codigo    || c.codigo_cliente?.toLowerCase().startsWith(this.codigo.toLowerCase())
      const docOk     = !this.documento || c.cpf?.includes(this.documento) || c.cnpj?.includes(this.documento)
      return nomeOk && codigoOk && docOk && c.status === 'Ativo'
    })
  }

  get rowsProdutoFiltradas () {
    return this.rowsProduto.filter((p: any) => {
      const nomeOk   = !this.nomeProduto    || p.nome_produto.toLowerCase().includes(this.nomeProduto.toLowerCase())
      const codigoOk = !this.codigoProduto  || p.codigo_produto?.toLowerCase().startsWith(this.codigoProduto.toLowerCase())
      return nomeOk && codigoOk
    })
  }

  get valorTotalNumerico (): number {
    return this.produtosAdicionados.reduce((acc, p) => acc + p.total, 0)
  }

  get valorBruto () {
    return this.valorTotalNumerico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  get descontoReais () {
    const total = this.produtosAdicionados.reduce((acc, p) => acc + (p.desconto || 0), 0)
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  get valorTotalVenda () {
    return this.valorTotalNumerico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  // ── Carregamento ─────────────────────────────────────────

  async carregarClientes () {
    try {
      this.rows = await clienteService.listarClientes()
    } catch {
      this.$q.notify({ type: 'negative', message: 'Erro ao carregar clientes!' })
    }
  }

  async carregarProdutos () {
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

  // ── Venda ────────────────────────────────────────────────

  async realizarVenda (row: any) {
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

  async adicionarProduto (row: any, quantidade = 1, desconto = 0) {
    try {
      await vendasService.adicionarItem({ venda_id: this.vendaAtual.id, produto_id: row.id, quantidade, desconto })
      const itens = await vendasService.listarItens(this.vendaAtual.id)
      this.atualizarCarrinho(itens)
      this.finalizacaoVenda = true
      this.drawerCarrinho = true
      this.$q.notify({ type: 'positive', message: 'Produto adicionado!' })
    } catch (err: any) {
      this.$q.notify({ type: 'negative', message: err.response?.data?.error || 'Erro ao adicionar produto' })
    }
  }

  async alterarQuantidade (item: any, novaQuantidade: number) {
    if (novaQuantidade < 1) return
    try {
      await vendasService.removerItem(item.item_id)
      await vendasService.adicionarItem({ venda_id: this.vendaAtual.id, produto_id: item.id, quantidade: novaQuantidade, desconto: item.desconto || 0 })
      const itens = await vendasService.listarItens(this.vendaAtual.id)
      this.atualizarCarrinho(itens)
    } catch {
      this.$q.notify({ type: 'negative', message: 'Erro ao alterar quantidade!' })
    }
  }

  async aplicarDesconto (item: any) {
    try {
      let desconto = 0
      if (item.tipoDesconto === 'percent') {
        desconto = (item.valorUnitario * item.quantidade) * (item.descontoInput / 100)
      } else {
        desconto = item.descontoInput || 0
      }
      await vendasService.removerItem(item.item_id)
      await vendasService.adicionarItem({ venda_id: this.vendaAtual.id, produto_id: item.id, quantidade: item.quantidade, desconto })
      const itens = await vendasService.listarItens(this.vendaAtual.id)
      this.atualizarCarrinho(itens)
    } catch {
      this.$q.notify({ type: 'negative', message: 'Erro ao aplicar desconto!' })
    }
  }

  atualizarCarrinho (itens: any[]) {
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

  async removerProduto (row: any) {
    try {
      await vendasService.removerItem(row.item_id)
      this.produtosAdicionados = this.produtosAdicionados.filter(p => p.item_id !== row.item_id)
      if (this.produtosAdicionados.length === 0) {
        this.finalizacaoVenda = false
        this.drawerCarrinho = false
      }
      this.$q.notify({ type: 'positive', message: 'Produto removido!' })
    } catch {
      this.$q.notify({ type: 'negative', message: 'Erro ao remover produto' })
    }
  }

  // ── Pagamento — fluxo ────────────────────────────────────

  abrirDialogPagamento () {
    if (this.produtosAdicionados.length === 0) {
      this.$q.notify({ type: 'warning', message: 'Adicione ao menos um produto!' })
      return
    }
    this.formaPagamentoSelecionada = ''
    this.dialogPagamento = true
  }

  continuarPagamento () {
    if (!this.formaPagamentoSelecionada) {
      this.$q.notify({ type: 'warning', message: 'Selecione a forma de pagamento!' })
      return
    }
    this.dialogPagamento = false

    if (this.formaPagamentoSelecionada === 'dinheiro') {
      this.valorRecebido = 0
      this.troco = 0
      this.dialogDinheiro = true
      return
    }

    if (this.formaPagamentoSelecionada === 'cartao') {
      this.dialogCartao = true
      return
    }

    if (this.formaPagamentoSelecionada === 'pix') {
      this.abrirPix()
    }
  }

  voltarParaPagamento () {
    this.dialogDinheiro = false
    this.dialogCartao   = false
    this.dialogPix      = false
    this.cancelarPix()
    this.dialogPagamento = true
  }

  // ── Dinheiro ─────────────────────────────────────────────

  calcularTroco () {
    this.troco = (this.valorRecebido || 0) - this.valorTotalNumerico
  }

  // ── PIX ──────────────────────────────────────────────────

  abrirPix () {
    this.pixCopiaCola  = this.gerarPixCopiaCola(this.valorTotalNumerico)
    this.pixAguardando = true
    this.dialogPix     = true
    this.$nextTick(() => {
      this.gerarQrCode()
    })
  }

  cancelarPix () {
    this.pixAguardando = false
    this.dialogPix = false
  }

  /**
   * Gera o payload PIX estático (BR Code) conforme o padrão do Banco Central.
   * Compatível com todos os bancos brasileiros.
   */
  gerarPixCopiaCola (valor: number): string {
    const chave     = PIX_CHAVE
    const nome      = PIX_NOME.substring(0, 25).padEnd(1).trim()
    const cidade    = PIX_CIDADE.substring(0, 15).padEnd(1).trim()
    const valorStr  = valor.toFixed(2)

    const merchantAccountInfo =
      this.tlv('00', 'BR.GOV.BCB.PIX') +
      this.tlv('01', chave)

    const payload =
      this.tlv('00', '01') +                              // Payload format indicator
      this.tlv('26', merchantAccountInfo) +               // Merchant account info
      this.tlv('52', '0000') +                            // Merchant category code
      this.tlv('53', '986') +                             // Currency BRL
      this.tlv('54', valorStr) +                          // Amount
      this.tlv('58', 'BR') +                              // Country
      this.tlv('59', nome) +                              // Merchant name
      this.tlv('60', cidade) +                            // Merchant city
      this.tlv('62', this.tlv('05', '***'))               // Additional data (txid)

    return payload + this.tlv('63', this.crc16(payload + '6304'))
  }

  /** TLV helper: Tag-Length-Value no formato PIX */
  tlv (id: string, value: string): string {
    const len = value.length.toString().padStart(2, '0')
    return `${id}${len}${value}`
  }

  /** CRC-16/CCITT-FALSE conforme especificação BACEN */
  crc16 (str: string): string {
    let crc = 0xFFFF
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8
      for (let j = 0; j < 8; j++) {
        crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1
        crc &= 0xFFFF
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0')
  }

  async gerarQrCode () {
    const canvas = this.$refs.qrCanvas as HTMLCanvasElement
    if (!canvas) return
    try {
      await QRCode.toCanvas(canvas, this.pixCopiaCola, {
        width: 200,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' }
      })
    } catch (e) {
      console.error('Erro ao gerar QR Code PIX:', e)
    }
  }

  copiarPix () {
    navigator.clipboard.writeText(this.pixCopiaCola).then(() => {
      this.$q.notify({ type: 'positive', message: 'Código PIX copiado!' })
    })
  }

  // ── Finalizar pagamento ───────────────────────────────────

  async confirmarPagamento () {
    try {
      this.carregando = true
      this.dialogDinheiro = false
      this.dialogCartao   = false
      this.dialogPix      = false
      this.pixAguardando  = false

      this.pagamentoStatus = 'loading'
      this.checkOffset     = 54
      this.dialogProcessando = true

      await vendasService.finalizarVenda(this.vendaAtual.id, this.formaPagamentoSelecionada)

      this.pagamentoStatus = 'success'
      setTimeout(() => { this.checkOffset = 0 }, 50)

    } catch {
      this.dialogProcessando = false
      this.$q.notify({ type: 'negative', message: 'Erro ao finalizar venda!' })
    } finally {
      this.carregando = false
    }
  }

  irParaNotaFiscal () {
    this.dialogProcessando = false
    this.limparTela()
    this.$router.push('/NotaFiscalSaida')
  }

  // ── Cancelar ─────────────────────────────────────────────

  abrirDialogCancelar () { this.dialogCancelar = true }

  async confirmarCancelamento () {
    if (this.vendaAtual?.id) {
      try { await vendasService.deletarVenda(this.vendaAtual.id) } catch { /* ignora */ }
    }
    this.dialogCancelar = false
    this.limparTela()
  }

  // ── Utilitários ──────────────────────────────────────────

  limparTela () {
    this.procurarProduto  = false
    this.finalizacaoVenda = false
    this.drawerCarrinho   = false
    this.produtosAdicionados = []
    this.clienteSelecionado = null
    this.vendaAtual = null
    this.limparCampos()
  }

  limparCampos () {
    this.codigo = ''
    this.nome   = ''
    this.documento  = ''
    this.codigoProduto = ''
    this.nomeProduto   = ''
  }

  refreshTable () { this.limparCampos() }

  formatarReais (valor: string | number): string {
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  formatarDocumento (row: any): string {
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
.border  { border: 1px solid #ccc; }

@keyframes spin {
  to { transform: rotate(360deg); }
}
.spinner-svg {
  animation: spin 0.9s linear infinite;
  transform-origin: center;
}
</style>
