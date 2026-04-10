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
            class="text-black"
            label="Limpar"
            @click="refreshTable()"
          />
          <q-btn
            icon="search"
            class="text-white verde-escuro"
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
        <div class="row">
          <q-input
            v-model="codigoProduto"
            class="col-2"
            label="Código do Produto"
            outlined
            dense
          />
          <q-input
            v-model="nomeProduto"
            class="col-2 q-px-md"
            label="Nome do Produto"
            outlined
            dense
          />
          <q-input
            v-model="codigoBarras"
            class="col-3"
            label="Código de Barras"
            outlined
            dense
          />
        </div>
        <div>
          <q-table
          :data="this.rowsProduto"
          :columns="this.colunasTabelProduto"
          row-key="codigo"
          flat
          bordered
          class="q-mt-lg"
          >
          <!-- Coluna Ações -->
          <template v-slot:body-cell-acoes="props">
            <q-td align="center">
              <q-btn
                icon="density_small"
                size="sm"
                color="green"
                flat
                round
              />
              <q-btn
                icon="percent"
                size="sm"
                color="blue"
                flat
                round
              />
              <q-btn
                icon="delete"
                size="sm"
                color="negative"
                flat
                round
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

      <q-dialog v-model="dialogExcluir">
        <q-card style="min-width: 300px">
          <q-card-section class="text-h6">
            Deseja mesmo excluir?
          </q-card-section>

          <q-card-section>
            Você tem certeza que deseja excluir?
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Não" color="primary" v-close-popup />
            <q-btn
              flat
              label="Sim, excluir"
              color="negative"
              @click="confirmarExcluir()"
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
  procurarProduto = false

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

  confirmarCancelamento() {
  this.dialogCancelar = false

  this.tipoPessoa = null
  this.codigo = ""
  this.nome = ""
  this.documento = ""
  this.rowsFiltradas = this.rowsClientes

  this.procurarProduto = false
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

refreshTable(){
  this.codigo = ""
  this.nome = ""
  this.documento = ""

  this.rowsFiltradas = this.rowsClientes
}
}
</script>

<style scoped>
.verde {
  background-color: #11b69a;
}

.verde-escuro {
  background-color: #00725f;
}
</style>
