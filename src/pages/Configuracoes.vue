<template>
  <!-- Container principal para centralizar o card na tela -->
  <div class="row justify-center items-center">
    <q-card
      class="shadow-2"
      style="width: 1500px;"
    >
      <!-- Cabeçalho do Card -->
      <q-card-section class="bg-white text-primary q-pb-none">
        <div class="text-h5 text-bold">Configurações Gerais</div>
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
            <q-breadcrumbs-el label="Configurações" icon="settings" />
          </q-breadcrumbs>
        </q-toolbar>
      </q-card-section>

      <q-separator />

      <!-- Corpo do Card -->
      <q-card-section class="q-pa-lg">
        <!-- SEÇÃO 1: Notificações -->
        <div class="q-mb-xl">
          <div class="row items-center q-mb-md">
            <q-icon
              name="notifications"
              size="24px"
              color="primary"
              class="q-mr-sm"
            />
            <div class="text-h6 text-bold">Notificações</div>
          </div>
          <div class="row q-col-gutter-md">
            <div
              v-for="(item, index) in notificacoes"
              :key="'notif-' + index"
              class="col-12 col-md-6"
            >
              <div
                class="row items-center justify-between q-pa-md border rounded-borders"
              >
                <div class="row items-center">
                  <q-icon
                    :name="item.icon"
                    size="28px"
                    color="primary"
                    class="q-mr-md"
                  />
                  <div>
                    <div class="text-subtitle1">{{ item.title }}</div>
                    <div class="text-caption text-grey-8">{{ item.desc }}</div>
                  </div>
                </div>
                <q-toggle v-model="item.value" color="primary" />
              </div>
            </div>
          </div>
        </div>

        <q-separator class="q-my-lg" />

        <!-- SEÇÃO 2: Pagamento -->
        <div class="q-mb-xl">
          <div class="row items-center q-mb-md">
            <q-icon
              name="payments"
              size="24px"
              color="primary"
              class="q-mr-sm"
            />
            <div class="text-h6 text-bold">Pagamento</div>
          </div>
          <div class="row q-col-gutter-md">
            <div
              v-for="(item, index) in pagamentos"
              :key="'pag-' + index"
              class="col-12 col-md-6"
            >
              <div
                class="row items-center justify-between q-pa-md border rounded-borders"
              >
                <div class="row items-center">
                  <q-icon
                    :name="item.icon"
                    size="28px"
                    color="primary"
                    class="q-mr-md"
                  />
                  <div>
                    <div class="text-subtitle1">{{ item.title }}</div>
                    <div class="text-caption text-grey-8">{{ item.desc }}</div>
                  </div>
                </div>
                <q-toggle v-model="item.value" color="primary" />
              </div>
            </div>
          </div>
        </div>

        <q-separator class="q-my-lg" />

        <!-- SEÇÃO 3: Vendas -->
        <div class="q-mb-xl">
          <div class="row items-center q-mb-md">
            <q-icon
              name="shopping_cart"
              size="24px"
              color="primary"
              class="q-mr-sm"
            />
            <div class="text-h6 text-bold">Vendas</div>
          </div>
          <div class="row q-col-gutter-md">
            <div
              v-for="(item, index) in vendas"
              :key="'vend-' + index"
              class="col-12 col-md-6"
            >
              <div
                class="row items-center justify-between q-pa-md border rounded-borders"
              >
                <div class="row items-center">
                  <q-icon
                    :name="item.icon"
                    size="28px"
                    color="primary"
                    class="q-mr-md"
                  />
                  <div>
                    <div class="text-subtitle1">{{ item.title }}</div>
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
        </div>

        <q-separator class="q-my-lg" />

        <!-- SEÇÃO 4: Sistema -->
        <div class="q-mb-xl">
          <div class="row items-center q-mb-md">
            <q-icon
              name="computer"
              size="24px"
              color="primary"
              class="q-mr-sm"
            />
            <div class="text-h6 text-bold">Sistema</div>
          </div>
          <div class="row q-col-gutter-md">
            <div
              v-for="(item, index) in sistema"
              :key="'sist-' + index"
              class="col-12 col-md-6"
            >
              <div
                class="row items-center justify-between q-pa-md border rounded-borders"
              >
                <div class="row items-center">
                  <q-icon
                    :name="item.icon"
                    size="28px"
                    color="primary"
                    class="q-mr-md"
                  />
                  <div>
                    <div class="text-subtitle1">{{ item.title }}</div>
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
        </div>

        <q-separator class="q-my-lg" />

        <!-- SEÇÃO 5: Caixa -->
        <div class="q-mb-xl">
          <div class="row items-center q-mb-md">
            <q-icon
              name="point_of_sale"
              size="24px"
              color="primary"
              class="q-mr-sm"
            />
            <div class="text-h6 text-bold">Caixa</div>
          </div>
          <div class="row q-col-gutter-md">
            <div
              v-for="(item, index) in caixa"
              :key="'caixa-' + index"
              class="col-12 col-md-6"
            >
              <div
                class="row items-center justify-between q-pa-md border rounded-borders"
              >
                <div class="row items-center">
                  <q-icon
                    :name="item.icon"
                    size="28px"
                    color="primary"
                    class="q-mr-md"
                  />
                  <div>
                    <div class="text-subtitle1">{{ item.title }}</div>
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
        </div>

        <!-- Botão de Salvar Configurações -->
        <div class="row justify-end q-mt-xl">
          <q-btn
            label="Salvar Todas as Alterações"
            color="positive"
            unelevated
            icon="save"
            @click="salvarConfig()"
          />
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
      message: 'Todas as configurações foram salvas com sucesso!',
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
/* Garante que o card não mude de tamanho */
.q-card {
  transition: none !important;
}
</style>
