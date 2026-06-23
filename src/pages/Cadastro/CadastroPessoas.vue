<template>
  <div class="q-pa-md">
    <!-- Cabeçalho -->
    <div class="text-bold text-black row items-center pessoas-cabecalho" style="font-size: 28px">
      <q-icon name="group" class="q-mr-md text-primary" size="28px" />Cadastro de Pessoas
    </div>
    <p class="text-grey-7 text-body2 q-mb-md pessoas-subtitulo">
      Gerencie os cadastros de pessoas físicas e jurídicas. Aqui você pode
      adicionar, editar, inativar e reativar clientes do sistema.
    </p>
    <q-separator class="q-mb-lg" />

    <!-- Filtros -->
    <div class="row q-col-gutter-md q-mb-md pessoas-filtros">
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
          id="pessoas-select-tipo"
          class="pessoas-select-tipo"
        />
      </div>
    </div>

    <q-form class="row q-col-gutter-md q-mb-md pessoas-form-filtro">
      <div class="col-12 col-md-4">
        <q-input v-model="nome" label="Nome Completo" outlined dense input-id="pessoas-input-nome" class="pessoas-input-nome" />
      </div>
      <div class="col-12 col-md-4">
        <q-input v-model="documento" label="CNPJ/CPF" outlined dense input-id="pessoas-input-documento" class="pessoas-input-documento" />
      </div>
      <div class="col-12 col-md-4">
        <q-input v-model="codigo" label="Código do Cliente" outlined dense input-id="pessoas-input-codigo" class="pessoas-input-codigo" />
      </div>
    </q-form>

    <!-- Botões -->
    <div
      v-if="!mostrarFormCadastroPF && !mostrarFormCadastroPJ"
      class="row justify-start q-gutter-sm q-mb-lg pessoas-acoes"
    >
      <q-btn
        id="pessoas-btn-adicionar"
        class="pessoas-btn-adicionar"
        label="Adicionar"
        icon="add"
        color="positive"
        unelevated
        @click="mostrarFormulario()"
      />
      <q-btn
        id="pessoas-btn-limpar"
        class="pessoas-btn-limpar text-grey-7"
        label="Limpar"
        icon="delete_sweep"
        flat
        @click="refreshTable()"
      />
    </div>

    <!-- Formulário -->
    <div v-if="mostrarFormCadastroPF || mostrarFormCadastroPJ" class="q-mt-md pessoas-form-cadastro">
      <q-form ref="formCadastro" @submit.prevent="salvar()" greedy>

        <!-- Dados Gerais -->
        <div class="text-h6 q-mb-sm">Dados Gerais</div>
        <div class="row q-col-gutter-md pessoas-dados-gerais">
          <template v-if="mostrarFormCadastroPF">
            <div class="col-12 col-sm-4">
              <q-input
                v-model="dtaNascimento"
                label="Data de Nascimento"
                type="date"
                outlined
                dense
                hide-bottom-space
                lazy-rules
                input-id="pessoas-input-nascimento"
                class="pessoas-input-nascimento"
              />
            </div>
            <div class="col-12 col-sm-4">
              <q-input
                v-model="nmeSocial"
                label="Nome Social"
                outlined
                dense
                input-id="pessoas-input-nome-social"
                class="pessoas-input-nome-social"
              />
            </div>
          </template>

          <template v-if="mostrarFormCadastroPJ">
            <div class="col-12 col-sm-4">
              <q-input
                v-model="razaoSocial"
                label="Nome Fantasia"
                outlined
                dense
                hide-bottom-space
                lazy-rules
                input-id="pessoas-input-razao-social"
                class="pessoas-input-razao-social"
              />
            </div>
            <div class="col-12 col-sm-4">
              <q-input
                v-model="nomeResponsavel"
                label="Nome do Responsável *"
                outlined
                dense
                :rules="[val => !!val || 'Nome do responsável obrigatório']"
                hide-bottom-space
                lazy-rules
                input-id="pessoas-input-responsavel"
                class="pessoas-input-responsavel"
              />
            </div>
          </template>

          <div class="col-12 col-sm-4">
            <q-select
              v-model="ativoInativo"
              :options="ativo_inativo"
              label="Status"
              outlined
              dense
              emit-value
              map-options
              id="pessoas-select-status"
              class="pessoas-select-status"
            />
          </div>
        </div>

        <!-- Dados de Contato -->
        <div class="text-h6 q-mt-lg q-mb-sm">Dados de Contato</div>
        <div class="row q-col-gutter-md q-mb-md pessoas-dados-contato">
          <div class="col-12 col-sm-4">
            <q-input
              v-model="email"
              label="E-mail"
              outlined
              dense
              hide-bottom-space
              lazy-rules
              input-id="pessoas-input-email"
              class="pessoas-input-email"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md pessoas-dados-telefones">
          <div class="col-12 col-sm-4">
            <q-input
              v-model="telefone1"
              label="Telefone 1 *"
              mask="(##) #####-####"
              outlined
              dense
              :rules="[val => !!val || 'Telefone obrigatório']"
              hide-bottom-space
              lazy-rules
              input-id="pessoas-input-telefone1"
              class="pessoas-input-telefone1"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="telefone2"
              label="Telefone 2"
              mask="(##) #####-####"
              outlined
              dense
              input-id="pessoas-input-telefone2"
              class="pessoas-input-telefone2"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="telefone_fixo"
              label="Telefone Fixo"
              mask="(##) ####-####"
              outlined
              dense
              input-id="pessoas-input-telefone-fixo"
              class="pessoas-input-telefone-fixo"
            />
          </div>
        </div>

        <!-- Dados de Endereço -->
        <div class="text-h6 q-mt-lg q-mb-sm">Dados de Endereço</div>
        <div class="row q-col-gutter-md pessoas-dados-endereco">
          <div class="col-12 col-sm-4">
            <q-input
              v-model="cep"
              label="CEP"
              mask="#####-###"
              outlined
              dense
              hide-bottom-space
              lazy-rules
              input-id="pessoas-input-cep"
              class="pessoas-input-cep"
              @input="buscarCep(cep)"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="endereco"
              label="Endereço"
              outlined
              dense
              hide-bottom-space
              lazy-rules
              input-id="pessoas-input-endereco"
              class="pessoas-input-endereco"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="numero"
              label="Número"
              outlined
              dense
              hide-bottom-space
              lazy-rules
              input-id="pessoas-input-numero"
              class="pessoas-input-numero"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="bairro"
              label="Bairro"
              outlined
              dense
              hide-bottom-space
              lazy-rules
              input-id="pessoas-input-bairro"
              class="pessoas-input-bairro"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="cidade"
              label="Cidade"
              outlined
              dense
              hide-bottom-space
              lazy-rules
              input-id="pessoas-input-cidade"
              class="pessoas-input-cidade"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-select
              v-model="ufSelect"
              :options="uf_select"
              label="UF"
              outlined
              dense
              emit-value
              map-options
              hide-bottom-space
              lazy-rules
              id="pessoas-select-uf"
              class="pessoas-select-uf"
            />
          </div>
        </div>

        <!-- Observações -->
        <div class="text-h6 q-mt-lg q-mb-sm">Observações</div>
        <div class="row pessoas-observacoes">
          <div class="col-12">
            <q-input
              v-model="observacoes"
              type="textarea"
              outlined
              dense
              input-style="resize: none;"
              rows="5"
              input-id="pessoas-input-observacoes"
              class="pessoas-input-observacoes"
            />
          </div>
        </div>

        <!-- Botões -->
        <div class="row q-mt-xl q-gutter-md justify-start pessoas-form-acoes">
          <q-btn
            id="pessoas-btn-salvar"
            class="pessoas-btn-salvar"
            label="Salvar Cadastro"
            color="positive"
            unelevated
            type="submit"
          />
          <q-btn
            id="pessoas-btn-cancelar"
            class="pessoas-btn-cancelar"
            label="Cancelar"
            color="negative"
            flat
            @click="abrirDialogCancelar()"
          />
        </div>
      </q-form>
    </div>

    <!-- Tabela -->
    <div
      v-if="!mostrarFormCadastroPF && !mostrarFormCadastroPJ"
      class="q-mt-xl pessoas-tabela"
    >
      <q-table
        :data="rowsFiltradas"
        :columns="colunasCadastroProdutos"
        row-key="id"
        :rows-per-page-options="[10, 20, 50]"
        flat
        bordered
        no-data-label="Nenhum registro encontrado"
        class="text-weight-medium pessoas-tabela-clientes"
      >
        <template v-slot:body-cell-acoes="props">
          <q-td align="center">
            <q-btn
              icon="edit"
              size="sm"
              color="black"
              flat
              round
              class="pessoas-btn-editar"
              @click="editar(props.row)"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              v-if="props.row.status === 'Ativo'"
              icon="person_off"
              size="sm"
              color="negative"
              flat
              round
              class="pessoas-btn-inativar"
              @click="confirmarExcluir(props.row)"
            >
              <q-tooltip>Inativar</q-tooltip>
            </q-btn>
            <q-btn
              v-if="props.row.status === 'Inativo'"
              icon="person"
              size="sm"
              color="positive"
              flat
              round
              class="pessoas-btn-reativar"
              @click="reativarCliente(props.row)"
            >
              <q-tooltip>Reativar</q-tooltip>
            </q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td align="center">
            <q-badge
              :color="props.row.status === 'Ativo' ? 'positive' : 'negative'"
              class="pessoas-badge-status"
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

    <!-- Dialog Cancelar -->
    <q-dialog v-model="dialogCancelar" persistent class="pessoas-dialog-cancelar">
      <q-card style="min-width: 380px; border-radius: 12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Cancelar operação</div>
        </q-card-section>
        <q-card-section class="text-grey-7" style="font-size: 14px">
          Deseja realmente cancelar? As alterações não salvas serão perdidas.
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn
            id="pessoas-dialog-cancelar-voltar"
            class="pessoas-dialog-cancelar-voltar"
            label="Voltar"
            unelevated
            style="border: 1px solid #ccc; border-radius: 8px; min-width: 100px"
            color="white"
            text-color="dark"
            v-close-popup
          />
          <q-btn
            id="pessoas-dialog-cancelar-confirmar"
            class="pessoas-dialog-cancelar-confirmar"
            label="Sim, Cancelar"
            unelevated
            color="negative"
            style="border-radius: 8px; min-width: 130px"
            @click="confirmarCancelamento()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Inativar -->
    <q-dialog v-model="dialogExcluir" persistent class="pessoas-dialog-inativar">
      <q-card style="min-width: 380px; border-radius: 12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Inativar Cliente</div>
        </q-card-section>
        <q-card-section class="text-grey-7" style="font-size: 14px">
          Tem certeza que deseja inativar o cliente
          <strong>{{ clienteParaExcluir?.nome_cliente }}</strong>?
          O cliente não será excluído, mas ficará inativo no sistema.
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn
            id="pessoas-dialog-inativar-voltar"
            class="pessoas-dialog-inativar-voltar"
            label="Voltar"
            unelevated
            style="border: 1px solid #ccc; border-radius: 8px; min-width: 100px"
            color="white"
            text-color="dark"
            v-close-popup
          />
          <q-btn
            id="pessoas-dialog-inativar-confirmar"
            class="pessoas-dialog-inativar-confirmar"
            label="Sim, Inativar"
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
  telefone_fixo = ''
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
  { label: 'AC', value: 'AC' },
  { label: 'AL', value: 'AL' },
  { label: 'AM', value: 'AM' },
  { label: 'AP', value: 'AP' },
  { label: 'BA', value: 'BA' },
  { label: 'CE', value: 'CE' },
  { label: 'DF', value: 'DF' },
  { label: 'ES', value: 'ES' },
  { label: 'GO', value: 'GO' },
  { label: 'MA', value: 'MA' },
  { label: 'MG', value: 'MG' },
  { label: 'MS', value: 'MS' },
  { label: 'MT', value: 'MT' },
  { label: 'PA', value: 'PA' },
  { label: 'PB', value: 'PB' },
  { label: 'PE', value: 'PE' },
  { label: 'PI', value: 'PI' },
  { label: 'PR', value: 'PR' },
  { label: 'RJ', value: 'RJ' },
  { label: 'RN', value: 'RN' },
  { label: 'RO', value: 'RO' },
  { label: 'RR', value: 'RR' },
  { label: 'RS', value: 'RS' },
  { label: 'SC', value: 'SC' },
  { label: 'SE', value: 'SE' },
  { label: 'SP', value: 'SP' },
  { label: 'TO', value: 'TO' }
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
        telefone_fixo: this.telefone_fixo,
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

  async reativarCliente(row: any) {
  try {
    await clienteService.atualizarCliente(row.id, {
      ...row,
      status: 'Ativo'
    })
    this.$q.notify({ type: 'positive', message: 'Cliente reativado com sucesso!' })
    await this.carregarClientes()
  } catch {
    this.$q.notify({ type: 'negative', message: 'Erro ao reativar cliente!' })
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
    this.telefone_fixo = row.telefone_fixo
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
    await clienteService.atualizarCliente(this.clienteParaExcluir.id, {
      ...this.clienteParaExcluir,
      status: 'Inativo'
    })
    this.$q.notify({ type: 'positive', message: 'Cliente inativado com sucesso!' })
    this.dialogExcluir = false
    this.clienteParaExcluir = null
    await this.carregarClientes()
  } catch {
    this.$q.notify({ type: 'negative', message: 'Erro ao inativar cliente!' })
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
    this.telefone_fixo = ''
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
</style>
