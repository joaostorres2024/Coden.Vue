<template>
  <div class="row justify-center items-center">
    <q-card
      class="col-11 col-md-10 col-lg-9 no-shadow border b-r-10"
      style="width: 1500px"
    >
      <q-card-section class="bg-white text-black q-pb-none">
        <div class="text-h5 text-bold">Cadastro de Pessoas</div>
        <q-toolbar class="q-pa-none">
          <q-breadcrumbs
            active-color="black"
            style="font-size: 14px"
            class="q-mb-md"
          >
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="black" />
            </template>
            <q-breadcrumbs-el label="Home" icon="home" to="/" />
            <q-breadcrumbs-el label="Cadastro" icon="group" />
            <q-breadcrumbs-el label="Cadastro Pessoas" icon="groups" />
          </q-breadcrumbs>
        </q-toolbar>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-lg">
        <div>
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
                :rules="[val => !!val || 'Selecione o tipo de pessoa']"
                ref="selectTipoPessoa"
                hide-bottom-space
                lazy-rules
              />
            </div>
          </div>

          <div class="row items-center q-col-gutter-md">
            <div class="col-12 col-md-9">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-4">
                  <q-input
                    v-model="nome"
                    label="Nome Completo"
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 col-md-4">
                  <q-input
                    v-model="documento"
                    label="CNPJ/CPF"
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 col-md-4">
                  <q-input
                    v-model="codigo"
                    label="Código do Cliente"
                    outlined
                    dense
                  />
                </div>
              </div>
            </div>

            <div
              class="col-12 col-md-3"
              v-if="!mostrarFormCadastroPF && !mostrarFormCadastroPJ"
            >
              <div class="row justify-end items-center q-gutter-sm">
                <q-btn
                  unelevated
                  class="bg-positive"
                  @click="mostrarFormulario()"
                >
                  <q-icon name="add" color="white" />
                  <q-tooltip>Adicionar</q-tooltip>
                </q-btn>
                <q-btn
                  unelevated
                  class="bg-primary"
                  @click="refreshTable()"
                >
                  <q-icon name="delete_sweep" color="white" />
                  <q-tooltip>Limpar</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulário -->
        <div
          v-if="mostrarFormCadastroPF || mostrarFormCadastroPJ"
          class="q-mt-md"
        >
          <q-form ref="formCadastro" @submit.prevent="salvar()" greedy>
            <!-- Dados Gerais -->
            <div class="text-h6 q-mb-sm">Dados Gerais</div>
            <div class="row q-col-gutter-md">
              <template v-if="mostrarFormCadastroPF">
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model="dtaNascimento"
                    label="Data de Nascimento *"
                    type="date"
                    outlined
                    dense
                    :rules="[val => !!val || 'Data de nascimento obrigatória']"
                    hide-bottom-space
                    lazy-rules
                  />
                </div>
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model="nmeSocial"
                    label="Nome Social"
                    outlined
                    dense
                  />
                </div>
              </template>

              <template v-if="mostrarFormCadastroPJ">
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model="razaoSocial"
                    label="Razão Social *"
                    outlined
                    dense
                    :rules="[val => !!val || 'Razão social obrigatória']"
                    hide-bottom-space
                    lazy-rules
                  />
                </div>
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model="nomeResponsavel"
                    label="Nome do Responsável *"
                    outlined
                    dense
                    :rules="[val => !!val || 'Nome do responsável obrigatório']"
                    hide-bottom-space
                    lazy-rules
                  />
                </div>
              </template>

              <div class="col-12 col-sm-3">
                <q-select
                  v-model="ativoInativo"
                  :options="ativo_inativo"
                  label="Status"
                  outlined
                  dense
                  emit-value
                  map-options
                />
              </div>
            </div>

            <!-- Dados de Contato -->
            <div class="text-h6 q-mt-lg q-mb-sm">Dados de Contato</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-3">
                <q-input
                  v-model="telefone1"
                  label="Telefone 1 *"
                  mask="(##) #####-####"
                  outlined
                  dense
                  :rules="[val => !!val || 'Telefone obrigatório']"
                  hide-bottom-space
                  lazy-rules
                />
              </div>
              <div class="col-12 col-sm-3">
                <q-input
                  v-model="telefone2"
                  label="Telefone 2"
                  mask="(##) #####-####"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-3">
                <q-input
                  v-model="email"
                  label="E-mail *"
                  outlined
                  dense
                  :rules="mostrarFormCadastroPJ ? [val => !!val || 'E-mail obrigatório'] : []"
                  hide-bottom-space
                  lazy-rules
                />
              </div>
            </div>

            <!-- Dados de Endereço -->
            <div class="text-h6 q-mt-lg q-mb-sm">Dados de Endereço</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-2">
                <q-input
                  v-model="cep"
                  label="CEP *"
                  mask="#####-###"
                  outlined
                  dense
                  :rules="[val => !!val || 'CEP obrigatório']"
                  hide-bottom-space
                  lazy-rules
                  @input="buscarCep(cep)"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="endereco"
                  label="Endereço *"
                  outlined
                  dense
                  :rules="[val => !!val || 'Endereço obrigatório']"
                  hide-bottom-space
                  lazy-rules
                />
              </div>
              <div class="col-12 col-sm-1">
                <q-input
                  v-model="numero"
                  label="Número *"
                  outlined
                  dense
                  :rules="[val => !!val || 'Número obrigatório']"
                  hide-bottom-space
                  lazy-rules
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="bairro"
                  label="Bairro *"
                  outlined
                  dense
                  :rules="[val => !!val || 'Bairro obrigatório']"
                  hide-bottom-space
                  lazy-rules
                />
              </div>
              <div class="col-12 col-sm-3">
                <q-input
                  v-model="cidade"
                  label="Cidade *"
                  outlined
                  dense
                  :rules="[val => !!val || 'Cidade obrigatória']"
                  hide-bottom-space
                  lazy-rules
                />
              </div>
              <div class="col-12 col-sm-1">
                <q-select
                  v-model="ufSelect"
                  :options="uf_select"
                  label="UF *"
                  outlined
                  dense
                  emit-value
                  map-options
                  :rules="[val => !!val || 'UF obrigatória']"
                  hide-bottom-space
                  lazy-rules
                />
              </div>
            </div>

            <!-- Observações -->
            <div class="text-h6 q-mt-lg q-mb-sm">Observações</div>
            <div class="row">
              <div class="col-12">
                <q-input
                  v-model="observacoes"
                  type="textarea"
                  outlined
                  dense
                  input-style="resize: none;"
                  rows="5"
                />
              </div>
            </div>

            <!-- Botões -->
            <div class="row q-mt-xl q-gutter-md justify-end">
              <q-btn
                label="Salvar Cadastro"
                color="positive"
                unelevated
                type="submit"
                class="b-r-8"
              />
              <q-btn
                label="Cancelar"
                color="negative"
                class="b-r-8"
                flat
                @click="abrirDialogCancelar()"
              />
            </div>
          </q-form>
        </div>

        <!-- Tabela -->
        <div
          v-if="!mostrarFormCadastroPF && !mostrarFormCadastroPJ"
          class="q-mt-xl"
        >
          <q-table
            :data="rowsFiltradas"
            :columns="colunasCadastroProdutos"
            row-key="id"
            :rows-per-page-options="[10, 20, 50]"
            flat
            bordered
            no-data-label="Nenhum registro encontrado"
            class="text-weight-medium"
          >
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
            <template v-slot:body-cell-status="props">
              <q-td align="center">
                <q-badge
                  :color="props.row.status === 'Ativo' ? 'positive' : 'negative'"
                >
                  {{ props.row.status }}
                </q-badge>
              </q-td>
            </template>
            <template v-slot:body-cell-documento="props">
              <q-td align="center">{{ formatarDocumento(props.row) }}</q-td>
            </template>
          </q-table>
        </div>
      </q-card-section>
    </q-card>

<q-dialog v-model="dialogCancelar" persistent>
  <q-card style="min-width: 380px; border-radius: 12px" class="q-pa-sm">
    <q-card-section class="q-pb-none">
      <div class="text-h6 text-bold">Cancelar operação</div>
    </q-card-section>

    <q-card-section class="text-grey-7" style="font-size: 14px">
      Deseja realmente cancelar? As alterações não salvas serão perdidas.
    </q-card-section>

    <q-card-actions align="right" class="q-pa-md q-gutter-sm">
      <q-btn
        label="Voltar"
        unelevated
        style="border: 1px solid #ccc; border-radius: 8px; min-width: 100px"
        color="white"
        text-color="dark"
        v-close-popup
      />
      <q-btn
        label="Sim, Cancelar"
        unelevated
        color="negative"
        style="border-radius: 8px; min-width: 130px"
        @click="confirmarCancelamento()"
      />
    </q-card-actions>
  </q-card>
</q-dialog>

<q-dialog v-model="dialogExcluir" persistent>
  <q-card style="min-width: 380px; border-radius: 12px" class="q-pa-sm">
    <q-card-section class="q-pb-none">
      <div class="text-h6 text-bold">Excluir Cliente</div>
    </q-card-section>

<q-card-section class="text-grey-7" style="font-size: 14px">
  Tem certeza que deseja excluir o cliente <strong>{{ clienteParaExcluir?.nome_cliente }}</strong>? Ao confirmar, todos os dados relacionados a esse cliente serão removidos permanentemente e essa ação não poderá ser desfeita.
</q-card-section>

    <q-card-actions align="right" class="q-pa-md q-gutter-sm">
      <q-btn
        label="Voltar"
        unelevated
        style="border: 1px solid #ccc; border-radius: 8px; min-width: 100px"
        color="white"
        text-color="dark"
        v-close-popup
      />
      <q-btn
        label="Sim, Excluir"
        unelevated
        color="negative"
        style="border-radius: 8px; min-width: 130px"
        @click="executarExclusao()"
      />
    </q-card-actions>
  </q-card>
</q-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import listCadastroPessoas from '../../config/listCadastroPessoas.json'
import clienteService, { Cliente } from '../../services/clienteService'

@Component
export default class ModuleComponent extends Vue {
  colunasCadastroProdutos = listCadastroPessoas.columns

  // ===== data =====
  tipoPessoa: string | null = null
  nome = ''
  documento = ''
  codigo = ''
  editandoId: number | null = null
  clienteParaExcluir: any = null

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
  ativoInativo = 'Ativo'
  telefone1 = ''
  telefone2 = ''
  email = ''
  cep = ''
  endereco = ''
  numero = ''
  bairro = ''
  cidade = ''
  ufSelect = 'DF'
  observacoes = ''

  // Tabela
  rows: Cliente[] = []

  // Opções
  opcoesTipoPessoa = [
    { label: 'Pessoa Física', value: 'PF' },
    { label: 'Pessoa Jurídica', value: 'PJ' }
  ]
  ativo_inativo = [
    { label: 'Ativo', value: 'Ativo' },
    { label: 'Inativo', value: 'Inativo' }
  ]
  uf_select = [
    { label: 'DF', value: 'DF' },
    { label: 'SP', value: 'SP' },
    { label: 'RJ', value: 'RJ' },
    { label: 'MG', value: 'MG' }
  ]

  async created() {
    await this.carregarClientes()
  }

  // ===== Computed =====
  get rowsFiltradas() {
    return this.rows.filter((c: Cliente) => {
      const nomeOk = c.nome_cliente.toLowerCase().startsWith(this.nome.toLowerCase())
      const codigoOk = !this.codigo || c.codigo_cliente?.toLowerCase().startsWith(this.codigo.toLowerCase())
      const docOk = !this.documento || c.cpf?.startsWith(this.documento) || c.cnpj?.startsWith(this.documento)
      const tipoOk = !this.tipoPessoa || c.tipo_pessoa === this.tipoPessoa
      return nomeOk && codigoOk && docOk && tipoOk
    })
  }

  // ===== Métodos =====
  async carregarClientes() {
    try {
      this.rows = await clienteService.listarClientes()
    } catch (err) {
      this.$q.notify({ type: 'negative', message: 'Erro ao carregar clientes!' })
    }
  }

  async salvar() {
    const form = this.$refs.formCadastro as any
    const valido = await form.validate()
    if (!valido) return

    // Validações extras dos campos do topo (fora do q-form)
    if (!this.nome) {
      this.$q.notify({ type: 'negative', message: 'Nome completo obrigatório', position: 'bottom' })
      return
    }
    if (!this.documento) {
      this.$q.notify({ type: 'negative', message: 'CPF/CNPJ obrigatório', position: 'bottom' })
      return
    }

    try {
      const payload: Cliente = {
        tipo_pessoa: this.tipoPessoa ?? '',
        nome_cliente: this.nome,
        cpf: this.tipoPessoa === 'PF' ? this.documento : undefined,
        cnpj: this.tipoPessoa === 'PJ' ? this.documento : undefined,
        codigo_cliente: this.codigo,
        status: this.ativoInativo,
        data_nascimento: this.tipoPessoa === 'PF' ? this.dtaNascimento : undefined,
        nome_social: this.tipoPessoa === 'PF' ? this.nmeSocial : undefined,
        razao_social: this.tipoPessoa === 'PJ' ? this.razaoSocial : undefined,
        nome_responsavel: this.tipoPessoa === 'PJ' ? this.nomeResponsavel : undefined,
        telefone_1: this.telefone1,
        telefone_2: this.telefone2,
        email: this.email,
        cep: this.cep,
        endereco: this.endereco,
        numero: this.numero,
        bairro: this.bairro,
        cidade: this.cidade,
        uf: this.ufSelect,
        observacoes: this.observacoes
      }

      if (this.editandoId) {
        await clienteService.atualizarCliente(this.editandoId, payload)
        this.$q.notify({ type: 'positive', message: 'Cliente atualizado com sucesso!' })
      } else {
        await clienteService.criarCliente(payload)
        this.$q.notify({ type: 'positive', message: 'Cliente cadastrado com sucesso!' })
      }

      await this.carregarClientes()
      this.confirmarCancelamento()

    } catch (err) {
      this.$q.notify({ type: 'negative', message: 'Erro ao salvar cadastro!' })
    }
  }

  async buscarCep(cep: string) {
  const cepLimpo = cep.replace(/\D/g, '')
  if (cepLimpo.length !== 8) return

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
    const data = await response.json()

    if (data.erro) {
      this.$q.notify({ type: 'negative', message: 'CEP não encontrado' })
      return
    }

    this.endereco = data.logradouro
    this.bairro    = data.bairro
    this.cidade    = data.localidade
    this.ufSelect  = data.uf
  } catch (err) {
    this.$q.notify({ type: 'negative', message: 'Erro ao buscar CEP' })
  }
}

  abrirDialogCancelar(){
    this.dialogCancelar = true
  }

  formatarDocumento(row: any): string {
    if (row.tipo_pessoa === 'PF') {
      const cpf = row.cpf?.replace(/\D/g, '') ?? ''
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    } else {
      const cnpj = row.cnpj?.replace(/\D/g, '') ?? ''
      return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
  }

  editar(row: any) {
    this.editandoId = row.id
    this.tipoPessoa = row.tipo_pessoa
    this.nome = row.nome_cliente
    this.documento = row.cpf || row.cnpj
    this.codigo = row.codigo_cliente
    this.ativoInativo = row.status
    this.dtaNascimento = row.data_nascimento
    this.nmeSocial = row.nome_social
    this.razaoSocial = row.razao_social
    this.nomeResponsavel = row.nome_responsavel
    this.telefone1 = row.telefone_1
    this.telefone2 = row.telefone_2
    this.email = row.email
    this.cep = row.cep
    this.endereco = row.endereco
    this.numero = row.numero
    this.bairro = row.bairro
    this.cidade = row.cidade
    this.ufSelect = row.uf
    this.observacoes = row.observacoes
    this.mostrarFormulario()
  }

confirmarExcluir(row: any) {
  this.clienteParaExcluir = row
  this.dialogExcluir = true
}

async executarExclusao() {
  try {
    await clienteService.deletarCliente(this.clienteParaExcluir.id)
    this.$q.notify({ type: 'positive', message: 'Cliente excluído com sucesso!' })
    this.dialogExcluir = false
    this.clienteParaExcluir = null
    await this.carregarClientes()
  } catch {
    this.$q.notify({ type: 'negative', message: 'Erro ao excluir cliente!' })
  }
}
async mostrarFormulario() {
    if (!this.tipoPessoa) {
        (this.$refs.selectTipoPessoa as any).validate()
        return
    }

    if (!this.editandoId) {
        try {
            this.codigo = await clienteService.proximoCodigo()
        } catch (err) {
            this.$q.notify({ type: 'negative', message: 'Erro ao gerar código do cliente' })
        }
    }

    this.mostrarFormCadastroPF = this.tipoPessoa === 'PF'
    this.mostrarFormCadastroPJ = this.tipoPessoa === 'PJ'
}
  confirmarCancelamento() {
    this.dialogCancelar = false
    this.mostrarFormCadastroPF = false
    this.mostrarFormCadastroPJ = false
    ;(this.$refs.selectTipoPessoa as any).resetValidation()
    this.$nextTick(() => {
      const form = this.$refs.formCadastro as any
      if (form) form.resetValidation()
    })
    this.limparCampos()
  }

  limparCampos() {
    this.editandoId = null
    this.tipoPessoa = null
    this.nome = ''
    this.documento = ''
    this.codigo = ''
    this.dtaNascimento = ''
    this.nmeSocial = ''
    this.razaoSocial = ''
    this.nomeResponsavel = ''
    this.ativoInativo = 'Ativo'
    this.telefone1 = ''
    this.telefone2 = ''
    this.email = ''
    this.cep = ''
    this.endereco = ''
    this.numero = ''
    this.bairro = ''
    this.cidade = ''
    this.ufSelect = 'DF'
    this.observacoes = ''
  }

  refreshTable() {
    this.limparCampos()
    ;(this.$refs.selectTipoPessoa as any).resetValidation()
  }
}
</script>

<style scoped>
.border {
  border: 1px solid #ccc;
}
.b-r-10 {
  border-radius: 10px;
}
.b-r-8 {
  border-radius: 8px;
}
.btn-outline-primary {
  border: 1.5px solid #ccc;
  background-color: #e9eff5 !important;
}
</style>
