<template>
  <div class="text-h5 text-bold">
    <div class="q-py-md">VENDA BALCÃO</div>
    <div class="col-12">
      <div class="col-12 row justify-between items-center q-mt-md">
        <div class="row col-7">
          <q-input
            v-model="codigo"
            class="col-2"
            label="Código do Cliente"
            outlined
            dense
          />
          <q-input
            v-model="nome"
            class="col-3 q-px-md"
            label="Nome Completo"
            outlined
            dense
          />
          <q-input
            v-model="documento"
            class="col-3"
            label="CNPJ/CPF"
            outlined
            dense
          />
        </div>

        <div class="row q-gutter-md" v-if="!procurarProduto">
          <q-btn
            icon="delete"
            class="text-black border"
            unelevated
            label="Limpar"
            @click="refreshTable()"
          />
          <q-btn
            icon="search"
            class="text-white bg-primary"
            unelevated
            label="Pesquisar"
            @click="pesquisar()"
          />
        </div>
      </div>

      <div>
        <q-table
          :data="this.rowsFiltradas"
          :columns="this.colunasVendaBalcão"
          row-key="codigo"
          flat
          bordered
          class="q-mt-lg"
          no-data-label="Nenhum registro encontrado"
          v-if="!procurarProduto"
        >
          <!-- Coluna Ações -->
          <template v-slot:body-cell-acoes="props">
            <q-td align="center">
              <q-btn
                icon="point_of_sale"
                size="sm"
                color="warning"
                flat
                round
                @click="realizarVenda(props.row)"
              />
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

      <div v-if="procurarProduto" class="column q-gutter-md q-mt-md">
        <q-title class="text-h6">Produto</q-title>
        <div class="col-12 row justify-between items-center q-mt-md">
        <div class="row col-6">
          <q-input
            v-model="codigoProduto"
            class="col-4"
            label="Código do Produto"
            outlined
            dense
          />
          <q-input
            v-model="nomeProduto"
            class="col-5 q-px-md"
            label="Nome do Produto"
            outlined
            dense
          />
        </div>

        <div class="row q-gutter-md">
          <q-btn
            icon="search"
            class="text-white bg-primary"
            unelevated
            label="Pesquisar"
            @click="pesquisar()"
          />
        </div>
      </div>
      </div>
      <div class="q-mt-lg">
        <q-table
          :data="this.rowsProduto"
          :columns="this.colunasTabelProduto"
          row-key="codigo"
          flat
          bordered
          :rows-per-page-options="[0]"
          no-data-label="Nenhum registro encontrado"
          v-if="procurarProduto"
        >
          <!-- Coluna Ações -->
          <template v-slot:body-cell-acoes="props">
            <q-td align="center">
              <q-btn
                icon="o_add_box"
                size="sm"
                color="warning"
                flat
                round
                @click="abrirDialogQuantiade()"
              />
              <q-btn icon="percent" size="sm" color="blue" @click="abrirDialogDesconto()" flat round />
              <q-btn icon="add" size="sm" color="positive" @click="revisarProdutos()" flat round />
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

      <div v-if="produtosAdicionados" class="column q-gutter-md q-mt-md">
        <q-title class="text-h6">Produtos Adicionados</q-title>
      </div>

      <div class="q-mt-lg">
        <q-table
          :data="this.rowsProduto"
          :columns="this.colunasTabelProduto"
          row-key="codigo"
          flat
          bordered
          :rows-per-page-options="[0]"
          no-data-label="Nenhum registro encontrado"
          v-if="produtosAdicionados"
        >
          <!-- Coluna Ações -->
          <template v-slot:body-cell-acoes="props">
            <q-td align="center">
              <q-btn icon="delete" size="sm" color="negative" flat round />
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

      <div v-if="finalizacaoVenda" class="column q-gutter-md q-mt-md">
        <q-title class="text-h6">Revisar Itens</q-title>
      </div>
      <div v-if="finalizacaoVenda" class="row col-12 justify-between items-center q-mt-md q-mb-md">
        <div class="row col-5 q-gutter-md">
          <q-btn
            icon="o_credit_card"
            label="Realizar Pagamento"
            unelevated
            class="text-white bg-positive"
          />
          <q-btn
            icon="close"
            label="Cancelar"
            unelevated
            class="text-white bg-negative"
            @click="abrirDialogCancelar()"
          />
        </div>
        <div class="row q-gutter-md col-7 justify-end">
          <q-input
            v-model="valorBrutoVenda"
            label="Produtos"
            class="col-2"
            outlined
            readonly
            dense
          />
          <q-input
            v-model="valorBrutoVenda"
            label="Valor Bruto"
            class="col-2"
            outlined
            readonly
            dense
          />
          <q-input
            v-model="valorBrutoVenda"
            label="Desconto (R$)"
            outlined
            readonly
            class="col-2"
            dense
          />
          <q-input
            v-model="valorBrutoVenda"
            label="Desconto (%)"
            outlined
            readonly
            class="col-2"
            dense
          />
          <q-input
            v-model="valorBrutoVenda"
            label="Valor Total"
            outlined
            readonly
            class="col-2"
            dense
          />
        </div>
      </div>

      <q-dialog v-model="dialogCancelar">
        <q-card style="min-width: 300px">
          <q-card-section class="text-h6">
            Confirmar Cancelamento
          </q-card-section>

          <q-card-section>
            Você tem certeza que deseja cancelar? Os dados não salvos serão
            perdidos.
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Não" color="primary" v-close-popup />
            <q-btn
              flat
              label="Sim, cancelar"
              color="negative"
              @click="confirmarCancelamento()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="dialogCancelarVenda">
        <q-card style="min-width: 300px">
          <q-card-section class="text-h6">
            Confirmar Cancelamento
          </q-card-section>

          <q-card-section>
            Você tem certeza que deseja cancelar? Os dados não salvos serão
            perdidos.
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Não" color="primary" v-close-popup />
            <q-btn
              flat
              label="Sim, cancelar"
              color="negative"
              @click="confirmarCancelamento()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="dialogQuantidade">
        <q-card style="min-width: 300px">
          <!-- Texto -->
          <q-card-section>
            <div class="text-subtitle1">Selecione quantidade:</div>
          </q-card-section>

          <!-- Input -->
          <q-card-section>
            <q-input
              v-model="quantidade"
              outlined
              dense
              min="1"
            />
          </q-card-section>

          <!-- Botões -->
          <q-card-actions align="right">
            <q-btn label="Cancelar" flat color="negative" v-close-popup />

            <q-btn
              label="Confirmar"
              class="bg-primary text-white"
              unelevated
              @click="confirmarQuantidade"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="dialogDesconto">
        <q-card style="min-width: 300px">
          <!-- Texto -->
          <q-card-section>
            <div class="text-subtitle1">Selecione desconto:</div>
          </q-card-section>

          <!-- Input -->
          <q-card-section class="row q-gutter-md">
            <q-input
              v-model="valor"
              label="Reais"
              outlined
              dense
            />
            <q-input
              v-model="porcentagem"
              label="Porcentagem (%)"
              outlined
              dense
            />
          </q-card-section>

          <!-- Botões -->
          <q-card-actions align="right">
            <q-btn label="Cancelar" flat color="negative" v-close-popup />

            <q-btn
              label="Confirmar"
              class="bg-primary text-white"
              unelevated
              @click="confirmarQuantidade"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import listVendaBalcao from '../../config/listVendaBalcao.json'

@Component
export default class ModuleComponent extends Vue {
  // ===== data =====

  colunasVendaBalcão = listVendaBalcao.columns
  colunasTabelProduto = listVendaBalcao.columnsTableProduto
  tipoPessoa: string | null = null
  sexo: string | null = null
  ativoInativo: string | null = null
  ufSelect: string | null = null
  dialogCancelar = false
  dialogExcluir = false
  dialogCancelarVenda = false
  dialogQuantidade = false
  dialogDesconto = false
  procurarProduto = false
  produtosAdicionados = false
  finalizacaoVenda = false

  // Dados Gerais
  nome = ''
  documento = ''
  codigo = ''
  dtaNascimento = ''
  nmeSocial = ''

  // Dados PJ específicos
  razaoSocial = ''
  nomeResponsavel = ''

  // Dados de Contato
  telefone1 = ''
  telefone2 = ''
  email = ''

  // Dados de Endereço
  cep = ''
  logradouro = ''
  numero = ''
  bairro = ''
  cidade = ''

  // Observações
  text = ''

  rowsFiltradas: any[] = []

  created(){
    this.rowsFiltradas = this.rowsClientes
  }

  // ===== dados de tabela fictícios =====
  rowsClientes = [
    {
      codigo: '001',
      tipoPessoa: 'PF',
      nome: 'Antônio Carlos',
      documento: '123-456-789-10',
      telefone: '(61) 981590-8038',
      email: 'antonio@gmail.com',
      status: 'Ativo'
    },
    {
      codigo: '002',
      tipoPessoa: 'PJ',
      nome: 'Matheus',
      documento: '123-422-789-10',
      telefone: '(61) 981120-8038',
      email: 'matheus@gmail.com',
      status: 'Inativo'
    },
    {
      codigo: '003',
      tipoPessoa: 'PF',
      nome: 'Uma tal de Brunna',
      documento: '677-886-080-21',
      telefone: '(61) 98999-9999',
      email: 'brunna@gmail.com',
      status: 'Inativo'
    }
  ]

  rowsProduto = [
    {
      codigoProduto: '02672483',
      nomeProduto: 'Tomada',
      quantidade: '1',
      valorUnitario: '40',
      desconto: '0%',
      subtotal: '40',
      total: '40'
    }
  ]

  abrirDialogCancelar(){
    this.dialogCancelar = true
  }

  abrirDialogCancelarVenda(){
    this.dialogCancelarVenda = true
  }

  abrirDialogQuantiade(){
    this.dialogQuantidade = true
  }

  abrirDialogDesconto(){
    this.dialogDesconto = true
  }

  confirmarCancelamento() {
  this.dialogCancelar = false
  this.dialogCancelarVenda = false
  this.finalizacaoVenda = false

  this.tipoPessoa = null
  this.codigo = ""
  this.nome = ""
  this.documento = ""
  this.rowsFiltradas = this.rowsClientes

  this.procurarProduto = false
  this.produtosAdicionados = false
}

confirmarExcluir() {
  this.dialogExcluir = true
}

pesquisar() {
  this.rowsFiltradas = this.rowsClientes.filter((row: any) => {
    const nomeMatch =
      !this.nome ||
      row.nome.toLowerCase().includes(this.nome.toLowerCase())

    const codigoMatch =
      !this.codigo ||
      row.codigo.toLowerCase().includes(this.codigo.toLowerCase())

    const documentoMatch =
    !this.documento ||
    row.documento.toLowerCase().includes(this.documento.toLowerCase())

    return nomeMatch && codigoMatch && documentoMatch
  })
}

realizarVenda(row: any) {
  // Preenche os campos do formulário com os dados do usuário
  this.codigo = row.codigo
  this.nome = row.nome
  this.documento = row.documento
  this.tipoPessoa = row.tipoPessoa
  this.ativoInativo = row.status === 'Ativo' ? 'Ativo' : 'Inativo'

  this.procurarProduto = true
}

revisarProdutos(){
  this.produtosAdicionados = true
  this.finalizacaoVenda = true
}

refreshTable(){
  this.codigo = ""
  this.nome = ""
  this.documento = ""

  this.rowsFiltradas = this.rowsClientes
}
}
</script>

<style scoped>
.border {
  border: 1px solid black;
}
</style>
