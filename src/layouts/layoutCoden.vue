<template>
  <q-layout view="hHh Lpr lFf">
    <!-- CABEÇALHO -->
    <q-header unelevated :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          color="black"
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          <img
            style="width: 90px; vertical-align: middle; margin-top: -10px"
            :src="require('../assets/Logo Coden.png')"
            alt="Logo Coden"
            @click="$router.push('/')"
            class="cursor-pointer q-mr-lg"
          />
          <span class="text-bold text-black"> Olá, </span><span class="text-bold text-primary">{{ user }}</span>
        </q-toolbar-title>

        <q-space />

        <div
          class="row items-center q-gutter-sm cursor-pointer q-mr-sm"
          @click="drawerPerfil = !drawerPerfil"
        >
          <q-avatar size="36px" color="primary" text-color="white">
            {{ iniciais }}
          </q-avatar>
          <div class="column" style="line-height: 1.2">
            <span
              class="text-black text-weight-bold"
              style="font-size: 13px"
              >{{ user }}</span
            >
            <span class="text-grey-6" style="font-size: 11px"
              >Configurações e Perfil</span
            >
          </div>
          <q-icon name="expand_more" color="black" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="260"
      :content-class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'"
    >
      <div class="col-12 column no-wrap full-height">
        <q-list>
          <q-item
            class="menu-header text-white"
            clickable
            v-ripple
            @click="$router.push('/')"
          >
            <q-item-section avatar
              ><q-icon name="o_dashboard"
            /></q-item-section>
            <q-item-section>Dashboard</q-item-section>
          </q-item>

          <q-expansion-item
            icon="o_group"
            label="Cadastro"
            header-class="menu-header text-white"
            expand-separator
          >
            <q-item
              class="q-my-xs q-pl-lg text-white"
              clickable
              v-ripple
              @click="$router.push('/CadastroPessoas')"
            >
              <q-item-section avatar><q-icon name="o_groups" /></q-item-section>
              <q-item-section>Cadastro Pessoas</q-item-section>
            </q-item>
            <q-item
              class="q-my-xs q-pl-lg text-white"
              clickable
              v-ripple
              @click="$router.push('/CadastroProdutos')"
            >
              <q-item-section avatar><q-icon name="shelves" /></q-item-section>
              <q-item-section>Cadastro Produtos</q-item-section>
            </q-item>
          </q-expansion-item>

          <q-expansion-item
            icon="o_paid"
            label="Financeiro"
            header-class="menu-header text-white"
            expand-separator
          >
            <q-item
              class="q-my-xs q-pl-lg text-white"
              clickable
              v-ripple
              @click="$router.push('/NotaFiscalEntrada')"
            >
              <q-item-section avatar
                ><q-icon name="trending_up"
              /></q-item-section>
              <q-item-section>NF Entrada</q-item-section>
            </q-item>
            <q-item
              class="q-my-xs q-pl-lg text-white"
              clickable
              v-ripple
              @click="$router.push('/NotaFiscalSaida')"
            >
              <q-item-section avatar
                ><q-icon name="trending_down"
              /></q-item-section>
              <q-item-section>NF Saída</q-item-section>
            </q-item>
          </q-expansion-item>

          <q-expansion-item
            label="Relatórios"
            icon="o_article"
            header-class="menu-header text-white"
            expand-separator
          >
            <q-item
              class="q-my-xs q-pl-lg text-white"
              clickable
              v-ripple
              @click="$router.push('/RelatorioEstoque')"
            >
              <q-item-section avatar
                ><q-icon name="o_inventory"
              /></q-item-section>
              <q-item-section>Relatório Estoque</q-item-section>
            </q-item>
            <q-item
              class="q-my-xs q-pl-lg text-white"
              clickable
              v-ripple
              @click="$router.push('/RelatorioVendas')"
            >
              <q-item-section avatar><q-icon name="o_sell" /></q-item-section>
              <q-item-section>Relatório Vendas</q-item-section>
            </q-item>
          </q-expansion-item>

          <q-item
            class="menu-header text-white"
            clickable
            v-ripple
            @click="$router.push('/Integracoes')"
          >
            <q-item-section avatar><q-icon name="webhook" /></q-item-section>
            <q-item-section>Integrações</q-item-section>
          </q-item>
          <q-item
            class="menu-header text-white"
            clickable
            v-ripple
            @click="$router.push('/Whatsapp')"
          >
            <q-item-section avatar
              ><q-icon name="fab fa-whatsapp"
            /></q-item-section>
            <q-item-section>Whatsapp</q-item-section>
          </q-item>

          <q-item
            class="menu-header text-white"
            clickable
            v-ripple
            @click="$router.push('/VendaBalcao')"
          >
            <q-item-section avatar
              ><q-icon name="point_of_sale"
            /></q-item-section>
            <q-item-section>Vendas Balcão</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>
    <template v-if="drawerPerfil">
      <div
        class="fixed-full"
        style="z-index: 1999; background: transparent"
        @click="drawerPerfil = false"
      />
    </template>

    <q-drawer
  v-model="drawerPerfil"
  side="right"
  overlay
  bordered
  :width="260"
  :breakpoint="0"
  style="z-index: 2000"
>
  <div class="column full-height">

    <!-- Header -->
    <div class="q-pa-lg row items-center q-gutter-md">
      <q-avatar size="48px" color="primary" text-color="white">
        {{ iniciais }}
      </q-avatar>
      <div class="column">
        <span class="text-weight-bold" style="font-size: 14px">{{ user }}</span>
        <span class="text-grey-6" style="font-size: 12px">Administrador</span>
      </div>
    </div>

    <q-separator />

    <!-- Menu -->
    <q-list class="q-pa-sm q-mt-sm">
      <q-item clickable v-ripple class="b-r-8" @click="$router.push('/Perfil'); drawerPerfil = false">
        <q-item-section avatar><q-icon name="business" color="grey-7" size="20px" /></q-item-section>
        <q-item-section><span style="font-size: 13px">Perfil da Empresa</span></q-item-section>
      </q-item>

      <q-item clickable v-ripple class="b-r-8" @click="toggleDark(); drawerPerfil = false">
        <q-item-section avatar><q-icon :name="$q.dark.isActive ? 'light_mode' : 'dark_mode'" color="grey-7" size="20px" /></q-item-section>
        <q-item-section><span style="font-size: 13px">{{ $q.dark.isActive ? 'Modo Claro' : 'Modo Escuro' }}</span></q-item-section>
      </q-item>

      <q-item clickable v-ripple class="b-r-8" @click="$router.push('/Configuracoes'); drawerPerfil = false">
        <q-item-section avatar><q-icon name="settings" color="grey-7" size="20px" /></q-item-section>
        <q-item-section><span style="font-size: 13px">Configurações</span></q-item-section>
      </q-item>


      <q-item clickable v-ripple class="b-r-8" disable>
        <q-item-section avatar><q-icon name="support_agent" color="grey-4" size="20px" /></q-item-section>
        <q-item-section>
          <span style="font-size: 13px" class="text-grey-5">Helpdesk</span>
          <span class="text-caption text-grey-4">Em breve</span>
        </q-item-section>
      </q-item>
    </q-list>

    <q-space />

    <q-separator />

    <q-list class="q-pa-sm">
      <q-item clickable v-ripple class="b-r-8" @click="Sair()">
        <q-item-section avatar><q-icon name="logout" color="negative" size="20px" /></q-item-section>
        <q-item-section><span class="text-negative" style="font-size: 13px">Sair</span></q-item-section>
      </q-item>
    </q-list>

  </div>
</q-drawer>
    <!-- CONTEÚDO -->
    <q-page-container>
      <q-page class="bg-accent" padding>
        <router-view />
      </q-page>
    </q-page-container>

    <!-- FOOTER -->
    <q-footer bordered>
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
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class ModuleComponent extends Vue {

  leftDrawerOpen = true
  drawerPerfil = false
  user = ''

created() {
  const token = localStorage.getItem('token')
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]))
    this.user = payload.nome ?? localStorage.getItem('nomeUsuario') ?? ''
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

  logoSrc() {
    return this.$q.dark.isActive
      ? require('../assets/Logo Coden Branca.png')
      : require('../assets/Logo Coden.png')
  }

  Sair() {
    localStorage.removeItem('token')
    this.$router.push('/login')
  }
}
</script>

<style>
.b-r-10 {
  border-radius: 10px;
}

.margin-auto {
  margin-top: auto;
}

.q-expansion-item__toggle-icon {
  color: white;
}
</style>
