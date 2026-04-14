<template>
  <div class="row col-12">
    <div
      class="column col-6 justify-center items-center imagem-tela2"
      style="height: 100vh"
    >
      <img style="width: 300px" src="../assets/Logo Coden Branca.png" />
    </div>

    <div
      class="column col-6 justify-center items-center imagem-tela b-r-20"
      style="height: 100vh"
    >
      <div
        class="column q-pa-lg items-left justify-center"
        style="width: 100%; max-width: 400px"
      >
        <div class="text-h5 text-bold">Bem-vindo ao sistema Coden!</div>

        <div class="q-mb-md">Faça login para continuar.</div>

        <form @submit.prevent="realizarLogin">
          <q-input
            v-model="email"
            class="full-width q-my-md"
            label="Email"
            outlined
            dense
          />

          <q-input
            v-model="senha"
            type="password"
            class="full-width"
            label="Senha"
            outlined
            dense
          />

          <q-btn
            class="full-width q-mt-md bg-primary text-white text-bold"
            label="Entrar"
            type="submit"
            :loading="loading"
          />
        </form>

        <div v-if="erro" class="text-negative q-mt-sm">
          {{ erro }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { authService } from '../services/authService'

@Component
export default class ModuleComponent extends Vue {
}
</script>
``

<style scoped>
.imagem-tela2 {
  background: url(../assets/Tela 2.jpg);
  background-position: center;
  background-size: cover;
}

.b-r-20 {
  border-radius: 0 0 0 20px;
}

.verde {
  background-color: #11b69a;
}
</style>
