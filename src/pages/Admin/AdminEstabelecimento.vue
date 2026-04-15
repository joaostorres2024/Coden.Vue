<template>
  <q-page padding>
    <!-- SEÇÃO 1: CRIAÇÃO DE ESTABELECIMENTO -->
    <div class="row q-col-gutter-lg q-mb-xl" style="max-width: 1200px">
      <!-- Lado Esquerdo: Formulário de Criação -->
      <div class="col-12 col-md-6">
        <div class="text-h6 q-mb-md">Criar/Editar Estabelecimento</div>

        <q-form @submit="onSubmitCreate" class="q-gutter-y-sm">
          <q-input
            outlined
            dense
            v-model="newEstabelecimento.nome"
            label="Nome"
          />

          <q-input
            outlined
            dense
            v-model="newEstabelecimento.cnpj"
            label="CNPJ"
            mask="##.###.###/####-##"
          />

          <q-input
            outlined
            dense
            v-model="newEstabelecimento.cep"
            label="CEP"
            mask="#####-###"
          />

          <!-- Botões de Ação do Formulário -->
          <div class="row q-gutter-sm q-mt-md">
            <q-btn
              label="Salvar"
              type="submit"
              color="primary"
              unelevated
              :loading="loadingCreate"
            />
            <q-btn
              label="Cancelar"
              color="black border"
              flat
              @click="onCancelCreate"
            />
          </div>
        </q-form>
      </div>

      <!-- Lado Direito: Card de Atenção -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="attention-card q-mt-lg">
          <q-card-section class="row items-center q-gutter-sm">
            <q-icon name="warning" size="sm" />
            <div class="text-subtitle2 text-bold">Atenção</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <p>
              Certifique-se de preencher todos os campos corretamente antes de
              prosseguir.
            </p>
            <ul class="q-pl-md">
              <li>O nome do estabelecimento deve ser único no sistema.</li>
              <li>
                O CNPJ deve ser válido e estar no formato correto
                (##.###.###/####-##).
              </li>
              <li>O CEP deve estar no formato correto (#####-###).</li>
            </ul>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-separator class="q-my-lg" />

    <!-- SEÇÃO 2: LISTAGEM E FILTROS -->
    <div class="row q-col-gutter-sm q-mb-md items-center">
      <div class="col-12">
        <div class="text-h6 q-mb-sm">Listagem de Estabelecimentos</div>
      </div>

      <div class="col-12 col-sm-3">
        <q-input
          outlined
          dense
          v-model="filter.nome"
          label="Nome"
          @keyup.enter="onSearch"
        />
      </div>
      <div class="col-12 col-sm-3">
        <q-input
          outlined
          dense
          v-model="filter.cnpj"
          label="CNPJ"
          @keyup.enter="onSearch"
        />
      </div>
      <div class="col-12 col-sm-2">
        <q-input
          outlined
          dense
          v-model="filter.cep"
          label="CEP"
          @keyup.enter="onSearch"
        />
      </div>
      <div class="col-12 col-sm-auto">
        <q-btn
          label="Pesquisar"
          color="primary"
          unelevated
          icon="search"
          @click="onSearch"
          :loading="loadingTable"
        />
        <q-btn
          label="Limpar"
          color="black"
          flat
          class="q-ml-sm border"
          @click="onClearFilters"
        />
      </div>
    </div>

    <!-- Tabela de Estabelecimentos -->
    <q-table
      flat
      bordered
      :data="estabelecimentos"
      :columns="colunasEstabelecimento"
      row-key="id"
      :loading="loadingTable"
      no-data-label="Nenhum estabelecimento encontrado"
      rows-per-page-label="Registros por página"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-xs">
          <q-btn
            dense
            flat
            color="primary"
            icon="edit"
            @click="onEdit(props.row)"
          />
          <q-btn
            dense
            flat
            color="negative"
            icon="delete"
            @click="onDelete(props.row)"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import listEstabelecimento from '../../config/listEstabelecimento.json'

interface EstabelecimentoForm {
  nome: string;
  cnpj: string;
  cep: string;
}

interface EstabelecimentoRow extends EstabelecimentoForm {
  id: string;
}

@Component
export default class EstabelecimentoComponent extends Vue {
    colunasEstabelecimento = listEstabelecimento.columns

  // --- ESTADO DA CRIAÇÃO ---
  private newEstabelecimento: EstabelecimentoForm = {
    nome: '',
    cnpj: '',
    cep: ''
  }
  private loadingCreate = false

  // --- ESTADO DA LISTAGEM ---
  private filter = {
    nome: '',
    cnpj: '',
    cep: ''
  }
  private loadingTable = false
  private estabelecimentos: EstabelecimentoRow[] = []

  // --- MÉTODOS DE VALIDAÇÃO ---
  private validateCNPJ(cnpj: string): boolean {
    // Remove caracteres não numéricos
    const cnpjNumbers = cnpj.replace(/\D/g, '')

    // Valida se tem 14 dígitos
    if (cnpjNumbers.length !== 14) {
      this.showAlert('CNPJ deve ter 14 dígitos!')
      return false
    }

    return true
  }

  private validateCEP(cep: string): boolean {
    // Remove caracteres não numéricos
    const cepNumbers = cep.replace(/\D/g, '')

    // Valida se tem 8 dígitos
    if (cepNumbers.length !== 8) {
      this.showAlert('CEP deve ter 8 dígitos!')
      return false
    }

    return true
  }

  private validateForm(): boolean {
    if (!this.newEstabelecimento.nome) {
      this.showAlert('Nome é obrigatório!')
      return false
    }
    if (!this.newEstabelecimento.cnpj || !this.validateCNPJ(this.newEstabelecimento.cnpj)) {
      return false
    }
    if (!this.newEstabelecimento.cep || !this.validateCEP(this.newEstabelecimento.cep)) {
      return false
    }
    return true
  }

  private showAlert(message: string): void {
    this.$q.dialog({
      title: 'Aviso',
      message: message,
      ok: { color: 'warning', label: 'Entendido' }
    })
  }

  // --- MÉTODOS DE CRIAÇÃO ---
  async onSubmitCreate(): Promise<void> {
    if (!this.validateForm()) return
    try {
      this.loadingCreate = true
      const payload = { ...this.newEstabelecimento }

      console.log('Criando estabelecimento:', payload)

      // Simulação de sucesso
      this.$q.notify({ color: 'positive', message: 'Estabelecimento salvo!', icon: 'check' })
      this.onCancelCreate()
      this.onSearch() // Atualiza a tabela
    } catch (error) {
      this.$q.notify({ color: 'negative', message: 'Erro ao Salvar.' })
    } finally {
      this.loadingCreate = false
    }
  }

  onCancelCreate(): void {
    this.newEstabelecimento = { nome: '', cnpj: '', cep: '' }
  }

  // --- MÉTODOS DA LISTAGEM ---
  async onSearch(): Promise<void> {
    this.loadingTable = true
    console.log('Pesquisando com filtros:', this.filter)
    setTimeout(() => { this.loadingTable = false }, 500)
  }

  onClearFilters(): void {
    this.filter = { nome: '', cnpj: '', cep: '' }
    this.onSearch()
  }

  onEdit(row: EstabelecimentoRow): void {
    this.newEstabelecimento = {
      nome: row.nome,
      cnpj: row.cnpj,
      cep: row.cep
    }
  }

  onDelete(row: EstabelecimentoRow): void {
    this.$q.dialog({
      title: 'Confirmar',
      message: `Excluir ${row.nome}?`,
      cancel: true
    }).onOk(() => {
      this.$q.notify({ color: 'positive', message: 'Excluído' })
    })
  }
}
</script>

<style scoped>
.attention-card {
  background-color: #fffde7;
  border-color: #fbc02d;
  color: #f57f17;
}
.attention-card .q-icon {
  color: #fbc02d;
}
.q-input {
  background: white;
}

.border {
  border: 1px solid black;
}
</style>
