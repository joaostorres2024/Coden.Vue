<template>
  <div class="column items-center col-12">
    <div class="background">
      <img class="img-logo" src="../assets/Logo Coden Branca.png" alt="" />
    </div>

    <div>
      <q-card
        class="column justify-center q-pa-lg card"
        style="width: 400px; height: 330px"
      >
        <div class="text-h6 text-bold login-titulo">
          Bem-vindo ao sistema Coden!
        </div>
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
            unelevated
            class="full-width q-mt-md bg-primary text-white text-bold login-btn-entrar"
            label="Entrar"
            type="submit"
            :loading="loading"
            id="login-btn-entrar"
          />
          <a
            style="text-decoration: none; color: black"
            href="https://orus-vue.onrender.com"
            target="_blank"
          >
            <q-btn
              unelevated
              class="full-width q-mt-md bg-transparent text-black login-btn-esqueci-senha"
              label="Esqueci minha senha"
              id="login-btn-esqueci-senha"
            />
          </a>
        </form>
      </q-card>
    </div>
    <div class="q-mt-lg">@2026 Coden</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { authService } from "../services/authService";

@Component
export default class LoginComponent extends Vue {
  usuario = "";
  email = "";
  senha = "";
  erro = "";
  loading = false;
  verSenha = false;

  async realizarLogin() {
    this.erro = "";
    this.loading = true;

    try {
      await authService.login({ email: this.email, senha: this.senha });
      this.$router.push("/");
      this.$q.notify({
        color: "positive",
        message: "Bem-vindo " + this.email,
        icon: "check",
      });
    } catch (err: any) {
      this.$q.notify({
        color: "negative",
        message: err.response?.data || "Erro ao realizar login",
        icon: "error",
      });
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style scoped>
.background {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 45vh;
  background: linear-gradient(to right, #3998f7 0%, #1976d2 100%);
}

.img-logo {
  width: 220px;
}

.card {
  border-radius: 10px;
  position: relative;
  bottom: 120px;
  z-index: 1000;
}
</style>
