<template>
  <div class="row justify-center items-center">
    <q-card
      class="col-11 col-md-10 col-lg-9 no-shadow border b-r-10"
      style="width: 1500px"
    >
      <q-card-section class="bg-white text-primary q-pb-none">
        <div class="text-h5 text-bold">Integrações</div>
        <q-toolbar class="q-pa-none">
          <q-breadcrumbs
            active-color="primary"
            style="font-size: 14px"
            class="q-mb-md"
          >
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el label="Home" icon="home" to="/" />
            <q-breadcrumbs-el label="Integrações" icon="webhook" />
          </q-breadcrumbs>
        </q-toolbar>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="inicioIntegracoes" class="q-pa-lg">
        <div class="row q-pb-md items-center" style="margin-top: -10px">
          Caso não saiba como fazer uma integração, clique aqui para ver o
          tutorial:
          <span
            ><q-icon
              class="cursor-pointer"
              color="orange"
              name="o_info"
              size="18px"
              style="margin-bottom: 1.5px; margin-left: 5px"
          /></span>
        </div>
        <div class="row items-center justify-between q-gutter-sm">
          <q-input
            class="col-3"
            label="Pesquise pelo nome da integração"
            outlined
            v-model="busca"
            dense
          />
        </div>
        <div class="q-mt-lg">
          <div class="row q-col-gutter-md">
            <div
              v-for="m in marketplacesFiltrados"
              :key="m.nome"
              class="col-12 col-sm-6 col-md-4"
            >
              <q-card
                class="row items-center justify-between q-pa-md b-r-10 border no-shadow"
              >
                <div class="row items-center q-col-gutter-md">
                  <img :src="m.logo" style="width: 50px" />

                  <div class="column">
                    <p class="text-h6 text-bold q-ma-none">{{ m.nome }}</p>
                    <p class="q-ma-none">{{ m.tipo }}</p>
                  </div>
                </div>

                <q-btn
                  label="Adicionar"
                  unelevated
                  class="btn-outline-primary text-primary"
                  @click="conectarIntegracao(m)"
                />
              </q-card>
            </div>

            <div v-if="marketplacesFiltrados.length === 0">
              Nenhuma integração encontrada
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section v-if="conectarIntegracoes">
        <div>
          <div class="row items-center q-gutter-md">
            <img :src="marketplaceSelecionado.logo" style="width: 40px;" alt="">
            <div class="text-bold text-h5">Integração com {{ marketplaceSelecionado.nome }}</div>
          </div>
          <div class="row q-gutter-sm q-mt-md">
           <q-input
            class="col-4"
            label="Nome da Integração"
            v-model="formularioIntegracao.nome"
            outlined
            dense
          />
          <q-btn
          class="btn-outline-primary text-primary"
          unelevated
          :label="'Conectar com ' + marketplaceSelecionado.nome"
          />
          </div>
          <div class="q-py-md q-pl-xs">
            <p>Ao clicar no botão, você será redirecionado para a página do {{ marketplaceSelecionado.nome}} para realizar a autenticação e conectar sua conta com segurança.</p>
          </div>
          <div class="row justify-end">
            <q-btn
              label="Cancelar"
              color="negative"
              flat
              @click="abrirDialogCancelar()"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="dialogCancelar" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"
            >Deseja realmente cancelar? As alterações não salvas serão
            perdidas.</span
          >
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Não" color="primary" v-close-popup />
          <q-btn
            flat
            label="Sim, Cancelar"
            color="negative"
            @click="confirmarCancelamento()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class ModuleComponent extends Vue {
  conectarIntegracoes = false
  inicioIntegracoes = true
  dialogCancelar = false

  marketplaceSelecionado: any = null

  formularioIntegracao: any = {
    nome: ''
  }

  busca = ''
  marketplaces = [
  {
    nome: 'Shopee',
    tipo: 'Marketplace',
    logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjRkU1MDAwIiBkPSJNMTUuOTQxIDE3Ljk2M2MuMjMtMS44NzktLjk4LTMuMDc3LTQuMTc1LTQuMDk3Yy0xLjU0OC0uNTI4LTIuMjc3LTEuMjItMi4yNi0yLjE3MWMuMDY1LTEuMDU2IDEuMDQ4LTEuODI1IDIuMzUyLTEuODVhNS4zIDUuMyAwIDAgMSAyLjg4My44OWMuMTE2LjA3Mi4xOTcuMDYuMjYzLS4wNGMuMDktLjE0NC4zMTUtLjQ5My4zOS0uNjJjLjA1MS0uMDguMDYxLS4xODYtLjA2OC0uMjhjLS4xODUtLjEzNy0uNzA0LS40MTUtLjk4My0uNTMyYTYuNSA2LjUgMCAwIDAtMi41MTEtLjUxNGMtMS45MS4wMDgtMy40MTMgMS4yMTUtMy41NCAyLjgyNnEtLjEyMiAxLjc0NiAxLjczIDIuODI3Yy4yNjMuMTUyIDEuNjguNzE2IDIuMjQ0Ljg5MmMxLjc3NC41NTIgMi42OTUgMS41NDIgMi40NzggMi42OTdjLS4xOTcgMS4wNDctMS4yOTkgMS43MjQtMi44MTggMS43NDRjLTEuMjAzLS4wNDYtMi4yODctLjUzNy0zLjEyNy0xLjE5bC0uMTQxLS4xMWMtLjEwNC0uMDgtLjIxOC0uMDc1LS4yODcuMDNjLS4wNS4wNzctLjM3Ni41NDctLjQ1OC42N2MtLjA3Ny4xMDgtLjAzNS4xNjguMDQ1LjIzNGMuMzUuMjkzLjgxNy42MTMgMS4xMzQuNzc1YTYuNyA2LjcgMCAwIDAgMi44MjkuNzI3YTQuOSA0LjkgMCAwIDAgMi4wNzUtLjM1NGMxLjA5NS0uNDY1IDEuODAzLTEuMzk0IDEuOTQ1LTIuNTU0TTEyIDEuNDAxYy0yLjA2OCAwLTMuNzU0IDEuOTUtMy44MzMgNC4zOWg3LjY2NUMxNS43NTEgMy4zNSAxNC4wNjYgMS40IDEyIDEuNG03Ljg1MSAyMi41OThsLS4wOC4wMDFsLTE1Ljc4NC0uMDAyYy0xLjA3NC0uMDQtMS44NjMtLjkxLTEuOTcxLTEuOTkxbC0uMDEtLjE5NWwtLjcwNy0xNS41MjZhLjQ2LjQ2IDAgMCAxIC40NS0uNDk0aDQuOTc1QzYuODQ1IDIuNTY4IDkuMTYgMCAxMiAwczUuMTUzIDIuNTY5IDUuMjc1IDUuNzloNC45NjhhLjQ2LjQ2IDAgMCAxIC40NTguNDgzbC0uNzczIDE1LjU4OGwtLjAwNy4xMzFjLS4wOTQgMS4wOTQtLjk3OSAxLjk3Ny0yLjA3IDIuMDA2Ii8+PC9zdmc+'
  },
  {
    nome: 'Mercado Livre',
    tipo: 'Marketplace',
    logo: 'https://cdn.iconscout.com/icon/free/png-256/free-mercado-livre-icon-svg-download-png-14549372.png'
  }
]

get marketplacesFiltrados() {
  if (!this.busca) return this.marketplaces

  return this.marketplaces.filter(m =>
    m.nome.toLowerCase().startsWith(this.busca.toLowerCase())
  )
}

 conectarIntegracao(marketplace: any){
  this.marketplaceSelecionado = marketplace
  this.formularioIntegracao = {
    nome: marketplace.nome
  }
  this.conectarIntegracoes = true
  this.inicioIntegracoes = false
}

confirmarCancelamento() {
    this.dialogCancelar = false
    this.conectarIntegracoes = false
    this.inicioIntegracoes = true
  }

  abrirDialogCancelar(){
    this.dialogCancelar = true
  }
}
</script>

<style scoped>
.border {
  border: 1px solid #ccc;
}
.b-r-10 {
  border-radius: 10px;
}
.btn-outline-primary {
  border: 1.5px solid #ccc;
  background-color: #f0e9f5 !important;
}
.marketplace-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}
.marketplace-icon svg {
  width: 24px;
  height: 24px;
}
</style>
