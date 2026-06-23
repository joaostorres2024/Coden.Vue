<template>
  <div class="q-pa-md">

    <!-- Cabeçalho -->
    <div class="text-bold text-black row items-center produtos-cabecalho" style="font-size: 28px">
      <q-icon name="shelves" class="q-mr-md text-primary" size="28px" />Cadastro de Produtos
    </div>
    <p class="text-grey-7 text-body2 q-mb-md produtos-subtitulo">
      Gerencie o catálogo de produtos do sistema. Aqui você pode adicionar, editar, inativar e excluir produtos, além de organizar por grupos.
    </p>
    <q-separator class="q-mb-lg" />

    <!-- Filtros -->
    <div class="row q-col-gutter-md q-mb-md produtos-filtros">
      <div class="col-12 col-md-4">
        <q-input
          v-model="nome_produto"
          label="Nome do Produto"
          outlined
          dense
          input-id="produtos-input-nome"
          class="produtos-input-nome"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="codigo_produto"
          label="Código do Produto"
          outlined
          dense
          input-id="produtos-input-codigo"
          class="produtos-input-codigo"
        />
      </div>
    </div>

    <!-- Botões -->
    <div v-if="!cadastroProdutoForm" class="row justify-start q-gutter-sm q-mb-lg produtos-acoes">
      <q-btn
        id="produtos-btn-adicionar"
        class="produtos-btn-adicionar"
        label="Adicionar"
        icon="add"
        color="positive"
        unelevated
        @click="mostrarFormulario()"
      />
      <q-btn
        id="produtos-btn-limpar"
        class="produtos-btn-limpar text-grey-7"
        label="Limpar"
        icon="delete_sweep"
        flat
        @click="refreshTable()"
      />
    </div>

    <!-- Formulário -->
    <div v-if="cadastroProdutoForm" class="q-mt-md produtos-form-cadastro">
      <q-form ref="formProduto" @submit.prevent="salvar()" greedy>

        <!-- Dados Gerais -->
        <div class="text-h6 q-mb-sm">Dados Gerais</div>
        <div class="row q-col-gutter-md q-mb-md items-center produtos-dados-gerais">
          <div class="col-12 col-sm-4">
            <q-select
              v-model="grupo"
              :options="grupos"
              option-label="nome"
              option-value="id"
              emit-value
              map-options
              label="Grupo"
              outlined
              dense
              id="produtos-select-grupo"
              class="produtos-select-grupo"
            />
          </div>
          <div class="col-12 col-sm-2">
            <q-btn
              id="produtos-btn-criar-grupo"
              class="produtos-btn-criar-grupo full-width"
              label="Criar Grupo"
              color="primary"
              unelevated
              @click="dialogCriarGrupo = true"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="codigo_barras"
              label="Código de Barras"
              outlined
              dense
              input-id="produtos-input-codigo-barras"
              class="produtos-input-codigo-barras"
            />
          </div>
          <div class="col-12 col-sm-2">
            <q-btn
              id="produtos-btn-gerar-codigo"
              class="produtos-btn-gerar-codigo full-width"
              label="Gerar"
              color="primary"
              unelevated
            />
          </div>
        </div>

        <!-- Preço -->
        <div class="text-h6 q-mb-sm">Preço</div>
        <div class="row q-col-gutter-md q-mb-md produtos-dados-preco">
          <div class="col-12 col-sm-4">
            <q-input
              v-model="preco_custo"
              label="Preço de Custo *"
              outlined
              dense
              type="number"
              :rules="[val => !!val || 'Preço de custo obrigatório']"
              hide-bottom-space
              lazy-rules
              input-id="produtos-input-preco-custo"
              class="produtos-input-preco-custo"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="preco_venda"
              label="Preço de Venda *"
              outlined
              dense
              type="number"
              :rules="[val => !!val || 'Preço de venda obrigatório']"
              hide-bottom-space
              lazy-rules
              input-id="produtos-input-preco-venda"
              class="produtos-input-preco-venda"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              :value="margem_calculada"
              label="Margem (%)"
              outlined
              dense
              readonly
              input-id="produtos-input-margem"
              class="produtos-input-margem"
            />
          </div>
        </div>

        <!-- Estoque e Fornecedor -->
        <div class="text-h6 q-mb-sm">Estoque e Fornecedor</div>
        <div class="row q-col-gutter-md q-mb-md produtos-dados-estoque">
          <div class="col-12 col-sm-4">
            <q-input
              v-model="estoque_atual"
              label="Estoque Atual *"
              outlined
              dense
              :rules="[val => !!val || 'Estoque atual obrigatório']"
              hide-bottom-space
              lazy-rules
              input-id="produtos-input-estoque-atual"
              class="produtos-input-estoque-atual"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="estoque_minimo"
              label="Estoque Mínimo *"
              outlined
              dense
              :rules="[val => !!val || 'Estoque mínimo obrigatório']"
              hide-bottom-space
              lazy-rules
              input-id="produtos-input-estoque-minimo"
              class="produtos-input-estoque-minimo"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="estoque_maximo"
              label="Estoque Máximo *"
              outlined
              dense
              :rules="[val => !!val || 'Estoque máximo obrigatório']"
              hide-bottom-space
              lazy-rules
              input-id="produtos-input-estoque-maximo"
              class="produtos-input-estoque-maximo"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="fornecedor"
              label="Fornecedor *"
              outlined
              dense
              :rules="[val => !!val || 'Fornecedor obrigatório']"
              hide-bottom-space
              lazy-rules
              input-id="produtos-input-fornecedor"
              class="produtos-input-fornecedor"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-select
              v-model="ativoInativo"
              :options="ativoInativoOpcoes"
              label="Status"
              outlined
              dense
              emit-value
              map-options
              id="produtos-select-status"
              class="produtos-select-status"
            />
          </div>
        </div>

        <!-- Observações -->
        <div class="text-h6 q-mb-sm">Observações</div>
        <div class="row q-mb-md produtos-observacoes">
          <div class="col-12">
            <q-input
              v-model="observacoes"
              type="textarea"
              outlined
              dense
              input-style="resize: none;"
              rows="5"
              input-id="produtos-input-observacoes"
              class="produtos-input-observacoes"
            />
          </div>
        </div>

        <!-- Botões -->
        <div class="row q-mt-xl q-gutter-md justify-start produtos-form-acoes">
          <q-btn
            id="produtos-btn-salvar"
            class="produtos-btn-salvar"
            label="Salvar Produto"
            color="positive"
            unelevated
            type="submit"
          />
          <q-btn
            id="produtos-btn-cancelar"
            class="produtos-btn-cancelar"
            label="Cancelar"
            color="negative"
            flat
            @click="abrirDialogCancelar()"
          />
        </div>
      </q-form>
    </div>

    <!-- Tabela -->
    <div v-if="!cadastroProdutoForm" class="q-mt-xl produtos-tabela">
      <q-table
        :data="rowsFiltradas"
        :columns="colunasCadastroProdutos"
        row-key="codigo"
        :rows-per-page-options="[10, 20, 50]"
        flat
        bordered
        no-data-label="Nenhum registro encontrado"
        class="text-weight-medium produtos-tabela-lista"
      >
        <template v-slot:body-cell-acoes="props">
          <q-td align="center">
            <q-btn
              icon="edit"
              size="sm"
              color="black"
              flat
              round
              class="produtos-btn-editar"
              @click="editar(props.row)"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              v-if="props.row.status === 'Ativo'"
              icon="inventory_2"
              size="sm"
              color="negative"
              flat
              round
              class="produtos-btn-inativar"
              @click="confirmarExcluir(props.row)"
            >
              <q-tooltip>Inativar</q-tooltip>
            </q-btn>
            <q-btn
              v-if="props.row.status === 'Inativo'"
              icon="inventory"
              size="sm"
              color="positive"
              flat
              round
              class="produtos-btn-reativar"
              @click="reativarProduto(props.row)"
            >
              <q-tooltip>Reativar</q-tooltip>
            </q-btn>
            <q-btn
              icon="delete_forever"
              size="sm"
              color="negative"
              flat
              round
              class="produtos-btn-deletar"
              @click="confirmarDeletar(props.row)"
            >
              <q-tooltip>Excluir definitivamente</q-tooltip>
            </q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-preco="props">
          <q-td :props="props" align="center">{{ formatarReais(props.row.preco) }}</q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td align="center">
            <q-badge
              :color="props.row.status === 'Ativo' ? 'positive' : 'negative'"
              class="produtos-badge-status"
            >
              {{ props.row.status }}
            </q-badge>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Dialog Cancelar -->
    <q-dialog v-model="dialogCancelar" persistent class="produtos-dialog-cancelar">
      <q-card style="min-width: 380px; border-radius: 12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Cancelar operação</div>
        </q-card-section>
        <q-card-section class="text-grey-7" style="font-size: 14px">
          Deseja realmente cancelar? As alterações não salvas serão perdidas.
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn
            id="produtos-dialog-cancelar-voltar"
            class="produtos-dialog-cancelar-voltar"
            label="Voltar"
            unelevated
            style="border: 1px solid #ccc; border-radius: 8px; min-width: 100px"
            color="white"
            text-color="dark"
            v-close-popup
          />
          <q-btn
            id="produtos-dialog-cancelar-confirmar"
            class="produtos-dialog-cancelar-confirmar"
            label="Sim, Cancelar"
            unelevated
            color="negative"
            style="border-radius: 8px; min-width: 130px"
            @click="confirmarCancelamento()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Deletar -->
    <q-dialog v-model="dialogDeletar" persistent class="produtos-dialog-deletar">
      <q-card style="min-width: 380px; border-radius: 12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Excluir Produto</div>
        </q-card-section>
        <q-card-section class="text-grey-7" style="font-size: 14px">
          Tem certeza que deseja <strong>excluir definitivamente</strong> o produto
          <strong>{{ produtoParaDeletar?.nome_produto }}</strong>? Essa ação não pode ser desfeita.
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn
            id="produtos-dialog-deletar-voltar"
            class="produtos-dialog-deletar-voltar"
            label="Voltar"
            unelevated
            style="border: 1px solid #ccc; border-radius: 8px; min-width: 100px"
            color="white"
            text-color="dark"
            v-close-popup
          />
          <q-btn
            id="produtos-dialog-deletar-confirmar"
            class="produtos-dialog-deletar-confirmar"
            label="Sim, Excluir"
            unelevated
            color="negative"
            style="border-radius: 8px; min-width: 130px"
            @click="executarDeletar()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Inativar -->
    <q-dialog v-model="dialogExcluir" persistent class="produtos-dialog-inativar">
      <q-card style="min-width: 380px; border-radius: 12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Inativar Produto</div>
        </q-card-section>
        <q-card-section class="text-grey-7" style="font-size: 14px">
          Tem certeza que deseja inativar o produto
          <strong>{{ produtoParaExcluir?.nome_produto }}</strong>?
          O produto não será excluído, mas ficará inativo no sistema.
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn
            id="produtos-dialog-inativar-voltar"
            class="produtos-dialog-inativar-voltar"
            label="Voltar"
            unelevated
            style="border: 1px solid #ccc; border-radius: 8px; min-width: 100px"
            color="white"
            text-color="dark"
            v-close-popup
          />
          <q-btn
            id="produtos-dialog-inativar-confirmar"
            class="produtos-dialog-inativar-confirmar"
            label="Sim, Inativar"
            unelevated
            color="negative"
            style="border-radius: 8px; min-width: 130px"
            @click="executarExclusao()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Criar Grupo -->
    <q-dialog v-model="dialogCriarGrupo" persistent class="produtos-dialog-grupo">
      <q-card style="min-width: 350px; border-radius: 12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Criar Grupo</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="novoGrupo"
            label="Nome do Grupo"
            outlined
            dense
            autofocus
            input-id="produtos-input-novo-grupo"
            class="produtos-input-novo-grupo"
          />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn
            id="produtos-dialog-grupo-cancelar"
            class="produtos-dialog-grupo-cancelar"
            label="Cancelar"
            flat
            v-close-popup
          />
          <q-btn
            id="produtos-dialog-grupo-confirmar"
            class="produtos-dialog-grupo-confirmar"
            label="Criar"
            unelevated
            color="primary"
            style="border-radius: 8px"
            @click="salvarGrupo()"
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
  grupo: number | null = null
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
  produtoParaExcluir: any = null

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
    await this.carregarGrupos()
  }

 async salvar() {
    const form = this.$refs.formProduto as any
  const valido = await form.validate()
  if (!valido) return

  // Validações dos campos de topo (fora do q-form)
  if (!this.nome_produto) {
    this.$q.notify({ type: 'negative', message: 'Nome do produto obrigatório', position: 'bottom' })
    return
  }
    try {

      const payload: Product = {
        nome_produto: this.nome_produto,
        preco: this.preco_venda ?? 0,
        grupo_id: this.grupo ? Number(this.grupo) : undefined,
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

  dialogCriarGrupo = false
novoGrupo = ''

async salvarGrupo() {
  if (!this.novoGrupo) {
    this.$q.notify({ type: 'warning', message: 'Informe o nome do grupo!' })
    return
  }
  try {
    const grupo = await productService.criarGrupo(this.novoGrupo)
    this.grupos.push(grupo)
    this.grupo = grupo.id
    this.novoGrupo = ''
    this.dialogCriarGrupo = false
    this.$q.notify({ type: 'positive', message: 'Grupo criado com sucesso!' })
  } catch {
    this.$q.notify({ type: 'negative', message: 'Erro ao criar grupo!' })
  }
}

  editar(row: any) {
    this.editandoId = row.id
    this.codigo_produto = row.codigo_produto
    this.nome_produto = row.nome_produto
    this.grupo = row.grupo_id ?? null
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

confirmarExcluir(row: any) {
  this.produtoParaExcluir = row
  this.dialogExcluir = true
}

async executarExclusao() {
  try {
    await productService.updateProduct(this.produtoParaExcluir.id, {
      ...this.produtoParaExcluir,
      status: 'Inativo'
    })
    this.$q.notify({ type: 'positive', message: 'Produto inativado com sucesso!' })
    this.dialogExcluir = false
    this.produtoParaExcluir = null
    await this.carregarProdutos()
  } catch {
    this.$q.notify({ type: 'negative', message: 'Erro ao inativar produto!' })
  }
}

async reativarProduto(row: any) {
  try {
    await productService.updateProduct(row.id, {
      ...row,
      status: 'Ativo'
    })
    this.$q.notify({ type: 'positive', message: 'Produto reativado com sucesso!' })
    await this.carregarProdutos()
  } catch {
    this.$q.notify({ type: 'negative', message: 'Erro ao reativar produto!' })
  }
}

  get rowsFiltradas() {
    return this.rows.filter((p: Product) => {
      const nomeOk = p.nome_produto.toLowerCase().startsWith(this.nome_produto.toLowerCase())
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

  grupos: any[] = []

async carregarGrupos() {
  try {
    const grupos = await productService.listarGrupos()
    this.grupos = [{ id: null, nome: 'Nenhum' }, ...grupos]
  } catch {
    this.$q.notify({ type: 'negative', message: 'Erro ao carregar grupos!' })
  }
}

abrirDialogCancelar() {
  this.dialogCancelar = true
}

  limparCampos() {
    this.editandoId = null
    this.codigo_produto = ''
    this.nome_produto = ''
    this.codigo_barras = ''
    this.grupo = null
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

dialogDeletar = false
produtoParaDeletar: any = null

confirmarDeletar(row: any) {
  this.produtoParaDeletar = row
  this.dialogDeletar = true
}

async executarDeletar() {
  try {
    await productService.deletarProduto(this.produtoParaDeletar.id)
    this.$q.notify({ type: 'positive', message: 'Produto excluído com sucesso!' })
    this.dialogDeletar = false
    this.produtoParaDeletar = null
    await this.carregarProdutos()
  } catch (err: any) {
    this.$q.notify({ type: 'negative', message: err.response?.data?.erro || 'Erro ao excluir produto!' })
  }
}
}
</script>

<style scoped>
.b-r-10 {
  border-radius: 10px;
}
.b-r-8 {
  border-radius: 8px;
}
.border {
  border: 1px solid #ccc;
}
.btn-outline-primary {
  border: 1.5px solid #ccc;
  background-color: #f0e9f5 !important;
}
</style>
