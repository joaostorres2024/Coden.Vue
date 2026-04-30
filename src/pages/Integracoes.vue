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

      <q-card-section class="q-pa-lg">
        <div class="row q-pb-md items-center" style="margin-top: -10px;">
          Caso não saiba como fazer uma integração, clique aqui para ver o tutorial: <span><q-icon class="cursor-pointer" color="orange" name="o_info" size="18px" style="margin-bottom: 1.5px; margin-left: 5px;"/></span>
        </div>
        <div class="row items-center q-gutter-sm">
          <div class="col-3">
            <q-select
              v-model="marketplace"
              :options="options"
              label="Selecione o Marketplace"
              outlined
              dense
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <span v-html="scope.opt.svg" class="marketplace-icon" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:selected-item="scope">
                <div class="row items-center no-wrap">
                  <span v-html="scope.opt.svg" class="marketplace-icon q-mr-sm" />
                  <span>{{ scope.opt.label }}</span>
                </div>
              </template>
            </q-select>
          </div>

          <q-btn unelevated class="btn-outline-primary" @click="pesquisar()">
            <q-icon name="add" color="primary" />
            <q-tooltip>Nova Integração</q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

// SVGs inline — sem dependência de URL externa
const SVG_ML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24">
  <ellipse cx="24" cy="24" rx="24" ry="24" fill="#FFE600"/>
  <path fill="#2D3277" d="M24 10c-7.7 0-14 6.3-14 14s6.3 14 14 14 14-6.3 14-14S31.7 10 24 10zm0 25c-6.1 0-11-4.9-11-11S17.9 13 24 13s11 4.9 11 11-4.9 11-11 11z"/>
  <circle fill="#2D3277" cx="20" cy="21" r="2"/>
  <circle fill="#2D3277" cx="28" cy="21" r="2"/>
  <path fill="#2D3277" d="M17.5 27s1.5 4 6.5 4 6.5-4 6.5-4h-13z"/>
</svg>`

const SVG_SHOPEE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24">
  <rect width="48" height="48" rx="8" fill="#EE4D2D"/>
  <path fill="white" d="M24 7c-4.4 0-8 3.1-8 7v1h-3l-1 20h24l-1-20h-3v-1c0-3.9-3.6-7-8-7zm0 3c2.8 0 5 1.8 5 4v1H19v-1c0-2.2 2.2-4 5-4zm-9 8h18l.8 16H14.2L15 18z"/>
  <circle fill="white" cx="20" cy="28" r="2.2"/>
  <circle fill="white" cx="28" cy="28" r="2.2"/>
  <path fill="white" d="M20 33s1.2 3 4 3 4-3 4-3h-8z"/>
</svg>`

const SVG_AMAZON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24">
  <rect width="48" height="48" rx="8" fill="#ffffff"/>
  <path fill="#232F3E" d="M8 22.5c0-7.5 7.2-13.5 16-13.5s16 6 16 13.5c0 5-3 9.3-7.5 11.5l1 2C38.5 33.5 43 28.5 43 22.5 43 13.4 34.4 6 24 6S5 13.4 5 22.5c0 6 4.5 11 9.5 13.5l1-2C11 31.8 8 27.5 8 22.5z"/>
  <path fill="#FF9900" d="M13 34c6 4 16 5.5 24 1.5.5-.3.2-1-.4-.7-7.5 3-17 1.5-23-2-.5-.4-1.1.2-.6.5-.0 0 0 0 0 .2z"/>
  <path fill="#FF9900" d="M35 31.5c-.5-.5-3-.2-4-.1-.3 0-.4-.3-.1-.5 2-1.3 5-1 5.5-.4.4.5-.1 3.8-2 5.5-.3.2-.5.1-.4-.2.4-1 1.5-3.8 1-4.3z"/>
  <text x="24" y="26" font-family="Arial" font-size="10" font-weight="bold" fill="#232F3E" text-anchor="middle">amazon</text>
</svg>`

const SVG_MAGALU = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24">
  <rect width="48" height="48" rx="8" fill="#0086FF"/>
  <text x="24" y="20" font-family="Arial Black, Arial" font-size="7" font-weight="900" fill="white" text-anchor="middle">magazine</text>
  <text x="24" y="30" font-family="Arial Black, Arial" font-size="9" font-weight="900" fill="white" text-anchor="middle">luiza</text>
  <rect x="8" y="33" width="32" height="3" rx="1.5" fill="#FFD700"/>
</svg>`

@Component
export default class ModuleComponent extends Vue {
  marketplace: any = null

  options = [
    { label: 'Mercado Livre', value: 'ml',     svg: SVG_ML },
    { label: 'Shopee',        value: 'shopee', svg: SVG_SHOPEE },
    { label: 'Amazon',        value: 'amazon', svg: SVG_AMAZON },
    { label: 'Magalu',        value: 'magalu', svg: SVG_MAGALU }
  ]

  pesquisar () {
    console.log(this.marketplace)
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
