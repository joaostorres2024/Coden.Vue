<template>
  <div class="">
    <div class="q-pt-md text-h5 text-bold">Relatório de Estoque</div>
    <q-toolbar class="q-pa-none">
        <q-breadcrumbs active-color="primary" style="font-size: 14px" class="q-mb-md">
          <template v-slot:separator>
        <q-icon
          size="1.5em"
          name="chevron_right"
          color="primary"
        />
      </template>
          <q-breadcrumbs-el label="Home" icon="home" to="/" />
          <q-breadcrumbs-el label="Relatórios" icon="article" />
          <q-breadcrumbs-el label="Relatório de Estoque" icon="inventory" />
        </q-breadcrumbs>
      </q-toolbar>
    <div class="col-12">
      <div class="row col-2 q-mt-md">
        <q-input
          class="col-2"
          label="Código do Produto"
          v-model="codigo"
          outlined
          dense
        />
        <q-input
          class="col-3 q-px-md"
          label="Nome do Produto"
          v-model="nomeProduto"
          outlined
          dense
        />
        <q-select class="col-3" label="Grupo" v-model="grupo" outlined dense />
      </div>
      <div class="col-12 q-mt-md row items-center justify-between">
        <div class="row col-9">
          <q-select
            class="col-3"
            label="Status Estoque"
            v-model="status"
            :options="this.ativo_inativo"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            outlined
            dense
          />
          <q-input
            class="col-3 q-px-md"
            label="Valor de Custo"
            v-model="valorCusto"
            outlined
            dense
          />
          <q-input
            class="col-3"
            label="Valor de Venda"
            v-model="valorVenda"
            outlined
            dense
          />
        </div>
        <div class="row q-gutter-md">
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
          :columns="this.colunasRelatorioEstoque"
          row-key="codigo"
          flat
          bordered
          no-data-label="Nenhum registro encontrado"
          class="q-mt-lg text-weight-medium"
        >
          <!-- Coluna Ações -->
          <template v-slot:body-cell-acoes="props">
            <q-td align="center">
              <q-btn
                icon="picture_as_pdf"
                size="sm"
                color="negative"
                flat
                round
                @click="editar(props.row)"
              />
              <q-btn
                icon="description"
                size="sm"
                color="green"
                flat
                round
                @click="excluir(props.row)"
              />
            </q-td>
          </template>

          <!-- Coluna Status -->
           <template v-slot:body-cell-valorCusto="props">
            <q-td :props="props" align="center">
              {{ formatarReais(props.row.valorCusto) }}
            </q-td>
          </template>
          <template v-slot:body-cell-valorVenda="props">
            <q-td :props="props" align="center">
              {{ formatarReais(props.row.valorVenda) }}
            </q-td>
          </template>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import listRelatorioEstoque from '../../config/listRelatorioEstoque.json'

@Component
export default class ModuleComponent extends Vue {
   // ===== data =====

  colunasRelatorioEstoque = listRelatorioEstoque.columns
  codigo = ''
  nomeProduto = ''
  grupo = ''
  quantidade = ''
  valorCusto = ''
  valorVenda = ''
  status = ''

  rowsFiltradas: any[] = []

  // ===== dados de tabela fictícios =====
  rowsEstoque = [
  {
    codigo: '001',
    nomeProduto: 'Notebook',
    grupo: 'Tecnologia',
    quantidade: '8',
    valorCusto: '2300',
    valorVenda: '2990',
    status: 'Ativo'
  },
  {
    codigo: '002',
    nomeProduto: 'Mouse Gamer',
    grupo: 'Periféricos',
    quantidade: '25',
    valorCusto: '80',
    valorVenda: '149',
    status: 'Ativo'
  },
  {
    codigo: '003',
    nomeProduto: 'Teclado Mecânico',
    grupo: 'Periféricos',
    quantidade: '15',
    valorCusto: '200',
    valorVenda: '350',
    status: 'Inativo'
  },
  {
    codigo: '004',
    nomeProduto: 'Monitor 24"',
    grupo: 'Tecnologia',
    quantidade: '12',
    valorCusto: '900',
    valorVenda: '1299',
    status: 'Ativo'
  },
  {
    codigo: '005',
    nomeProduto: 'Headset',
    grupo: 'Áudio',
    quantidade: '18',
    valorCusto: '120',
    valorVenda: '199',
    status: 'Ativo'
  }
]

formatarReais(valor: string | number): string {
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

ativo_inativo = [
    { label: 'Ativo', value: 'Ativo' },
    { label: 'Inativo', value: 'Inativo' }
  ]

created(){
    this.rowsFiltradas = this.rowsEstoque
  }

pesquisar() {
  this.rowsFiltradas = this.rowsEstoque.filter((row: any) => {

    const codigoMatch =
      !this.codigo ||
      row.codigo.toLowerCase().includes(this.codigo.toLowerCase())

    const nomeMatch =
      !this.nomeProduto ||
      row.nomeProduto.toLowerCase().includes(this.nomeProduto.toLowerCase())

    const custoMatch =
      !this.valorCusto ||
      row.valorCusto.toLowerCase().includes(this.valorCusto.toLowerCase())

    const vendaMatch =
      !this.valorVenda ||
      row.valorVenda.toLowerCase().includes(this.valorVenda.toLowerCase())

      const statusMatch =
      !this.status ||
      row.status === this.status

      return nomeMatch && codigoMatch && custoMatch && statusMatch && vendaMatch
  });
}

refreshTable(){
  this.codigo = ""
  this.nomeProduto = ""
  this.grupo = ""
  this.quantidade = ""
  this.valorCusto = ""
  this.valorVenda = ""
  this.status = ""

  this.rowsFiltradas = this.rowsEstoque
}
}
</script>

<style scoped>
.border{
  border: 1px solid black;
}
</style>
