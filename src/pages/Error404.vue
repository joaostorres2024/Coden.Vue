<template>
  <div class="fullscreen bg-white text-center q-pa-md flex flex-center erro404-container">
    <div>
      <div class="erro404-codigo" style="font-size: 10vh">404</div>

      <div class="text-h5 erro404-mensagem" style="opacity: 0.4">Página não encontrada...</div>

      <q-btn
        id="erro404-btn-voltar"
        class="q-mt-xl erro404-btn-voltar"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="VOLTAR"
        no-caps
      />
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound'
})
</script>
