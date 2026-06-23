<template>
  <div class="q-pa-md">

    <!-- Cabeçalho -->
    <div class="text-bold text-black row items-center perfil-cabecalho" style="font-size: 28px">
      <q-icon name="account_circle" class="q-mr-md text-primary" size="28px" />Perfil da Empresa
    </div>
    <p class="text-grey-7 text-body2 q-mb-md perfil-subtitulo">
      Gerencie os dados cadastrais, endereço, contato e configurações de segurança da sua empresa.
    </p>
    <q-separator class="q-mb-lg" />

    <div class="row q-col-gutter-lg">

      <!-- Coluna Esquerda -->
      <div class="col-12 col-md-3">

        <!-- Foto de Perfil -->
        <q-card flat bordered class="b-r-10 q-pa-md text-center q-mb-md perfil-card-foto">
          <div class="column items-center q-gutter-sm">
            <q-avatar size="120px" font-size="60px" color="grey-3" text-color="primary" icon="business" class="shadow-1 perfil-avatar" />
            <div class="text-subtitle2 text-weight-bold perfil-nome-empresa">{{ form.nome || 'Empresa' }}</div>
            <div class="text-caption text-grey-6 perfil-regime">{{ form.regime_tributario || '-' }}</div>
            <q-file
              v-model="fotoPerfil"
              accept=".jpg,.jpeg,.png"
              label="Alterar Logo"
              outlined
              dense
              class="full-width q-mt-sm perfil-file-logo"
              id="perfil-file-logo"
            >
              <template v-slot:prepend><q-icon name="image" /></template>
            </q-file>
          </div>
        </q-card>

        <!-- Segurança -->
        <q-card flat bordered class="b-r-10 q-pa-md q-mb-md perfil-card-seguranca">
          <div class="text-subtitle1 text-weight-bold q-mb-md">
            <q-icon name="lock" class="q-mr-xs" />Segurança
          </div>
          <div class="column q-gutter-sm">
            <q-input
              v-model="senha.atual"
              label="Senha Atual"
              type="password"
              outlined
              dense
              input-id="perfil-input-senha-atual"
              class="perfil-input-senha-atual"
            />
            <q-input
              v-model="senha.nova"
              label="Nova Senha"
              type="password"
              outlined
              dense
              input-id="perfil-input-senha-nova"
              class="perfil-input-senha-nova"
            />
            <q-input
              v-model="senha.confirmar"
              label="Confirmar Nova Senha"
              type="password"
              outlined
              dense
              input-id="perfil-input-senha-confirmar"
              class="perfil-input-senha-confirmar"
            />
            <q-btn
              id="perfil-btn-alterar-senha"
              class="full-width q-mt-sm perfil-btn-alterar-senha"
              label="Alterar Senha"
              color="primary"
              unelevated
              icon="lock_reset"
              @click="alterarSenha()"
            />
          </div>
        </q-card>

        <!-- Notificações -->
        <q-card flat bordered class="b-r-10 q-pa-md q-mb-md perfil-card-notificacoes">
          <div class="text-subtitle1 text-weight-bold q-mb-md">
            <q-icon name="notifications" class="q-mr-xs" />Notificações
          </div>
          <div class="column q-gutter-sm">
            <q-toggle v-model="notificacoes.vendas" label="Novas vendas" color="primary" dense class="perfil-toggle-vendas" />
            <q-toggle v-model="notificacoes.estoque" label="Estoque baixo" color="primary" dense class="perfil-toggle-estoque" />
            <q-toggle v-model="notificacoes.nf" label="Notas fiscais" color="primary" dense class="perfil-toggle-nf" />
            <q-toggle v-model="notificacoes.sistema" label="Atualizações do sistema" color="primary" dense class="perfil-toggle-sistema" />
          </div>
        </q-card>

        <!-- Suporte -->
        <q-card flat bordered class="b-r-10 q-pa-md perfil-card-suporte">
          <div class="text-subtitle1 text-weight-bold q-mb-sm">
            <q-icon name="support_agent" class="q-mr-xs" />Suporte
          </div>
          <div class="text-caption text-grey-6 q-mb-md">Precisa de ajuda? Acesse nosso helpdesk.</div>
          <q-btn
            id="perfil-btn-helpdesk"
            class="full-width perfil-btn-helpdesk"
            label="Acessar Helpdesk"
            color="primary"
            outline
            icon="open_in_new"
            disable
          >
            <q-tooltip>Em breve</q-tooltip>
          </q-btn>
        </q-card>

      </div>

      <!-- Coluna Direita -->
      <div class="col-12 col-md-9">

        <!-- Dados da Empresa -->
        <div class="text-h6 q-mb-md">Dados da Empresa</div>
        <div class="row q-col-gutter-md q-mb-lg perfil-dados-empresa">
          <div class="col-12 col-sm-4">
            <q-input
              v-model="form.nome"
              label="Razão Social"
              outlined
              dense
              input-id="perfil-input-razao-social"
              class="perfil-input-razao-social"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="form.nome_fantasia"
              label="Nome Fantasia"
              outlined
              dense
              input-id="perfil-input-nome-fantasia"
              class="perfil-input-nome-fantasia"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="form.cnpj"
              label="CNPJ"
              outlined
              dense
              mask="##.###.###/####-##"
              input-id="perfil-input-cnpj"
              class="perfil-input-cnpj"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="form.inscricao_estadual"
              label="Inscrição Estadual"
              outlined
              dense
              input-id="perfil-input-ie"
              class="perfil-input-ie"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="form.inscricao_municipal"
              label="Inscrição Municipal"
              outlined
              dense
              input-id="perfil-input-im"
              class="perfil-input-im"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-select
              v-model="form.regime_tributario"
              :options="opcoesRegime"
              label="Regime Tributário"
              outlined
              dense
              emit-value
              map-options
              id="perfil-select-regime"
              class="perfil-select-regime"
            />
          </div>
        </div>

        <!-- Endereço -->
        <div class="text-h6 q-mb-md">Endereço</div>
        <div class="row q-col-gutter-md q-mb-lg perfil-dados-endereco">
          <div class="col-12 col-sm-4">
            <q-input
              v-model="form.cep"
              label="CEP"
              outlined
              dense
              mask="#####-###"
              input-id="perfil-input-cep"
              class="perfil-input-cep"
              @input="buscarCep(form.cep)"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="form.endereco"
              label="Endereço"
              outlined
              dense
              input-id="perfil-input-endereco"
              class="perfil-input-endereco"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="form.numero"
              label="Número"
              outlined
              dense
              input-id="perfil-input-numero"
              class="perfil-input-numero"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="form.complemento"
              label="Complemento"
              outlined
              dense
              input-id="perfil-input-complemento"
              class="perfil-input-complemento"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="form.bairro"
              label="Bairro"
              outlined
              dense
              input-id="perfil-input-bairro"
              class="perfil-input-bairro"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="form.cidade"
              label="Cidade"
              outlined
              dense
              input-id="perfil-input-cidade"
              class="perfil-input-cidade"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-select
              v-model="form.uf"
              :options="opcoesUF"
              label="UF"
              outlined
              dense
              emit-value
              map-options
              id="perfil-select-uf"
              class="perfil-select-uf"
            />
          </div>
        </div>

        <!-- Contato -->
        <div class="text-h6 q-mb-md">Contato</div>
        <div class="row q-col-gutter-md q-mb-lg perfil-dados-contato">
          <div class="col-12 col-sm-4">
            <q-input
              v-model="form.telefone"
              label="Telefone"
              outlined
              dense
              mask="(##) #####-####"
              input-id="perfil-input-telefone"
              class="perfil-input-telefone"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="form.email"
              label="E-mail"
              outlined
              dense
              input-id="perfil-input-email"
              class="perfil-input-email"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="form.site"
              label="Site"
              outlined
              dense
              input-id="perfil-input-site"
              class="perfil-input-site"
            />
          </div>
        </div>

        <!-- Responsável -->
        <div class="text-h6 q-mb-md">Responsável</div>
        <div class="row q-col-gutter-md q-mb-lg perfil-dados-responsavel">
          <div class="col-12 col-sm-4">
            <q-input
              v-model="form.responsavel"
              label="Nome do Responsável"
              outlined
              dense
              input-id="perfil-input-responsavel"
              class="perfil-input-responsavel"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="form.cargo"
              label="Cargo"
              outlined
              dense
              input-id="perfil-input-cargo"
              class="perfil-input-cargo"
            />
          </div>
        </div>

        <!-- Botão Salvar -->
        <div class="row justify-start q-mt-xl perfil-acoes">
          <q-btn
            id="perfil-btn-salvar"
            class="perfil-btn-salvar"
            label="Salvar Alterações"
            color="positive"
            unelevated
            icon="save"
            :loading="salvando"
            @click="salvar()"
          />
        </div>

      </div>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import estabelecimentoService, { Estabelecimento } from '../services/estabelecimentoService'

@Component
export default class PerfilComponent extends Vue {
  salvando = false
  fotoPerfil: File | null = null

  form: Estabelecimento = {
    nome: '',
    nome_fantasia: '',
    cnpj: '',
    inscricao_estadual: '',
    inscricao_municipal: '',
    regime_tributario: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    telefone: '',
    email: '',
    site: '',
    responsavel: '',
    cargo: ''
  }

  senha = {
    atual: '',
    nova: '',
    confirmar: ''
  }

  notificacoes = {
    vendas: true,
    estoque: true,
    nf: false,
    sistema: true
  }

  opcoesRegime = [
    { label: 'Simples Nacional', value: 'Simples Nacional' },
    { label: 'Lucro Presumido', value: 'Lucro Presumido' },
    { label: 'Lucro Real', value: 'Lucro Real' },
    { label: 'MEI', value: 'MEI' }
  ]

  opcoesUF = [
    'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
    'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
    'RS','RO','RR','SC','SP','SE','TO'
  ].map(uf => ({ label: uf, value: uf }))

  async created() {
    await this.carregarDados()
  }

  async carregarDados() {
    try {
      const data = await estabelecimentoService.buscar()
      this.form = { ...this.form, ...data }
    } catch {
      this.$q.notify({ type: 'negative', message: 'Erro ao carregar dados da empresa!' })
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
      this.form.endereco = data.logradouro
      this.form.bairro = data.bairro
      this.form.cidade = data.localidade
      this.form.uf = data.uf
    } catch {
      this.$q.notify({ type: 'negative', message: 'Erro ao buscar CEP' })
    }
  }

  async salvar() {
    try {
      this.salvando = true
      await estabelecimentoService.atualizar(this.form)
      this.$q.notify({ type: 'positive', message: 'Dados salvos com sucesso!' })
    } catch {
      this.$q.notify({ type: 'negative', message: 'Erro ao salvar dados!' })
    } finally {
      this.salvando = false
    }
  }

  alterarSenha() {
    if (!this.senha.atual || !this.senha.nova || !this.senha.confirmar) {
      this.$q.notify({ type: 'warning', message: 'Preencha todos os campos de senha!' })
      return
    }
    if (this.senha.nova !== this.senha.confirmar) {
      this.$q.notify({ type: 'negative', message: 'As senhas não coincidem!' })
      return
    }
    this.$q.notify({ type: 'info', message: 'Funcionalidade em desenvolvimento!' })
  }
}
</script>

<style scoped>
.border { border: 1px solid #ccc; }
.b-r-10 { border-radius: 10px; }
.b-r-8 { border-radius: 8px; }
</style>
