<template>
  <q-layout view="hHh Lpr lFf">

    <!-- CABEÇALHO -->
    <q-header unelevated :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'" class="layout-header">
      <q-toolbar>
        <q-btn
          id="layout-btn-menu"
          flat
          dense
          round
          color="black"
          icon="menu"
          aria-label="Menu"
          class="layout-btn-menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title>
          <img
            style="width: 90px; vertical-align: middle; margin-top: -10px"
            :src="$q.dark.isActive
              ? require('../assets/Logo Coden Branca.png')
              : require('../assets/Logo Coden.png')"
            alt="Logo Coden"
            class="cursor-pointer q-mr-lg layout-logo"
            id="layout-logo"
            @click="$router.push('/')"
          />
          <span class="text-bold text-black"> Olá, </span>
          <span class="text-bold text-primary layout-usuario-nome">{{ user }}</span>
        </q-toolbar-title>
        <div class="q-mx-sm">
          <q-btn
            icon="o_notifications"
            class="text-black"
            unelevated
            onclick="alert('Função em Desenvolvimento')"
          />
        </div>
        <div
          class="row items-center q-gutter-sm cursor-pointer q-mr-sm layout-perfil-trigger"
          id="layout-perfil-trigger"
          @click="drawerPerfil = !drawerPerfil"
        >
          <q-avatar size="36px" color="primary" text-color="white" class="layout-avatar">
  <img v-if="logo" :src="logo" style="object-fit: cover; width: 100%; height: 100%; border-radius: 50%;" />
  <span v-else>{{ iniciais }}</span>
</q-avatar>
          <div class="column" style="line-height: 1.2">
            <span class="text-black text-weight-bold layout-perfil-nome" style="font-size: 13px">{{ user }}</span>
            <span class="text-grey-6" style="font-size: 11px">Configurações e Perfil</span>
          </div>
          <q-icon name="expand_more" color="black" />
        </div>
      </q-toolbar>
    </q-header>

    <!-- DRAWER ESQUERDO -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="260"
      :content-class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'"
      class="layout-drawer-menu"
    >
      <div class="column no-wrap full-height">
        <q-separator class="q-mb-sm bg-grey-8" />

        <q-scroll-area style="flex: 1">
          <q-list class="q-px-sm q-py-xs">

            <!-- Dashboard -->
            <q-item
              id="layout-menu-dashboard"
              clickable
              v-ripple
              class="menu-item b-r-10 q-mb-xs text-white layout-menu-dashboard"
              :class="$route.path === '/' ? 'menu-item-active' : ''"
              @click="$router.push('/')"
            >
              <q-item-section avatar>
                <q-icon name="o_dashboard" size="20px" color="white" />
              </q-item-section>
              <q-item-section class="menu-label">Dashboard</q-item-section>
            </q-item>

            <!-- Cadastro -->
            <div class="menu-section-label q-px-sm q-mt-md q-mb-xs">CADASTRO</div>

            <q-item
              id="layout-menu-pessoas"
              clickable
              v-ripple
              class="menu-item b-r-10 q-mb-xs text-white layout-menu-pessoas"
              :class="$route.path === '/CadastroPessoas' ? 'menu-item-active' : ''"
              @click="$router.push('/CadastroPessoas')"
            >
              <q-item-section avatar>
                <q-icon name="o_groups" size="20px" color="white" />
              </q-item-section>
              <q-item-section class="menu-label">Pessoas</q-item-section>
            </q-item>

            <q-item
              id="layout-menu-produtos"
              clickable
              v-ripple
              class="menu-item b-r-10 q-mb-xs text-white layout-menu-produtos"
              :class="$route.path === '/CadastroProdutos' ? 'menu-item-active' : ''"
              @click="$router.push('/CadastroProdutos')"
            >
              <q-item-section avatar>
                <q-icon name="shelves" size="20px" color="white" />
              </q-item-section>
              <q-item-section class="menu-label">Produtos</q-item-section>
            </q-item>

            <!-- Financeiro -->
            <div class="menu-section-label q-px-sm q-mt-md q-mb-xs">FINANCEIRO</div>

            <q-item
              id="layout-menu-nf-entrada"
              clickable
              v-ripple
              class="menu-item b-r-10 q-mb-xs text-white layout-menu-nf-entrada"
              :class="$route.path === '/NotaFiscalEntrada' ? 'menu-item-active' : ''"
              @click="$router.push('/NotaFiscalEntrada')"
            >
              <q-item-section avatar>
                <q-icon name="trending_up" size="20px" color="white" />
              </q-item-section>
              <q-item-section class="menu-label">NF Entrada</q-item-section>
            </q-item>

            <q-item
              id="layout-menu-nf-saida"
              clickable
              v-ripple
              class="menu-item b-r-10 q-mb-xs text-white layout-menu-nf-saida"
              :class="$route.path === '/NotaFiscalSaida' ? 'menu-item-active' : ''"
              @click="$router.push('/NotaFiscalSaida')"
            >
              <q-item-section avatar>
                <q-icon name="trending_down" size="20px" color="white" />
              </q-item-section>
              <q-item-section class="menu-label">NF Saída</q-item-section>
            </q-item>

            <!-- Relatórios -->
            <div class="menu-section-label q-px-sm q-mt-md q-mb-xs">RELATÓRIOS</div>

            <q-item
              id="layout-menu-rel-estoque"
              clickable
              v-ripple
              class="menu-item b-r-10 q-mb-xs text-white layout-menu-rel-estoque"
              :class="$route.path === '/RelatorioEstoque' ? 'menu-item-active' : ''"
              @click="$router.push('/RelatorioEstoque')"
            >
              <q-item-section avatar>
                <q-icon name="o_inventory_2" size="20px" color="white" />
              </q-item-section>
              <q-item-section class="menu-label">Estoque</q-item-section>
            </q-item>

            <q-item
              id="layout-menu-rel-vendas"
              clickable
              v-ripple
              class="menu-item b-r-10 q-mb-xs text-white layout-menu-rel-vendas"
              :class="$route.path === '/RelatorioVendas' ? 'menu-item-active' : ''"
              @click="$router.push('/RelatorioVendas')"
            >
              <q-item-section avatar>
                <q-icon name="o_sell" size="20px" color="white" />
              </q-item-section>
              <q-item-section class="menu-label">Vendas</q-item-section>
            </q-item>

            <!-- Outros -->
            <div class="menu-section-label q-px-sm q-mt-md q-mb-xs">OUTROS</div>

            <q-item
              id="layout-menu-venda-direta"
              clickable
              v-ripple
              class="menu-item b-r-10 q-mb-xs text-white layout-menu-venda-direta"
              :class="$route.path === '/VendaDireta' ? 'menu-item-active' : ''"
              @click="$router.push('/VendaDireta')"
            >
              <q-item-section avatar>
                <q-icon name="point_of_sale" size="20px" color="white" />
              </q-item-section>
              <q-item-section class="menu-label">Venda Direta</q-item-section>
            </q-item>

            <q-item
              id="layout-menu-integracoes"
              clickable
              v-ripple
              class="menu-item b-r-10 q-mb-xs text-white layout-menu-integracoes"
              :class="$route.path === '/Integracoes' ? 'menu-item-active' : ''"
              @click="$router.push('/Integracoes')"
            >
              <q-item-section avatar>
                <q-icon name="webhook" size="20px" color="white" />
              </q-item-section>
              <q-item-section class="menu-label">Integrações</q-item-section>
            </q-item>

            <q-item
              id="layout-menu-integracoes"
              clickable
              v-ripple
              class="menu-item b-r-10 q-mb-xs text-white layout-menu-integracoes"
              :class="$route.path === '/Whatsapp' ? 'menu-item-active' : ''"
              @click="$router.push('/Whatsapp')"
            >
              <q-item-section avatar>
                <q-icon name="fab fa-whatsapp" size="20px" color="white" />
              </q-item-section>
              <q-item-section class="menu-label">Whatsapp</q-item-section>
            </q-item>

            <q-item
              id="layout-menu-integracoes"
              clickable
              v-ripple
              class="menu-item b-r-10 q-mb-xs text-white layout-menu-integracoes"
              :class="$route.path === '/Agentes' ? 'menu-item-active' : ''"
              @click="$router.push('/Agentes')"
            >
              <q-item-section avatar>
                <q-icon name="support_agent" size="20px" color="white" />
              </q-item-section>
              <q-item-section class="menu-label">Agentes de IA</q-item-section>
            </q-item>

          </q-list>
        </q-scroll-area>
      </div>
    </q-drawer>

    <!-- OVERLAY PERFIL -->
    <template v-if="drawerPerfil">
      <div class="fixed-full" style="z-index: 1999; background: transparent" @click="drawerPerfil = false" />
    </template>

    <!-- DRAWER PERFIL -->
    <q-drawer
      v-model="drawerPerfil"
      side="right"
      overlay
      bordered
      :width="260"
      :breakpoint="0"
      style="z-index: 2000"
      class="layout-drawer-perfil"
    >
      <div class="column full-height">
        <div class="q-pa-lg row items-center q-gutter-md layout-perfil-header">
          <q-avatar size="48px" color="primary" text-color="white" class="layout-perfil-avatar">
  <img v-if="logo" :src="logo" style="object-fit: cover; width: 100%; height: 100%; border-radius: 50%;" />
  <span v-else>{{ iniciais }}</span>
</q-avatar>
          <div class="column">
            <span class="text-weight-bold layout-perfil-drawer-nome" style="font-size: 14px">{{ user }}</span>
            <span class="text-grey-6" style="font-size: 12px">Administrador</span>
          </div>
        </div>
        <q-separator />
        <q-list class="q-pa-sm q-mt-sm">
          <q-item
            id="layout-perfil-ir-perfil"
            clickable
            v-ripple
            class="b-r-8 layout-perfil-ir-perfil"
            @click="$router.push('/Perfil'); drawerPerfil = false"
          >
            <q-item-section avatar><q-icon name="business" color="grey-7" size="20px" /></q-item-section>
            <q-item-section><span style="font-size: 13px">Perfil da Empresa</span></q-item-section>
          </q-item>
          <q-item
            id="layout-perfil-toggle-dark"
            clickable
            v-ripple
            class="b-r-8 layout-perfil-toggle-dark"
            @click="toggleDark(); drawerPerfil = false"
          >
            <q-item-section avatar><q-icon :name="$q.dark.isActive ? 'light_mode' : 'dark_mode'" color="grey-7" size="20px" /></q-item-section>
            <q-item-section><span style="font-size: 13px">{{ $q.dark.isActive ? 'Modo Claro' : 'Modo Escuro' }}</span></q-item-section>
          </q-item>
          <a style="text-decoration: none; color: black;" href="https://orus-vue.onrender.com" target="_blank">
          <q-item
            id="layout-perfil-helpdesk"
            clickable
            v-ripple
            class="b-r-8 layout-perfil-helpdesk"
          >
            <q-item-section avatar><q-icon name="support_agent" color="grey-7" size="20px" /></q-item-section>
            <q-item-section>
              <span style="font-size: 13px">Helpdesk</span>
            </q-item-section>
          </q-item>
          </a>
        </q-list>
        <q-space />
        <q-separator />
        <q-list class="q-pa-sm">
          <q-item
            id="layout-perfil-sair"
            clickable
            v-ripple
            class="b-r-8 layout-perfil-sair"
            @click="Sair()"
          >
            <q-item-section avatar><q-icon name="logout" color="negative" size="20px" /></q-item-section>
            <q-item-section><span class="text-negative" style="font-size: 13px">Sair</span></q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

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
        <a href="" style="text-decoration: underline; color: white">Todos os direitos reservados</a>
        | Versão Alpha
      </div>
    </q-footer>

  </q-layout>
</template>

  <script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import estabelecimentoService from '../services/estabelecimentoService'

@Component
export default class ModuleComponent extends Vue {

  leftDrawerOpen = true
  drawerPerfil = false
  user = ''
  logo = ''

  async created() {
    const token = localStorage.getItem('token')
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]))
      this.user = payload.nome ?? localStorage.getItem('nomeUsuario') ?? ''
    }
    await this.carregarLogo()
  }

  async carregarLogo() {
    try {
      const dados = await estabelecimentoService.buscar()
      this.logo = dados.logo || ''
    } catch {
      this.logo = ''
    }
  }

  get iniciais(): string {
    if (!this.user) return '?'
    const partes = this.user.trim().split(' ')
    const primeira = partes[0]?.[0] ?? ''
    const segunda = partes[1]?.[0] ?? ''
    return (primeira + segunda).toUpperCase()
  }

  toggleDark() {
    this.$q.dark.toggle()
  }

  Sair() {
    localStorage.removeItem('token')
    this.$router.push('/login')
  }
}
  </script>

  <style>
  .b-r-10 { border-radius: 10px; }
  .margin-auto { margin-top: auto; }
  .q-expansion-item__toggle-icon { color: white; }

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
  .menu-item {
    color: white;
    min-height: 40px;
    transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.18s ease;
    will-change: transform;
  }
  .menu-item:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
  .menu-item:active {
    transform: translateY(1px);
  }
  .menu-item-active {
    background: rgba(255, 255, 255, 0.22);
    font-weight: 600;
    transform: translateY(0) !important;
  }
  .menu-footer {
    transition: background 0.18s ease;
  }
  .menu-footer:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  .menu-label {
    font-size: 13px;
  }
  .menu-section-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.45);
  }
  </style>
