<template>
  <div class="text-h5 text-bold">
    <div class="q-py-md">RELATÓRIO DE VENDAS</div>

    <div class="col-12">
      <div class="row col-12 q-mt-md">
        <q-input
          class="col-2"
          label="Código do Produto"
          v-model="codigoProduto"
          outlined
          dense
        />

        <q-input
          class="col-2 q-px-md"
          label="Nome do Produto"
          v-model="nomeProduto"
          outlined
          dense
        />

        <q-input
          class="col-3"
          label="Cliente"
          v-model="nomeCliente"
          outlined
          dense
        />

        <q-input
          class="col-2 q-px-md"
          label="CPF/CNPJ"
          v-model="cpfCnpj"
          outlined
          dense
        />
      </div>

      <div class="col-12 row justify-between items-center q-mt-md">
        <div class="row col-10">
          <q-input
            class="col-2"
            label="Valor Unitário"
            v-model="valorUnitario"
            outlined
            dense
          />

          <q-input
            class="col-2 q-px-md"
            label="Valor Total"
            v-model="valorTotal"
            outlined
            dense
          />

          <q-input
            class="col-3"
            label="Período: De"
            type="date"
            v-model="periodoDe"
            outlined
            dense
          />

          <q-input
            class="col-3 q-px-md"
            label="Período: Até"
            type="date"
            v-model="periodoAte"
            outlined
            dense
          />
        </div>

        <div class="row q-gutter-md">
          <q-btn
            icon="search"
            class="text-white verde-escuro"
            rounded
            @click="pesquisar()"
          />
          <q-btn
            rounded
            icon="cleaning_services"
            class="text-white"
            color="warning"
            @click="refreshTable()"
          />
        </div>
      </div>
    </div>

    <div>
      <q-table
        :data="this.rowsFiltradas"
        :columns="this.colunasRelatorioVenda"
        row-key="codigo"
        flat
        bordered
        class="q-mt-lg"
      >
        <!-- Coluna Ações -->
        <template v-slot:body-cell-acoes="props">
          <q-td align="center">
            <q-btn
              icon="picture_as_pdf"
              size="sm"
              color="red"
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
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import listRelatorioVenda from '../../config/listRelatorioVenda.json'

@Component
export default class ModuleComponent extends Vue {
   // ===== data =====

  colunasRelatorioVenda = listRelatorioVenda.columns
  dataVenda = ''
  codigoProduto = ''
  nomeProduto = ''
  nomeCliente = ''
  cpfCnpj = ''
  valorUnitario = ''
  valorTotal = ''

  rowsFiltradas: any[] = []

  // ===== dados de tabela fictícios =====
  rowsVendas = [
  {
    dataVenda: '06/04/2026',
    codigoProduto: '001002003004',
    nomeProduto: 'GTA 5',
    nomeCliente: 'algumaCoisa',
    cpfCnpj: '098878881000110',
    valorUnitario: '179',
    valorTotal: '199'
  },
  {
  dataVenda: '12/03/2026',
  codigoProduto: '009876543210',
  nomeProduto: 'Teclado Mecânico RGB',
  nomeCliente: 'Carlos Eduardo',
  cpfCnpj: '12345678900199',
  valorUnitario: '350',
  valorTotal: '700'
},
{
  dataVenda: '28/02/2026',
  codigoProduto: '005544332211',
  nomeProduto: 'Mouse Gamer Pro',
  nomeCliente: 'Fernanda Lima',
  cpfCnpj: '98765432100011',
  valorUnitario: '149',
  valorTotal: '298'
}
]

created(){
  this.rowsFiltradas = this.rowsVendas
}

pesquisar() {
  this.rowsFiltradas = this.rowsVendas.filter((row: any) => {

    const codigoProdutoMatch =
      !this.codigoProduto ||
      row.codigoProduto
        .toLowerCase()
        .includes(this.codigoProduto.toLowerCase())

    const nomeProdutoMatch =
      !this.nomeProduto ||
      row.nomeProduto
        .toLowerCase()
        .includes(this.nomeProduto.toLowerCase())

    const nomeClienteMatch =
      !this.nomeCliente ||
      row.nomeCliente
        .toLowerCase()
        .includes(this.nomeCliente.toLowerCase())

    const cpfCnpjMatch =
      !this.cpfCnpj ||
      row.cpfCnpj
        .toLowerCase()
        .includes(this.cpfCnpj.toLowerCase())

    const valorUnitarioMatch =
      !this.valorUnitario ||
      row.valorUnitario
        .toLowerCase()
        .includes(this.valorUnitario.toLowerCase())

    const valorTotalMatch =
      !this.valorTotal ||
      row.valorTotal
        .toLowerCase()
        .includes(this.valorTotal.toLowerCase())

    const dataVendaMatch =
      !this.dataVenda ||
      row.dataVenda
        .toLowerCase()
        .includes(this.dataVenda.toLowerCase())

    return (
      codigoProdutoMatch &&
      nomeProdutoMatch &&
      nomeClienteMatch &&
      cpfCnpjMatch &&
      valorUnitarioMatch &&
      valorTotalMatch &&
      dataVendaMatch
    )
  })
}

refreshTable(){
  this.dataVenda = ""
  this.codigoProduto = ""
  this.nomeProduto = ""
  this.nomeCliente = ""
  this.cpfCnpj = ""
  this.valorUnitario = ""
  this.valorTotal = ""

  this.rowsFiltradas = this.rowsVendas
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
