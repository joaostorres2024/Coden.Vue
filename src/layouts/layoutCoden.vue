<template>
  <q-layout view="hHh Lpr lFf">
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="300"
      :content-class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-1'"
    >
      <div class="col-12 column no-wrap full-height">
        <q-item class="q-pt-md b-r-10 no-wrap items-center" to="/">
          <img
            class="q-mb-sm"
            style="width: 120px"
            :src="$q.dark.isActive ? require('../assets/Logo Coden Branca.png') : require('../assets/Logo Coden.png')"
            alt="Logo Coden"
          />
        </q-item>

        <q-list>
          <q-expansion-item
            icon="o_group"
            label="Cadastro"
            header-class="menu-header b-r-10"
            expand-separator
          >
            <q-item
              class="b-r-10 q-my-xs q-pl-lg"
              clickable
              v-ripple
              @click="$router.push('/CadastroPessoas')"
            >
              <q-item-section avatar>
                <q-icon name="o_groups" />
              </q-item-section>

              <q-item-section> Cadastro Pessoas </q-item-section>
            </q-item>

            <q-item
              class="b-r-10 q-my-xs q-pl-lg"
              clickable
              v-ripple
              @click="$router.push('/CadastroProdutos')"
            >
              <q-item-section avatar>
                <q-icon name="shelves" />
              </q-item-section>

              <q-item-section> Cadastro Produtos </q-item-section>
            </q-item>
          </q-expansion-item>

          <q-expansion-item
            icon="o_paid"
            label="Financeiro"
            header-class="menu-header b-r-10"
            expand-separator
          >
            <q-item
              class="b-r-10 q-my-xs q-pl-lg"
              clickable
              v-ripple
              @click="$router.push('/NotaFiscalEntrada')"
            >
              <q-item-section avatar>
                <q-icon name="trending_up" />
              </q-item-section>

              <q-item-section> NF Entrada </q-item-section>
            </q-item>

            <q-item
              class="b-r-10 q-my-xs q-pl-lg"
              clickable
              v-ripple
              @click="$router.push('/NotaFiscalSaida')"
            >
              <q-item-section avatar>
                <q-icon name="trending_down" />
              </q-item-section>

              <q-item-section> NF Saída </q-item-section>
            </q-item>
          </q-expansion-item>

          <q-expansion-item
            label="Relatórios"
            icon="o_article"
            header-class="menu-header b-r-10"
            expand-separator
          >
            <q-item
              class="b-r-10 q-my-xs q-pl-lg"
              clickable
              v-ripple
              @click="$router.push('/RelatorioEstoque')"
            >
              <q-item-section avatar>
                <q-icon name="o_inventory" />
              </q-item-section>

              <q-item-section> Relatório Estoque </q-item-section>
            </q-item>

            <q-item
              class="b-r-10 q-my-xs q-pl-lg"
              clickable
              v-ripple
              @click="$router.push('/RelatorioVendas')"
            >
              <q-item-section avatar>
                <q-icon name="o_sell" />
              </q-item-section>

              <q-item-section> Relatório Vendas </q-item-section>
            </q-item>
          </q-expansion-item>
          <q-item
            class="menu-header b-r-10"
            clickable
            v-ripple
            @click="$router.push('/VendaBalcao')"
          >
            <q-item-section avatar>
              <q-icon name="point_of_sale" />
            </q-item-section>

            <q-item-section>Vendas Balcão</q-item-section>
          </q-item>
        </q-list>
        <q-list class="column margin-auto q-pt-lg q-pb-md">
          <q-item
            class="b-r-10 q-mx-xs"
            @click="toggleDark()"
            clickable
            v-ripple
            to=""
          >
            <q-item-section avatar>
              <q-icon name="dark_mode" />
            </q-item-section>

            <q-item-section>Modo Escuro/Claro</q-item-section>
          </q-item>
          <q-item
            class="b-r-10 q-mx-xs"
            clickable
            v-ripple
            @click="$router.push('/Configuracoes')"
          >
            <q-item-section avatar>
              <q-icon name="o_settings" />
            </q-item-section>

            <q-item-section>Configurações</q-item-section>
          </q-item>
          <q-item
            class="b-r-10 q-mx-xs"
            clickable
            v-ripple
            @click="$router.push('/Perfil')"
          >
            <q-item-section avatar>
              <q-icon name="o_account_circle" />
            </q-item-section>

            <q-item-section>Perfil</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <!-- CONTEÚDO -->
    <q-page-container>
      <q-page padding>
        <router-view />
      </q-page>
    </q-page-container>

    <!-- FOOTER -->
    <q-footer bordered>
      <div class="row justify-center bg-grey-8">
        © 2026 Coden —
        <a href="" style="text-decoration: underline; color: white"
          >Todos os direitos reservados</a
        >
        | Versão Alpha
      </div>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { ref } from 'vue'
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class ModuleComponent extends Vue {

  created(){
    const leftDrawerOpen = ref(true)
  }

  toggleDark(){
    this.$q.dark.toggle()
  }

  // ===== data =====
  user = ''
  password = ''

  logoSrc () {
    return this.$q.dark.isActive
      ? require('../assets/Logo Coden Branca.png')
      : require('../assets/Logo Coden.png')
  }

  }
</script>

<style>
.b-r-10 {
  border-radius: 10px;
}

.margin-auto {
  margin-top: auto;
}
</style>
