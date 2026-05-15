<template>
  <div class="q-pa-md">

    <!-- Cabeçalho -->
    <div class="text-bold text-black row items-center" style="font-size: 28px">
      <q-icon name="account_circle" class="q-mr-md" size="28px" />Perfil da Empresa
    </div>
    <p class="text-grey-7 text-body2 q-mb-md">
      Gerencie os dados cadastrais, endereço, contato e configurações de segurança da sua empresa.
    </p>
    <q-separator class="q-mb-lg" />

    <div class="row q-col-gutter-lg">

      <!-- Coluna Esquerda -->
      <div class="col-12 col-md-3">

        <!-- Foto de Perfil -->
        <q-card flat bordered class="b-r-10 q-pa-md text-center q-mb-md">
          <div class="column items-center q-gutter-sm">
            <q-avatar size="120px" font-size="60px" color="grey-3" text-color="primary" icon="business" class="shadow-1" />
            <div class="text-subtitle2 text-weight-bold">{{ form.nome || 'Empresa' }}</div>
            <div class="text-caption text-grey-6">{{ form.regime_tributario || '-' }}</div>
            <q-file v-model="fotoPerfil" accept=".jpg,.jpeg,.png" label="Alterar Logo" outlined dense class="full-width q-mt-sm">
              <template v-slot:prepend><q-icon name="image" /></template>
            </q-file>
          </div>
        </q-card>

        <!-- Segurança -->
        <q-card flat bordered class="b-r-10 q-pa-md q-mb-md">
          <div class="text-subtitle1 text-weight-bold q-mb-md">
            <q-icon name="lock" class="q-mr-xs" />Segurança
          </div>
          <div class="column q-gutter-sm">
            <q-input v-model="senha.atual" label="Senha Atual" type="password" outlined dense />
            <q-input v-model="senha.nova" label="Nova Senha" type="password" outlined dense />
            <q-input v-model="senha.confirmar" label="Confirmar Nova Senha" type="password" outlined dense />
            <q-btn label="Alterar Senha" color="primary" unelevated class="full-width q-mt-sm" icon="lock_reset" @click="alterarSenha()" />
          </div>
        </q-card>

        <!-- Notificações -->
        <q-card flat bordered class="b-r-10 q-pa-md q-mb-md">
          <div class="text-subtitle1 text-weight-bold q-mb-md">
            <q-icon name="notifications" class="q-mr-xs" />Notificações
          </div>
          <div class="column q-gutter-sm">
            <q-toggle v-model="notificacoes.vendas" label="Novas vendas" color="primary" dense />
            <q-toggle v-model="notificacoes.estoque" label="Estoque baixo" color="primary" dense />
            <q-toggle v-model="notificacoes.nf" label="Notas fiscais" color="primary" dense />
            <q-toggle v-model="notificacoes.sistema" label="Atualizações do sistema" color="primary" dense />
          </div>
        </q-card>

        <!-- Suporte -->
        <q-card flat bordered class="b-r-10 q-pa-md">
          <div class="text-subtitle1 text-weight-bold q-mb-sm">
            <q-icon name="support_agent" class="q-mr-xs" />Suporte
          </div>
          <div class="text-caption text-grey-6 q-mb-md">Precisa de ajuda? Acesse nosso helpdesk.</div>
          <q-btn label="Acessar Helpdesk" color="primary" outline class="full-width" icon="open_in_new" disable>
            <q-tooltip>Em breve</q-tooltip>
          </q-btn>
        </q-card>

      </div>

      <!-- Coluna Direita -->
      <div class="col-12 col-md-9">

        <!-- Dados da Empresa -->
        <div class="text-h6 q-mb-md">Dados da Empresa</div>
        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-12 col-sm-4">
            <q-input v-model="form.nome" label="Razão Social" outlined dense />
          </div>
          <div class="col-12 col-sm-4">
            <q-input v-model="form.nome_fantasia" label="Nome Fantasia" outlined dense />
          </div>
          <div class="col-12 col-sm-4">
            <q-input v-model="form.cnpj" label="CNPJ" outlined dense mask="##.###.###/####-##" />
          </div>
          <div class="col-12 col-sm-4">
            <q-input v-model="form.inscricao_estadual" label="Inscrição Estadual" outlined dense />
          </div>
          <div class="col-12 col-sm-4">
            <q-input v-model="form.inscricao_municipal" label="Inscrição Municipal" outlined dense />
          </div>
          <div class="col-12 col-sm-4">
            <q-select v-model="form.regime_tributario" :options="opcoesRegime" label="Regime Tributário" outlined dense emit-value map-options />
          </div>
        </div>

        <!-- Endereço -->
        <div class="text-h6 q-mb-md">Endereço</div>
        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-12 col-sm-4">
            <q-input v-model="form.cep" label="CEP" outlined dense mask="#####-###" @input="buscarCep(form.cep)" />
          </div>
          <div class="col-12 col-sm-4">
            <q-input v-model="form.endereco" label="Endereço" outlined dense />
          </div>
          <div class="col-12 col-sm-4">
            <q-input v-model="form.numero" label="Número" outlined dense />
          </div>
          <div class="col-12 col-sm-4">
            <q-input v-model="form.complemento" label="Complemento" outlined dense />
          </div>
          <div class="col-12 col-sm-4">
            <q-input v-model="form.bairro" label="Bairro" outlined dense />
          </div>
          <div class="col-12 col-sm-4">
            <q-input v-model="form.cidade" label="Cidade" outlined dense />
          </div>
          <div class="col-12 col-sm-4">
            <q-select v-model="form.uf" :options="opcoesUF" label="UF" outlined dense emit-value map-options />
          </div>
        </div>

        <!-- Contato -->
        <div class="text-h6 q-mb-md">Contato</div>
        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-12 col-sm-4">
            <q-input v-model="form.telefone" label="Telefone" outlined dense mask="(##) #####-####" />
          </div>
          <div class="col-12 col-sm-4">
            <q-input v-model="form.email" label="E-mail" outlined dense />
          </div>
          <div class="col-12 col-sm-4">
            <q-input v-model="form.site" label="Site" outlined dense />
          </div>
        </div>

        <!-- Responsável -->
        <div class="text-h6 q-mb-md">Responsável</div>
        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-12 col-sm-4">
            <q-input v-model="form.responsavel" label="Nome do Responsável" outlined dense />
          </div>
          <div class="col-12 col-sm-4">
            <q-input v-model="form.cargo" label="Cargo" outlined dense />
          </div>
        </div>

        <!-- Botão Salvar -->
        <div class="row justify-end q-mt-xl">
          <q-btn label="Salvar Alterações" color="positive" unelevated icon="save" :loading="salvando" @click="salvar()" />
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
