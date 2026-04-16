<template>
  <!-- Container principal para centralizar o card na tela -->
  <div class="row justify-center items-center">
    <q-card class="col-11 col-md-10 col-lg-9 shadow-2" style="width: 1500px">
      <!-- Cabeçalho do Card -->
      <q-card-section class="bg-primary text-white q-pb-none">
        <div class="text-h5 text-bold">Perfil</div>
        <q-toolbar class="q-pa-none">
          <q-breadcrumbs
            active-color="white"
            style="font-size: 14px"
            class="q-mb-md"
          >
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="white" />
            </template>
            <q-breadcrumbs-el label="Home" icon="home" to="/" />
            <q-breadcrumbs-el label="Perfil" icon="account_circle" />
          </q-breadcrumbs>
        </q-toolbar>
      </q-card-section>

      <q-separator />

      <!-- Corpo do Card -->
      <q-card-section class="q-pa-lg">
        <!-- Tabs de Navegação -->
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
        >
          <q-tab name="meu_perfil" label="Meu Perfil" icon="person" />
          <q-tab name="gestao_usuarios" label="Gestão de Usuários" icon="group" />
        </q-tabs>

        <q-separator />

        <!-- Conteúdo das Tabs -->
        <q-tab-panels v-model="tab" animated class="q-mt-md">
          
          <!-- TAB 1: Meu Perfil (Somente UI) -->
          <q-tab-panel name="meu_perfil" class="q-pa-none">
            <div class="row q-col-gutter-md">
              <!-- Área da Foto -->
              <div class="col-12 col-md-4 flex justify-center items-center">
                <div class="column items-center">
                  <q-avatar size="150px" font-size="80px" color="grey-3" text-color="primary" icon="person" class="shadow-1" />
                  <q-btn flat color="primary" label="Alterar Foto" class="q-mt-sm" />
                </div>
              </div>

              <!-- Dados do Perfil -->
              <div class="col-12 col-md-8">
                <div class="text-h6 q-mb-md">Dados Pessoais</div>
                <div class="row q-col-gutter-md">
                  <q-input label="Nome Completo" class="col-12" outlined dense />
                  <q-input label="E-mail" class="col-12 col-sm-6" outlined dense />
                  <q-input label="Telefone" class="col-12 col-sm-6" outlined dense mask="(##) #####-####" />
                  <q-input label="Cargo/Função" class="col-12 col-sm-6" outlined dense readonly />
                  <q-input label="Membro desde" class="col-12 col-sm-6" outlined dense readonly />
                </div>
                
                <div class="text-h6 q-mt-lg q-mb-md">Segurança</div>
                <div class="row q-col-gutter-md">
                  <q-input label="Senha Atual" type="password" class="col-12 col-sm-4" outlined dense />
                  <q-input label="Nova Senha" type="password" class="col-12 col-sm-4" outlined dense />
                  <q-input label="Confirmar Nova Senha" type="password" class="col-12 col-sm-4" outlined dense />
                </div>
              </div>
            </div>
            <div class="row justify-end q-mt-xl">
              <q-btn label="Salvar Alterações" color="positive" unelevated icon="save" />
            </div>
          </q-tab-panel>

          <!-- TAB 2: Gestão de Usuários (Somente UI) -->
          <q-tab-panel name="gestao_usuarios" class="q-pa-none">
            
            <!-- Filtros e Botões (Padronizado col-9 e col-3) -->
            <div class="row items-center justify-between no-wrap q-mb-lg">
              <div class="row q-gutter-md col">
                <q-input style="width: 300px" label="Nome do Usuário" outlined dense />
                <q-select style="width: 200px" label="Status" :options="['Ativo', 'Inativo']" outlined dense />
              </div>
              <div class="row q-gutter-sm">
                <q-btn icon="search" color="primary" unelevated />
                <q-btn icon="add" color="positive" unelevated label="Novo Usuário" />
              </div>
            </div>

            <!-- Tabela de Usuários (Exemplo Visual) -->
            <q-table
              :columns="colunasUsuarios"
              row-key="id"
              flat
              bordered
              class="text-weight-medium"
            >
              <template v-slot:body-cell-status="props">
                <q-td align="center">
                  <q-badge color="positive">Ativo</q-badge>
                </q-td>
              </template>
              <template v-slot:body-cell-acoes="props">
                <q-td align="center">
                  <q-btn icon="edit" size="sm" color="primary" flat round />
                  <q-btn icon="delete" size="sm" color="negative" flat round />
                </q-td>
              </template>
            </q-table>

            <!-- SEÇÃO DE PERMISSÕES (Visualização de como seria no formulário) -->
            <div class="q-mt-xl">
              <div class="text-h6 q-mb-sm">Permissões de Acesso (Exemplo de Formulário)</div>
              <div class="row q-col-gutter-md">
                
                <!-- Cadastro -->
                <div class="col-12 col-md-4">
                  <q-card flat bordered>
                    <q-card-section class="bg-grey-2 q-py-xs text-bold">CADASTRO</q-card-section>
                    <q-list dense>
                      <q-item tag="label" v-ripple>
                        <q-item-section avatar><q-checkbox :value="true" color="primary" /></q-item-section>
                        <q-item-section><q-item-label>Produtos</q-item-label></q-item-section>
                      </q-item>
                      <q-item tag="label" v-ripple>
                        <q-item-section avatar><q-checkbox :value="false" color="primary" /></q-item-section>
                        <q-item-section><q-item-label>Pessoas</q-item-label></q-item-section>
                      </q-item>
                    </q-list>
                  </q-card>
                </div>

                <!-- Financeiro -->
                <div class="col-12 col-md-4">
                  <q-card flat bordered>
                    <q-card-section class="bg-grey-2 q-py-xs text-bold">FINANCEIRO</q-card-section>
                    <q-list dense>
                      <q-item tag="label" v-ripple>
                        <q-item-section avatar><q-checkbox :value="true" color="primary" /></q-item-section>
                        <q-item-section><q-item-label>NF Entrada</q-item-label></q-item-section>
                      </q-item>
                      <q-item tag="label" v-ripple>
                        <q-item-section avatar><q-checkbox :value="true" color="primary" /></q-item-section>
                        <q-item-section><q-item-label>NF Saída</q-item-label></q-item-section>
                      </q-item>
                    </q-list>
                  </q-card>
                </div>

                <!-- Relatórios e Vendas -->
                <div class="col-12 col-md-4">
                  <q-card flat bordered>
                    <q-card-section class="bg-grey-2 q-py-xs text-bold">RELATÓRIOS / VENDAS</q-card-section>
                    <q-list dense>
                      <q-item tag="label" v-ripple>
                        <q-item-section avatar><q-checkbox :value="false" color="primary" /></q-item-section>
                        <q-item-section><q-item-label>Relatório Estoque</q-item-label></q-item-section>
                      </q-item>
                      <q-item tag="label" v-ripple>
                        <q-item-section avatar><q-checkbox :value="false" color="primary" /></q-item-section>
                        <q-item-section><q-item-label>Relatório Venda</q-item-label></q-item-section>
                      </q-item>
                      <q-item tag="label" v-ripple>
                        <q-item-section avatar><q-checkbox :value="true" color="primary" /></q-item-section>
                        <q-item-section><q-item-label>Venda Balcão</q-item-label></q-item-section>
                      </q-item>
                    </q-list>
                  </q-card>
                </div>

              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class PerfilUsuariosUIComponent extends Vue {
  tab = 'meu_perfil'

  colunasUsuarios = [
    { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
    { name: 'email', label: 'E-mail', field: 'email', align: 'left' },
    { name: 'status', label: 'Status', field: 'status', align: 'center' },
    { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
  ]
}
</script>

<style scoped>
.border {
  border: 1px solid #e0e0e0;
}
</style>
