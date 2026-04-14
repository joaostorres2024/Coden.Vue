<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-bar
        class="q-px-lg row bg-black text-white items-center q-gutter-sm q-pa-lg"
      >
        <div class="q-mr-lg cursor-pointer" @click="$router.push('/Admin')">
          Coden Administradores
        </div>
        <div
          class="cursor-pointer"
          @click="$router.push('/AdminUsuario')"
          active-class="text-orange"
        >
          Usuários
        </div>
      </q-bar>
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
export default class LayoutAdmin extends Vue {}
</script>
