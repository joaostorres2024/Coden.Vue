<template>
  <div class="fullscreen bg-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 10vh">404</div>

      <div class="text-h5" style="opacity: 0.4">Página não encontrada...</div>

      <q-btn
        class="q-mt-xl"
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
