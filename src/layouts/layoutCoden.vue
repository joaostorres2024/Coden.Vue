<template>
  <q-layout view="hHh LpR fFf">
    <!-- CABEÇALHO -->
    <q-header
      unelevated
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
      class="layout-header"
    >
      <q-toolbar>
        <q-toolbar-title class="row items-center no-wrap">
          <img
            style="width: 80px; vertical-align: middle; margin-bottom: 2px"
            :src="
              $q.dark.isActive
                ? require('../assets/Logo Coden Branca.png')
                : require('../assets/Logo Coden Azul.png')
            "
            alt="Logo Coden"
            class="cursor-pointer q-mr-md layout-logo"
            id="layout-logo"
            @click="$router.push('/')"
          />

          <!-- MENU DROPDOWN HORIZONTAL -->
          <div class="row items-center no-wrap gt-sm layout-menu-topo">
            <!-- Dashboard (link direto, sem dropdown) -->
            <q-btn
              id="layout-menu-dashboard"
              flat
              no-caps
              dense
              class="menu-top-btn q-px-md"
              :class="$route.path === '/' ? 'menu-top-btn-active' : ''"
              label="Dashboard"
              @click="$router.push('/')"
            />

            <!-- Cadastro -->
            <q-btn
              id="layout-menu-cadastro"
              flat
              no-caps
              dense
              class="menu-top-btn q-px-md"
              :class="
                ['/CadastroPessoas', '/CadastroProdutos'].includes($route.path)
                  ? 'menu-top-btn-active'
                  : ''
              "
              label="Cadastro"
              icon-right="expand_more"
            >
              <q-menu
                anchor="bottom left"
                self="top left"
                content-class="menu-dropdown-panel"
                :offset="[-5, 13]"
              >
                <q-list class="q-py-sm" style="min-width: 250px">
                  <div class="menu-dropdown-titulo q-px-md q-pb-xs q-my-sm">
                    Cadastros
                  </div>

                  <q-item
                    id="layout-menu-pessoas"
                    clickable
                    v-ripple
                    v-close-popup
                    class="menu-dropdown-item"
                    @click="$router.push('/CadastroPessoas')"
                  >
                    <q-item-section avatar>
                      <q-icon name="groups" color="grey-7" size="20px" />
                    </q-item-section>
                    <q-item-section>Pessoas</q-item-section>
                  </q-item>

                  <q-item
                    id="layout-menu-produtos"
                    clickable
                    v-ripple
                    v-close-popup
                    class="menu-dropdown-item"
                    @click="$router.push('/CadastroProdutos')"
                  >
                    <q-item-section avatar>
                      <q-icon name="shelves" color="grey-7" size="20px" />
                    </q-item-section>
                    <q-item-section>Produtos</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>

            <!-- Financeiro -->
            <q-btn
              id="layout-menu-financeiro"
              flat
              no-caps
              dense
              class="menu-top-btn q-px-md"
              :class="
                [
                  '/ControleFiscal',
                  '/NotaFiscalEntrada',
                  '/NotaFiscalSaida',
                ].includes($route.path)
                  ? 'menu-top-btn-active'
                  : ''
              "
              label="Financeiro"
              icon-right="expand_more"
            >
              <q-menu
                anchor="bottom left"
                self="top left"
                content-class="menu-dropdown-panel"
                :offset="[-5, 13]"
              >
                <q-list class="q-py-sm" style="min-width: 260px">
                  <div class="menu-dropdown-titulo q-px-md q-my-sm q-pb-xs">
                    Financeiro
                  </div>

                  <q-item
                    id="layout-menu-controle-fiscal"
                    clickable
                    v-ripple
                    v-close-popup
                    class="menu-dropdown-item"
                    @click="$router.push('/ControleFiscal')"
                  >
                    <q-item-section avatar>
                      <q-icon name="date_range" color="grey-7" size="20px" />
                    </q-item-section>
                    <q-item-section>Calendário Fiscal</q-item-section>
                  </q-item>

                  <q-item
                    id="layout-menu-nf-entrada"
                    clickable
                    v-ripple
                    v-close-popup
                    class="menu-dropdown-item"
                    @click="$router.push('/NotaFiscalEntrada')"
                  >
                    <q-item-section avatar>
                      <q-icon name="trending_up" color="grey-7" size="20px" />
                    </q-item-section>
                    <q-item-section>NF Entrada</q-item-section>
                  </q-item>

                  <q-item
                    id="layout-menu-nf-saida"
                    clickable
                    v-ripple
                    v-close-popup
                    class="menu-dropdown-item"
                    @click="$router.push('/NotaFiscalSaida')"
                  >
                    <q-item-section avatar>
                      <q-icon name="trending_down" color="grey-7" size="20px" />
                    </q-item-section>
                    <q-item-section>NF Saída</q-item-section>
                  </q-item>

                  <q-item
                    id="layout-menu-nf-saida"
                    clickable
                    v-ripple
                    v-close-popup
                    class="menu-dropdown-item"
                    @click="$router.push('/ContasAPagar')"
                  >
                    <q-item-section avatar>
                      <q-icon name="payments" color="grey-7" size="20px" />
                    </q-item-section>
                    <q-item-section>Contas a Pagar</q-item-section>
                  </q-item>

                  <q-item
                    id="layout-menu-nf-saida"
                    clickable
                    v-ripple
                    v-close-popup
                    class="menu-dropdown-item"
                    @click="$router.push('/ContasAReceber')"
                  >
                    <q-item-section avatar>
                      <q-icon name="savings" color="grey-7" size="20px" />
                    </q-item-section>
                    <q-item-section>Contas a Receber</q-item-section>
                  </q-item>

                  <q-item
                    id="layout-menu-nf-saida"
                    clickable
                    v-ripple
                    v-close-popup
                    class="menu-dropdown-item"
                    @click="$router.push('/FormasPagamento')"
                  >
                    <q-item-section avatar>
                      <q-icon name="credit_card" color="grey-7" size="20px" />
                    </q-item-section>
                    <q-item-section>Formas de Pagamento</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>

            <!-- Relatórios -->
            <q-btn
              id="layout-menu-relatorios"
              flat
              no-caps
              dense
              class="menu-top-btn q-px-md"
              :class="
                ['/RelatorioEstoque', '/RelatorioVendas'].includes($route.path)
                  ? 'menu-top-btn-active'
                  : ''
              "
              label="Relatórios"
              icon-right="expand_more"
            >
              <q-menu
                anchor="bottom left"
                self="top left"
                content-class="menu-dropdown-panel"
                :offset="[-5, 13]"
              >
                <q-list class="q-py-sm" style="min-width: 250px">
                  <div class="menu-dropdown-titulo q-px-md q-my-sm q-pb-xs">
                    Relatórios
                  </div>

                  <q-item
                    id="layout-menu-rel-estoque"
                    clickable
                    v-ripple
                    v-close-popup
                    class="menu-dropdown-item"
                    @click="$router.push('/RelatorioEstoque')"
                  >
                    <q-item-section avatar>
                      <q-icon name="inventory_2" color="grey-7" size="20px" />
                    </q-item-section>
                    <q-item-section>Estoque</q-item-section>
                  </q-item>

                  <q-item
                    id="layout-menu-rel-vendas"
                    clickable
                    v-ripple
                    v-close-popup
                    class="menu-dropdown-item"
                    @click="$router.push('/RelatorioVendas')"
                  >
                    <q-item-section avatar>
                      <q-icon name="sell" color="grey-7" size="20px" />
                    </q-item-section>
                    <q-item-section>Vendas</q-item-section>
                  </q-item>

                  <q-item
                    id="layout-menu-rel-vendas"
                    clickable
                    v-ripple
                    v-close-popup
                    class="menu-dropdown-item"
                    @click="$router.push('/CurvaABC')"
                  >
                    <q-item-section avatar>
                      <q-icon name="analytics" color="grey-7" size="20px" />
                    </q-item-section>
                    <q-item-section>Curva ABC</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>

            <!-- Outros -->
            <q-btn
              id="layout-menu-outros"
              flat
              no-caps
              dense
              class="menu-top-btn q-px-md"
              :class="
                ['/VendaDireta', '/Integracoes'].includes($route.path)
                  ? 'menu-top-btn-active'
                  : ''
              "
              label="Serviços"
              icon-right="expand_more"
            >
              <q-menu
                anchor="bottom left"
                self="top left"
                content-class="menu-dropdown-panel"
                :offset="[-5, 13]"
              >
                <q-list class="q-py-sm" style="min-width: 250px">
                  <div class="menu-dropdown-titulo q-px-md q-my-sm q-pb-xs">
                    Serviços
                  </div>

                  <q-item
                    id="layout-menu-venda-direta"
                    clickable
                    v-ripple
                    v-close-popup
                    class="menu-dropdown-item"
                    @click="$router.push('/VendaDireta')"
                  >
                    <q-item-section avatar>
                      <q-icon name="point_of_sale" color="grey-7" size="20px" />
                    </q-item-section>
                    <q-item-section>Venda Direta</q-item-section>
                  </q-item>

                  <q-item
                    id="layout-menu-integracoes"
                    clickable
                    v-ripple
                    v-close-popup
                    class="menu-dropdown-item"
                    @click="$router.push('/Integracoes')"
                  >
                    <q-item-section avatar>
                      <q-icon name="webhook" color="grey-7" size="20px" />
                    </q-item-section>
                    <q-item-section>Integrações</q-item-section>
                  </q-item>

                  <q-item
                    id="layout-menu-integracoes"
                    clickable
                    v-ripple
                    v-close-popup
                    class="menu-dropdown-item"
                    @click="$router.push('/Contratos')"
                  >
                    <q-item-section avatar>
                      <q-icon name="article" color="grey-7" size="20px" />
                    </q-item-section>
                    <q-item-section>Contratos</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </q-toolbar-title>

        <div class="q-mx-md">
          <q-btn
            icon="notifications"
            class="text-black"
            size="12px"
            unelevated
            onclick="alert('Função em Desenvolvimento')"
          />
        </div>

        <div
          class="row items-center q-gutter-sm cursor-pointer q-mr-sm layout-perfil-trigger"
          id="layout-perfil-trigger"
        >
          <q-avatar
            size="36px"
            color="primary"
            text-color="white"
            class="layout-avatar"
          >
            <img
              v-if="logo"
              :src="logo"
              style="
                object-fit: cover;
                width: 100%;
                height: 100%;
                border-radius: 50%;
              "
            />
            <span v-else>{{ iniciais }}</span>
          </q-avatar>
          <div class="column" style="line-height: 1.2">
            <span
              class="text-black text-weight-bold layout-perfil-nome"
              style="font-size: 13px"
              >{{ user }}</span
            >
            <span class="text-grey-6" style="font-size: 11px"
              >Configurações e Perfil</span
            >
          </div>
          <q-icon name="expand_more" color="black" />

          <q-menu
            anchor="bottom right"
            self="top right"
            content-class="menu-dropdown-panel"
            :offset="[0, 10]"
          >
            <q-list class="q-pa-sm" style="min-width: 260px">
              <q-item
                id="layout-perfil-ir-perfil"
                clickable
                v-ripple
                v-close-popup
                class="menu-dropdown-item"
                @click="$router.push('/Perfil')"
              >
                <q-item-section avatar>
                  <q-icon name="business" color="grey-7" size="20px" />
                </q-item-section>
                <q-item-section>
                  <span style="font-size: 13px">Perfil da Empresa</span>
                </q-item-section>
              </q-item>

              <q-item
                id="layout-perfil-toggle-dark"
                clickable
                v-ripple
                v-close-popup
                class="menu-dropdown-item"
                @click="toggleDark()"
              >
                <q-item-section avatar>
                  <q-icon
                    :name="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
                    color="grey-7"
                    size="20px"
                  />
                </q-item-section>
                <q-item-section>
                  <span style="font-size: 13px">{{
                    $q.dark.isActive ? "Modo Claro" : "Modo Escuro"
                  }}</span>
                </q-item-section>
              </q-item>

              <a
                style="text-decoration: none; color: black"
                href="https://orus-vue.onrender.com"
                target="_blank"
              >
                <q-item
                  id="layout-perfil-helpdesk"
                  clickable
                  v-ripple
                  v-close-popup
                  class="menu-dropdown-item"
                >
                  <q-item-section avatar>
                    <q-icon name="support_agent" color="grey-7" size="20px" />
                  </q-item-section>
                  <q-item-section>
                    <span style="font-size: 13px">Helpdesk</span>
                  </q-item-section>
                </q-item>
              </a>

              <q-item
                id="layout-perfil-ir-perfil"
                clickable
                v-ripple
                v-close-popup
                class="menu-dropdown-item"
                @click="$router.push('/Configuracoes')"
              >
                <q-item-section avatar>
                  <q-icon name="settings" color="grey-7" size="20px" />
                </q-item-section>
                <q-item-section>
                  <span style="font-size: 13px">Configurações</span>
                </q-item-section>
              </q-item>

              <q-separator class="q-my-xs" />

              <q-item
                id="layout-perfil-sair"
                clickable
                v-ripple
                v-close-popup
                class="menu-dropdown-item"
                @click="Sair()"
              >
                <q-item-section avatar>
                  <q-icon name="logout" color="negative" size="20px" />
                </q-item-section>
                <q-item-section>
                  <span class="text-negative" style="font-size: 13px"
                    >Sair</span
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
      </q-toolbar>
    </q-header>

    <!-- CONTEÚDO -->
    <q-page-container>
      <q-page class="bg-accent q-px-lg">
        <transition name="page" mode="out-in">
          <router-view />
        </transition>
      </q-page>
    </q-page-container>

    <!-- FOOTER -->
    <q-footer bordered class="layout-footer">
      <div class="row justify-center bg-grey-8">
        © 2026 Coden —
        <a href="" style="text-decoration: underline; color: white"
          >Todos os direitos reservados</a
        >
        | Versão Alpha
      </div>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import estabelecimentoService from "../services/estabelecimentoService";

@Component
export default class ModuleComponent extends Vue {
  user = "";
  logo = "";

  async created() {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(
        new TextDecoder().decode(
          Uint8Array.from(atob(token.split(".")[1]), (c) => c.charCodeAt(0)),
        ),
      );
      this.user = payload.nome ?? localStorage.getItem("nomeUsuario") ?? "";
    }
    await this.carregarLogo();
  }

  async carregarLogo() {
    try {
      const dados = await estabelecimentoService.buscar();
      this.logo = dados.logo || "";
    } catch {
      this.logo = "";
    }
  }

  get iniciais(): string {
    if (!this.user) return "?";
    const partes = this.user.trim().split(" ");
    const primeira = partes[0]?.[0] ?? "";
    const segunda = partes[1]?.[0] ?? "";
    return (primeira + segunda).toUpperCase();
  }

  toggleDark() {
    this.$q.dark.toggle();
  }

  Sair() {
    localStorage.removeItem("token");
    this.$router.push("/login");
  }
}
</script>

<style>
:root {
  --menu-color-primary: #1976d2;
  --menu-color-primary-bg: #f5faff;
  --menu-color-text: #444;
  --menu-color-text-dark: #ddd;
  --menu-color-title: #1a1a1a;
  --menu-radius: 8px;
}

.b-r-10 {
  border-radius: 10px;
}
.margin-auto {
  margin-top: auto;
}
/* .q-expansion-item__toggle-icon {
  color: white;
} */

.layout-header {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  margin-bottom: 10px;
}

.page-enter-active {
  animation: pageIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.page-leave-active {
  animation: pageOut 0.25s cubic-bezier(0.55, 0, 1, 0.45) forwards;
}

@keyframes pageIn {
  0% {
    opacity: 0;
    transform: translateY(12px) scale(0.99);
    filter: blur(4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes pageOut {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-8px) scale(0.99);
    filter: blur(2px);
  }
}

.menu-top-btn {
  color: var(--menu-color-text);
  font-size: 14px;
  font-weight: 700;
  border-radius: var(--menu-radius);
  transition: background 0.15s ease, color 0.15s ease;
}
.menu-top-btn:hover,
.menu-top-btn:hover .q-icon {
  color: var(--menu-color-primary);
}
.menu-top-btn .q-icon {
  font-size: 14px;
  color: inherit;
}
.body--dark .menu-top-btn {
  color: var(--menu-color-text-dark);
}
.body--dark .menu-top-btn:hover,
.body--dark .menu-top-btn:hover .q-icon {
  background: rgba(255, 255, 255, 0.08);
  color: var(--menu-color-primary);
}

/* PAINEL DO DROPDOWN */
.menu-dropdown-panel {
  border-radius: 0 0 10px 10px;
  box-shadow: 0 6px 12px -4px rgba(0, 0, 0, 0.15);
}
.menu-dropdown-titulo {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--menu-color-title);
}

/* ITENS DO DROPDOWN */
.menu-dropdown-item {
  min-height: 38px;
  border-radius: 6px;
  margin: 0 6px;
  width: calc(100% - 12px);
  color: var(--menu-color-text);
  transition: background 0.15s ease, color 0.15s ease;
}
.menu-dropdown-item:hover,
.menu-dropdown-item:hover .q-icon {
  color: var(--menu-color-primary) !important;
}
.body--dark .menu-dropdown-item {
  color: var(--menu-color-text-dark);
}
.body--dark .menu-dropdown-item:hover,
.body--dark .menu-dropdown-item:hover .q-icon {
  background: rgba(255, 255, 255, 0.08);
  color: var(--menu-color-primary) !important;
}

/* Item "Sair" mantém vermelho no hover, não azul */
.menu-dropdown-item:has(.text-negative):hover,
.menu-dropdown-item:has(.text-negative):hover .q-icon {
  color: #c10015 !important;
}

.menu-label {
  font-size: 13px;
}
/* .menu-section-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.45);
} */
</style>
