<template>
  <div>
    <div class="text-h5 text-bold q-py-md">Configurações</div>

    <!-- Tabs -->
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="start"
      narrow-indicator
    >
      <q-tab name="tab1" label="Notificações"/>
      <q-tab name="tab2" label="Pagamento"/>
      <q-tab name="tab3" label="Vendas" />
      <q-tab name="tab4" label="Sistema"/>
      <q-tab name="tab5" label="Caixa"/>
    </q-tabs>

    <!-- Conteúdo das Tabs -->
    <q-tab-panels v-model="tab" animated class="q-pa-none q-mt-md">
      <!-- TAB 1 -->
      <q-tab-panel name="tab1">
        <q-list class="column">
          <q-item class="q-px-none">
            <div
              class="row items-center justify-between q-pa-sm border"
              style="width: 40vw"
            >
              <div class="row items-center">
                <div class="q-ml-md">
                  <q-icon name="notifications" size="28px" color="primary" />
                </div>
                <div class="q-pa-none q-ml-lg">
                  <p class="q-ma-none" style="font-size: 18px;">Alertas de Vendas</p>
                  <p class="q-ma-none">Notificar ao concluir venda</p>
                </div>
              </div>
              <div>
                <q-toggle v-model="notificarVenda" />
              </div>
            </div>
          </q-item>

          <q-item class="q-px-none">
            <div
              class="row items-center justify-between q-pa-sm border"
              style="width: 40vw"
            >
              <div class="row items-center">
                <div class="q-ml-md">
                  <q-icon name="inventory_2" size="28px" color="primary" />
                </div>
                <div class="q-pa-none q-ml-lg">
                  <p class="q-ma-none" style="font-size: 18px;">Estoque Baixo</p>
                  <p class="q-ma-none">Alertar ao estoque atingir mínimo</p>
                </div>
              </div>
              <div>
                <q-toggle v-model="estoqueBaixo" />
              </div>
            </div>
          </q-item>

          <q-item class="q-px-none">
            <div
              class="row items-center justify-between q-pa-sm border"
              style="width: 40vw"
            >
              <div class="row items-center">
                <div class="q-ml-md">
                  <q-icon name="alarm" size="28px" color="primary" />
                </div>
                <div class="q-pa-none q-ml-lg">
                  <p class="q-ma-none" style="font-size: 18px;">Alertas automáticos</p>
                  <p class="q-ma-none">Notificar quando produto baixar</p>
                </div>
              </div>
              <div>
                <q-toggle v-model="alertaAutomatico" />
              </div>
            </div>
          </q-item>
        </q-list>
      </q-tab-panel>

      <!-- TAB 2 -->
      <q-tab-panel name="tab2">
        <q-list class="column">
          <q-item class="q-px-none">
            <div
              class="row items-center justify-between q-pa-sm border"
              style="width: 40vw"
            >
              <div class="row items-center">
                <div class="q-ml-md">
                  <q-icon name="credit_card" size="28px" color="primary" />
                </div>
                <div class="q-pa-none q-ml-lg">
                  <p class="q-ma-none" style="font-size: 18px;">Cartão de Crédito</p>
                  <p class="q-ma-none">Aceitar pagamento por crédito</p>
                </div>
              </div>
              <div>
                <q-toggle v-model="aceitarCartaoCredito" />
              </div>
            </div>
          </q-item>

          <q-item class="q-px-none">
            <div
              class="row items-center justify-between q-pa-sm border"
              style="width: 40vw"
            >
              <div class="row items-center">
                <div class="q-ml-md">
                  <q-icon name="credit_card" size="28px" color="primary" />
                </div>
                <div class="q-pa-none q-ml-lg">
                  <p class="q-ma-none" style="font-size: 18px;">Cartão de Débito</p>
                  <p class="q-ma-none">Aceitar pagamento por débito</p>
                </div>
              </div>
              <div>
                <q-toggle v-model="aceitarCartaoDebito" />
              </div>
            </div>
          </q-item>

          <q-item class="q-px-none">
            <div
              class="row items-center justify-between q-pa-sm border"
              style="width: 40vw"
            >
              <div class="row items-center">
                <div class="q-ml-md">
                  <q-icon name="pix" size="28px" color="primary" />
                </div>
                <div class="q-pa-none q-ml-lg">
                  <p class="q-ma-none" style="font-size: 18px;">PIX</p>
                  <p class="q-ma-none">Aceitar pagamento por PIX</p>
                </div>
              </div>
              <div>
                <q-toggle v-model="aceitarPix" />
              </div>
            </div>
          </q-item>

          <q-item class="q-px-none">
            <div
              class="row items-center justify-between q-pa-sm border"
              style="width: 40vw"
            >
              <div class="row items-center">
                <div class="q-ml-md">
                  <q-icon name="attach_money" size="28px" color="primary" />
                </div>
                <div class="q-pa-none q-ml-lg">
                  <p class="q-ma-none" style="font-size: 18px;">Dinheiro</p>
                  <p class="q-ma-none">Aceitar pagamento por Dinheiro</p>
                </div>
              </div>
              <div>
                <q-toggle v-model="alertaAutomatico" />
              </div>
            </div>
          </q-item>
        </q-list>
      </q-tab-panel>

      <!-- TAB 3 -->
      <q-tab-panel name="tab3">
        <q-list class="column">
          <q-item class="q-px-none">
            <div
              class="row items-center justify-between q-pa-sm border"
              style="width: 40vw"
            >
              <div class="row items-center">
                <div class="q-ml-md">
                  <q-icon name="person" size="28px" color="primary" />
                </div>
                <div class="q-pa-none q-ml-lg">
                  <p class="q-ma-none" style="font-size: 18px;">Cliente Padrão</p>
                  <p class="q-ma-none">
                    Permitir vendas sem identificação de cliente
                  </p>
                </div>
              </div>
              <div>
                <q-toggle v-model="clientePadrao" />
              </div>
            </div>
          </q-item>

          <q-item class="q-px-none">
            <div
              class="row items-center justify-between q-pa-sm border"
              style="width: 40vw"
            >
              <div class="row items-center">
                <div class="q-ml-md">
                  <q-icon name="block" size="28px" color="primary" />
                </div>
                <div class="q-pa-none q-ml-lg">
                  <p class="q-ma-none" style="font-size: 18px;">Bloquear Venda sem Estoque</p>
                  <p class="q-ma-none">
                    Impedir venda com saldo de estoque negativo
                  </p>
                </div>
              </div>
              <div>
                <q-toggle v-model="bloquearVendaSemEstoque" />
              </div>
            </div>
          </q-item>

          <q-item class="q-px-none">
            <div
              class="row items-center justify-between q-pa-sm border"
              style="width: 40vw"
            >
              <div class="row items-center">
                <div class="q-ml-md">
                  <q-icon name="percent" size="28px" color="primary" />
                </div>
                <div class="q-pa-none q-ml-lg">
                  <p class="q-ma-none" style="font-size: 18px;">Desconto por Vendedor</p>
                  <p class="q-ma-none">Permitir que vendedor altere o preço</p>
                </div>
              </div>
              <div>
                <q-toggle v-model="permissaoDesconto" />
              </div>
            </div>
          </q-item>

          <q-item class="q-px-none">
            <div
              class="row items-center justify-between q-pa-sm border"
              style="width: 40vw"
            >
              <div class="row items-center">
                <div class="q-ml-md">
                  <q-icon name="person" size="28px" color="primary" />
                </div>
                <div class="q-pa-none q-ml-lg">
                  <p class="q-ma-none" style="font-size: 18px;">Desconto Máximo</p>
                  <p class="q-ma-none">
                    Definir limite de desconto: {{ limiteDesconto }}
                  </p>
                </div>
              </div>
              <div>
                <q-btn flat dense icon="chevron_right" color="grey" />
              </div>
            </div>
          </q-item>

          <q-item class="q-px-none">
            <div
              class="row items-center justify-between q-pa-sm border"
              style="width: 40vw"
            >
              <div class="row items-center">
                <div class="q-ml-md">
                  <q-icon name="warning" size="28px" color="primary" />
                </div>
                <div class="q-pa-none q-ml-lg">
                  <p class="q-ma-none" style="font-size: 18px;">Requer aprovação de gerente</p>
                  <p class="q-ma-none">Para descontos acima do limite</p>
                </div>
              </div>
              <div>
                <q-toggle v-model="aprovacaoGerenteDesconto" />
              </div>
            </div>
          </q-item>
        </q-list>
      </q-tab-panel>

      <!-- TAB 4 -->
      <q-tab-panel name="tab4">
        <q-list class="column">
          <q-item class="q-px-none">
            <div
              class="row items-center justify-between q-pa-sm border"
              style="width: 40vw"
            >
              <div class="row items-center">
                <div class="q-ml-md">
                  <q-icon name="language" size="28px" color="primary" />
                </div>
                <div class="q-pa-none q-ml-lg">
                  <p class="q-ma-none" style="font-size: 18px;">Idioma</p>
                  <p class="q-ma-none">Idioma Definido: {{ idiomaDefinido }}</p>
                </div>
              </div>
              <div>
                <q-btn flat dense icon="chevron_right" color="grey" />
              </div>
            </div>
          </q-item>
        </q-list>
      </q-tab-panel>

      <!-- TAB 5 -->
      <q-tab-panel name="tab5">
        <q-list class="column">
          <q-item class="q-px-none">
            <div
              class="row items-center justify-between q-pa-sm border"
              style="width: 40vw"
            >
              <div class="row items-center">
                <div class="q-ml-md">
                  <q-icon name="point_of_sale" size="28px" color="primary" />
                </div>
                <div class="q-pa-none q-ml-lg">
                  <p class="q-ma-none" style="font-size: 18px;">Gerenciamento de Caixa</p>
                  <p class="q-ma-none">Gerenciamento de caixas e operadores</p>
                </div>
              </div>
              <div>
                <q-btn @click="$router.push('/GerenciamentoCaixa')" flat dense icon="chevron_right" color="grey" />
              </div>
            </div>
          </q-item>

          <q-item class="q-px-none">
            <div
              class="row items-center justify-between q-pa-sm border"
              style="width: 40vw"
            >
              <div class="row items-center">
                <div class="q-ml-md">
                  <q-icon name="money" size="28px" color="primary" />
                </div>
                <div class="q-pa-none q-ml-lg">
                  <p class="q-ma-none" style="font-size: 18px;">Troco Inicial</p>
                  <p class="q-ma-none">
                    Valor padrão de abertura: {{ valorAbertura }}
                  </p>
                </div>
              </div>
              <div>
                <q-btn flat dense icon="chevron_right" color="grey" />
              </div>
            </div>
          </q-item>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class ModuleComponent extends Vue {
  // ===== Tabs =====
  tab = 'tab1'

  notificarVenda = false
  estoqueBaixo = false
  alertaAutomatico = false
  aceitarCartaoCredito = false
  aceitarCartaoDebito = false
  aceitarPix = false
  bloquearVendaSemEstoque = false
  permissaoDesconto = false
  clientePadrao = false
  limiteDesconto = "20%"
  aprovacaoGerenteDesconto = false
  idiomaDefinido = "Português PT-BR"
  valorAbertura = "100"

  columns = [
    {
      name: 'produto',
      label: 'Produto',
      field: 'produto',
      align: 'left'
    },
    {
      name: 'quantidade',
      label: 'Quantidade',
      field: 'quantidade',
      align: 'left'
    },
    {
      name: 'valor',
      label: 'Valor',
      field: 'valor',
      align: 'left'
    }
  ]

}
</script>

<style scoped>
.border {
  border: 1px solid rgb(208, 208, 208);
  border-radius: 10px;
}
</style>
