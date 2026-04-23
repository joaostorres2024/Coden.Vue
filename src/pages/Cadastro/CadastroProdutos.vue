<template>
  <!-- Container principal para centralizar o card na tela -->
  <div class="row justify-center items-center">
    <q-card class="col-11 col-md-10 col-lg-9 shadow-2" style="width: 1500px">
      <!-- Cabeçalho do Card -->
      <q-card-section class="bg-white text-primary q-pb-none">
        <div class="text-h5 text-bold">Cadastro de Produtos</div>
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
            <q-breadcrumbs-el label="Cadastro" icon="group" />
            <q-breadcrumbs-el label="Cadastro Produtos" icon="shelves" />
          </q-breadcrumbs>
        </q-toolbar>
      </q-card-section>

      <q-separator />

      <!-- Corpo do Card -->
<q-card-section class="q-pa-lg">
        <!-- Filtros e Ações (Visíveis apenas quando não está em modo de formulário) -->
        <div class="row items-center justify-between no-wrap">

          <!-- Grupo de Inputs (Alinhado à Esquerda) -->
          <div class="row q-gutter-md col">
            <q-input
              v-model="codigo"
              style="width: 300px"
              label="Código do Produto"
              outlined
              dense
            />
            <q-input
              v-model="nmeProduto"
              style="width: 400px"
              label="Nome do Produto"
              outlined
              dense
            />
          </div>

          <!-- Grupo de Botões (Alinhado à Direita) -->
          <div v-if="!cadastroProdutoForm" class="row q-gutter-sm">
            <q-btn
                icon="add"
                unelevated
                class="bg-positive text-white"
                @click="mostrarFormulario()"
              />
              <q-btn
                icon="search"
                color="primary"
                unelevated
                @click="pesquisar()"
              />
              <q-btn
                icon="delete"
                unelevated
                class="bg-warning text-white"
                @click="refreshTable()"
              />
          </div>
        </div>

        <!-- Formulário de Cadastro -->
        <div v-if="cadastroProdutoForm" class="q-mt-md">
          <q-form @submit.prevent="salvar()">
            <!-- Seção: Dados Gerais -->
            <div class="text-h6 q-mb-sm">Dados Gerais</div>
            <div class="row q-col-gutter-md items-center">
              <div class="col-12 col-sm-4">
                <q-select
                  v-model="grupo"
                  label="Grupo"
                  outlined
                  dense
                  :options="['Lanternagem', 'Mecânica', 'Elétrica']"
                />
              </div>
              <div class="col-12 col-sm-2">
                <q-btn label="Criar Grupo" color="primary" unelevated class="full-width" />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="codigoBarras" label="Código de Barras" outlined dense />
              </div>
              <div class="col-12 col-sm-2">
                <q-btn label="Gerar" color="primary" unelevated class="full-width" />
              </div>
            </div>

            <!-- Seção: Preço -->
            <div class="text-h6 q-mt-lg q-mb-sm">Preço</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <q-input v-model="precoCusto" label="Preço de Custo" outlined dense type="number" />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="precoVendaTabela" label="Preço de Venda" outlined dense type="number" />
              </div>
              <div class="col-12 col-sm-4">
                <q-input :value="margemCalculada" label="Margem (%)" outlined dense readonly />
              </div>
            </div>

            <!-- Seção: Estoque e Fornecedor -->
            <div class="text-h6 q-mt-lg q-mb-sm">Estoque e Fornecedor</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-3">
                <q-input v-model="estoque" label="Estoque Atual" outlined dense />
              </div>
              <div class="col-12 col-sm-3">
                <q-input label="Estoque Máximo" outlined dense />
              </div>
              <div class="col-12 col-sm-3">
                <q-input v-model="fornecedor" label="Fornecedor" outlined dense />
              </div>
              <div class="col-12 col-sm-3">
                <q-select v-model="ativoInativo" :options="ativoInativoOpcoes" label="Status" outlined dense emit-value map-options />
              </div>
            </div>

            <!-- Seção: Observações -->
            <div class="text-h6 q-mt-lg q-mb-sm">Observações</div>
            <div class="row">
              <div class="col-12">
                <q-input v-model="obsProduto" type="textarea" outlined dense input-style="resize: none;" rows="3" />
              </div>
            </div>

            <!-- Botões do Formulário -->
            <div class="row q-mt-xl q-gutter-md justify-end">
              <q-btn label="Cancelar" color="negative" flat @click="abrirDialogCancelar()" />
              <q-btn label="Salvar Produto" color="positive" unelevated type="submit" />
            </div>
          </q-form>
        </div>

        <!-- Tabela de Resultados (Visível apenas quando não está em modo de formulário) -->
        <div v-if="!cadastroProdutoForm" class="q-mt-xl">
          <q-table
            :data="rowsFiltradas"
            :columns="colunasCadastroProdutos"
            row-key="codigo"
            flat
            bordered
            no-data-label="Nenhum registro encontrado"
            class="text-weight-medium"
          >
            <!-- Coluna Ações -->
            <template v-slot:body-cell-acoes="props">
              <q-td align="center">
                <q-btn
                  icon="edit"
                  size="sm"
                  color="primary"
                  flat
                  round
                  @click="editar(props.row)"
                />
                <q-btn
                  icon="delete"
                  size="sm"
                  color="negative"
                  flat
                  round
                  @click="confirmarExcluir(props.row)"
                />
              </q-td>
            </template>

            <!-- Coluna Preço -->
            <template v-slot:body-cell-precoVendaTabela="props">
              <q-td :props="props" align="center">
                {{ formatarReais(props.row.precoVendaTabela) }}
              </q-td>
            </template>

            <!-- Coluna Status -->
            <template v-slot:body-cell-status="props">
              <q-td align="center">
                <q-badge
                  :color="props.row.status === 'Ativo' ? 'positive' : 'negative'"
                >
                  {{ props.row.status }}
                </q-badge>
              </q-td>
            </template>
          </q-table>
        </div>
      </q-card-section>
    </q-card>

    <!-- Dialogs -->
    <q-dialog v-model="dialogCancelar" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Deseja realmente cancelar? As alterações não salvas serão perdidas.</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Não" color="primary" v-close-popup />
          <q-btn flat label="Sim, Cancelar" color="negative" @click="confirmarCancelamento()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import listCadastroProdutos from '../../config/listCadastroProdutos.json'

@Component
export default class ModuleComponent extends Vue {
  colunasCadastroProdutos = listCadastroProdutos.columns

  // ===== data =====
  codigo = ''
  nmeProduto = ''
  codigoBarras = ''
  grupo = ''
  estoque = ''
  fornecedor = ''
  precoCusto: number | null = null
  precoVendaTabela: number | null = null
  ativoInativo = 'Ativo'
  obsProduto = ''

  // Controle de UI
  cadastroProdutoForm = false
  dialogCancelar = false
  dialogExcluir = false

  rowsProdutos = [
    {
      codigo: '1SB807221CGRU',
      nmeProduto: 'Parachoque',
      grupo: 'Lanternagem',
      precoVendaTabela: 1200,
      estoque: '20',
      fornecedor: 'Volkswagen',
      status: 'Ativo'
    }
  ]

  rowsFiltradas: any[] = []

  ativoInativoOpcoes = [
    { label: 'Ativo', value: 'Ativo' },
    { label: 'Inativo', value: 'Inativo' }
  ]

  created() {
    this.rowsFiltradas = this.rowsProdutos
  }

  // ===== Métodos =====
  get margemCalculada(): string {
    if (!this.precoCusto || !this.precoVendaTabela) return '0.00%'
    const margem = ((this.precoVendaTabela - this.precoCusto) / this.precoCusto) * 100
    return margem.toFixed(2) + '%'
  }

  formatarReais(valor: string | number): string {
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  mostrarFormulario() {
    this.cadastroProdutoForm = true
  }

  abrirDialogCancelar() {
    this.dialogCancelar = true
  }

  confirmarCancelamento() {
    this.dialogCancelar = false
    this.cadastroProdutoForm = false
    this.limparCampos()
  }

  limparCampos() {
    this.codigo = ''
    this.nmeProduto = ''
    this.grupo = ''
    this.estoque = ''
    this.fornecedor = ''
    this.precoCusto = null
    this.precoVendaTabela = null
  }

  pesquisar() {
    this.rowsFiltradas = this.rowsProdutos.filter((row: any) => {
      const nomeMatch = !this.nmeProduto || row.nmeProduto.toLowerCase().includes(this.nmeProduto.toLowerCase())
      const codigoMatch = !this.codigo || row.codigo.toLowerCase().includes(this.codigo.toLowerCase())
      return nomeMatch && codigoMatch
    })
  }

  editar(row: any) {
    this.codigo = row.codigo
    this.nmeProduto = row.nmeProduto
    this.grupo = row.grupo
    this.estoque = row.estoque
    this.fornecedor = row.fornecedor
    this.precoVendaTabela = row.precoVendaTabela
    this.ativoInativo = row.status
    this.cadastroProdutoForm = true
  }

  confirmarExcluir(row: any) {
    console.log('Excluir:', row)
  }

  refreshTable() {
    this.limparCampos()
    this.rowsFiltradas = this.rowsProdutos
  }

  salvar() {
    this.$q.notify({ type: 'positive', message: 'Produto salvo com sucesso!' })
    this.confirmarCancelamento()
  }
}
</script>

<style scoped>
</style>
