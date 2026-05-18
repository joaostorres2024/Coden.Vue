<template>
  <div class="q-pa-md">
    <!-- Cabeçalho -->

    <div class="text-bold text-black row items-center" style="font-size: 28px">
      <q-icon name="help_outline" class="q-mr-md text-primary" si\e="28px" />Ajuda
    </div>
    <p class="text-grey-7 text-body2 q-mb-md">
      Acesse conteúdos, orientações e tutoriais para utilizar todas as
      funcionalidades do sistema com mais facilidade.
    </p>
    <q-separator class="q-mb-lg" />
    <!-- Lista de Módulos -->
    <q-list class="q-gutter-y-sm">
      <q-expansion-item
        icon="groups"
        label="Cadastro de Pessoas"
        header-class="text-weight-medium"
        style="border: 0.5px solid #ccc; border-radius: 10px; overflow: hidden"
        expand-icon-class="text-grey-6"
      >
        <q-separator />
        <div class="q-pa-lg q-gutter-y-lg">
          <!-- Visão Geral -->
          <div>
            <div class="row items-center q-gutter-x-sm q-mb-md">
              <q-icon name="info_outline" size="18px" class="text-primary" />
              <span
                class="text-weight-medium text-black"
                style="
                  font-size: 13px;
                  text-transform: uppercase;
                  letter-spacing: 0.06em;
                "
                >Visão Geral</span
              >
            </div>
            <p
              class="text-grey-7"
              style="font-size: 14px; line-height: 1.7; margin: 0"
            >
              O módulo de Cadastro de Pessoas é responsável pelo gerenciamento
              centralizado de todos os contatos vinculados ao sistema, incluindo
              clientes, fornecedores, colaboradores e demais entidades. Por meio
              dele, é possível registrar, consultar, editar e controlar o status
              de cada pessoa de forma organizada e eficiente.
            </p>
          </div>
          <q-separator />
          <!-- Acessando o Módulo -->
          <div>
            <div class="row items-center q-gutter-x-sm q-mb-md">
              <q-icon name="login" size="18px" class="text-primary" />
              <span
                class="text-weight-medium"
                style="
                  font-size: 13px;
                  text-transform: uppercase;
                  letter-spacing: 0.06em;
                "
                >Acessando o Módulo</span
              >
            </div>
            <p
              class="text-grey-7"
              style="font-size: 14px; line-height: 1.7; margin: 0"
            >
              O acesso é realizado pelo menu principal do sistema. Ao selecionar
              a opção <strong>Cadastro de Pessoas</strong>, o usuário é
              direcionado para a interface de gerenciamento, onde visualiza a
              listagem de registros existentes e os recursos disponíveis para
              operação.
            </p>
          </div>
          <q-separator />
          <!-- Filtros -->
          <div>
            <div class="row items-center q-gutter-x-sm q-mb-md">
              <q-icon name="filter_list" size="18px" class="text-primary" />
              <span
                class="text-weight-medium"
                style="
                  font-size: 13px;
                  text-transform: uppercase;
                  letter-spacing: 0.06em;
                "
                >Filtros de Pesquisa</span
              >
            </div>
            <p
              class="text-grey-7 q-mb-sm"
              style="font-size: 14px; line-height: 1.7"
            >
              A parte superior da tela disponibiliza filtros para facilitar a
              localização de registros:
            </p>
            <q-list dense>
              <q-item
                v-for="filtro in filtros"
                :key="filtro.label"
                class="q-px-none"
              >
                <q-item-section avatar style="min-width: 28px">
                  <q-icon :name="filtro.icon" size="16px" class="text-grey-5" />
                </q-item-section>
                <q-item-section>
                  <span style="font-size: 14px; color: #555">
                    <strong>{{ filtro.label }}</strong> — {{ filtro.desc }}
                  </span>
                </q-item-section>
              </q-item>
            </q-list>
            <p
              class="text-grey-6 q-mt-sm"
              style="font-size: 13px; line-height: 1.6; margin-bottom: 0"
            >
              Os filtros podem ser combinados para resultados mais precisos. Use
              o botão <strong>Limpar</strong> para redefinir a listagem.
            </p>
          </div>
          <q-separator />
          <!-- Cadastrando -->
          <div>
            <div class="row items-center q-gutter-x-sm q-mb-md">
              <q-icon name="person_add_alt" size="18px" class="text-primary" />
              <span
                class="text-weight-medium"
                style="
                  font-size: 13px;
                  text-transform: uppercase;
                  letter-spacing: 0.06em;
                "
                >Cadastrando uma Nova Pessoa</span
              >
            </div>
            <q-list dense>
              <q-item
                v-for="(passo, i) in passos"
                :key="i"
                class="q-px-none items-start"
              >
                <q-item-section
                  avatar
                  style="min-width: 28px; padding-top: 2px"
                >
                  <q-badge
                    outline
                    color="grey-6"
                    :label="i + 1"
                    style="font-size: 11px"
                  />
                </q-item-section>
                <q-item-section>
                  <span style="font-size: 14px; color: #555; line-height: 1.6">
                    <strong>{{ passo.titulo }}</strong> — {{ passo.desc }}
                  </span>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <q-separator />
          <!-- Estrutura do Formulário -->
          <div>
            <div class="row items-center q-gutter-x-sm q-mb-md">
              <q-icon name="article" size="18px" class="text-primary" />
              <span
                class="text-weight-medium"
                style="
                  font-size: 13px;
                  text-transform: uppercase;
                  letter-spacing: 0.06em;
                "
                >Estrutura do Formulário</span
              >
            </div>
            <div class="row q-col-gutter-sm q-mt-xs">
              <div
                class="col-12 col-sm-6"
                v-for="secao in secoes"
                :key="secao.titulo"
              >
                <div
                  style="
                    border: 0.5px solid #ddd;
                    border-radius: 8px;
                    padding: 12px 14px;
                  "
                >
                  <div class="row items-center q-gutter-x-xs q-mb-xs">
                    <q-icon
                      :name="secao.icon"
                      size="16px"
                      class="text-grey-5"
                    />
                    <span
                      class="text-weight-medium"
                      style="font-size: 13px"
                      >{{ secao.titulo }}</span
                    >
                  </div>
                  <p
                    class="text-grey-6"
                    style="font-size: 13px; line-height: 1.6; margin: 0"
                  >
                    {{ secao.desc }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <q-separator />
          <!-- Editar e Status -->
          <div>
            <div class="row items-center q-gutter-x-sm q-mb-md">
              <q-icon name="tune" size="18px" class="text-primary" />
              <span
                class="text-weight-medium"
                style="
                  font-size: 13px;
                  text-transform: uppercase;
                  letter-spacing: 0.06em;
                "
                >Ações por Registro</span
              >
            </div>
            <q-list dense>
              <q-item class="q-px-none">
                <q-item-section avatar style="min-width: 28px">
                  <q-icon name="edit" size="16px" class="text-grey-5" />
                </q-item-section>
                <q-item-section>
                  <span style="font-size: 14px; color: #555; line-height: 1.6">
                    <strong>Editar</strong> — Clique no ícone de lápis para
                    abrir o formulário com os dados atuais preenchidos. Realize
                    as alterações e salve para confirmar.
                  </span>
                </q-item-section>
              </q-item>
              <q-item class="q-px-none">
                <q-item-section avatar style="min-width: 28px">
                  <q-icon name="person" size="16px" class="text-grey-5" />
                </q-item-section>
                <q-item-section>
                  <span style="font-size: 14px; color: #555; line-height: 1.6">
                    <strong>Ativar / Inativar</strong> — Controla o status do
                    registro sem excluí-lo. Registros inativos permanecem no
                    sistema para fins históricos, mas ficam desabilitados para
                    novos processos.
                  </span>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <q-separator />
          <!-- Dicas -->
          <div>
            <div class="row items-center q-gutter-x-sm q-mb-md">
              <q-icon
                name="lightbulb_outline"
                size="18px"
                class="text-primary"
              />
              <span
                class="text-weight-medium"
                style="
                  font-size: 13px;
                  text-transform: uppercase;
                  letter-spacing: 0.06em;
                "
                >Dicas de Uso</span
              >
            </div>
            <q-list dense>
              <q-item
                v-for="(dica, i) in dicas"
                :key="i"
                class="q-px-none items-start"
              >
                <q-item-section
                  avatar
                  style="min-width: 24px; padding-top: 4px"
                >
                  <q-icon
                    name="check_circle_outline"
                    size="15px"
                    color="positive"
                  />
                </q-item-section>
                <q-item-section>
                  <span
                    style="font-size: 14px; color: #555; line-height: 1.6"
                    v-html="dica"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <q-separator />
          <!-- Suporte -->
          <div class="row items-center justify-between">
            <p class="text-grey-6 q-mb-none" style="font-size: 13px">
              Dúvidas ou problemas? Entre em contato com o administrador do
              sistema.
            </p>
            <q-btn
              unelevated
              label="Falar com Suporte"
              icon="support_agent"
              color="positive"
              size="md"
              style="border-radius: 8px"
            />
          </div>
        </div>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
@Component
export default class AjudaComponent extends Vue {
 filtros = [
   { icon: 'people_outline', label: 'Tipo de Pessoa', desc: 'Filtra entre Pessoa Física (PF) e Pessoa Jurídica (PJ)' },
   { icon: 'badge',          label: 'Nome Completo',  desc: 'Busca por correspondência inicial do nome cadastrado' },
   { icon: 'fingerprint',    label: 'CNPJ / CPF',     desc: 'Localiza pelo número do documento' },
   { icon: 'tag',            label: 'Código do Cliente', desc: 'Busca pelo código interno gerado pelo sistema' }
 ]
 passos = [
   { titulo: 'Selecione o Tipo de Pessoa', desc: 'Campo obrigatório que determina quais informações serão solicitadas no formulário.' },
   { titulo: 'Clique em Adicionar',        desc: 'O formulário será exibido com os campos correspondentes ao tipo escolhido.' },
   { titulo: 'Preencha o formulário',      desc: 'Campos marcados com * são obrigatórios para concluir o cadastro.' },
   { titulo: 'Salve o cadastro',           desc: 'Clique em Salvar Cadastro para confirmar. Use Cancelar para descartar — uma confirmação será solicitada.' }
 ]
 secoes = [
   { icon: 'person_outline',   titulo: 'Dados Gerais',     desc: 'Nome, documento, data de nascimento ou razão social e nome do responsável. Inclui o campo de status (Ativo / Inativo).' },
   { icon: 'phone',   titulo: 'Dados de Contato', desc: 'E-mail, telefone celular principal e secundário, e telefone fixo.' },
   { icon: 'location_on',      titulo: 'Dados de Endereço', desc: 'CEP com preenchimento automático de logradouro, bairro, cidade e UF. Informe o número manualmente.' },
   { icon: 'notes',            titulo: 'Observações',      desc: 'Campo livre para anotações internas ou informações complementares ao cadastro.' }
 ]
 dicas = [
   'Selecione o <strong>Tipo de Pessoa</strong> antes de buscar para reduzir o volume de resultados.',
   'Preencha o <strong>CEP</strong> primeiro — o sistema completa o endereço automaticamente.',
   'O <strong>Código do Cliente</strong> é gerado automaticamente ao iniciar um novo cadastro.',
   'Ao cancelar uma edição, uma confirmação será exibida para evitar perda de dados não salvos.'
 ]
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
