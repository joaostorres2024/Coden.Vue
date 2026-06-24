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
        style="width: 100%; max-width: 420px"
      >
        <div class="text-h5 text-bold login-titulo">Bem-vindo ao sistema Coden!</div>

        <div class="login-subtitulo">Faça login para continuar.</div>

        <form id="login-form" @submit.prevent="realizarLogin">
          <q-input
            v-model="email"
            class="full-width q-my-md login-input-email"
            label="E-mail"
            outlined
            dense
            input-id="login-input-email"
          />

          <q-input
            :type="verSenha ? 'text' : 'password'"
            class="full-width login-input-senha"
            label="Senha"
            v-model="senha"
            outlined
            dense
            input-id="login-input-senha"
          >
            <template v-slot:append>
              <q-icon
                :name="verSenha ? 'visibility_off' : 'visibility'"
                class="cursor-pointer login-toggle-senha"
                id="login-toggle-senha"
                @click="verSenha = !verSenha"
              />
            </template>
          </q-input>

          <q-btn
            class="full-width q-mt-md bg-primary text-white text-bold login-btn-entrar"
            label="Entrar"
            type="submit"
            :loading="loading"
            id="login-btn-entrar"
          />

          <q-btn
            unelevated
            class="full-width q-mt-md bg-transparent text-black login-btn-esqueci-senha"
            label="Esqueci minha senha"
            id="login-btn-esqueci-senha"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { authService } from '../services/authService'

@Component
export default class LoginComponent extends Vue {
  usuario = ''
  email = ''
  senha = ''
  erro = ''
  loading = false
  verSenha = false

  async realizarLogin() {
    this.erro = ''
    this.loading = true

    try {
      await authService.login({ email: this.email, senha: this.senha })
      this.$router.push('/')
      this.$q.notify({ color: 'positive', message: 'Bem-vindo ' + this.email, icon: 'check' })
    } catch (err: any) {
      this.$q.notify({
        color: 'negative',
        message: err.response?.data || 'Erro ao realizar login',
        icon: 'error'
      })
    } finally {
      this.loading = false
    }
  }
}
</script>

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
