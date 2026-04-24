<template>
  <!-- Container principal para centralizar o card na tela -->
  <div class="row justify-center items-center">
    <q-card class="col-11 col-md-10 col-lg-9 shadow-2" style="width: 1500px">
      <!-- Cabeçalho do Card -->
      <q-card-section class="bg-white text-primary q-pb-none">
        <div class="row justify-between items-center">
          <div>
            <div class="text-h5 text-bold">Dashboards</div>
            <q-toolbar class="q-pa-none">
              <q-breadcrumbs active-color="primary" style="font-size: 14px" class="q-mb-md">
                <template v-slot:separator>
                  <q-icon size="1.5em" name="chevron_right" color="primary" />
                </template>
                <q-breadcrumbs-el label="Home" icon="home" to="/" />
              </q-breadcrumbs>
            </q-toolbar>
          </div>
          <!-- Controles de Filtro Global -->
          <div class="row q-gutter-sm items-center">
            <q-select
              v-model="periodoSelecionado"
              :options="opcoesPeriodo"
              outlined
              dense
              bg-color="white"
              style="width: 200px"
              label="Período"
            />
            <q-btn icon="refresh" color="primary" flat round @click="recarregarDados()" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Corpo do Card -->
      <q-card-section class="q-pa-lg">

        <!-- 4 Cards de Números Gerais (Preparados para Dados) -->
        <div class="row q-col-gutter-md q-mb-xl">
          <div v-for="(card, index) in cardsResumo" :key="index" class="col-12 col-sm-6 col-md-3">
            <q-card flat bordered :class="`bg-${card.color}-1 text-${card.color}-9`" style="height: 120px">
              <q-card-section class="row items-center no-wrap full-height">
                <div class="col">
                  <div class="text-subtitle2 text-uppercase text-bold">{{ card.label }}</div>
                  <div v-if="card.valor" class="text-h4 text-bold">{{ card.valor }}</div>
                  <div v-else class="text-caption text-grey-7 italic">Sem dados no período</div>
                  <div v-if="card.tendencia" :class="`text-caption text-${card.tendenciaColor}-8 text-bold`">
                    <q-icon :name="card.tendenciaIcon" /> {{ card.tendencia }}
                  </div>
                </div>
                <q-icon :name="card.icon" size="48px" class="q-ml-md opacity-30" />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Área de Gráficos e Atividades -->
        <div class="row q-col-gutter-md">

          <!-- Gráfico Principal (Vendas) -->
          <div class="col-12 col-md-8">
            <q-card flat bordered style="min-height: 400px">
              <q-card-section class="row items-center justify-between">
                <div class="text-h6 text-bold">Desempenho de Vendas</div>
                <q-btn icon="more_vert" flat round dense />
              </q-card-section>
              <q-separator />
              <q-card-section class="flex flex-center full-height" style="min-height: 330px">
                <!-- Estado Vazio para Gráfico -->
                <div v-if="!temDadosGrafico" class="text-center text-grey-6">
                  <q-icon name="analytics" size="80px" class="q-mb-sm" />
                  <div class="text-h6">Nenhuma venda registrada</div>
                  <p>Não há dados de vendas para o período selecionado.</p>
                </div>
                <!-- Placeholder para ApexCharts -->
                <div v-else class="full-width text-center text-grey-5">
                  [ O gráfico ApexCharts será renderizado aqui ]
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Atividades Recentes de Usuários -->
          <div class="col-12 col-md-4">
            <q-card flat bordered style="min-height: 400px">
              <q-card-section>
                <div class="text-h6 text-bold">Atividades dos Usuários</div>
              </q-card-section>
              <q-separator />
              <q-card-section class="q-pa-none">
                <!-- Lista de Atividades -->
                <q-list v-if="atividadesUsuarios.length > 0" separator>
                  <q-item v-for="(act, idx) in atividadesUsuarios" :key="idx">
                    <q-item-section avatar>
                      <q-avatar color="primary" text-white size="32px">{{ act.user.charAt(0) }}</q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-bold">{{ act.user }}</q-item-label>
                      <q-item-label caption>{{ act.acao }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label caption>{{ act.hora }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <!-- Estado Vazio para Atividades -->
                <div v-else class="flex flex-center q-pa-xl text-grey-6 text-center">
                  <q-icon name="history" size="64px" class="q-mb-sm" />
                  <div>Sem atividades recentes</div>
                </div>
              </q-card-section>
              <q-card-actions align="center" v-if="atividadesUsuarios.length > 0">
                <q-btn flat color="primary" label="Ver todos os logs" dense />
              </q-card-actions>
            </q-card>
          </div>

          <!-- Alertas e Notificações do Sistema -->
          <div class="col-12">
            <q-card flat bordered>
              <q-card-section class="bg-grey-1">
                <div class="text-subtitle1 text-bold">Alertas do Sistema</div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <div v-if="alertasSistema.length === 0" class="row items-center justify-center q-pa-md text-grey-7">
                  <q-icon name="check_circle" color="positive" size="24px" class="q-mr-sm" />
                  O sistema está operando normalmente. Nenhum alerta pendente.
                </div>
                <div v-else class="row q-col-gutter-sm">
                  <div v-for="(alerta, i) in alertasSistema" :key="i" class="col-12 col-md-4">
                    <q-banner dense rounded :class="`bg-${alerta.tipo}-1 text-${alerta.tipo}-9`" bordered>
                      <template v-slot:avatar>
                        <q-icon :name="alerta.icon" :color="alerta.tipo" />
                      </template>
                      {{ alerta.mensagem }}
                    </q-banner>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class ModuleExports extends Vue {
  // Controles de UI
  periodoSelecionado = 'Últimos 30 dias'
  opcoesPeriodo = ['Hoje', 'Últimos 7 dias', 'Últimos 30 dias', 'Este Ano']

  // Estados de Dados (Simulação de retorno de API)
  temDadosGrafico = false // Mude para true para simular dados

  cardsResumo = [
    { label: 'Total de Vendas', valor: 'R$ 0,00', icon: 'sell', color: 'blue', tendencia: null },
    { label: 'Pedidos', valor: '0', icon: 'shopping_cart', color: 'green', tendencia: null },
    { label: 'Novos Clientes', valor: '0', icon: 'group', color: 'purple', tendencia: null },
    { label: 'Estoque Crítico', valor: '0', icon: 'inventory_2', color: 'orange', tendencia: null }
  ]

  atividadesUsuarios = [] // Lista vazia para simular estado inicial

  alertasSistema = [] // Lista vazia para simular sistema OK

  // Exemplo de como os dados seriam preenchidos após chamada de API:
  /*
  atividadesUsuarios = [
    { user: 'João Silva', acao: 'Realizou venda #123', hora: '10:30' },
    { user: 'Maria Souza', acao: 'Cadastrou novo produto', hora: '09:15' }
  ]
  */

  recarregarDados() {
    this.$q.loading.show({ message: 'Sincronizando dados...' })
    setTimeout(() => {
      this.$q.loading.hide()
      this.$q.notify({
        message: 'Dados atualizados com sucesso!',
        color: 'positive',
        icon: 'done'
      })
    }, 1000)
  }
}
</script>

<style scoped>
.opacity-30 {
  opacity: 0.3;
}
.full-height {
  height: 100%;
}
</style>
