<template>
  <q-page padding>
    <!-- SEÇÃO 1: CRIAÇÃO DE USUÁRIO -->
    <div class="row q-col-gutter-lg q-mb-xl" style="max-width: 1200px">
      <!-- Lado Esquerdo: Formulário de Criação -->
      <div class="col-12 col-md-6">
        <div class="text-h6 q-mb-md">Novo Usuário</div>

        <q-form @submit="onSubmitCreate" class="q-gutter-y-sm">
          <q-input outlined dense v-model="newUser.nome" label="Nome" />

          <q-input
            outlined
            dense
            type="email"
            v-model="newUser.email"
            label="E-mail"
          />

          <q-input
            outlined
            dense
            type="password"
            v-model="newUser.senha"
            label="Senha"
          />

          <q-input
            outlined
            dense
            type="number"
            v-model.number="newUser.estabelecimento_id"
            label="ID Estabelecimento"
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
              <li>O e-mail deve ser único no sistema.</li>
              <li>
                A senha será criptografada automaticamente via hash SHA-256.
              </li>
              <li>O ID do estabelecimento deve ser um número válido.</li>
            </ul>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-separator class="q-my-lg" />

    <!-- SEÇÃO 2: LISTAGEM E FILTROS -->
    <div class="row q-col-gutter-sm q-mb-md items-center">
      <div class="col-12">
        <div class="text-h6 q-mb-sm">Listagem de Usuários</div>
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
          v-model="filter.email"
          label="E-mail"
          @keyup.enter="onSearch"
        />
      </div>
      <div class="col-12 col-sm-2">
        <q-input
          outlined
          dense
          type="number"
          v-model.number="filter.estabelecimento_id"
          label="ID Estabelecimento"
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

    <!-- Tabela de Usuários -->
    <q-table
      flat
      bordered
      :data="users"
      :columns="colunasUsuarios"
      row-key="id"
      :loading="loadingTable"
      no-data-label="Nenhum usuário encontrado"
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
          <q-btn dense flat color="warning" icon="lock" />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import listUsuarios from '../../config/listUsuarios.json'

interface UserForm {
  nome: string;
  email: string;
  senha: string;
  estabelecimento_id: number | null;
}

@Component
export default class ModuleComponent extends Vue {
  // --- ESTADO DA CRIAÇÃO ---
  private newUser: UserForm = {
    nome: '',
    email: '',
    senha: '',
    estabelecimento_id: null
  }
  private loadingCreate = false
  colunasUsuarios = listUsuarios.columns

  // --- ESTADO DA LISTAGEM ---
  private filter = {
    nome: '',
    email: '',
    estabelecimento_id: null as number | null
  }
  private loadingTable = false

  // --- MÉTODOS DE CRIAÇÃO ---
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  private validateForm(): boolean {
    if (!this.newUser.nome) { this.showAlert('Nome é obrigatório!'); return false }
    if (!this.newUser.email || !/.+@.+\..+/.test(this.newUser.email)) { this.showAlert('E-mail inválido!'); return false }
    if (!this.newUser.senha || this.newUser.senha.length < 6) { this.showAlert('Senha deve ter 6+ caracteres!'); return false }
    if (this.newUser.estabelecimento_id === null) { this.showAlert('ID Estabelecimento é obrigatório!'); return false }
    return true
  }

  private showAlert(message: string): void {
    this.$q.dialog({
      title: 'Aviso',
      message: message,
      ok: { color: 'warning', label: 'Entendido' }
    })
  }

  async onSubmitCreate(): Promise<void> {
    if (!this.validateForm()) return
    try {
      this.loadingCreate = true
      const passwordHash = await this.hashPassword(this.newUser.senha)
      const payload = { ...this.newUser, senha: passwordHash }

      console.log('Criando usuário:', payload)

      // Simulação de sucesso
      this.$q.notify({ color: 'positive', message: 'Usuário salvo!', icon: 'check' })
      this.onCancelCreate()
      this.onSearch() // Atualiza a tabela
    } catch (error) {
      this.$q.notify({ color: 'negative', message: 'Erro ao Salvar.' })
    } finally {
      this.loadingCreate = false
    }
  }

  onCancelCreate(): void {
    this.newUser = { nome: '', email: '', senha: '', estabelecimento_id: null }
  }

  // --- MÉTODOS DA LISTAGEM ---
  async onSearch(): Promise<void> {
    this.loadingTable = true
    console.log('Pesquisando com filtros:', this.filter)
    setTimeout(() => { this.loadingTable = false }, 500)
  }

  onClearFilters(): void {
    this.filter = { nome: '', email: '', estabelecimento_id: null }
    this.onSearch()
  }


onEdit(row: any): void {
  this.newUser = {
    nome: row.nome,
    email: row.email,
    senha: '', // NÃO sobe senha por segurança
    estabelecimento_id: row.estabelecimento_id
  }
}

  onDelete(row: any): void {
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
