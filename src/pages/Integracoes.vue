<template>
  <div class="q-pa-md">

    <div class="text-bold text-black row items-center integ-cabecalho" style="font-size:28px">
      <q-icon name="webhook" class="q-mr-md text-primary" size="28px" />Integrações
    </div>
    <p class="text-grey-7 text-body2 q-mb-md">
      Conecte e gerencie integrações com marketplaces e outras plataformas para sincronizar produtos, preços e pedidos automaticamente.
    </p>
    <q-separator class="q-mb-lg" />

    <!-- TELA 1: LISTA -->
    <div v-if="tela === 'inicio'">
      <div class="row q-pb-md items-center">
        Caso não saiba como fazer uma integração, clique aqui para ver o tutorial:
        <q-icon class="cursor-pointer q-ml-xs" color="orange" name="o_info" size="18px" />
      </div>
      <div class="row items-center justify-between q-gutter-sm q-mb-lg">
        <q-input class="col-3" label="Pesquise pelo nome da integração" outlined v-model="busca" dense />
      </div>

      <div class="text-bold q-pb-md" style="font-size: 18px">Minhas Integrações</div>
      <div v-if="minhasIntegracoes.length" class="row q-col-gutter-md">
        <div v-for="m in minhasIntegracoes" :key="m.nome" class="col-12 col-sm-6 col-md-3">
          <q-card class="column items-center q-pa-lg border no-shadow mp-card" style="border-radius:16px">
            <q-inner-loading :showing="verificandoConexao" />
            <img :src="m.logo" style="width:56px;height:56px;object-fit:contain" class="q-mb-md" />
            <p class="text-bold q-ma-none text-center" style="font-size:20px">{{ m.nome }}</p>
            <p class="text-body2 text-grey-6 q-mt-xs q-mb-md">{{ m.tipo }}</p>
            <q-badge color="positive" class="q-mb-md q-px-sm q-py-xs">
              <q-icon name="circle" size="8px" class="q-mr-xs" />Conectado
            </q-badge>
            <q-btn label="Gerenciar" unelevated color="primary" class="full-width" style="border-radius:8px" @click="irParaDashboard(m)" />
          </q-card>
        </div>
      </div>
      <div v-else class="text-grey-6 q-mb-xl">Nenhuma integração conectada ainda.</div>

      <div class="q-mt-xl">
        <div class="text-bold q-pb-md" style="font-size: 18px">Integrações disponíveis</div>
        <div v-if="integracoesDisponiveis.length" class="row q-col-gutter-md">
          <div v-for="m in integracoesDisponiveis" :key="m.nome" class="col-12 col-sm-6 col-md-3">
            <q-card class="column items-center q-pa-lg border no-shadow mp-card" style="border-radius:16px">
              <img :src="m.logo" style="width:56px;height:56px;object-fit:contain" class="q-mb-md" />
              <p class="text-bold q-ma-none text-center" style="font-size:20px">{{ m.nome }}</p>
              <p class="text-body2 text-grey-6 q-mt-xs" :class="m.emBreve ? 'q-mb-md' : 'q-mb-lg'">{{ m.tipo }}</p>
              <q-badge v-if="m.emBreve" color="warning" class="q-mb-md q-px-sm q-py-xs">Em breve</q-badge>
              <q-btn :label="m.emBreve ? 'Indisponível' : 'Adicionar'" unelevated :disable="m.emBreve" color="primary" class="full-width" style="border-radius:8px" @click="!m.emBreve && irParaConectar(m)" />
            </q-card>
          </div>
        </div>
        <div v-else class="text-grey-6">Nenhuma integração disponível encontrada.</div>
      </div>
    </div>

    <!-- TELA 2: CONECTAR (melhorada) -->
    <div v-if="tela === 'conectar'">
      <div class="row q-col-gutter-lg">

        <!-- Coluna esquerda: formulário -->
        <div class="col-12 col-md-7">
          <q-card flat bordered style="border-radius:16px" class="q-pa-lg">
            <div class="row items-center q-gutter-md q-mb-lg">
              <img :src="marketplaceSelecionado.logo" style="width:48px;height:48px;object-fit:contain" />
              <div>
                <div class="text-h6 text-bold">Integração com {{ marketplaceSelecionado.nome }}</div>
                <div class="text-grey-6 text-body2">Conecte sua conta com segurança via OAuth2</div>
              </div>
            </div>

            <q-separator class="q-mb-sm" />

            <!-- Passos -->
            <div class="column q-gutter-md q-mb-lg">
              <div class="row items-center q-gutter-md">
                <div class="step-circle bg-primary text-white text-bold flex flex-center" style="width:32px;height:32px;border-radius:50%;font-size:13px;flex-shrink:0">1</div>
                <div>
                  <div class="text-weight-bold" style="font-size:16px">Nomeie sua integração</div>
                  <div class="text-grey-6 text-body2">Dê um nome para identificar esta conexão no sistema</div>
                </div>
              </div>
              <div class="row items-center q-gutter-md">
                <div class="step-circle bg-primary text-white text-bold flex flex-center" style="width:32px;height:32px;border-radius:50%;font-size:13px;flex-shrink:0">2</div>
                <div>
                  <div class="text-weight-bold" style="font-size:16px">Autentique no {{ marketplaceSelecionado.nome }}</div>
                  <div class="text-grey-6 text-body2">Uma janela será aberta para você fazer login com segurança</div>
                </div>
              </div>
              <div class="row items-center q-gutter-md">
                <div class="step-circle bg-primary text-white text-bold flex flex-center" style="width:32px;height:32px;border-radius:50%;font-size:13px;flex-shrink:0">3</div>
                <div>
                  <div class="text-weight-bold" style="font-size:16px">Pronto!</div>
                  <div class="text-grey-6 text-body2">Seus produtos e pedidos serão sincronizados automaticamente</div>
                </div>
              </div>
            </div>

            <q-separator class="q-mb-lg" />

            <q-input
              v-model="formularioIntegracao.nome"
              label="Nome da integração"
              outlined
              dense
              class="q-mb-md"
              placeholder="Ex: Minha loja no Mercado Livre"
            />

            <div class="row q-gutter-sm">
              <q-btn
                :label="'Conectar com ' + marketplaceSelecionado.nome"
                unelevated
                color="primary"
                :loading="carregando"
                icon="link"
                style="border-radius:8px"
                @click="conectarML()"
              />
              <q-btn label="Cancelar" flat color="negative" @click="abrirDialogCancelar()" />
            </div>
          </q-card>
        </div>

        <!-- Coluna direita: benefícios -->
        <div class="col-12 col-md-5">
          <q-card flat bordered style="border-radius:16px" class="q-pa-lg">
            <div class="text-weight-bold q-mb-md" style="font-size:16px">O que você vai ganhar</div>
            <div class="column q-gutter-md">
              <div class="row items-center q-gutter-sm">
                <q-icon name="sync" color="positive" size="22px" style="margin-top:1px" />
                <div>
                  <div class="text-weight-bold" style="font-size:13px">Sincronização automática</div>
                  <div class="text-grey-6" style="font-size:12px">Estoque e preços atualizados em tempo real</div>
                </div>
              </div>
              <div class="row items-center q-gutter-sm">
                <q-icon name="receipt_long" color="positive" size="22px" style="margin-top:1px" />
                <div>
                  <div class="text-weight-bold" style="font-size:13px">Pedidos centralizados</div>
                  <div class="text-grey-6" style="font-size:12px">Gerencie todos os pedidos dentro do Coden ERP</div>
                </div>
              </div>
              <div class="row items-center q-gutter-sm">
                <q-icon name="inventory_2" color="positive" size="22px" style="margin-top:1px" />
                <div>
                  <div class="text-weight-bold" style="font-size:13px">Controle de estoque</div>
                  <div class="text-grey-6" style="font-size:12px">Evite vendas de produtos sem estoque</div>
                </div>
              </div>
              <div class="row items-center q-gutter-sm">
                <q-icon name="lock" color="positive" size="22px" style="margin-top:1px" />
                <div>
                  <div class="text-weight-bold" style="font-size:13px">Conexão segura</div>
                  <div class="text-grey-6" style="font-size:12px">Autenticação oficial via OAuth2 do {{ marketplaceSelecionado.nome }}</div>
                </div>
              </div>
            </div>
          </q-card>
        </div>

      </div>
    </div>

    <!-- TELA 3: DASHBOARD (melhorado) -->
    <div v-if="tela === 'dashboard'">

      <!-- Header da integração -->
      <q-card flat bordered style="border-radius:16px" class="q-pa-md q-mb-lg">
        <div class="row items-center justify-between">
          <div class="row items-center q-gutter-md">
            <img :src="marketplaceSelecionado.logo" style="width:44px;height:44px;object-fit:contain" />
            <div>
              <div class="text-h6 text-bold">{{ marketplaceSelecionado.nome }}</div>
              <q-badge color="positive" class="q-px-sm q-py-xs">
                <q-icon name="circle" size="8px" class="q-mr-xs" />Conectado
              </q-badge>
            </div>
          </div>
        </div>
      </q-card>

      <q-tabs v-model="abaAtiva" dense align="left" active-color="primary" indicator-color="primary" class="q-mb-lg">
        <q-tab name="dashboard" label="Dashboard" />
        <q-tab name="produtos" label="Produtos" />
        <q-tab name="pedidos" label="Pedidos" />
        <q-tab name="notafiscal" label="Nota Fiscal" />
        <q-tab name="config" label="Configurações" />
      </q-tabs>

      <q-tab-panels v-model="abaAtiva" animated>

        <!-- ABA: DASHBOARD -->
        <q-tab-panel name="dashboard" class="q-pa-none">

          <div class="text-grey-6 q-mb-md">Exibindo os últimos 90 dias por padrão. Use os filtros abaixo para personalizar o período.</div>
          <!-- Filtro de datas -->
          <div class="row items-center q-gutter-sm q-mb-lg">
              <q-input
                v-model="inicioPeriodoStr"
                label="Data início"
                outlined
                type="date"
                dense
                style="max-width:180px"
              />
              <q-input
                v-model="fimPeriodoStr"
                label="Data fim"
                outlined
                type="date"
                dense
                style="max-width:180px"
              />
            <q-btn label="Filtrar" unelevated color="primary" icon="filter_list" @click="aplicarFiltroDashboard" />
              <q-btn
                id="filtro-btn-limpar"
                class="filtro-btn-limpar text-grey-7"
                label="Limpar"
                icon="delete_sweep"
                flat
                @click="refreshTable()"
              />
          </div>

          <!-- Cards de métricas melhorados -->
          <div class="row q-col-gutter-md q-mb-lg">

            <div class="col-6 col-md">
              <q-card flat bordered style="border-radius:12px" class="q-pa-md">
                <div class="row items-center justify-between q-mb-sm">
                  <div class="text-caption text-grey-6" style="font-size: 14px;">Produtos sincronizados</div>
                  <q-avatar size="32px" color="blue-1" text-color="primary" icon="inventory_2" font-size="16px" />
                </div>
                <div class="text-h5 text-bold">{{ totalProdutos }}</div>
                <div class="text-caption text-grey-5" style="font-size: 12px;">no {{ marketplaceSelecionado?.nome }}</div>
              </q-card>
            </div>

            <div class="col-6 col-md">
              <q-card flat bordered style="border-radius:12px" class="q-pa-md">
                <div class="row items-center justify-between q-mb-sm">
                  <div class="text-caption text-grey-6" style="font-size: 14px;">Total de pedidos</div>
                  <q-avatar size="32px" color="purple-1" text-color="purple" icon="shopping_bag" font-size="16px" />
                </div>
                <div class="text-h5 text-bold">{{ totalPedidosDoPeriodo }}</div>
                <div class="text-caption text-grey-5">no período</div>
              </q-card>
            </div>

            <div class="col-6 col-md">
              <q-card flat bordered style="border-radius:12px" class="q-pa-md">
                <div class="row items-center justify-between q-mb-sm">
                  <div class="text-caption text-grey-6" style="font-size: 14px;">Concluídos</div>
                  <q-avatar size="32px" color="green-1" text-color="positive" icon="check_circle" font-size="16px" />
                </div>
                <div class="text-h5 text-bold">{{ pedidosConcluidosDoPeriodo }}</div>
                <div class="text-caption text-grey-5">pedidos pagos</div>
              </q-card>
            </div>

            <div class="col-6 col-md">
              <q-card flat bordered style="border-radius:12px" class="q-pa-md">
                <div class="row items-center justify-between q-mb-sm">
                  <div class="text-caption text-grey-6" style="font-size: 14px;">Cancelados</div>
                  <q-avatar size="32px" color="red-1" text-color="negative" icon="cancel" font-size="16px" />
                </div>
                <div class="text-h5 text-bold">{{ pedidosCanceladosDoPeriodo }}</div>
                <div class="text-caption text-grey-5">no período</div>
              </q-card>
            </div>

            <div class="col-12 col-md-3">
              <q-card flat bordered style="border-radius:12px" class="q-pa-md">
                <div class="row items-center justify-between q-mb-sm">
                  <div class="text-caption" style="color:#0F6E56; font-size: 14px;">Receita total</div>
                  <q-avatar size="32px" color="teal-1" text-color="teal" icon="attach_money" font-size="16px" />
                </div>
                <div class="text-h5 text-bold" style="color:#0F6E56">{{ receitaTotalDoPeriodo }}</div>
                <div class="text-caption" style="color:#1D9E75">pedidos pagos no período</div>
              </q-card>
            </div>

          </div>

          <!-- Tabela de pedidos recentes -->
          <q-card flat bordered style="border-radius:12px">
            <div class="row items-center justify-between q-pa-md q-pb-sm">
              <div class="text-weight-bold" style="font-size:14px">Pedidos recentes</div>
              <q-btn flat dense label="Ver todos" color="primary" size="sm" @click="abaAtiva = 'pedidos'" />
            </div>
            <q-separator />
            <q-table
              flat
              :data="pedidosDoPeriodo.slice(0, 5)"
              :columns="colunasPedidos"
              hide-bottom
              no-data-label="Nenhum pedido no período"
              class="text-weight-medium"
            >
              <template v-slot:body-cell-comprador="props">
                <q-td :props="props">{{ props.row.buyer ? props.row.buyer.nickname : '-' }}</q-td>
              </template>
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge :color="props.value === 'paid' ? 'positive' : props.value === 'pending' ? 'orange' : 'negative'">
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
                  <q-btn flat dense icon="open_in_new" color="primary" :href="props.row.permalink" target="_blank" />
                </q-td>
              </template>
            </q-table>
          </q-card>

        </q-tab-panel>

        <!-- ABA: PRODUTOS -->
        <q-tab-panel name="produtos" class="q-pa-none">
          <div class="row items-center justify-between q-mb-md q-gutter-sm">
            <q-input v-model="buscaProduto" label="Pesquisar produto..." outlined dense style="min-width:240px">
              <template v-slot:prepend><q-icon name="search" /></template>
            </q-input>
            <div class="row q-gutter-sm items-center">
              <q-select v-model="filtroProduto" :options="[{label:'Todos',value:'todos'},{label:'Ativo',value:'active'},{label:'Pausado',value:'paused'},{label:'Encerrado',value:'closed'}]" option-label="label" option-value="value" emit-value map-options outlined dense style="min-width:160px" />
              <q-btn label="Publicar selecionados" unelevated color="primary" />
            </div>
          </div>
          <q-card flat bordered style="border-radius:12px">
            <q-inner-loading :showing="carregandoProdutos" />
            <q-table flat :data="produtosFiltrados" :columns="colunaProdutosMercadoLivre" :hide-bottom="produtosFiltrados.length > 0" bordered no-data-label="Nenhum produto encontrado" class="text-weight-medium">
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge :color="props.value === 'active' ? 'positive' : props.value === 'paused' ? 'orange' : 'negative'">
                    {{ props.value === 'active' ? 'Ativo' : props.value === 'paused' ? 'Pausado' : props.value }}
                  </q-badge>
                </q-td>
              </template>
              <template v-slot:body-cell-price="props">
                <q-td :props="props" align="center">{{ formatarReais(props.row.price) }}</q-td>
              </template>
              <template v-slot:body-cell-acoes="props">
                <q-td :props="props">
                  <q-btn flat dense icon="pause" color="grey-7" @click="pausarProduto(props.row.id)" v-if="props.row.status === 'active'"><q-tooltip>Pausar</q-tooltip></q-btn>
                  <q-btn flat dense icon="play_arrow" color="grey-7" @click="ativarProduto(props.row.id)" v-if="props.row.status === 'paused'"><q-tooltip>Ativar</q-tooltip></q-btn>
                  <q-btn flat dense icon="open_in_new" color="primary" :href="props.row.permalink" target="_blank"><q-tooltip>Ver no ML</q-tooltip></q-btn>
                </q-td>
              </template>
            </q-table>
          </q-card>
        </q-tab-panel>

        <!-- ABA: PEDIDOS -->
        <q-tab-panel name="pedidos" class="q-pa-none">
          <div class="row items-center justify-between q-mb-md q-gutter-sm flex-wrap">
            <div class="row q-gutter-sm q-ma-none">
              <q-input v-model="buscaPedido" label="Pesquisar pedido..." outlined dense style="min-width:240px">
                <template v-slot:prepend><q-icon name="search" /></template>
              </q-input>
              <q-input v-model="inicioPedidoStr" label="Data início" type="date" outlined dense style="min-width:150px" />
              <q-input v-model="fimPedidoStr" label="Data fim" outlined dense type="date" style="min-width:150px" />
                <q-btn
                  id="pedidos-btn-limpar"
                  class="pedidos-btn-limpar text-grey-7"
                  label="Limpar"
                  icon="delete_sweep"
                  flat
                  @click="limparPedidos()"
                />
            </div>
            <div class="row q-gutter-sm items-center q-ma-none">
              <q-select v-model="filtroPedido" :options="[{label:'Todos',value:'todos'},{label:'Pago',value:'paid'},{label:'Pendente',value:'pending'},{label:'Cancelado',value:'cancelled'}]" option-label="label" option-value="value" emit-value map-options outlined dense style="min-width:160px" />
              <q-btn label="Sincronizar" unelevated color="primary" icon="sync" @click="carregarPedidos()" />
            </div>
          </div>
          <q-card flat bordered style="border-radius:12px">
            <q-inner-loading :showing="carregandoPedidos" />
            <q-table flat :data="pedidosFiltrados" :columns="colunasPedidos" :hide-bottom="pedidosFiltrados.length > 0" bordered no-data-label="Nenhum pedido encontrado" class="text-weight-medium">
              <template v-slot:body-cell-comprador="props">
                <q-td :props="props">{{ props.row.buyer ? props.row.buyer.nickname : '-' }}</q-td>
              </template>
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge :color="props.value === 'paid' ? 'positive' : props.value === 'pending' ? 'orange' : 'negative'">
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
                  <q-btn flat dense icon="open_in_new" color="primary" :href="props.row.permalink" target="_blank" />
                </q-td>
              </template>
            </q-table>
          </q-card>
        </q-tab-panel>

        <!-- ABA: NOTA FISCAL -->
        <q-tab-panel name="notafiscal" class="q-pa-none">
          <div class="row items-center justify-between q-mb-md q-gutter-sm">
            <q-input v-model="buscaNF" label="Pesquisar nota fiscal..." outlined dense style="min-width:240px">
              <template v-slot:prepend><q-icon name="search" /></template>
            </q-input>
            <div class="row q-gutter-sm items-center">
              <q-select v-model="filtroNF" :options="[{label:'Todos',value:'todos'},{label:'Emitida',value:'emitida'},{label:'Pendente',value:'pendente'},{label:'Cancelada',value:'cancelada'}]" option-label="label" option-value="value" emit-value map-options outlined dense style="min-width:160px" />
              <q-btn label="Emitir NF-e" unelevated color="primary" icon="receipt_long" />
            </div>
          </div>
          <q-card flat bordered style="border-radius:12px">
            <q-table flat :data="notasFiscaisFiltradas" :columns="colunasNotaFiscal" :hide-bottom="notasFiscaisFiltradas.length > 0" bordered no-data-label="Nenhuma nota fiscal encontrada" class="text-weight-medium">
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge :color="props.value === 'emitida' ? 'positive' : props.value === 'pendente' ? 'orange' : 'negative'">
                    {{ props.value === 'emitida' ? 'Emitida' : props.value === 'pendente' ? 'Pendente' : 'Cancelada' }}
                  </q-badge>
                </q-td>
              </template>
              <template v-slot:body-cell-valor="props">
                <q-td :props="props" align="center">{{ formatarReais(props.row.valor) }}</q-td>
              </template>
              <template v-slot:body-cell-acoes="props">
                <q-td :props="props">
                  <q-btn flat dense icon="download" color="primary"><q-tooltip>Baixar XML</q-tooltip></q-btn>
                  <q-btn flat dense icon="picture_as_pdf" color="secondary"><q-tooltip>Baixar DANFE</q-tooltip></q-btn>
                  <q-btn flat dense icon="cancel" color="negative" v-if="props.row.status === 'emitida'"><q-tooltip>Cancelar NF</q-tooltip></q-btn>
                </q-td>
              </template>
            </q-table>
          </q-card>
        </q-tab-panel>

        <!-- ABA: CONFIGURAÇÕES -->
        <q-tab-panel name="config" class="q-pa-none">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-card flat bordered style="border-radius:12px" class="q-pa-md q-mb-md">
                <div class="text-caption text-grey-6 q-mb-md text-weight-bold">SINCRONIZAÇÃO</div>
                <div class="column q-gutter-sm">
                  <q-toggle v-model="config.sincEstoque" label="Sincronizar estoque automaticamente" color="primary" />
                  <q-toggle v-model="config.sincPrecos" label="Sincronizar preços automaticamente" color="primary" />
                  <q-toggle v-model="config.publicarAuto" label="Publicar novos produtos automaticamente" color="primary" />
                  <q-separator class="q-my-sm" />
                  <div class="row items-center q-gutter-md">
                    <span class="text-body2 text-grey-7">Frequência</span>
                    <q-select v-model="config.frequencia" :options="opcoesFrequencia" outlined dense style="min-width:200px" />
                  </div>
                </div>
              </q-card>

              <q-card flat bordered style="border-radius:12px" class="q-pa-md">
                <div class="text-caption text-grey-6 q-mb-md text-weight-bold">REGRAS DE PREÇO</div>
                <div class="row q-gutter-md items-center">
                  <q-select v-model="config.tipoAjuste" :options="opcoesTipoAjuste" label="Tipo de ajuste" outlined dense class="col-3" />
                  <q-input v-model="config.valorAjuste" label="Valor (%)" type="number" outlined dense class="col-2" />
                  <span class="text-caption text-grey-6">Ex: R$100 → R${{ 100 + Number(config.valorAjuste) }} no ML</span>
                </div>
              </q-card>
            </div>

            <div class="col-12 col-md-6">
              <q-card flat bordered style="border-radius:12px" class="q-pa-md q-mb-md">
                <div class="text-caption text-grey-6 q-mb-md text-weight-bold">MAPEAMENTO DE CATEGORIAS</div>
                <div class="column q-gutter-sm">
                  <div v-for="(cat, i) in config.categorias" :key="i" class="row items-center q-gutter-md">
                    <span class="text-body2 text-grey-7" style="min-width:140px">{{ cat.origem }}</span>
                    <q-icon name="arrow_forward" color="grey-5" />
                    <q-select v-model="cat.destino" :options="cat.opcoes" outlined dense style="min-width:220px" />
                  </div>
                  <div v-if="!config.categorias.length" class="text-grey-5 text-body2">Nenhuma categoria mapeada.</div>
                </div>
              </q-card>

              <q-card flat bordered style="border-radius:12px;border-color:#ffc9c9" class="q-pa-md">
                <div class="text-caption text-negative q-mb-sm text-weight-bold">ZONA DE PERIGO</div>
                <div class="text-body2 text-grey-6 q-mb-md">Desconectar encerrará a sincronização com o Mercado Livre.</div>
                <q-btn label="Desconectar integração" unelevated color="negative" icon="link_off" @click="desconectar()" />
              </q-card>
            </div>
          </div>

          <div class="row q-gutter-sm q-mt-md">
            <q-btn label="Cancelar" flat color="grey-7" />
            <q-btn label="Salvar configurações" unelevated color="primary" />
          </div>
        </q-tab-panel>

      </q-tab-panels>
    </div>

    <!-- Dialog Cancelar -->
    <q-dialog v-model="dialogCancelar" persistent>
      <q-card style="min-width:380px;border-radius:12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Cancelar operação</div>
        </q-card-section>
        <q-card-section class="text-grey-7" style="font-size:14px">
          Deseja realmente cancelar? As alterações não salvas serão perdidas.
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn label="Voltar" unelevated style="border:1px solid #ccc;border-radius:8px;min-width:100px" color="white" text-color="dark" v-close-popup />
          <q-btn label="Sim, Cancelar" unelevated color="negative" style="border-radius:8px;min-width:130px" @click="confirmarCancelamento()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Desconectar -->
    <q-dialog v-model="dialogDesconectar" persistent>
      <q-card style="min-width:380px;border-radius:12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Desconectar integração</div>
        </q-card-section>
        <q-card-section class="text-grey-7" style="font-size:14px">
          Deseja desconectar a integração com <strong>{{ marketplaceSelecionado?.nome }}</strong>? Isso interromperá a sincronização.
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn label="Voltar" unelevated style="border:1px solid #ccc;border-radius:8px;min-width:100px" color="white" text-color="dark" v-close-popup />
          <q-btn label="Sim, Desconectar" unelevated color="negative" style="border-radius:8px;min-width:130px" @click="confirmarDesconexao()" />
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

  inicioPeriodo = moment().subtract(90, 'days')
  fimPeriodo = moment()
  inicioPeriodoStr = moment().subtract(90, 'days').format('YYYY-MM-DD')
  fimPeriodoStr = moment().format('YYYY-MM-DD')

  inicioPedidoStr = moment().subtract(30, 'days').format('YYYY-MM-DD')
  fimPedidoStr = ''

  marketplaceSelecionado: any = null
  statusML: StatusML | null = null
  verificandoConexao = false
  formularioIntegracao: any = { nome: '' }
  busca = ''

  buscaProduto = ''
  filtroProduto = 'todos'
  carregandoProdutos = false
  produtos: ProdutoML[] = []
  totalProdutos = 0

  buscaPedido = ''
  filtroPedido = 'todos'
  carregandoPedidos = false
  pedidos: PedidoML[] = []
  totalPedidos = 0

  buscaNF = ''
  filtroNF = 'todos'
  notasFiscais: any[] = []

  colunaProdutosMercadoLivre = gridProdutosMercadoLivre.columns

  colunasPedidos = [
    { name: 'id',        label: 'Nº Pedido', field: 'id',           align: 'left'   },
    { name: 'comprador', label: 'Comprador', field: 'comprador',    align: 'left'   },
    { name: 'status',    label: 'Status',    field: 'status',       align: 'center' },
    { name: 'total',     label: 'Total',     field: 'total_amount', align: 'center' },
    { name: 'data',      label: 'Data',      field: 'date_created', align: 'center' },
    { name: 'acoes',     label: 'Ações',     field: 'acoes',        align: 'center' }
  ]

  colunasNotaFiscal = [
    { name: 'numero',       label: 'Nº NF-e',     field: 'numero',       align: 'left'   },
    { name: 'pedido',       label: 'Pedido',       field: 'pedido',       align: 'left'   },
    { name: 'destinatario', label: 'Destinatário', field: 'destinatario', align: 'left'   },
    { name: 'valor',        label: 'Valor',        field: 'valor',        align: 'center' },
    { name: 'status',       label: 'Status',       field: 'status',       align: 'center' },
    { name: 'emissao',      label: 'Emissão',      field: 'emissao',      align: 'center' },
    { name: 'acoes',        label: 'Ações',        field: 'acoes',        align: 'center' }
  ]

  config = {
    sincEstoque: true, sincPrecos: true, publicarAuto: false,
    frequencia: 'A cada 1 hora', tipoAjuste: 'Markup (%)', valorAjuste: 10, categorias: [] as any[]
  }

  opcoesFrequencia = ['A cada 30 minutos', 'A cada 1 hora', 'A cada 4 horas', 'Diariamente']
  opcoesTipoAjuste = ['Sem ajuste', 'Markup (%)', 'Desconto (%)', 'Preço fixo']

  marketplaces = [{
    nome: 'Mercado Livre', tipo: 'Marketplace', conectado: false, emBreve: false,
    logo: 'https://cdn.iconscout.com/icon/free/png-256/free-mercado-livre-icon-svg-download-png-14549372.png'
  }]

  async created() { await this.verificarConexaoML() }

  get marketplacesFiltrados() {
    if (!this.busca) return this.marketplaces
    return this.marketplaces.filter(m => m.nome.toLowerCase().startsWith(this.busca.toLowerCase()))
  }
  get minhasIntegracoes() { return this.marketplacesFiltrados.filter(m => m.conectado) }
  get integracoesDisponiveis() { return this.marketplacesFiltrados.filter(m => !m.conectado) }

  get produtosFiltrados() {
    return this.produtos.filter(p => {
      const matchBusca = !this.buscaProduto || p.title.toLowerCase().includes(this.buscaProduto.toLowerCase())
      const matchFiltro = this.filtroProduto === 'todos' || p.status === this.filtroProduto
      return matchBusca && matchFiltro
    })
  }

  get pedidosFiltrados() {
    return this.pedidos.filter((p: any) => {
      const matchBusca = !this.buscaPedido ||
        String(p.id).toLowerCase().includes(this.buscaPedido.toLowerCase()) ||
        ((p.buyer?.nickname ?? '').toLowerCase().includes(this.buscaPedido.toLowerCase()))
      const matchFiltro = this.filtroPedido === 'todos' || p.status === this.filtroPedido
      let matchData = true
      if (this.inicioPedidoStr || this.fimPedidoStr) {
        const data = moment(p.date_created)
        if (this.inicioPedidoStr) matchData = matchData && data.isSameOrAfter(moment(this.inicioPedidoStr), 'day')
        if (this.fimPedidoStr)    matchData = matchData && data.isSameOrBefore(moment(this.fimPedidoStr), 'day')
      }
      return matchBusca && matchFiltro && matchData
    })
  }

  refreshTable() {
    this.limparCampos()
  }

  limparCampos() {
    this.inicioPeriodo = moment().subtract(90, 'days')
    this.fimPeriodo = moment()
    this.inicioPeriodoStr = ''
    this.fimPeriodoStr = ''
  }

  limparPedidos() {
    this.inicioPedidoStr = ''
    this.fimPedidoStr = ''
  }

  get notasFiscaisFiltradas() {
    return this.notasFiscais.filter((nf: any) => {
      const matchBusca = !this.buscaNF ||
        String(nf.numero).toLowerCase().includes(this.buscaNF.toLowerCase()) ||
        (nf.destinatario || '').toLowerCase().includes(this.buscaNF.toLowerCase())
      const matchFiltro = this.filtroNF === 'todos' || nf.status === this.filtroNF
      return matchBusca && matchFiltro
    })
  }

  get tokenExpiraEm() {
    if (!this.statusML?.expira_em) return '-'
    return new Date(this.statusML.expira_em).toLocaleDateString('pt-BR')
  }

  get pedidosDoPeriodo() {
    return this.pedidos.filter((p: any) => {
      if (!p.date_created) return false
      const data = moment(p.date_created)
      return data.isSameOrAfter(this.inicioPeriodo, 'day') && data.isSameOrBefore(this.fimPeriodo, 'day')
    })
  }

  get totalPedidosDoPeriodo() { return this.pedidosDoPeriodo.length }
  get pedidosConcluidosDoPeriodo() { return this.pedidosDoPeriodo.filter((p: any) => p.status === 'paid').length }
  get pedidosCanceladosDoPeriodo() { return this.pedidosDoPeriodo.filter((p: any) => p.status === 'cancelled').length }

  get receitaTotalDoPeriodo() {
    const total = this.pedidosDoPeriodo
      .filter((p: any) => p.status === 'paid')
      .reduce((acc: number, p: any) => acc + Number(p.total_amount || 0), 0)
    return this.formatarReais(total)
  }

  aplicarFiltroDashboard() {
    const inicio = moment(this.inicioPeriodoStr, 'YYYY-MM-DD')
    const fim = moment(this.fimPeriodoStr, 'YYYY-MM-DD')
    if (inicio.isValid()) this.inicioPeriodo = inicio
    if (fim.isValid()) this.fimPeriodo = fim
  }

  formatarReais(valor: string | number): string {
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor
    if (isNaN(numero)) return 'R$ 0,00'
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  formatarData(valor: string): string {
    if (!valor) return '-'
    const data = moment(valor)
    return data.isValid() ? data.format('DD/MM/YYYY') : valor
  }

  async verificarConexaoML() {
    const index = this.marketplaces.findIndex(m => m.nome === 'Mercado Livre')
    try {
      this.statusML = await mlService.getStatus()
      Vue.set(this.marketplaces, index, { ...this.marketplaces[index], conectado: this.statusML.conectado ?? false })
      if (this.statusML?.conectado) {
        await this.carregarProdutos()
        await this.carregarPedidos()
      }
    } catch {
      Vue.set(this.marketplaces, index, { ...this.marketplaces[index], conectado: false })
    }
  }

  async irParaConectar(marketplace: any) {
    this.marketplaceSelecionado = marketplace
    this.formularioIntegracao = { nome: marketplace.nome }
    this.tela = 'conectar'
  }

async conectarML() {
  try {
    this.carregando = true
    const url = await mlService.getLoginUrl()
    this.$q.dialog({
      title: 'Conectar Mercado Livre',
      message: 'Uma janela de autenticação será aberta. Caso queira conectar uma conta diferente, certifique-se de estar deslogado do Mercado Livre antes de continuar.',
      ok: { label: 'Continuar', color: 'primary', unelevated: true },
      cancel: { label: 'Cancelar', flat: true }
    }).onOk(() => {
      const largura = 600, altura = 700
      const left = window.screenX + (window.outerWidth - largura) / 2
      const top = window.screenY + (window.outerHeight - altura) / 2
      const popup = window.open(url, 'ml_auth', `width=${largura},height=${altura},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`)

      // Loading enquanto aguarda o popup fechar
      const loadingDialog = this.$q.dialog({
        title: 'Aguardando autenticação...',
        message: 'Conclua o login no Mercado Livre para continuar.',
        progress: true,
        persistent: true,
        ok: false,
        cancel: false
      })

      const intervalo = setInterval(async () => {
        if (popup?.closed) {
          clearInterval(intervalo)
          loadingDialog.hide()

          // Loading de verificação
          const verificandoDialog = this.$q.dialog({
            title: 'Verificando conexão...',
            message: 'Estamos confirmando sua autenticação.',
            progress: true,
            persistent: true,
            ok: false,
            cancel: false
          })

          await new Promise(resolve => setTimeout(resolve, 2000))
          await this.verificarConexaoML()
          verificandoDialog.hide()

          if (this.statusML?.conectado) {
            this.$q.notify({
              type: 'positive',
              message: 'Mercado Livre conectado com sucesso!',
              icon: 'check_circle',
              timeout: 3000
            })
            this.irParaDashboard(this.marketplaceSelecionado)
          } else {
            this.$q.notify({
              type: 'warning',
              message: 'Conexão não detectada. Tente novamente.',
              icon: 'warning',
              timeout: 4000
            })
          }
        }
      }, 1000)
    })
  } catch {
    this.$q.notify({ message: 'Erro ao conectar com o Mercado Livre', color: 'negative' })
  } finally {
    this.carregando = false
  }
}

  async irParaDashboard(marketplace: any) {
    this.marketplaceSelecionado = marketplace
    this.abaAtiva = 'dashboard'
    this.tela = 'dashboard'
    const index = this.marketplaces.findIndex(x => x.nome === marketplace.nome)
    Vue.set(this.marketplaces, index, { ...this.marketplaces[index], conectado: true })
    await this.carregarProdutos()
    await this.carregarPedidos()
  }

  async carregarProdutos() {
    try {
      this.carregandoProdutos = true
      const resultado = await mlService.listarProdutos()
      this.totalProdutos = resultado.total
      this.produtos = resultado.produtos
    } catch {
      this.$q.notify({ message: 'Erro ao carregar produtos', color: 'negative' })
    } finally {
      this.carregandoProdutos = false
    }
  }

  async carregarPedidos() {
    try {
      this.carregandoPedidos = true
      const resultado = await mlService.listarPedidos()
      this.pedidos = resultado.pedidos
      this.totalPedidos = resultado.total
    } catch {
      /* ignora */
    } finally {
      this.carregandoPedidos = false
    }
  }

  async pausarProduto(itemId: string) {
    try {
      await mlService.pausarProduto(itemId)
      this.$q.notify({ message: 'Produto pausado!', color: 'positive' })
      await this.carregarProdutos()
    } catch {
      this.$q.notify({ message: 'Erro ao pausar produto', color: 'negative' })
    }
  }

  async ativarProduto(itemId: string) {
    try {
      await mlService.ativarProduto(itemId)
      this.$q.notify({ message: 'Produto ativado!', color: 'positive' })
      await this.carregarProdutos()
    } catch {
      this.$q.notify({ message: 'Erro ao ativar produto', color: 'negative' })
    }
  }

  desconectar() { this.dialogDesconectar = true }

  async confirmarDesconexao() {
    await mlService.desconectar()
    const index = this.marketplaces.findIndex(x => x.nome === this.marketplaceSelecionado?.nome)
    Vue.set(this.marketplaces, index, { ...this.marketplaces[index], conectado: false })
    this.statusML = null
    this.dialogDesconectar = false
    this.tela = 'inicio'
    this.$q.notify({ message: 'Desconectado com sucesso!', color: 'positive' })
  }

  abrirDialogCancelar() { this.dialogCancelar = true }

  confirmarCancelamento() {
    this.dialogCancelar = false
    this.tela = 'inicio'
  }
}
</script>

<style scoped>
.border { border: 1px solid #ccc; }
.mp-card { transition: border-color 0.15s; }
.mp-card:hover { border-color: #aaa; }
</style>
