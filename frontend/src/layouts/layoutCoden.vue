<template>
  <q-layout view="hHh Lpr lFf">
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="300"
      :content-style="{ backgroundColor: '#FAFAFA' }"
    >
      <div class="col-12 column bg-grey-1 q-pa-sm">
        <q-item to="/">
          <img class="q-mb-sm justify-center" style="width: 150px;" src="../assets/Logo Coden.png" alt="">
        </q-item>

        <q-list>

          <q-expansion-item
          icon="group"
          label="Cadastro"
          header-class="b-r-10 menu-header"
        >
          <q-item class="b-r-10 q-my-xs q-ml-md" clickable v-ripple to="">
            <q-item-section avatar>
              <q-icon name="groups" />
            </q-item-section>

            <q-item-section>
              Cadastro Pessoas
            </q-item-section>
          </q-item>

          <q-item class="b-r-10 q-my-xs q-ml-md" clickable v-ripple to="">
            <q-item-section avatar>
              <q-icon name="shelves" />
            </q-item-section>

            <q-item-section>
              Cadastro Produtos
            </q-item-section>
          </q-item>
        </q-expansion-item>

        <q-expansion-item
          icon="paid"
          label="Financeiro"
          header-class="b-r-10 menu-header"
        >
          <q-item class="b-r-10 q-my-xs q-ml-md" clickable v-ripple to="">
            <q-item-section avatar>
              <q-icon name="trending_up" />
            </q-item-section>

            <q-item-section>
              NF Entrada
            </q-item-section>
          </q-item>

          <q-item class="b-r-10 q-my-xs q-ml-md" clickable v-ripple to="">
            <q-item-section avatar>
              <q-icon name="trending_down" />
            </q-item-section>

            <q-item-section>
              NF Saída
            </q-item-section>
          </q-item>

        </q-expansion-item>

        <q-expansion-item
          label="Relatórios"
          icon="article"
          header-class="b-r-10 menu-header"
        >
          <q-item class="b-r-10 q-my-xs q-ml-md" clickable v-ripple to="">
            <q-item-section avatar>
              <q-icon name="inventory" />
            </q-item-section>

            <q-item-section>
              Relatório Estoque
            </q-item-section>
          </q-item>

          <q-item class="b-r-10 q-my-xs q-ml-md" clickable v-ripple to="">
            <q-item-section avatar>
              <q-icon name="sell" />
            </q-item-section>

            <q-item-section>
              Relatório Vendas
            </q-item-section>
          </q-item>

          <q-item class="b-r-10 q-my-xs q-ml-md" clickable v-ripple to="">
            <q-item-section avatar>
              <q-icon name="shopping_cart" />
            </q-item-section>

            <q-item-section>
              Relatório Compras
            </q-item-section>
          </q-item>
        </q-expansion-item>

        <q-expansion-item
          label="Vendas"
          icon="shop"
          header-class="b-r-10 menu-header"
        >
          <q-item class="b-r-10 q-my-xs q-ml-md" clickable v-ripple to="">
            <q-item-section avatar>
              <q-icon name="point_of_sale" />
            </q-item-section>

            <q-item-section>
              Venda Balcão
            </q-item-section>
          </q-item>

          <q-item class="b-r-10 q-my-xs q-ml-md" clickable v-ripple to="">
            <q-item-section avatar>
              <q-icon name="receipt" />
            </q-item-section>

            <q-item-section>
              NF Venda
            </q-item-section>
          </q-item>
        </q-expansion-item>
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
      <!-- vazio -->
    </q-footer>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(true)
</script>

<style>
.b-r-10{
  border-radius: 10px;
}

.menu-header:hover {
  background: #11B69A;
  color: white;
}

</style>
