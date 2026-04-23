<template>
  <!-- Container principal para centralizar o card na tela -->
  <div class="row justify-center items-center">
    
    <q-card class="col-11 col-md-10 col-lg-9 shadow-2" style="width: 1500px;">
      
      <!-- Cabeçalho do Card -->
      <q-card-section class="bg-white text-primary q-pb-none">
        <div class="text-h5 text-bold">Cadastro de Pessoas</div>
        <q-toolbar class="q-pa-none">
          <q-breadcrumbs active-color="primary" style="font-size: 14px" class="q-mb-md">
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el label="Home" icon="home" to="/" />
            <q-breadcrumbs-el label="Cadastro" icon="group" />
            <q-breadcrumbs-el label="Cadastro Pessoas" icon="groups" />
          </q-breadcrumbs>
        </q-toolbar>
      </q-card-section>

      <q-separator />

      <!-- Corpo do Card -->
      <q-card-section class="q-pa-lg">
        <!-- Filtros e Ações (Visíveis apenas quando não está em modo de formulário) -->
        <div>
          
          <!-- Linha Superior: Tipo de Pessoa -->
          
<div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-3">
            <q-select
              v-model="tipoPessoa"
              :options="opcoesTipoPessoa"
              label="Tipo de Pessoa"
              outlined
              dense
              emit-value
              map-options
            />
          </div>
        </div>


          <!-- Linha Inferior: Inputs e Botões Separados -->
          
<div class="row items-center q-col-gutter-md">

          <!-- INPUTS -->
          <div class="col-12 col-md-9">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input v-model="nome" label="Nome Completo" outlined dense />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="documento" label="CNPJ/CPF" outlined dense />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="codigo" label="Código do Cliente" outlined dense />
              </div>
            </div>
          </div>

          <!-- BOTÕES -->
          <div class="col-12 col-md-3" v-if="!mostrarFormCadastroPF && !mostrarFormCadastroPJ">
            <div class="row justify-end items-center q-gutter-sm">
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

        </div>
      </div>

        <!-- Formulário de Cadastro (PF ou PJ) -->
        <div v-if="mostrarFormCadastroPF || mostrarFormCadastroPJ" class="q-mt-md">
          <q-form @submit.prevent="salvar()">
            <!-- Seção: Dados Gerais -->
            <div class="text-h6 q-mb-sm">Dados Gerais</div>
            <div class="row q-col-gutter-md">
              <template v-if="mostrarFormCadastroPF">
                <div class="col-12 col-sm-3">
                  <q-input v-model="dtaNascimento" label="Data de Nascimento" type="date" outlined dense />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input v-model="nmeSocial" label="Nome Social" outlined dense />
                </div>
              </template>
              <template v-if="mostrarFormCadastroPJ">
                <div class="col-12 col-sm-5">
                  <q-input v-model="razaoSocial" label="Razão Social" outlined dense />
                </div>
                <div class="col-12 col-sm-4">
                  <q-input v-model="nomeResponsavel" label="Nome do Responsável" outlined dense />
                </div>
              </template>
              <div class="col-12 col-sm-3">
                <q-select v-model="ativoInativo" :options="ativo_inativo" label="Status" outlined dense emit-value map-options />
              </div>
            </div>

            <!-- Seção: Dados de Contato -->
            <div class="text-h6 q-mt-lg q-mb-sm">Dados de Contato</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <q-input v-model="telefone1" label="Telefone 1" mask="(##) #####-####" outlined dense />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="telefone2" label="Telefone 2" mask="(##) #####-####" outlined dense />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="email" label="E-mail" outlined dense />
              </div>
            </div>

            <!-- Seção: Dados de Endereço -->
            <div class="text-h6 q-mt-lg q-mb-sm">Dados de Endereço</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-2">
                <q-input v-model="cep" label="CEP" mask="#####-###" outlined dense />
              </div>
              <div class="col-12 col-sm-6">
                <q-input v-model="endereco" label="Endereço" outlined dense />
              </div>
              <div class="col-12 col-sm-2">
                <q-input v-model="numero" label="Número" outlined dense />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="bairro" label="Bairro" outlined dense />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="cidade" label="Cidade" outlined dense />
              </div>
              <div class="col-12 col-sm-2">
                <q-select v-model="ufSelect" :options="uf_select" label="UF" outlined dense emit-value map-options />
              </div>
            </div>

            <!-- Seção: Observações -->
            <div class="text-h6 q-mt-lg q-mb-sm">Observações</div>
            <div class="row">
              <div class="col-12">
                <q-input v-model="text" type="textarea" outlined dense input-style="resize: none;" rows="3" />
              </div>
            </div>

            <!-- Botões do Formulário -->
            <div class="row q-mt-xl q-gutter-md justify-end">
              <q-btn label="Cancelar" color="negative" flat @click="abrirDialogCancelar()" />
              <q-btn label="Salvar Cadastro" color="positive" unelevated type="submit" />
            </div>
          </q-form>
        </div>

        <!-- Tabela de Resultados (Visível apenas quando não está em modo de formulário) -->
        <div v-if="!mostrarFormCadastroPF && !mostrarFormCadastroPJ" class="q-mt-xl">
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
import listCadastroPessoas from '../../config/listCadastroPessoas.json'

@Component
export default class ModuleComponent extends Vue {
  colunasCadastroProdutos = listCadastroPessoas.columns
  // ===== data =====
  tipoPessoa = null
  nome = ''
  documento = ''
  codigo = ''
  
  // Controle de UI
  mostrarFormCadastroPF = false
  mostrarFormCadastroPJ = false
  dialogCancelar = false
  dialogExcluir = false

  // Dados do Formulário
  dtaNascimento = ''
  nmeSocial = ''
  razaoSocial = ''
  nomeResponsavel = ''
  ativoInativo = 'A'
  telefone1 = ''
  telefone2 = ''
  email = ''
  cep = ''
  endereco = ''
  numero = ''
  bairro = ''
  cidade = ''
  ufSelect = 'DF'
  text = ''

  rowsClientes = [
    { codigo: '001', tipoPessoa: 'PF', nome: 'Antônio Carlos', documento: '123-456-789-10', telefone: '(61) 98159-8038', email: 'antonio@gmail.com', status: 'Ativo' },
    { codigo: '002', tipoPessoa: 'PJ', nome: 'Matheus Tech', documento: '12.342.278/0001-10', telefone: '(61) 98112-8038', email: 'matheus@gmail.com', status: 'Inativo' },
    { codigo: '003', tipoPessoa: 'PF', nome: 'Brunna Silva', documento: '677-886-080-21', telefone: '(61) 98999-9999', email: 'brunna@gmail.com', status: 'Inativo' }
  ]

  rowsFiltradas: any[] = []

  // Opções
  opcoesTipoPessoa = [
    { label: 'Pessoa Física', value: 'PF' },
    { label: 'Pessoa Jurídica', value: 'PJ' }
  ]
  ativo_inativo = [
    { label: 'Ativo', value: 'A' },
    { label: 'Inativo', value: 'I' }
  ]
  uf_select = [
    { label: 'DF', value: 'DF' },
    { label: 'SP', value: 'SP' },
    { label: 'RJ', value: 'RJ' },
    { label: 'MG', value: 'MG' }
  ]

  created() {
    this.rowsFiltradas = this.rowsClientes
  }

  // ===== Métodos =====
  mostrarFormulario() {
    if (!this.tipoPessoa) {
      this.$q.notify({ type: 'negative', message: 'Selecione o tipo de pessoa primeiro', position: 'bottom' })
      return
    }
    this.mostrarFormCadastroPF = this.tipoPessoa === 'PF'
    this.mostrarFormCadastroPJ = this.tipoPessoa === 'PJ'
  }

  abrirDialogCancelar() {
    this.dialogCancelar = true
  }

  confirmarCancelamento() {
    this.dialogCancelar = false
    this.mostrarFormCadastroPF = false
    this.mostrarFormCadastroPJ = false
    this.limparCampos()
  }

  limparCampos() {
    this.codigo = ""
    this.nome = ""
    this.documento = ""
    this.tipoPessoa = null
  }

  pesquisar() {
    this.rowsFiltradas = this.rowsClientes.filter((row: any) => {
      const nomeMatch = !this.nome || row.nome.toLowerCase().includes(this.nome.toLowerCase())
      const codigoMatch = !this.codigo || row.codigo.toLowerCase().includes(this.codigo.toLowerCase())
      const documentoMatch = !this.documento || row.documento.toLowerCase().includes(this.documento.toLowerCase())
      const tipoPessoaMatch = !this.tipoPessoa || row.tipoPessoa === this.tipoPessoa
      return nomeMatch && codigoMatch && documentoMatch && tipoPessoaMatch
    })
  }

  editar(row: any) {
    this.codigo = row.codigo
    this.nome = row.nome
    this.documento = row.documento
    this.tipoPessoa = row.tipoPessoa
    this.ativoInativo = row.status === 'Ativo' ? 'A' : 'I'
    this.mostrarFormulario()
  }

  confirmarExcluir(row: any) {
    console.log('Excluir:', row)
  }

  refreshTable() {
    this.limparCampos()
    this.rowsFiltradas = this.rowsClientes
  }

  salvar() {
    this.$q.notify({ type: 'positive', message: 'Cadastro salvo com sucesso!' })
    this.confirmarCancelamento()
  }
}
</script>

<style scoped>
.border {
  border: 1px solid #ccc;
}
</style>
