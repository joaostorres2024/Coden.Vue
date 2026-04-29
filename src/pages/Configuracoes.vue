<template>
  <div class="row justify-center items-center">
    <q-card class="no-shadow border b-r-10" style="width: 1500px">
      <q-card-section class="bg-white text-primary q-pb-none">
        <div class="text-h5 text-bold">Configurações Gerais</div>
        <q-toolbar class="q-pa-none">
          <q-breadcrumbs active-color="primary" style="font-size: 14px" class="q-mb-md">
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el label="Home" icon="home" to="/" />
            <q-breadcrumbs-el label="Configurações" icon="settings" />
          </q-breadcrumbs>
        </q-toolbar>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-lg">

        <!-- NOTIFICAÇÕES -->
        <div class="row items-center q-mb-sm">
          <q-icon name="notifications" size="22px" color="primary" class="q-mr-sm" />
          <div class="text-h6 text-bold">Notificações</div>
        </div>
        <q-list bordered separator class="rounded-borders q-mb-xl">
          <q-item>
            <q-item-section avatar>
              <q-icon name="notifications" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Alertas de Vendas</q-item-label>
              <q-item-label caption>Notificar ao concluir venda</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="notif_alertaVendas" color="primary" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="inventory_2" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Estoque Baixo</q-item-label>
              <q-item-label caption>Alertar ao estoque atingir mínimo</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="notif_estoqueBaixo" color="primary" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="alarm" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Alertas Automáticos</q-item-label>
              <q-item-label caption>Notificar quando produto baixar</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="notif_alertasAutomaticos" color="primary" />
            </q-item-section>
          </q-item>
        </q-list>

        <q-separator class="q-my-lg" />

        <!-- PAGAMENTO -->
        <div class="row items-center q-mb-sm">
          <q-icon name="payments" size="22px" color="primary" class="q-mr-sm" />
          <div class="text-h6 text-bold">Pagamento</div>
        </div>
        <q-list bordered separator class="rounded-borders q-mb-xl">
          <q-item>
            <q-item-section avatar>
              <q-icon name="credit_card" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Cartão de Crédito</q-item-label>
              <q-item-label caption>Aceitar pagamento por crédito</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="pag_credito" color="primary" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="credit_card" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Cartão de Débito</q-item-label>
              <q-item-label caption>Aceitar pagamento por débito</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="pag_debito" color="primary" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="pix" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>PIX</q-item-label>
              <q-item-label caption>Aceitar pagamento por PIX</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="pag_pix" color="primary" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="attach_money" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Dinheiro</q-item-label>
              <q-item-label caption>Aceitar pagamento em dinheiro</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="pag_dinheiro" color="primary" />
            </q-item-section>
          </q-item>
        </q-list>

        <q-separator class="q-my-lg" />

        <!-- VENDAS -->
        <div class="row items-center q-mb-sm">
          <q-icon name="shopping_cart" size="22px" color="primary" class="q-mr-sm" />
          <div class="text-h6 text-bold">Vendas</div>
        </div>
        <q-list bordered separator class="rounded-borders q-mb-xl">
          <q-item>
            <q-item-section avatar>
              <q-icon name="person" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Cliente Padrão</q-item-label>
              <q-item-label caption>Permitir vendas sem identificação</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="venda_clientePadrao" color="primary" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="block" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Bloquear Venda sem Estoque</q-item-label>
              <q-item-label caption>Impedir saldo negativo</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="venda_bloquearSemEstoque" color="primary" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="percent" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Desconto por Vendedor</q-item-label>
              <q-item-label caption>Permitir alteração de preço</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="venda_descontoVendedor" color="primary" />
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="settings_suggest" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Desconto Máximo</q-item-label>
              <q-item-label caption>Definir limite de desconto</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" color="grey" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="warning" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Aprovação de Gerente</q-item-label>
              <q-item-label caption>Para descontos acima do limite</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="venda_aprovacaoGerente" color="primary" />
            </q-item-section>
          </q-item>
        </q-list>

        <q-separator class="q-my-lg" />

        <!-- SISTEMA -->
        <div class="row items-center q-mb-sm">
          <q-icon name="computer" size="22px" color="primary" class="q-mr-sm" />
          <div class="text-h6 text-bold">Sistema</div>
        </div>
        <q-list bordered separator class="rounded-borders q-mb-xl">
          <q-item>
            <q-item-section avatar>
              <q-icon name="backup" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Backup Automático</q-item-label>
              <q-item-label caption>Realizar backup diário dos dados</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="sist_backup" color="primary" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="dark_mode" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Tema Escuro</q-item-label>
              <q-item-label caption>Habilitar interface em modo noturno</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="sist_temaEscuro" color="primary" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="history" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Logs de Atividade</q-item-label>
              <q-item-label caption>Registrar ações dos usuários</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="sist_logs" color="primary" />
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="update" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Atualizações</q-item-label>
              <q-item-label caption>Verificar novas versões do sistema</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" color="grey" />
            </q-item-section>
          </q-item>
        </q-list>

        <q-separator class="q-my-lg" />

        <!-- CAIXA -->
        <div class="row items-center q-mb-sm">
          <q-icon name="point_of_sale" size="22px" color="primary" class="q-mr-sm" />
          <div class="text-h6 text-bold">Caixa</div>
        </div>
        <q-list bordered separator class="rounded-borders q-mb-xl">
          <q-item>
            <q-item-section avatar>
              <q-icon name="lock_open" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Abertura de Caixa</q-item-label>
              <q-item-label caption>Exigir valor inicial na abertura</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="caixa_abertura" color="primary" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="visibility_off" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Fechamento Cego</q-item-label>
              <q-item-label caption>Não mostrar saldo esperado no fechamento</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="caixa_fechamentoCego" color="primary" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="outbox" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Sangria de Caixa</q-item-label>
              <q-item-label caption>Permitir retiradas durante o expediente</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="caixa_sangria" color="primary" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="print" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Relatório de Turno</q-item-label>
              <q-item-label caption>Imprimir resumo ao fechar caixa</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="caixa_relatorioTurno" color="primary" />
            </q-item-section>
          </q-item>
        </q-list>

        <!-- Salvar -->
        <div class="row justify-end q-mt-xl">
          <q-btn label="Salvar Todas as Alterações" color="positive" unelevated icon="save" @click="salvarConfig()" />
        </div>

      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class ConfiguracoesComponent extends Vue {

  // Notificações
  notif_alertaVendas = true
  notif_estoqueBaixo = true
  notif_alertasAutomaticos = false

  // Pagamento
  pag_credito = true
  pag_debito = true
  pag_pix = true
  pag_dinheiro = true

  // Vendas
  venda_clientePadrao = true
  venda_bloquearSemEstoque = false
  venda_descontoVendedor = true
  venda_aprovacaoGerente = true

  // Sistema
  sist_backup = true
  sist_temaEscuro = false
  sist_logs = true

  // Caixa
  caixa_abertura = true
  caixa_fechamentoCego = false
  caixa_sangria = true
  caixa_relatorioTurno = true

  salvarConfig() {
    this.$q.notify({
      type: 'positive',
      message: 'Configurações salvas com sucesso!',
      position: 'bottom'
    })
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
.rounded-borders {
  border-radius: 8px;
}
</style>
