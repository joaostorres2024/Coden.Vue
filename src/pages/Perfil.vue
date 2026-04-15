<template>
  <div class="">
    <div class="q-pt-md text-h5 text-bold">Perfil</div>
    <q-toolbar class="q-pa-none">
        <q-breadcrumbs active-color="primary" style="font-size: 14px" class="q-mb-md">
          <template v-slot:separator>
        <q-icon
          size="1.5em"
          name="chevron_right"
          color="primary"
        />
      </template>
          <q-breadcrumbs-el label="Home" icon="home" to="/" />
          <q-breadcrumbs-el label="Perfil" icon="account_circle" />
        </q-breadcrumbs>
      </q-toolbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class ModuleComponent extends Vue {
}
</script>

<style scoped></style>
