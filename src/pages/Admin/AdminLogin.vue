<template>
  <div class="flex flex-center fullscreen bg-grey-2">
    <q-card flat bordered style="width: 350px; max-width: 90vw">
      <q-card-section class="text-center q-pb-none">
        <div class="text-h6">Coden Administradores</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmitLogin" class="q-gutter-y-sm">
          <q-input
            v-model="loginForm.usuario"
            outlined
            dense
            label="Usuário"
            :rules="[val => !!val || 'Obrigatório']"
            hide-bottom-space
          />

          <q-input
            v-model="loginForm.senha"
            outlined
            dense
            label="Senha"
            type="password"
            :rules="[val => !!val || 'Obrigatório']"
            hide-bottom-space
          />

          <q-btn
            label="Entrar"
            type="submit"
            color="primary"
            unelevated
            class="full-width q-mt-md"
            :loading="loadingLogin"
          />
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-pt-none">
        <q-btn
          label="Recuperar senha"
          flat
          dense
          color="grey-7"
          size="sm"
          @click="onRecoverPassword"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class LoginPageSimple extends Vue {
  private loginForm = {
    usuario: '',
    senha: ''
  }
  private loadingLogin = false

  async onSubmitLogin(): Promise<void> {
    this.loadingLogin = true
    console.log('Login:', this.loginForm)
    // Simulação de delay
    setTimeout(() => {
      this.loadingLogin = false
      this.$q.notify({ color: 'positive', message: 'Bem-vindo!' })
      this.$router.push('/Admin')
    }, 800)
  }

  onRecoverPassword(): void {
    this.$q.dialog({
      title: 'Recuperar Senha',
      message: 'Enviamos um e-mail para o endereço cadastrado com as instruções de recuperação.',
      ok: { color: 'primary', label: 'Entendido', unelevated: true }
    })
  }
}
</script>

<style scoped>
.fullscreen {
  height: 100vh;
  width: 100vw;
}
</style>
