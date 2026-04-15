<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-bar
        class="q-px-lg row bg-black text-white items-center q-gutter-sm q-pa-lg"
      >
        <div 
          class="q-mr-xl cursor-pointer" 
          @click="$router.push('/Admin')"
          :class="{ 'text-orange': isActive('/Admin') }"
        >
          Coden Administradores
        </div>
        <div
          class="cursor-pointer q-mr-sm"
          @click="$router.push('/AdminUsuario')"
          :class="{ 'text-orange': isActive('/AdminUsuario') }"
        >
          Usuários
        </div>
        <div
          class="cursor-pointer"
          @click="$router.push('/AdminEstabelecimento')"
          :class="{ 'text-orange': isActive('/AdminEstabelecimento') }"
        >
          Estabelecimento
        </div>
        <q-space></q-space>
        <div
          class="cursor-pointer"
          @click="$router.push('/AdminLogin')"
        >
          Sair
        </div>
      </q-bar>
      <q-space/>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class LayoutAdmin extends Vue {
  isActive(route: string): boolean {
    return this.$route.path === route
  }
}
</script>

<style scoped>
.text-orange {
  color: #ff9800;
}
</style>
