<template>
  <div class="text-h5 text-bold">
    <div class="q-py-md">CADASTRO DE PESSOAS</div>
    <div class="col-12">
      <div class="row col-3 q-mt-md">
        <q-select
          class="col-3"
          v-model="tipoPessoa"
          :options="this.opcoesTipoPessoa"
          label="Tipo de Pessoa"
          outlined
          option-value="value"
          option-label="label"
          emit-value
          map-options
          dense
        />
      </div>
      <div class="col-12 row justify-between items-center">
        <div class="row col-9 q-mt-md">
          <q-input
            v-model="nome"
            class="col-4"
            label="Nome Completo"
            outlined
            dense
          />
          <q-input
            v-model="documento"
            class="col-4 q-px-md"
            label="CNPJ/CPF"
            outlined
            dense
          />
          <q-input
            v-model="codigo"
            class="col-2"
            label="Código do Cliente"
            outlined
            dense
          />
          <q-btn
            rounded
            icon="cleaning_services"
            class="text-white q-mx-md"
            color="warning"
            @click="refreshTable()"
            v-if="!mostrarFormCadastroPF && !mostrarFormCadastroPJ"
          />
        </div>
        <div class="row q-gutter-md">
          <q-btn
            icon="search"
            class="text-white verde-escuro"
            @click="pesquisar()"
            rounded
          />
          <q-btn
            rounded
            icon="add"
            class="text-white verde"
            @click="mostrarFormulario()"
          />
        </div>
      </div>

      <form action="">
        <div v-if="mostrarFormCadastroPF">
          <div class="row col-12 q-mt-md">
            <div class="q-pb-md q-mt-md">
              <q-title class="text-h6">Dados Gerais</q-title>
            </div>
            <div class="row col-12 q-gutter-md">
              <q-input
                v-model="dtaNascimento"
                class="col-2"
                label="Data de Nascimento"
                type="date"
                outlined
                dense
              />
              <q-input
                v-model="nmeSocial"
                class="col-3"
                label="Nome Social"
                outlined
                dense
              />
              <q-select
                class="col-2"
                v-model="ativoInativo"
                :options="this.ativo_inativo"
                label="Ativo/Inativo"
                outlined
                dense
              />
            </div>
          </div>

          <div class="row col-12 q-mt-md">
            <div class="q-pb-md q-mt-md">
              <q-title class="text-h6">Dados de Contato</q-title>
            </div>
            <div class="row col-12 q-gutter-md">
              <q-input
                v-model="telefone1"
                class="col-3"
                label="Telefone 1"
                mask="(##) #####-####"
                outlined
                dense
              />
              <q-input
                v-model="telefone2"
                class="col-3"
                label="Telefone 2"
                mask="(##) #####-####"
                outlined
                dense
              />
              <q-input
                class="col-3"
                label="E-mail"
                v-model="email"
                outlined
                dense
              />
            </div>
          </div>

          <div class="row col-12 q-mt-md">
            <div class="q-pb-md q-mt-md">
              <q-title class="text-h6">Dados de Endereço</q-title>
            </div>
            <div class="row col-12 q-gutter-md">
              <q-input
                class="col-3"
                label="CEP"
                mask="#####-###"
                outlined
                dense
              />
              <q-input
                class="col-3"
                label="Endereço"
                v-model="endereco"
                outlined
                dense
              />
              <q-input
                class="col-3"
                label="Número"
                v-model="numero"
                outlined
                dense
              />
              <q-input
                class="col-3"
                label="Bairro"
                v-model="bairro"
                outlined
                dense
              />
              <q-input
                class="col-3"
                label="Cidade"
                v-model="cidade"
                outlined
                dense
              />
              <q-select
                class="col-2"
                v-model="ufSelect"
                :options="this.uf_select"
                label="UF"
                outlined
                dense
              />
            </div>
          </div>

          <div class="row col-12 q-mt-md">
            <div class="q-pb-md q-mt-md">
              <q-title class="text-h6">Observações</q-title>
            </div>
            <div class="row col-12 q-gutter-md">
              <q-input
                class="row col-10"
                v-model="text"
                outlined
                dense
                type="textarea"
                input-style="resize: none;"
              />
            </div>
          </div>

          <div class="row col-12 q-mt-lg q-gutter-md">
            <q-btn class="bg-green text-white text-bold" rounded>Salvar</q-btn>
            <q-btn
              rounded
              class="bg-red text-white text-bold"
              @click="abrirDialogCancelar()"
              >Cancelar</q-btn
            >
          </div>
        </div>
      </form>

      <form action="">
        <div v-if="mostrarFormCadastroPJ">
          <div class="row col-12 q-mt-md">
            <div class="q-pb-md q-mt-md">
              <q-title class="text-h6">Dados Gerais</q-title>
            </div>
            <div class="row col-12 q-gutter-md">
              <q-input
                class="col-3"
                label="Razão Social"
                v-model="razaoSocial"
                outlined
                dense
              />
              <q-input
                class="col-3"
                label="Nome do responsável"
                v-model="nomeResponsavel"
                outlined
                dense
              />
              <q-select
                class="col-2"
                v-model="ativoInativo"
                :options="this.ativo_inativo"
                label="Ativo/Inativo"
                outlined
                dense
              />
            </div>
          </div>

          <div class="row col-12 q-mt-md">
            <div class="q-pb-md q-mt-md">
              <q-title class="text-h6">Dados de Contato</q-title>
            </div>
            <div class="row col-12 q-gutter-md">
              <q-input
                class="col-3"
                v-model="telefone1"
                label="Telefone 1"
                mask="(##) #####-####"
                outlined
                dense
              />
              <q-input
                class="col-3"
                label="Telefone 2"
                v-model="telefone2"
                mask="(##) #####-####"
                outlined
                dense
              />
              <q-input
                class="col-3"
                label="E-mail"
                v-model="email"
                outlined
                dense
              />
            </div>
          </div>

          <div class="row col-12 q-mt-md">
            <div class="q-pb-md q-mt-md">
              <q-title class="text-h6">Dados de Endereço</q-title>
            </div>
            <div class="row col-12 q-gutter-md">
              <q-input
                class="col-3"
                label="CEP"
                mask="#####-###"
                outlined
                dense
              />
              <q-input
                class="col-3"
                label="Endereço"
                v-model="endereco"
                outlined
                dense
              />
              <q-input
                class="col-3"
                label="Número"
                v-model="numero"
                outlined
                dense
              />
              <q-input
                class="col-3"
                label="Bairro"
                v-model="bairro"
                outlined
                dense
              />
              <q-input
                class="col-3"
                label="Cidade"
                v-model="cidade"
                outlined
                dense
              />
              <q-select
                class="col-2"
                v-model="ufSelect"
                :options="this.uf_select"
                label="Ativo/Inativo"
                outlined
                dense
              />
            </div>
          </div>

          <div class="row col-12 q-mt-md">
            <div class="q-pb-md q-mt-md">
              <q-title class="text-h6">Observações</q-title>
            </div>
            <div class="row col-12 q-gutter-md">
              <q-input
                class="row col-10"
                v-model="text"
                outlined
                dense
                type="textarea"
                input-style="resize: none;"
              />
            </div>
          </div>

          <div class="row col-12 q-mt-lg q-gutter-md">
            <q-btn class="bg-green text-white text-bold" rounded>Salvar</q-btn>
            <q-btn
              class="bg-red text-white text-bold"
              rounded
              @click="abrirDialogCancelar()"
              >Cancelar</q-btn
            >
          </div>
        </div>
      </form>

      <div>
        <q-table
          :data="this.rowsFiltradas"
          :columns="this.colunasCadastroPessoas"
          row-key="codigo"
          flat
          bordered
          class="q-mt-lg"
          v-if="!mostrarFormCadastroPF && !mostrarFormCadastroPJ"
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
                @click="confirmarExcluir()"
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
import listCadastroPessoas from '../../config/listCadastroPessoas.json'

@Component
export default class ModuleComponent extends Vue {
  // ===== data =====

  colunasCadastroPessoas = listCadastroPessoas.columns
  tipoPessoa: string | null = null
  sexo: string | null = null
  ativoInativo: string | null = null
  ufSelect: string | null = null
  mostrarFormCadastroPF = false
  mostrarFormCadastroPJ = false
  dialogCancelar = false
  dialogExcluir = false

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

  opcoesTipoPessoa = [
      { label: 'Pessoa Física', value: 'PF' },
      { label: 'Pessoa Jurídica', value: 'PJ' }
    ]
  tipoSexo = [
    { label: 'Masculino', value: 'M' },
    { label: 'Feminino', value: 'F' },
    { label: 'Não informado', value: 'NI' }
  ]
  ativo_inativo = [
    { label: 'Ativo', value: 'A' },
    { label: 'Inativo', value: 'I' }
  ]

  uf_select = [
    { label: 'DF', value: 'DF' },
    { label: 'Outro', value: 'Outro' }
  ]

  mostrarFormulario(){
    if(this.tipoPessoa === 'PF'){
      this.mostrarFormCadastroPF = true
      this.mostrarFormCadastroPJ = false
    }
    if(this.tipoPessoa === 'PJ'){
      this.mostrarFormCadastroPF = false
      this.mostrarFormCadastroPJ = true
    }
    if(!this.tipoPessoa){
      this.$q.notify({
        type: 'negative',
        message: 'Selecione o tipo de pessoa',
        position: 'bottom'
      })
    return
    }
  }

  abrirDialogCancelar(){
    this.dialogCancelar = true
  }

  confirmarCancelamento() {
  this.dialogCancelar = false

  // volta pra tabela
  this.mostrarFormCadastroPF = false
  this.mostrarFormCadastroPJ = false

  // opcional: limpa dados
  this.tipoPessoa = null
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

    const tipoPessoaMatch =
      !this.tipoPessoa ||
      row.tipoPessoa === this.tipoPessoa

    return nomeMatch && codigoMatch && documentoMatch && tipoPessoaMatch
  })
}

editar(row: any) {
  // Preenche os campos do formulário com os dados do usuário
  this.codigo = row.codigo
  this.nome = row.nome
  this.documento = row.documento
  this.tipoPessoa = row.tipoPessoa
  this.ativoInativo = row.status === 'Ativo' ? 'Ativo' : 'Inativo'

  if (row.tipoPessoa === 'PF') {
    this.mostrarFormCadastroPF = true
    this.mostrarFormCadastroPJ = false
  } else {
    this.mostrarFormCadastroPF = false
    this.mostrarFormCadastroPJ = true
  }
}

refreshTable(){
  this.codigo = ""
  this.nome = ""
  this.documento = ""
  this.tipoPessoa = null

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
