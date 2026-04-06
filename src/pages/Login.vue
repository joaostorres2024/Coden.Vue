<template>
  <div class="row col-12">
    <div class="column col-6 justify-center items-center imagem-tela2" style="height: 100vh;">
      <img style="width: 300px;" src="../assets/Logo Coden.png" alt="">
    </div>
    <div class="column col-6 justify-center items-center imagem-tela b-r-20" style="height: 100vh;">
      <q-card class="column q-pa-lg items-center justify-center">
        <div>
          Bem-vindo ao sistema Coden, faça login para continuar.
        </div>
        <div style="width: 100%;">
          <form action="" class="column items-center justify-center">
          <q-input v-model="user" class="full-width q-my-md" label="Usuário" outlined dense/>
          <q-input v-model="password" class="full-width" label="Senha" type="password" outlined dense/>
          <q-btn class="full-width q-mt-md verde text-white text-bold" label="Entrar" to="/"/>
        </form>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class ModuleComponent extends Vue {
  // ===== data =====
  user = ''
  password = ''

  }
</script>

<style scoped>
.imagem-tela{
  background: url(../assets/Tela.jpg);
  background-position: center;
  background-size: cover;
}

.imagem-tela2{
  background: url(../assets/Tela 2.jpg);
  background-position: center;
  background-size: cover;
}

.b-r-20{
  border-radius: 0 0 0 20px;
}

.verde {
  background-color: #11b69a;
}
</style>
