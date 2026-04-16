<template>
  <!-- Container principal para centralizar o card na tela -->
  <div class="row justify-center items-center">
    <q-card class="col-11 col-md-10 col-lg-9 shadow-2" style="width: 1500px">
      <!-- Cabeçalho do Card -->
      <q-card-section class="bg-primary text-white q-pb-none">
        <div class="text-h5 text-bold">Configurações</div>
        <q-toolbar class="q-pa-none">
          <q-breadcrumbs
            active-color="white"
            style="font-size: 14px"
            class="q-mb-md"
          >
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="white" />
            </template>
            <q-breadcrumbs-el label="Home" icon="home" to="/" />
            <q-breadcrumbs-el label="Configurações" icon="settings" />
          </q-breadcrumbs>
        </q-toolbar>
      </q-card-section>

      <q-separator />

      <!-- Corpo do Card -->
      <q-card-section class="q-pa-lg">
        <!-- Tabs de Navegação -->
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
        >
          <q-tab name="tab1" label="Notificações" />
          <q-tab name="tab2" label="Pagamento" />
          <q-tab name="tab3" label="Vendas" />
          <q-tab name="tab4" label="Sistema" />
          <q-tab name="tab5" label="Caixa" />
        </q-tabs>

        <q-separator />

        <!-- Conteúdo das Tabs -->
        <q-tab-panels v-model="tab" animated class="q-mt-md">
          <!-- TAB 1: Notificações -->
          <q-tab-panel name="tab1" class="q-pa-none">
            <div class="row q-col-gutter-md">
              <div v-for="(item, index) in notificacoes" :key="index" class="col-12 col-md-6">
                <div class="row items-center justify-between q-pa-md border rounded-borders">
                  <div class="row items-center">
                    <q-icon :name="item.icon" size="28px" color="primary" class="q-mr-md" />
                    <div>
                      <div class="text-subtitle1 text-bold">{{ item.title }}</div>
                      <div class="text-caption text-grey-8">{{ item.desc }}</div>
                    </div>
                  </div>
                  <q-toggle v-model="item.value" color="primary" />
                </div>
              </div>
            </div>
          </q-tab-panel>

          <!-- TAB 2: Pagamento -->
          <q-tab-panel name="tab2" class="q-pa-none">
            <div class="row q-col-gutter-md">
              <div v-for="(item, index) in pagamentos" :key="index" class="col-12 col-md-6">
                <div class="row items-center justify-between q-pa-md border rounded-borders">
                  <div class="row items-center">
                    <q-icon :name="item.icon" size="28px" color="primary" class="q-mr-md" />
                    <div>
                      <div class="text-subtitle1 text-bold">{{ item.title }}</div>
                      <div class="text-caption text-grey-8">{{ item.desc }}</div>
                    </div>
                  </div>
                  <q-toggle v-model="item.value" color="primary" />
                </div>
              </div>
            </div>
          </q-tab-panel>

          <!-- TAB 3: Vendas -->
          <q-tab-panel name="tab3" class="q-pa-none">
            <div class="row q-col-gutter-md">
              <div v-for="(item, index) in vendas" :key="index" class="col-12 col-md-6">
                <div class="row items-center justify-between q-pa-md border rounded-borders">
                  <div class="row items-center">
                    <q-icon :name="item.icon" size="28px" color="primary" class="q-mr-md" />
                    <div>
                      <div class="text-subtitle1 text-bold">{{ item.title }}</div>
                      <div class="text-caption text-grey-8">{{ item.desc }}</div>
                    </div>
                  </div>
                  <template v-if="item.type === 'toggle'">
                    <q-toggle v-model="item.value" color="primary" />
                  </template>
                  <template v-else>
                    <q-btn flat dense icon="chevron_right" color="grey" />
                  </template>
                </div>
              </div>
            </div>
          </q-tab-panel>

          <!-- TAB 4: Sistema -->
          <q-tab-panel name="tab4" class="q-pa-none">
            <div class="row q-col-gutter-md">
              <div v-for="(item, index) in sistema" :key="index" class="col-12 col-md-6">
                <div class="row items-center justify-between q-pa-md border rounded-borders">
                  <div class="row items-center">
                    <q-icon :name="item.icon" size="28px" color="primary" class="q-mr-md" />
                    <div>
                      <div class="text-subtitle1 text-bold">{{ item.title }}</div>
                      <div class="text-caption text-grey-8">{{ item.desc }}</div>
                    </div>
                  </div>
                  <template v-if="item.type === 'toggle'">
                    <q-toggle v-model="item.value" color="primary" />
                  </template>
                  <template v-else>
                    <q-btn flat dense icon="chevron_right" color="grey" />
                  </template>
                </div>
              </div>
            </div>
          </q-tab-panel>

          <!-- TAB 5: Caixa -->
          <q-tab-panel name="tab5" class="q-pa-none">
            <div class="row q-col-gutter-md">
              <div v-for="(item, index) in caixa" :key="index" class="col-12 col-md-6">
                <div class="row items-center justify-between q-pa-md border rounded-borders">
                  <div class="row items-center">
                    <q-icon :name="item.icon" size="28px" color="primary" class="q-mr-md" />
                    <div>
                      <div class="text-subtitle1 text-bold">{{ item.title }}</div>
                      <div class="text-caption text-grey-8">{{ item.desc }}</div>
                    </div>
                  </div>
                  <template v-if="item.type === 'toggle'">
                    <q-toggle v-model="item.value" color="primary" />
                  </template>
                  <template v-else>
                    <q-btn flat dense icon="chevron_right" color="grey" />
                  </template>
                </div>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>

        <!-- Botão de Salvar Configurações -->
        <div class="row justify-end q-mt-xl">
          <q-btn label="Salvar Alterações" color="positive" unelevated icon="save" @click="salvarConfig()" />
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
  tab = 'tab1'

  notificacoes = [
    { title: 'Alertas de Vendas', desc: 'Notificar ao concluir venda', icon: 'notifications', value: true },
    { title: 'Estoque Baixo', desc: 'Alertar ao estoque atingir mínimo', icon: 'inventory_2', value: true },
    { title: 'Alertas Automáticos', desc: 'Notificar quando produto baixar', icon: 'alarm', value: false }
  ]

  pagamentos = [
    { title: 'Cartão de Crédito', desc: 'Aceitar pagamento por crédito', icon: 'credit_card', value: true },
    { title: 'Cartão de Débito', desc: 'Aceitar pagamento por débito', icon: 'credit_card', value: true },
    { title: 'PIX', desc: 'Aceitar pagamento por PIX', icon: 'pix', value: true },
    { title: 'Dinheiro', desc: 'Aceitar pagamento por Dinheiro', icon: 'attach_money', value: true }
  ]

  vendas = [
    { title: 'Cliente Padrão', desc: 'Permitir vendas sem identificação', icon: 'person', value: true, type: 'toggle' },
    { title: 'Bloquear Venda sem Estoque', desc: 'Impedir saldo negativo', icon: 'block', value: false, type: 'toggle' },
    { title: 'Desconto por Vendedor', desc: 'Permitir alteração de preço', icon: 'percent', value: true, type: 'toggle' },
    { title: 'Desconto Máximo', desc: 'Definir limite de desconto', icon: 'settings_suggest', value: null, type: 'button' },
    { title: 'Aprovação de Gerente', desc: 'Para descontos acima do limite', icon: 'warning', value: true, type: 'toggle' }
  ]

  sistema = [
    { title: 'Backup Automático', desc: 'Realizar backup diário dos dados', icon: 'backup', value: true, type: 'toggle' },
    { title: 'Tema Escuro', desc: 'Habilitar interface em modo noturno', icon: 'dark_mode', value: false, type: 'toggle' },
    { title: 'Logs de Atividade', desc: 'Registrar ações dos usuários', icon: 'history', value: true, type: 'toggle' },
    { title: 'Atualizações', desc: 'Verificar novas versões do sistema', icon: 'update', value: null, type: 'button' }
  ]

  caixa = [
    { title: 'Abertura de Caixa', desc: 'Exigir valor inicial na abertura', icon: 'lock_open', value: true, type: 'toggle' },
    { title: 'Fechamento Cego', desc: 'Não mostrar saldo esperado no fechamento', icon: 'visibility_off', value: false, type: 'toggle' },
    { title: 'Sangria de Caixa', desc: 'Permitir retiradas durante o expediente', icon: 'outbox', value: true, type: 'toggle' },
    { title: 'Relatório de Turno', desc: 'Imprimir resumo ao fechar caixa', icon: 'print', value: true, type: 'toggle' }
  ]

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
  border: 1px solid #e0e0e0;
  transition: background-color 0.3s;
}
.border:hover {
  background-color: #f5f5f5;
}
.rounded-borders {
  border-radius: 8px;
}
</style>
