<template>
  <!-- Container principal para centralizar o card na tela -->
  <div class="row justify-center items-center">
    <q-card
      class="col-11 col-md-10 col-lg-9 shadow-2 b-r-10"
      style="width: 1500px"
    >
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
              v-model="codigo_produto"
              style="width: 300px"
              label="Código do Produto"
              outlined
              dense
            />
            <q-input
              v-model="nome_produto"
              style="width: 400px"
              label="Nome do Produto"
              outlined
              dense
            />
            <q-input
              v-if="cadastroProdutoForm"
              style="width: 300px"
              label="Data de Cadastro"
              type="date"
              v-model="dataHoje"
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
                />
              </div>
              <div class="col-12 col-sm-2">
                <q-btn
                  label="Criar Grupo"
                  color="primary"
                  unelevated
                  class="full-width"
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="codigo_barras"
                  label="Código de Barras"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-2">
                <q-btn
                  label="Gerar"
                  color="primary"
                  unelevated
                  class="full-width"
                />
              </div>
            </div>

            <!-- Seção: Preço -->
            <div class="text-h6 q-mt-lg q-mb-sm">Preço</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="preco_custo"
                  label="Preço de Custo"
                  outlined
                  dense
                  type="number"
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="preco_venda"
                  label="Preço de Venda"
                  outlined
                  dense
                  type="number"
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  :value="margem_calculada"
                  label="Margem (%)"
                  outlined
                  dense
                  readonly
                />
              </div>
            </div>

            <!-- Seção: Estoque e Fornecedor -->
            <div class="text-h6 q-mt-lg q-mb-sm">Estoque e Fornecedor</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-2">
                <q-input
                  v-model="estoque_atual"
                  label="Estoque Atual"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-2">
                <q-input v-model="estoque_minimo" label="Estoque mínimo" outlined dense />
              </div>
              <div class="col-12 col-sm-2">
                <q-input v-model="estoque_maximo" label="Estoque Máximo" outlined dense />
              </div>
              <div class="col-12 col-sm-3">
                <q-input
                  v-model="fornecedor"
                  label="Fornecedor"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-3">
                <q-select
                  v-model="ativoInativo"
                  :options="ativoInativoOpcoes"
                  label="Status"
                  outlined
                  dense
                  emit-value
                  map-options
                />
              </div>
            </div>

            <!-- Seção: Observações -->
            <div class="text-h6 q-mt-lg q-mb-sm">Observações</div>
            <div class="row">
              <div class="col-12">
                <q-input
                  v-model="observacoes"
                  type="textarea"
                  outlined
                  dense
                  input-style="resize: none;"
                  rows="3"
                />
              </div>
            </div>

            <!-- Botões do Formulário -->
            <div class="row q-mt-xl q-gutter-md justify-end">
              <q-btn
                label="Salvar Produto"
                color="positive"
                unelevated
                type="submit"
              />
              <q-btn
                label="Cancelar"
                color="negative"
                flat
                @click="abrirDialogCancelar()"
              />
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

            <template v-slot:body-cell-preco="props">
              <q-td :props="props" align="center">
                {{ formatarReais(props.row.preco) }}
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
import listCadastroProdutos from '../../config/listCadastroProdutos.json'
import moment from 'moment'
import productService, { Product } from '../../services/productService'

@Component
export default class ModuleComponent extends Vue {
  colunasCadastroProdutos = listCadastroProdutos.columns

 // ===== data =====
  codigo_produto = ''
  nome_produto = ''
  codigo_barras = ''
  grupo = ''
  estoque_atual = ''
  estoque_minimo = ''
  estoque_maximo = ''
  fornecedor = ''
  observacoes = ''
  preco_custo: number | null = null
  preco_venda: number | null = null
  ativoInativo = 'Ativo'
  dataHoje = moment().format('YYYY-MM-DD')
  editandoId: number | null = null

  // Controle de UI
  cadastroProdutoForm = false
  dialogCancelar = false
  dialogExcluir = false
  rows: Product[] = []

  ativoInativoOpcoes = [
    { label: 'Ativo', value: 'Ativo' },
    { label: 'Inativo', value: 'Inativo' }
  ]

    async created() {
    await this.carregarProdutos()
  }

 async salvar() {
    try {

      const payload: Product = {
        nome_produto: this.nome_produto,
        preco: this.preco_venda ?? 0,
        grupo: this.grupo,
        codigo_produto: this.codigo_produto,
        codigo_barras: this.codigo_barras,
        preco_custo: this.preco_custo ?? undefined,
        margem_percentual: (!this.preco_custo || !this.preco_venda)
          ? 0
          : ((this.preco_venda - this.preco_custo) / this.preco_custo) * 100,
        estoque_atual: this.estoque_atual ? Number(this.estoque_atual) : undefined,
        estoque_minimo: this.estoque_minimo ? Number(this.estoque_minimo) : undefined,
        estoque_maximo: this.estoque_maximo ? Number(this.estoque_maximo) : undefined,
        fornecedor: this.fornecedor,
        status: this.ativoInativo,
        observacoes: this.observacoes
      }

      if (this.editandoId) {
        await productService.updateProduct(this.editandoId, payload)
        this.$q.notify({ type: 'positive', message: 'Produto atualizado com sucesso!' })
      } else {
        await productService.createProduct(payload)
        this.$q.notify({ type: 'positive', message: 'Produto cadastrado com sucesso!' })
      }

      await this.carregarProdutos()
      this.confirmarCancelamento()

    } catch (err) {
      this.$q.notify({ type: 'negative', message: 'Erro ao salvar produto!' })
    }
  }

async carregarProdutos() {
    try {
      this.rows = await productService.getAllProducts()
    } catch (err) {
      this.$q.notify({ type: 'negative', message: 'Erro ao carregar produtos!' })
    }
  }

  editar(row: any) {
    this.editandoId = row.id
    this.codigo_produto = row.codigo_produto
    this.nome_produto = row.nome_produto
    this.grupo = row.grupo
    this.codigo_barras = row.codigo_barras
    this.estoque_atual = row.estoque_atual
    this.estoque_minimo = row.estoque_minimo
    this.estoque_maximo = row.estoque_maximo
    this.fornecedor = row.fornecedor
    this.preco_custo = row.preco_custo
    this.preco_venda = row.preco
    this.ativoInativo = row.status
    this.observacoes = row.observacoes
    this.cadastroProdutoForm = true
  }

  async confirmarExcluir(row: any) {
    this.$q.dialog({
      title: 'Excluir Produto',
      message: `Deseja excluir o produto "${row.nome_produto}"?`,
      cancel: true,
      persistent: true
    }).onOk(async () => {
      try {
        await productService.deleteProduct(row.id)
        this.$q.notify({ type: 'positive', message: 'Produto excluído com sucesso!' })
        await this.carregarProdutos()
      } catch (err) {
        this.$q.notify({ type: 'negative', message: 'Erro ao excluir produto!' })
      }
    })
  }

  get rowsFiltradas() {
    return this.rows.filter((p: Product) => {
      const nomeOk = p.nome_produto.toLowerCase().includes(this.nome_produto.toLowerCase())
      const codigoOk = !this.codigo_produto || p.codigo_produto?.startsWith(this.codigo_produto)
      return nomeOk && codigoOk
    })
  }

get margem_calculada(): string {
    if (!this.preco_custo || !this.preco_venda) return '0.00%'
    const margem = ((this.preco_venda - this.preco_custo) / this.preco_custo) * 100
    return margem.toFixed(2) + '%'
  }

 formatarReais(valor: string | number): string {
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

abrirDialogCancelar() {
  this.dialogCancelar = true
}

  limparCampos() {
    this.editandoId = null
    this.codigo_produto = ''
    this.nome_produto = ''
    this.codigo_barras = ''
    this.grupo = ''
    this.estoque_atual = ''
    this.estoque_minimo = ''
    this.estoque_maximo = ''
    this.fornecedor = ''
    this.preco_custo = null
    this.preco_venda = null
    this.observacoes = ''
    this.ativoInativo = 'Ativo'
  }

confirmarCancelamento() {
  this.dialogCancelar = false
  this.cadastroProdutoForm = false
  this.limparCampos()
}

mostrarFormulario() {
  this.cadastroProdutoForm = true
}
}
</script>

<style scoped>
.b-r-10 {
  border-radius: 10px;
}
</style>
