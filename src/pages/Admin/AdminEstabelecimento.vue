<template>
  <q-page padding>

    <!-- Formulário -->
    <div class="text-h6 q-mb-md">Criar/Editar Estabelecimento</div>
    <q-card flat bordered class="q-pa-md q-mb-lg b-r-8">
      <div class="row q-col-gutter-md">
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
          <q-select
            v-model="form.regime_tributario"
            :options="opcoesRegime"
            label="Regime Tributário"
            outlined
            dense
            emit-value
            map-options
          />
        </div>
        <div class="col-12 col-sm-4">
          <q-input
            v-model="form.cep"
            label="CEP"
            outlined
            dense
            mask="#####-###"
            @input="buscarCep(form.cep)"
          />
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
          <q-select
            v-model="form.uf"
            :options="opcoesUF"
            label="UF"
            outlined
            dense
            emit-value
            map-options
          />
        </div>
        <div class="col-12 col-sm-4">
          <q-input v-model="form.telefone" label="Telefone" outlined dense mask="(##) #####-####" />
        </div>
        <div class="col-12 col-sm-4">
          <q-input v-model="form.email" label="E-mail" outlined dense />
        </div>
        <div class="col-12 col-sm-4">
          <q-input v-model="form.site" label="Site" outlined dense />
        </div>
        <div class="col-12 col-sm-4">
          <q-input v-model="form.responsavel" label="Responsável" outlined dense />
        </div>
        <div class="col-12 col-sm-4">
          <q-input v-model="form.cargo" label="Cargo" outlined dense />
        </div>
      </div>

      <div class="row q-gutter-sm q-mt-md justify-end">
        <q-btn
          label="Salvar"
          color="positive"
          unelevated
          class="b-r-8"
          icon="save"
          :loading="salvando"
          @click="salvar()"
        />
        <q-btn
          label="Limpar"
          flat
          class="text-grey-7 b-r-8"
          icon="delete_sweep"
          @click="limpar()"
        />
      </div>
    </q-card>

    <q-separator class="q-my-lg" />

    <!-- Filtros e Tabela -->
    <div class="text-h6 q-mb-md">Listagem de Estabelecimentos</div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-4">
        <q-input v-model="filter.nome" label="Nome" outlined dense />
      </div>
      <div class="col-12 col-sm-4">
        <q-input v-model="filter.cnpj" label="CNPJ" outlined dense />
      </div>
      <div class="col-12 col-sm-4">
        <q-input v-model="filter.cep" label="CEP" outlined dense />
      </div>
    </div>

    <div class="row justify-end q-gutter-sm q-mb-md">
      <q-btn
        label="Pesquisar"
        color="primary"
        unelevated
        icon="search"
        class="b-r-8"
        :loading="loadingTable"
        @click="onSearch()"
      />
      <q-btn
        label="Limpar"
        flat
        class="text-grey-7 b-r-8"
        icon="delete_sweep"
        @click="onClearFilters()"
      />
    </div>

    <q-table
      flat
      bordered
      :data="estabelecimentos"
      :columns="colunasEstabelecimento"
      row-key="id"
      :loading="loadingTable"
      no-data-label="Nenhum estabelecimento encontrado"
      :rows-per-page-options="[10, 20, 50]"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" align="center">
          <q-btn dense flat color="primary" icon="edit" round @click="onEdit(props.row)">
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn dense flat color="negative" icon="delete" round @click="onDelete(props.row)">
            <q-tooltip>Excluir</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Dialog Excluir -->
    <q-dialog v-model="dialogExcluir" persistent>
      <q-card style="min-width: 380px; border-radius: 12px" class="q-pa-sm">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-bold">Excluir Estabelecimento</div>
        </q-card-section>
        <q-card-section class="text-grey-7" style="font-size: 14px">
          Tem certeza que deseja excluir o estabelecimento <strong>{{ itemParaExcluir?.nome }}</strong>? Essa ação não pode ser desfeita.
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
            class="b-r-8"
            style="min-width: 130px"
            @click="confirmarExclusao()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import estabelecimentoService from '../../services/estabelecimentoService'
import listEstabelecimento from '../../config/listEstabelecimento.json'

interface EstabelecimentoForm {
  nome: string
  nome_fantasia: string
  cnpj: string
  inscricao_estadual: string
  inscricao_municipal: string
  regime_tributario: string
  cep: string
  endereco: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
  telefone: string
  email: string
  site: string
  responsavel: string
  cargo: string
}

@Component
export default class EstabelecimentoComponent extends Vue {
  colunasEstabelecimento = listEstabelecimento.columns

  salvando = false
  loadingTable = false
  dialogExcluir = false
  itemParaExcluir: any = null

  form: EstabelecimentoForm = {
    nome: '', nome_fantasia: '', cnpj: '', inscricao_estadual: '',
    inscricao_municipal: '', regime_tributario: '', cep: '', endereco: '',
    numero: '', complemento: '', bairro: '', cidade: '', uf: '',
    telefone: '', email: '', site: '', responsavel: '', cargo: ''
  }

  filter = { nome: '', cnpj: '', cep: '' }
  estabelecimentos: any[] = []

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
  await this.onSearch()
}

  async salvar() {
    try {
      this.salvando = true
      this.$q.notify({ type: 'positive', message: 'Estabelecimento salvo com sucesso!' })
      this.limpar()
      await this.onSearch()
    } catch {
      this.$q.notify({ type: 'negative', message: 'Erro ao salvar!' })
    } finally {
      this.salvando = false
    }
  }

  limpar() {
    this.form = {
      nome: '', nome_fantasia: '', cnpj: '', inscricao_estadual: '',
      inscricao_municipal: '', regime_tributario: '', cep: '', endereco: '',
      numero: '', complemento: '', bairro: '', cidade: '', uf: '',
      telefone: '', email: '', site: '', responsavel: '', cargo: ''
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

async onSearch() {
  this.loadingTable = true
  try {
    this.estabelecimentos = await estabelecimentoService.listar(this.filter)
  } catch {
    this.$q.notify({ type: 'negative', message: 'Erro ao carregar estabelecimentos!' })
  } finally {
    this.loadingTable = false
  }
}
  onClearFilters() {
    this.filter = { nome: '', cnpj: '', cep: '' }
    this.onSearch()
  }

  onEdit(row: any) {
    this.form = { ...row }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  onDelete(row: any) {
    this.itemParaExcluir = row
    this.dialogExcluir = true
  }

  confirmarExclusao() {
    this.$q.notify({ type: 'positive', message: 'Estabelecimento excluído!' })
    this.dialogExcluir = false
    this.itemParaExcluir = null
    this.onSearch()
  }
}
</script>

<style scoped>
</style>
