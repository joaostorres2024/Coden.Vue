<template>
  <div class="q-pa-md">

    <!-- Cabeçalho -->
    <div class="text-bold text-black row items-center integ-cabecalho" style="font-size:28px">
      <q-icon name="webhook" class="q-mr-md text-primary" size="28px" />Integrações
    </div>
    <p class="text-grey-7 text-body2 q-mb-md integ-subtitulo">
      Conecte e gerencie integrações com marketplaces e outras plataformas para sincronizar produtos, preços e pedidos automaticamente.
    </p>
    <q-separator class="q-mb-lg" />

    <!-- TELA 1: LISTA DE MARKETPLACES -->
    <div v-if="tela === 'inicio'" class="integ-tela-inicio">
      <div class="row items-center justify-between q-gutter-sm integ-busca">
        <q-input
          class="col-3"
          label="Pesquise pelo nome da integração"
          outlined
          v-model="busca"
          dense
          input-id="integ-input-busca"
        />
      </div>

      <div class="q-mt-lg">

        <!-- Minhas Integrações -->
        <div class="integ-minhas">
          <div class="text-bold q-pb-md" style="font-size: 18px">Minhas Integrações</div>
          <div v-if="minhasIntegracoes.length" class="row q-col-gutter-md integ-minhas-lista">
            <div v-for="m in minhasIntegracoes" :key="m.nome" class="col-12 col-sm-6 col-md-3">
              <q-card class="column items-center q-pa-lg b-r-16 border no-shadow mp-card integ-card-conectado">
                <q-inner-loading :showing="verificandoConexao" />
                <img :src="m.logo" class="mp-logo q-mb-md" />
                <p class="text-bold q-ma-none text-center" style="font-size: 22px;">{{ m.nome }}</p>
                <p class="text-body2 text-grey-6 q-mt-xs q-mb-md">{{ m.tipo }}</p>
                <q-badge color="positive" class="q-mb-md q-px-sm q-py-xs integ-badge-conectado">
                  <q-icon name="circle" size="8px" class="q-mr-xs" />
                  Conectado
                </q-badge>
                <q-btn
                  label="Gerenciar"
                  unelevated
                  class="bg-primary text-white full-width integ-btn-gerenciar"
                  style="border-radius: 8px"
                  @click="irParaDashboard(m)"
                />
              </q-card>
            </div>
          </div>
          <div v-else class="text-grey-6">Nenhuma integração conectada ainda.</div>
        </div>

        <!-- Integrações disponíveis -->
        <div class="q-mt-xl integ-disponiveis">
          <div class="text-bold q-pb-md" style="font-size: 18px">Integrações disponíveis</div>
          <div v-if="integracoesDisponiveis.length" class="row q-col-gutter-md integ-disponiveis-lista">
            <div v-for="m in integracoesDisponiveis" :key="m.nome" class="col-12 col-sm-6 col-md-3">
              <q-card class="column items-center q-pa-lg b-r-16 border no-shadow mp-card integ-card-disponivel">
                <img :src="m.logo" class="mp-logo q-mb-md" />
                <p class="text-bold q-ma-none text-center" style="font-size: 22px;">{{ m.nome }}</p>
                <p class="text-body2 text-grey-6 q-mt-xs" :class="m.emBreve ? 'q-mb-md' : 'q-mb-lg'">{{ m.tipo }}</p>
                <q-badge v-if="m.emBreve" color="positive" class="q-mb-md q-px-sm q-py-xs">
                  Em breve
                </q-badge>
                <q-btn
                  :label="m.emBreve ? 'Indisponível' : 'Adicionar'"
                  unelevated
                  :disable="m.emBreve"
                  class="bg-primary text-white full-width integ-btn-adicionar"
                  style="border-radius: 8px"
                  @click="!m.emBreve && irParaConectar(m)"
                />
              </q-card>
            </div>
          </div>
          <div v-else class="text-grey-6">Nenhuma integração disponível encontrada.</div>
        </div>

      </div>
    </div>

    <!-- TELA 2: CONECTAR -->
    <div v-if="tela === 'conectar'" class="integ-tela-conectar">
      <div class="row items-center q-gutter-md q-mb-md">
        <img :src="marketplaceSelecionado.logo" style="width: 40px" alt="" />
        <div class="text-bold text-h5">Integração com {{ marketplaceSelecionado.nome }}</div>
      </div>
      <div class="row q-gutter-sm q-mt-md integ-conectar-form">
        <q-input
          class="col-4"
          label="Nome da Integração"
          v-model="formularioIntegracao.nome"
          outlined
          dense
          input-id="integ-input-nome-integracao"
        />
        <q-btn
          id="integ-btn-conectar"
          class="bg-primary text-white integ-btn-conectar"
          unelevated
          :loading="carregando"
          :label="'Conectar com ' + marketplaceSelecionado.nome"
          @click="conectarML()"
        />
      </div>
      <div class="q-py-md q-pl-xs" style="font-size: 15px">
        <p>
          Ao clicar no botão, você será redirecionado para a página do
          {{ marketplaceSelecionado.nome }} para realizar a autenticação e conectar sua conta com segurança.
        </p>
      </div>
      <div class="row justify-start">
        <q-btn
          id="integ-btn-cancelar-conectar"
          class="integ-btn-cancelar-conectar"
          label="Cancelar"
          color="negative"
          unelevated
          @click="abrirDialogCancelar()"
        />
      </div>
    </div>

    <!-- TELA 3: DASHBOARD -->
    <div v-if="tela === 'dashboard'" class="integ-tela-dashboard">
      <div class="row items-center justify-between q-mb-md integ-dashboard-cabecalho">
        <div class="row items-center q-gutter-md">
          <img :src="marketplaceSelecionado.logo" style="width: 40px" alt="" />
          <div>
            <div class="text-h6 text-bold">{{ marketplaceSelecionado.nome }}</div>
            <q-badge color="positive" text-color="white" class="q-px-sm q-py-xs integ-badge-status">
              <q-icon name="circle" size="10px" class="q-mr-xs" />
              Conectado
            </q-badge>
          </div>
        </div>
      </div>

      <q-tabs
        v-model="abaAtiva"
        dense
        align="left"
        active-color="primary"
        indicator-color="primary"
        class="q-mb-md integ-tabs"
      >
        <q-tab id="integ-tab-dashboard" class="integ-tab-dashboard" name="dashboard" label="Dashboard" />
        <q-tab id="integ-tab-produtos" class="integ-tab-produtos" name="produtos" label="Produtos" />
        <q-tab id="integ-tab-pedidos" class="integ-tab-pedidos" name="pedidos" label="Pedidos" />
        <q-tab id="integ-tab-notafiscal" class="integ-tab-notafiscal" name="notafiscal" label="Nota Fiscal" />
        <q-tab id="integ-tab-config" class="integ-tab-config" name="config" label="Configurações" />
      </q-tabs>

      <q-tab-panels v-model="abaAtiva" animated class="integ-tab-panels">

        <!-- ABA: DASHBOARD -->
        <q-tab-panel name="dashboard" class="q-pa-none integ-panel-dashboard">
          <div class="row q-col-gutter-md q-mb-md items-center integ-dashboard-filtros">
            <div class="col-auto">
              <q-input
                v-model="inicioPeriodoStr"
                label="Data início"
                outlined
                dense
                mask="##/##/####"
                placeholder="DD/MM/AAAA"
                input-id="integ-input-periodo-inicio"
                class="integ-input-periodo-inicio"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy>
                      <q-date v-model="inicioPeriodoStr" mask="DD/MM/YYYY" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-auto">
              <q-input
                v-model="fimPeriodoStr"
                label="Data fim"
                outlined
                dense
                mask="##/##/####"
                placeholder="DD/MM/AAAA"
                input-id="integ-input-periodo-fim"
                class="integ-input-periodo-fim"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy>
                      <q-date v-model="fimPeriodoStr" mask="DD/MM/YYYY" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-auto">
              <q-btn
                id="integ-btn-filtrar-dashboard"
                class="integ-btn-filtrar-dashboard"
                label="Filtrar"
                unelevated
                color="primary"
                icon="filter_list"
                @click="aplicarFiltroDashboard"
              />
            </div>
          </div>

          <!-- Cards de métricas -->
          <div class="row q-col-gutter-md q-mb-md integ-dashboard-metricas">
            <div class="col-6 col-md-2">
              <q-card class="no-shadow border b-r-10 q-pa-md integ-card-total-produtos">
                <div class="text-h5 text-bold integ-valor-total-produtos">{{ totalProdutos }}</div>
                <div class="text-caption text-grey-6">Produtos Sincronizados</div>
              </q-card>
            </div>
            <div class="col-6 col-md-2">
              <q-card class="no-shadow border b-r-10 q-pa-md integ-card-total-pedidos">
                <div class="text-h5 text-bold integ-valor-total-pedidos">{{ totalPedidosDoPeriodo }}</div>
                <div class="text-caption text-grey-6">Total de Pedidos</div>
              </q-card>
            </div>
            <div class="col-6 col-md-2">
              <q-card class="no-shadow border b-r-10 q-pa-md integ-card-pedidos-concluidos">
                <div class="text-h5 text-bold text-positive integ-valor-pedidos-concluidos">{{ pedidosConcluidosDoPeriodo }}</div>
                <div class="text-caption text-grey-6">Concluídos</div>
              </q-card>
            </div>
            <div class="col-6 col-md-2">
              <q-card class="no-shadow border b-r-10 q-pa-md integ-card-pedidos-cancelados">
                <div class="text-h5 text-bold text-negative integ-valor-pedidos-cancelados">{{ pedidosCanceladosDoPeriodo }}</div>
                <div class="text-caption text-grey-6">Cancelados</div>
              </q-card>
            </div>
            <div class="col-6 col-md-4">
              <q-card class="no-shadow border b-r-10 q-pa-md integ-card-receita">
                <div class="text-h5 text-bold integ-valor-receita">{{ receitaTotalDoPeriodo }}</div>
                <div class="text-caption text-grey-6">Receita Total</div>
              </q-card>
            </div>
          </div>

          <div class="row items-center justify-between integ-dashboard-token">
            <div class="text-caption text-grey-6">
              Token expira em: <strong class="text-black integ-token-expiracao">{{ tokenExpiraEm }}</strong>
            </div>
            <q-btn
              id="integ-btn-renovar-token"
              class="bg-primary text-white integ-btn-renovar-token"
              label="Renovar token"
              unelevated
            />
          </div>
        </q-tab-panel>

        <!-- ABA: PRODUTOS -->
        <q-tab-panel name="produtos" class="q-pa-none integ-panel-produtos">
          <div class="row items-center justify-between q-mb-md q-gutter-sm integ-produtos-acoes">
            <q-input
              v-model="buscaProduto"
              label="Pesquisar produto..."
              outlined
              dense
              style="min-width: 240px"
              input-id="integ-input-busca-produto"
              class="integ-input-busca-produto"
            >
              <template v-slot:prepend><q-icon name="search" /></template>
            </q-input>
            <div class="row q-gutter-sm items-center">
              <q-select
                v-model="filtroProduto"
                :options="[
                  { label: 'Todos os status', value: 'todos' },
                  { label: 'Ativo', value: 'active' },
                  { label: 'Pausado', value: 'paused' },
                  { label: 'Encerrado', value: 'closed' }
                ]"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                outlined
                dense
                style="min-width: 160px"
                id="integ-select-filtro-produto"
                class="integ-select-filtro-produto"
              />
              <q-btn
                id="integ-btn-publicar-selecionados"
                class="integ-btn-publicar-selecionados"
                label="Publicar selecionados"
                unelevated
                color="primary"
              />
            </div>
          </div>

          <q-card class="no-shadow border b-r-10 integ-tabela-produtos-card">
            <q-inner-loading :showing="carregandoProdutos" />
            <q-table
              flat
              :data="produtosFiltrados"
              :columns="colunaProdutosMercadoLivre"
              :hide-bottom="produtosFiltrados.length > 0"
              bordered
              no-data-label="Nenhum registro encontrado"
              class="text-weight-medium integ-tabela-produtos"
            >
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge :color="props.value === 'active' ? 'positive' : props.value === 'paused' ? 'orange' : 'negative'" class="integ-badge-produto-status">
                    {{ props.value === 'active' ? 'Ativo' : props.value === 'paused' ? 'Pausado' : props.value }}
                  </q-badge>
                </q-td>
              </template>
              <template v-slot:body-cell-price="props">
                <q-td :props="props" align="center">{{ formatarReais(props.row.price) }}</q-td>
              </template>
              <template v-slot:body-cell-acoes="props">
                <q-td :props="props">
                  <q-btn flat dense icon="pause" color="dark-blue" class="integ-btn-pausar-produto" @click="pausarProduto(props.row.id)" v-if="props.row.status === 'active'" />
                  <q-btn flat dense icon="play_arrow" color="dark-blue" class="integ-btn-ativar-produto" @click="ativarProduto(props.row.id)" v-if="props.row.status === 'paused'" />
                  <q-btn flat dense icon="open_in_new" color="primary" class="integ-btn-ver-produto" :href="props.row.permalink" target="_blank" />
                </q-td>
              </template>
            </q-table>
          </q-card>
        </q-tab-panel>

        <!-- ABA: PEDIDOS -->
        <q-tab-panel name="pedidos" class="q-pa-none integ-panel-pedidos">
          <div class="row items-center justify-between q-mb-md q-gutter-sm flex-wrap integ-pedidos-acoes">
            <q-input
              v-model="buscaPedido"
              label="Pesquisar pedido..."
              outlined
              dense
              style="min-width: 240px"
              input-id="integ-input-busca-pedido"
              class="integ-input-busca-pedido"
            >
              <template v-slot:prepend><q-icon name="search" /></template>
            </q-input>

            <q-input
              v-model="inicioPedidoStr"
              label="Data início"
              type="date"
              outlined
              dense
              style="min-width: 150px"
              input-id="integ-input-pedido-inicio"
              class="integ-input-pedido-inicio"
            />

            <q-input
              v-model="fimPedidoStr"
              label="Data fim"
              outlined
              dense
              type="date"
              style="min-width: 150px"
              input-id="integ-input-pedido-fim"
              class="integ-input-pedido-fim"
            />

            <div class="row q-gutter-sm items-center">
              <q-select
                v-model="filtroPedido"
                :options="[
                  { label: 'Todos os status', value: 'todos' },
                  { label: 'Pago', value: 'paid' },
                  { label: 'Pendente', value: 'pending' },
                  { label: 'Cancelado', value: 'cancelled' }
                ]"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                outlined
                dense
                style="min-width: 160px"
                id="integ-select-filtro-pedido"
                class="integ-select-filtro-pedido"
              />
              <q-btn
                id="integ-btn-sincronizar-pedidos"
                class="integ-btn-sincronizar-pedidos"
                label="Sincronizar pedidos"
                unelevated
                color="primary"
                icon="sync"
                @click="carregarPedidos()"
              />
            </div>
          </div>

          <q-card class="no-shadow border b-r-10 integ-tabela-pedidos-card">
            <q-inner-loading :showing="carregandoPedidos" />
            <q-table
              flat
              :data="pedidosFiltrados"
              :columns="colunasPedidos"
              :hide-bottom="pedidosFiltrados.length > 0"
              bordered
              no-data-label="Nenhum pedido encontrado"
              class="text-weight-medium integ-tabela-pedidos"
            >
              <template v-slot:body-cell-comprador="props">
                <q-td :props="props">{{ props.row.buyer ? props.row.buyer.nickname : '-' }}</q-td>
              </template>
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge :color="props.value === 'paid' ? 'positive' : props.value === 'pending' ? 'orange' : 'negative'" class="integ-badge-pedido-status">
                    {{ props.value === 'paid' ? 'Pago' : props.value === 'pending' ? 'Pendente' : 'Cancelado' }}
                  </q-badge>
                </q-td>
              </template>
              <template v-slot:body-cell-total="props">
                <q-td :props="props" align="center">{{ formatarReais(props.row.total_amount) }}</q-td>
              </template>
              <template v-slot:body-cell-data="props">
                <q-td :props="props" align="center">{{ formatarData(props.row.date_created) }}</q-td>
              </template>
              <template v-slot:body-cell-acoes="props">
                <q-td :props="props">
                  <q-btn flat dense icon="open_in_new" color="primary" class="integ-btn-ver-pedido" :href="props.row.permalink" target="_blank" />
                </q-td>
              </template>
            </q-table>
          </q-card>
        </q-tab-panel>

        <!-- ABA: NOTA FISCAL -->
        <q-tab-panel name="notafiscal" class="q-pa-none integ-panel-notafiscal">
          <div class="row items-center justify-between q-mb-md q-gutter-sm integ-nf-acoes">
            <q-input
              v-model="buscaNF"
              label="Pesquisar nota fiscal..."
              outlined
              dense
              style="min-width: 240px"
              input-id="integ-input-busca-nf"
              class="integ-input-busca-nf"
            >
              <template v-slot:prepend><q-icon name="search" /></template>
            </q-input>
            <div class="row q-gutter-sm items-center">
              <q-select
                v-model="filtroNF"
                :options="[
                  { label: 'Todos os status', value: 'todos' },
                  { label: 'Emitida', value: 'emitida' },
                  { label: 'Pendente', value: 'pendente' },
                  { label: 'Cancelada', value: 'cancelada' }
                ]"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                outlined
                dense
                style="min-width: 160px"
                id="integ-select-filtro-nf"
                class="integ-select-filtro-nf"
              />
              <q-btn
                id="integ-btn-emitir-nfe"
                class="integ-btn-emitir-nfe"
                label="Emitir NF-e"
                unelevated
                color="primary"
                icon="receipt_long"
              />
            </div>
          </div>

          <q-card class="no-shadow border b-r-10 integ-tabela-nf-card">
            <q-table
              flat
              :data="notasFiscaisFiltradas"
              :columns="colunasNotaFiscal"
              :hide-bottom="notasFiscaisFiltradas.length > 0"
              bordered
              no-data-label="Nenhuma nota fiscal encontrada"
              class="text-weight-medium integ-tabela-nf"
            >
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge :color="props.value === 'emitida' ? 'positive' : props.value === 'pendente' ? 'orange' : 'negative'" class="integ-badge-nf-status">
                    {{ props.value === 'emitida' ? 'Emitida' : props.value === 'pendente' ? 'Pendente' : 'Cancelada' }}
                  </q-badge>
                </q-td>
              </template>
              <template v-slot:body-cell-valor="props">
                <q-td :props="props" align="center">{{ formatarReais(props.row.valor) }}</q-td>
              </template>
              <template v-slot:body-cell-acoes="props">
                <q-td :props="props">
                  <q-btn flat dense icon="download" color="primary" class="integ-btn-baixar-xml" title="Baixar XML" />
                  <q-btn flat dense icon="picture_as_pdf" color="secondary" class="integ-btn-baixar-danfe" title="Baixar DANFE" />
                  <q-btn flat dense icon="cancel" color="negative" class="integ-btn-cancelar-nf" title="Cancelar NF" v-if="props.row.status === 'emitida'" />
                </q-td>
              </template>
            </q-table>
          </q-card>
        </q-tab-panel>

        <!-- ABA: CONFIGURAÇÕES -->
        <q-tab-panel name="config" class="q-pa-none integ-panel-config">
          <q-card class="no-shadow border b-r-10 q-pa-md q-mb-md integ-config-sincronizacao">
            <div class="text-caption text-grey-6 q-mb-md">SINCRONIZAÇÃO</div>
            <div class="column q-gutter-sm">
              <q-toggle
                v-model="config.sincEstoque"
                label="Sincronizar estoque automaticamente"
                color="primary"
                class="integ-toggle-sinc-estoque"
              />
              <q-toggle
                v-model="config.sincPrecos"
                label="Sincronizar preços automaticamente"
                color="primary"
                class="integ-toggle-sinc-precos"
              />
              <q-toggle
                v-model="config.publicarAuto"
                label="Publicar novos produtos automaticamente"
                color="primary"
                class="integ-toggle-publicar-auto"
              />
              <q-separator class="q-my-sm" />
              <div class="row items-center q-gutter-md">
                <span class="text-body2 text-grey-7">Frequência de sincronização</span>
                <q-select
                  v-model="config.frequencia"
                  :options="opcoesFrequencia"
                  outlined
                  dense
                  style="min-width: 200px"
                  id="integ-select-frequencia"
                  class="integ-select-frequencia"
                />
              </div>
            </div>
          </q-card>

          <q-card class="no-shadow border b-r-10 q-pa-md q-mb-md integ-config-preco">
            <div class="text-caption text-grey-6 q-mb-md">REGRAS DE PREÇO</div>
            <div class="row q-gutter-md items-center">
              <q-select
                v-model="config.tipoAjuste"
                :options="opcoesTipoAjuste"
                label="Tipo de ajuste"
                outlined
                dense
                class="col-3 integ-select-tipo-ajuste"
                id="integ-select-tipo-ajuste"
              />
              <q-input
                v-model="config.valorAjuste"
                label="Valor (%)"
                type="number"
                outlined
                dense
                class="col-2"
                input-id="integ-input-valor-ajuste"
              />
              <span class="text-caption text-grey-6">
                Ex: produto R$100 → R${{ 100 + Number(config.valorAjuste) }} no {{ marketplaceSelecionado.nome }}
              </span>
            </div>
          </q-card>

          <q-card class="no-shadow border b-r-10 q-pa-md q-mb-md integ-config-categorias">
            <div class="text-caption text-grey-6 q-mb-md">MAPEAMENTO DE CATEGORIAS</div>
            <div class="column q-gutter-sm">
              <div v-for="(cat, i) in config.categorias" :key="i" class="row items-center q-gutter-md integ-categoria-item">
                <span class="text-body2 text-grey-7" style="min-width: 140px">{{ cat.origem }}</span>
                <q-icon name="arrow_forward" color="grey-5" />
                <q-select
                  v-model="cat.destino"
                  :options="cat.opcoes"
                  outlined
                  dense
                  style="min-width: 220px"
                  class="integ-select-categoria-destino"
                />
              </div>
            </div>
          </q-card>

          <q-card class="no-shadow border b-r-10 q-pa-md q-mb-md integ-config-desconectar">
            <div class="text-caption text-grey-6 q-mb-md">DESCONECTAR INTEGRAÇÃO</div>
            <q-btn
              id="integ-btn-desconectar"
              class="bg-negative text-white integ-btn-desconectar"
              unelevated
              label="Desconectar"
              @click="desconectar()"
            />
          </q-card>

          <div class="row justify-start q-gutter-sm integ-config-acoes">
            <q-btn
              id="integ-btn-cancelar-config"
              class="integ-btn-cancelar-config text-grey-7"
              label="Cancelar"
              flat
            />
            <q-btn
              id="integ-btn-salvar-config"
              class="integ-btn-salvar-config"
              label="Salvar configurações"
              unelevated
              color="primary"
            />
          </div>
        </q-tab-panel>

      </q-tab-panels>
    </div>

    <!-- Dialog Cancelar -->
    <q-dialog v-model="dialogCancelar" persistent class="integ-dialog-cancelar">
      <q-card style="min-width: 380px; border-radius: 12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Cancelar operação</div>
        </q-card-section>
        <q-card-section class="text-grey-7" style="font-size: 14px">
          Deseja realmente cancelar? As alterações não salvas serão perdidas.
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn
            id="integ-dialog-cancelar-voltar"
            class="integ-dialog-cancelar-voltar"
            label="Voltar"
            unelevated
            style="border: 1px solid #ccc; border-radius: 8px; min-width: 100px"
            color="white"
            text-color="dark"
            v-close-popup
          />
          <q-btn
            id="integ-dialog-cancelar-confirmar"
            class="integ-dialog-cancelar-confirmar"
            label="Sim, Cancelar"
            unelevated
            color="negative"
            style="border-radius: 8px; min-width: 130px"
            @click="confirmarCancelamento()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Desconectar -->
    <q-dialog v-model="dialogDesconectar" persistent class="integ-dialog-desconectar">
      <q-card style="min-width: 380px; border-radius: 12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Desconectar integração</div>
        </q-card-section>
        <q-card-section class="text-grey-7" style="font-size: 14px">
          Deseja desconectar a integração com <strong>{{ marketplaceSelecionado?.nome }}</strong>? Isso interromperá a sincronização.
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn
            id="integ-dialog-desconectar-voltar"
            class="integ-dialog-desconectar-voltar"
            label="Voltar"
            unelevated
            style="border: 1px solid #ccc; border-radius: 8px; min-width: 100px"
            color="white"
            text-color="dark"
            v-close-popup
          />
          <q-btn
            id="integ-dialog-desconectar-confirmar"
            class="integ-dialog-desconectar-confirmar"
            label="Sim, Desconectar"
            unelevated
            color="negative"
            style="border-radius: 8px; min-width: 130px"
            @click="confirmarDesconexao()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import gridProdutosMercadoLivre from '../config/produtosMercadoLivre.json'
import mlService, { StatusML, ProdutoML, PedidoML } from '../services/mlService'
import moment from 'moment'

@Component
export default class ModuleComponent extends Vue {
  tela: 'inicio' | 'conectar' | 'dashboard' = 'inicio'
  abaAtiva = 'dashboard'
  dialogCancelar = false
  dialogDesconectar = false
  carregando = false

  // ─── PERÍODO DASHBOARD ────────────────────────────────────────────────────
  // Datas reativas usadas pelos computeds do dashboard
  inicioPeriodo = moment().startOf('month')
  fimPeriodo = moment().endOf('month')

  // Strings dos inputs (só são aplicadas ao clicar em "Filtrar")
  inicioPeriodoStr = moment().startOf('month').format('DD/MM/YYYY')
  fimPeriodoStr = moment().endOf('month').format('DD/MM/YYYY')

  marketplaceSelecionado: any = null
  statusML: StatusML | null = null
  verificandoConexao = false

  formularioIntegracao: any = { nome: '' }

  busca = ''

  // ─── PRODUTOS ─────────────────────────────────────────────────────────────
  buscaProduto = ''
  filtroProduto = 'todos'
  carregandoProdutos = false
  produtos: ProdutoML[] = []
  totalProdutos = 0

  // ─── PEDIDOS ──────────────────────────────────────────────────────────────
  buscaPedido = ''
  filtroPedido = 'todos'
  // Filtro de data específico da aba Pedidos (aplicado em tempo real)
  inicioPedidoStr = ''
  fimPedidoStr = ''
  carregandoPedidos = false
  pedidos: PedidoML[] = []
  totalPedidos = 0

  // ─── NOTA FISCAL ──────────────────────────────────────────────────────────
  buscaNF = ''
  filtroNF = 'todos'
  notasFiscais: any[] = []
  totalNotasFiscais = 0

  colunaProdutosMercadoLivre = gridProdutosMercadoLivre.columns

  colunasPedidos = [
    { name: 'id',         label: 'Nº Pedido',  field: 'id',           align: 'left'   },
    { name: 'comprador',  label: 'Comprador',  field: 'comprador',    align: 'left'   },
    { name: 'status',     label: 'Status',     field: 'status',       align: 'center' },
    { name: 'total',      label: 'Total',      field: 'total_amount', align: 'center' },
    { name: 'data',       label: 'Data',       field: 'date_created', align: 'center' },
    { name: 'acoes',      label: 'Ações',      field: 'acoes',        align: 'center' }
  ]

  colunasNotaFiscal = [
    { name: 'numero',       label: 'Nº NF-e',       field: 'numero',       align: 'left'   },
    { name: 'pedido',       label: 'Pedido',         field: 'pedido',       align: 'left'   },
    { name: 'destinatario', label: 'Destinatário',   field: 'destinatario', align: 'left'   },
    { name: 'valor',        label: 'Valor',          field: 'valor',        align: 'center' },
    { name: 'status',       label: 'Status',         field: 'status',       align: 'center' },
    { name: 'emissao',      label: 'Emissão',        field: 'emissao',      align: 'center' },
    { name: 'acoes',        label: 'Ações',          field: 'acoes',        align: 'center' }
  ]

  config = {
    sincEstoque:  true,
    sincPrecos:   true,
    publicarAuto: false,
    frequencia:   'A cada 1 hora',
    tipoAjuste:   'Markup (%)',
    valorAjuste:  10,
    categorias:   [] as any[]
  }

  opcoesFrequencia = ['A cada 30 minutos', 'A cada 1 hora', 'A cada 4 horas', 'Diariamente']
  opcoesTipoAjuste = ['Sem ajuste', 'Markup (%)', 'Desconto (%)', 'Preço fixo']

  marketplaces = [
    {
      nome: 'Mercado Livre',
      tipo: 'Marketplace',
      conectado: false,
      emBreve: false,
      logo: 'https://cdn.iconscout.com/icon/free/png-256/free-mercado-livre-icon-svg-download-png-14549372.png'
    }
  ]

  // ─── LIFECYCLE ─────────────────────────────────────────────────────────────

  async created () {
    await this.verificarConexaoML()
  }

  // ─── COMPUTED ──────────────────────────────────────────────────────────────

  get marketplacesFiltrados () {
    if (!this.busca) return this.marketplaces
    return this.marketplaces.filter(m =>
      m.nome.toLowerCase().startsWith(this.busca.toLowerCase())
    )
  }

  get minhasIntegracoes () {
    return this.marketplacesFiltrados.filter(m => m.conectado)
  }

  get integracoesDisponiveis () {
    return this.marketplacesFiltrados.filter(m => !m.conectado)
  }

  get produtosFiltrados () {
    return this.produtos.filter(p => {
      const matchBusca = !this.buscaProduto ||
        p.title.toLowerCase().includes(this.buscaProduto.toLowerCase())
      const matchFiltro = this.filtroProduto === 'todos' || p.status === this.filtroProduto
      return matchBusca && matchFiltro
    })
  }

  // Pedidos filtrados: busca por texto + status + intervalo de datas (aplicado em tempo real)
  get pedidosFiltrados () {
    const inicio = this.inicioPedidoStr
      ? moment(this.inicioPedidoStr, 'DD/MM/YYYY')
      : null
    const fim = this.fimPedidoStr
      ? moment(this.fimPedidoStr, 'DD/MM/YYYY')
      : null

    return this.pedidos.filter((p: any) => {
      const matchBusca = !this.buscaPedido ||
        String(p.id).toLowerCase().includes(this.buscaPedido.toLowerCase()) ||
        ((p.buyer?.nickname ?? '').toLowerCase().includes(this.buscaPedido.toLowerCase()))

      const matchFiltro = this.filtroPedido === 'todos' || p.status === this.filtroPedido

      let matchData = true
      if (inicio?.isValid() || fim?.isValid()) {
        const data = moment(p.date_created)
        if (inicio?.isValid()) matchData = matchData && data.isSameOrAfter(inicio, 'day')
        if (fim?.isValid())    matchData = matchData && data.isSameOrBefore(fim, 'day')
      }

      return matchBusca && matchFiltro && matchData
    })
  }

  get notasFiscaisFiltradas () {
    return this.notasFiscais.filter((nf: any) => {
      const matchBusca = !this.buscaNF ||
        String(nf.numero).toLowerCase().includes(this.buscaNF.toLowerCase()) ||
        (nf.destinatario || '').toLowerCase().includes(this.buscaNF.toLowerCase())
      const matchFiltro = this.filtroNF === 'todos' || nf.status === this.filtroNF
      return matchBusca && matchFiltro
    })
  }

  get tokenExpiraEm () {
    if (!this.statusML?.expira_em) return '-'
    return new Date(this.statusML.expira_em).toLocaleDateString('pt-BR')
  }

  // ─── COMPUTEDS DO PERÍODO (DASHBOARD) ─────────────────────────────────────
  // Dependem de inicioPeriodo / fimPeriodo, que só são atualizados ao clicar "Filtrar"

  get pedidosDoPeriodo () {
    return this.pedidos.filter((p: any) => {
      if (!p.date_created) return false
      const data = moment(p.date_created)
      return (
        data.isSameOrAfter(this.inicioPeriodo, 'day') &&
        data.isSameOrBefore(this.fimPeriodo, 'day')
      )
    })
  }

  get totalPedidosDoPeriodo () {
    return this.pedidosDoPeriodo.length
  }

  get pedidosConcluidosDoPeriodo () {
    return this.pedidosDoPeriodo.filter((p: any) => p.status === 'paid').length
  }

  get pedidosCanceladosDoPeriodo () {
    return this.pedidosDoPeriodo.filter((p: any) => p.status === 'cancelled').length
  }

  get receitaTotalDoPeriodo () {
    const total = this.pedidosDoPeriodo
      .filter((p: any) => p.status === 'paid')
      .reduce((acc: number, p: any) => acc + Number(p.total_amount || 0), 0)
    return this.formatarReais(total)
  }

  // ─── MÉTODOS ───────────────────────────────────────────────────────────────

  // Aplica o filtro de período do Dashboard (chamado pelo botão "Filtrar")
  aplicarFiltroDashboard () {
    const inicio = moment(this.inicioPeriodoStr, 'DD/MM/YYYY')
    const fim    = moment(this.fimPeriodoStr,    'DD/MM/YYYY')
    if (inicio.isValid()) this.inicioPeriodo = inicio
    if (fim.isValid())    this.fimPeriodo    = fim
  }

  formatarReais (valor: string | number): string {
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor
    if (isNaN(numero)) return 'R$ 0,00'
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  formatarData (valor: string): string {
    if (!valor) return '-'
    const data = moment(valor)
    return data.isValid() ? data.format('DD/MM/YYYY') : valor
  }

  async verificarConexaoML () {
    const index = this.marketplaces.findIndex(m => m.nome === 'Mercado Livre')
    try {
      this.statusML = await mlService.getStatus()
      Vue.set(this.marketplaces, index, {
        ...this.marketplaces[index],
        conectado: this.statusML.conectado ?? false
      })
      if (this.statusML?.conectado) {
        await this.carregarProdutos()
        await this.carregarPedidos()
      }
    } catch {
      Vue.set(this.marketplaces, index, {
        ...this.marketplaces[index],
        conectado: false
      })
    }
  }

  async irParaConectar (marketplace: any) {
    this.marketplaceSelecionado = marketplace
    this.formularioIntegracao   = { nome: marketplace.nome }
    this.tela = 'conectar'
  }

  async conectarML () {
    try {
      this.verificandoConexao = true
      const url = await mlService.getLoginUrl()

      this.$q.dialog({
        title:   'Conectar Mercado Livre',
        message: 'Uma janela de autenticação será aberta. Caso queira conectar uma conta diferente, certifique-se de estar deslogado do Mercado Livre antes de continuar.',
        ok:     { label: 'Continuar', color: 'primary', unelevated: true },
        cancel: { label: 'Cancelar', flat: true }
      }).onOk(() => {
        const largura = 600
        const altura  = 700
        const left    = window.screenX + (window.outerWidth  - largura) / 2
        const top     = window.screenY + (window.outerHeight - altura)  / 2

        const popup = window.open(
          url,
          'ml_auth',
          `width=${largura},height=${altura},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
        )

        const intervalo = setInterval(async () => {
          if (popup?.closed) {
            clearInterval(intervalo)
            await new Promise(resolve => setTimeout(resolve, 2000))
            await this.verificarConexaoML()
            if (this.statusML?.conectado) {
              this.irParaDashboard(this.marketplaceSelecionado)
            } else {
              this.$q.notify({ message: 'Conexão não detectada, tente novamente', color: 'warning' })
            }
          }
        }, 1000)
      })
    } catch (err) {
      this.$q.notify({ message: 'Erro ao conectar com o Mercado Livre', color: 'negative' })
    } finally {
      this.verificandoConexao = false
    }
  }

  async irParaDashboard (marketplace: any) {
    this.marketplaceSelecionado = marketplace
    this.abaAtiva = 'dashboard'
    this.tela     = 'dashboard'
    const index   = this.marketplaces.findIndex(x => x.nome === marketplace.nome)
    Vue.set(this.marketplaces, index, { ...this.marketplaces[index], conectado: true })
    await this.carregarProdutos()
    await this.carregarPedidos()
  }

  async carregarProdutos () {
    try {
      this.carregandoProdutos = true
      const resultado         = await mlService.listarProdutos()
      this.totalProdutos      = resultado.total
      this.produtos           = resultado.produtos
    } catch (err) {
      console.error('Erro ao carregar produtos:', err)
      this.$q.notify({ message: 'Erro ao carregar produtos', color: 'negative' })
    } finally {
      this.carregandoProdutos = false
    }
  }

  async carregarPedidos () {
    try {
      this.carregandoPedidos = true
      const resultado        = await mlService.listarPedidos()
      this.pedidos           = resultado.pedidos
      this.totalPedidos      = resultado.total
    } catch (err) {
      console.error('Erro ao carregar pedidos', err)
    } finally {
      this.carregandoPedidos = false
    }
  }

  async pausarProduto (itemId: string) {
    try {
      await mlService.pausarProduto(itemId)
      this.$q.notify({ message: 'Produto pausado!', color: 'positive' })
      await this.carregarProdutos()
    } catch {
      this.$q.notify({ message: 'Erro ao pausar produto', color: 'negative' })
    }
  }

  async ativarProduto (itemId: string) {
    try {
      await mlService.ativarProduto(itemId)
      this.$q.notify({ message: 'Produto ativado!', color: 'positive' })
      await this.carregarProdutos()
    } catch {
      this.$q.notify({ message: 'Erro ao ativar produto', color: 'negative' })
    }
  }

  desconectar () {
    this.dialogDesconectar = true
  }

  async confirmarDesconexao () {
    await mlService.desconectar()
    const index = this.marketplaces.findIndex(x => x.nome === this.marketplaceSelecionado?.nome)
    Vue.set(this.marketplaces, index, { ...this.marketplaces[index], conectado: false })
    this.statusML          = null
    this.dialogDesconectar = false
    this.tela              = 'inicio'
    this.$q.notify({ message: 'Desconectado com sucesso!', color: 'positive' })
  }

  abrirDialogCancelar () {
    this.dialogCancelar = true
  }

  confirmarCancelamento () {
    this.dialogCancelar = false
    this.tela           = 'inicio'
  }
}
</script>

<style scoped>
.border {
  border: 1px solid #ccc;
}
.b-r-10 {
  border-radius: 10px;
}
.b-r-16 {
  border-radius: 16px;
}
.mp-card {
  transition: border-color 0.15s;
}
.mp-card:hover {
  border-color: #aaa;
}
.mp-logo {
  width: 56px;
  height: 56px;
  object-fit: contain;
}
.btn-outline-primary {
  border: 1.5px solid #ccc;
  background-color: #f0e9f5 !important;
}
</style>
