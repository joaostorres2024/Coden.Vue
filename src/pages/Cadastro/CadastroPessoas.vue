<template>
  <div style="padding: 30px 200px">

    <!-- Breadcrumb (só aparece com o formulário aberto) -->
    <div
      v-if="mostrarFormCadastroPF || mostrarFormCadastroPJ"
      class="row items-center q-mb-md pessoas-breadcrumb"
    >

      <q-btn
        flat
        dense
        no-caps
        label="Cadastro de Pessoas"
        color="grey-7"
        class="pessoas-breadcrumb-voltar"
        @click="abrirDialogCancelar()"
      />
      <q-icon name="chevron_right" size="18px" color="grey-5" class="q-mx-xs" />
      <span class="text-grey-6 text-body2">
        {{ editandoId ? 'Editar Pessoa' : 'Nova Pessoa' }}
      </span>
    </div>

    <!-- Cabeçalho -->
    <div
      class="text-bold text-black row q-mb-sm items-center justify-between pessoas-cabecalho"
      style="font-size: 28px"
    >
      <div>
        <q-icon name="group" class="q-mr-md text-primary" size="28px" />Cadastro
        de Pessoas
        <p class="text-grey-7 text-body2 q-mb- pessoas-subtitulo">
          Gerencie os cadastros de pessoas físicas e jurídicas. Aqui você pode
          adicionar, editar, inativar e reativar clientes do sistema.
        </p>
      </div>
      <div class="row justify-end items-center" v-if="!mostrarFormCadastroPF && !mostrarFormCadastroPJ">
        <q-btn
          id="pessoas-btn-adicionar"
          class="pessoas-btn-adicionar b-r-6"
          label="Adicionar Novo"
          icon="add"
          color="positive"
          unelevated
          @click="mostrarFormulario()"
        />
      </div>
    </div>

    <!-- Filtro de busca (Escondido quando o formulário estiver aberto) -->
    <q-card v-if="!mostrarFormCadastroPF && !mostrarFormCadastroPJ" class="card-filtro b-r-10 q-pa-md q-mb-md">
      <div class="text-bold text-black q-mb-md" style="font-size: 16px">
        Filtros de busca
      </div>

      <div class="row justify-between items-end q-col-gutter-md q-mb-sm">
        <div class="col-12 col-md-9">
          <q-form class="row q-col-gutter-sm pessoas-form-filtro">
            <div class="col-12 col-md-3">
              <q-select
                v-model="filtroTipoPessoa"
                :options="opcoesTipoPessoa"
                label="Tipo de Pessoa"
                outlined
                dense
                emit-value
                map-options
                clearable
                ref="selectTipoPessoa"
                hide-bottom-space
                lazy-rules
                id="pessoas-select-tipo"
                class="pessoas-select-tipo"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model="filtroNome"
                label="Nome Completo"
                outlined
                dense
                input-id="pessoas-input-nome"
                class="pessoas-input-nome"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                label="CNPJ/CPF"
                outlined
                dense
                input-id="pessoas-input-documento"
                class="pessoas-input-documento"
                :value="filtroDocumentoFormatado"
                @input="atualizarFiltroDocumento"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model="filtroCodigo"
                label="Código do Cliente"
                outlined
                dense
                input-id="pessoas-input-codigo"
                class="pessoas-input-codigo"
              />
            </div>
          </q-form>
        </div>

        <!-- Lado Direito: Botões de Filtro -->
        <div class="col-12 col-md-3 row justify-end q-gutter-sm no-wrap">
          <q-btn
            style="border: 1px solid rgba(0, 0, 0, 0.12)"
            id="pessoas-btn-filtrar"
            class="pessoas-btn-filtrar"
            label="Filtrar"
            icon="search"
            color="primary"
            unelevated
            @click="aplicarFiltro()"
          />
          <q-btn
            style="border: 1px solid rgba(0, 0, 0, 0.12)"
            id="pessoas-btn-limpar"
            class="pessoas-btn-limpar text-grey-7"
            label="Limpar"
            icon="delete_sweep"
            flat
            @click="refreshTable()"
          />
        </div>
      </div>
    </q-card>

    <!-- Formulário -->
    <div
      v-if="mostrarFormCadastroPF || mostrarFormCadastroPJ"
      class="pessoas-form-cadastro"
    >
      <q-form ref="formCadastro" @submit.prevent="salvar()" greedy>

        <!-- Tipo de Cadastro -->
        <q-card class="q-pa-md b-r-10 q-mb-md pessoas-card-tipo">
          <div class="text-subtitle1 text-bold q-mb-md">Tipo de Cadastro</div>
          <div v-if="editandoId" class="text-caption text-grey-6 q-mb-sm">
            O tipo de pessoa não pode ser alterado após o cadastro.
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-4">
              <div
                class="pessoas-tipo-card"
                :class="{
                  'pessoas-tipo-card-ativo': tipoPessoa === 'PF',
                  'pessoas-tipo-card-desabilitado': !!editandoId
                }"
                @click="!editandoId && mudarTipoPessoaNoForm('PF')"
              >
                <q-avatar size="36px" class="pessoas-tipo-avatar" :class="{ 'pessoas-tipo-avatar-ativo': tipoPessoa === 'PF' }">
                  <q-icon name="person" size="20px" />
                </q-avatar>
                <span class="pessoas-tipo-label" :class="{ 'text-primary text-weight-bold': tipoPessoa === 'PF' }">
                  Pessoa Física
                </span>
                <q-icon
                  v-if="tipoPessoa === 'PF'"
                  name="check_circle"
                  color="primary"
                  size="20px"
                  class="pessoas-tipo-check"
                />
              </div>
            </div>
            <div class="col-12 col-sm-4">
              <div
                class="pessoas-tipo-card"
                :class="{
                  'pessoas-tipo-card-ativo': tipoPessoa === 'PJ',
                  'pessoas-tipo-card-desabilitado': !!editandoId
                }"
                @click="!editandoId && mudarTipoPessoaNoForm('PJ')"
              >
                <q-avatar size="36px" class="pessoas-tipo-avatar" :class="{ 'pessoas-tipo-avatar-ativo': tipoPessoa === 'PJ' }">
                  <q-icon name="business" size="20px" />
                </q-avatar>
                <span class="pessoas-tipo-label" :class="{ 'text-primary text-weight-bold': tipoPessoa === 'PJ' }">
                  Pessoa Jurídica
                </span>
                <q-icon
                  v-if="tipoPessoa === 'PJ'"
                  name="check_circle"
                  color="primary"
                  size="20px"
                  class="pessoas-tipo-check"
                />
              </div>
            </div>
          </div>
          <div v-if="!tipoPessoa" class="text-negative text-caption q-mt-sm">
            Selecione o tipo de pessoa
          </div>
        </q-card>

        <!-- Dados Gerais -->
        <q-card class="q-pa-md b-r-10 q-mb-md pessoas-card-secao">
          <div class="row items-center q-mb-md">
            <q-avatar size="28px" color="primary" text-color="white" class="pessoas-secao-numero">01</q-avatar>
            <span class="text-subtitle1 q-mx-sm text-bold">Dados Gerais</span>
          </div>

          <div class="row q-col-gutter-md pessoas-dados-gerais">
            <template v-if="mostrarFormCadastroPF">
              <div class="col-12 col-sm-6">
                <div class="text-caption text-weight-medium q-mb-xs">
                  Nome Completo <span class="text-negative">*</span>
                </div>
                <q-input
                  v-model="nome"
                  outlined
                  dense
                  placeholder="Ex: João da Silva Santos"
                  hide-bottom-space
                  lazy-rules
                  :rules="[(val) => !!val || 'Nome completo obrigatório']"
                  input-id="pessoas-input-nome-form"
                  class="pessoas-input-nome-form"
                />
              </div>
              <div class="col-12 col-sm-6">
                <div class="text-caption text-weight-medium q-mb-xs">
                  CPF <span class="text-negative">*</span>
                </div>
                <q-input
                  v-model="documento"
                  outlined
                  dense
                  mask="###.###.###-##"
                  placeholder="000.000.000-00"
                  hide-bottom-space
                  lazy-rules
                  :rules="[
                    (val) => !!val || 'CPF obrigatório',
                    (val) => validarCPF(val) || 'CPF inválido'
                  ]"
                  input-id="pessoas-input-cpf"
                  class="pessoas-input-cpf"
                />
              </div>
              <div class="col-12 col-sm-4">
                <div class="text-caption text-weight-medium q-mb-xs">Data de Nascimento</div>
                <q-input
                  v-model="dtaNascimento"
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
                <div class="text-caption text-weight-medium q-mb-xs">Nome Social</div>
                <q-input
                  v-model="nmeSocial"
                  outlined
                  dense
                  placeholder="Nome pelo qual prefere ser chamado"
                  input-id="pessoas-input-nome-social"
                  class="pessoas-input-nome-social"
                />
              </div>
              <div class="col-12 col-sm-4">
                <div class="text-caption text-weight-medium q-mb-xs">RG</div>
                <q-input
                  v-model="rg"
                  outlined
                  dense
                  mask="##.###.###-#"
                  placeholder="00.000.000-0"
                  input-id="pessoas-input-rg"
                  class="pessoas-input-rg"
                />
              </div>
            </template>

            <template v-if="mostrarFormCadastroPJ">
              <div class="col-12 col-sm-6">
                <div class="text-caption text-weight-medium q-mb-xs">
                  Razão Social <span class="text-negative">*</span>
                </div>
                <q-input
                  v-model="nome"
                  outlined
                  dense
                  placeholder="Ex: Empresa Comércio de Produtos LTDA"
                  hide-bottom-space
                  lazy-rules
                  :rules="[(val) => !!val || 'Razão social obrigatória']"
                  input-id="pessoas-input-razao-form"
                  class="pessoas-input-razao-form"
                />
              </div>
              <div class="col-12 col-sm-6">
                <div class="text-caption text-weight-medium q-mb-xs">
                  CNPJ <span class="text-negative">*</span>
                </div>
                <q-input
                  v-model="documento"
                  outlined
                  dense
                  mask="##.###.###/####-##"
                  placeholder="00.000.000/0000-00"
                  hide-bottom-space
                  lazy-rules
                  :rules="[
                    (val) => !!val || 'CNPJ obrigatório',
                    (val) => validarCNPJ(val) || 'CNPJ inválido'
                  ]"
                  input-id="pessoas-input-cnpj"
                  class="pessoas-input-cnpj"
                />
              </div>
              <div class="col-12 col-sm-6">
                <div class="text-caption text-weight-medium q-mb-xs">Nome Fantasia</div>
                <q-input
                  v-model="razaoSocial"
                  outlined
                  dense
                  placeholder="Nome fantasia da empresa"
                  hide-bottom-space
                  lazy-rules
                  input-id="pessoas-input-razao-social"
                  class="pessoas-input-razao-social"
                />
              </div>
              <div class="col-12 col-sm-6">
                <div class="text-caption text-weight-medium q-mb-xs">
                  Nome do Responsável <span class="text-negative">*</span>
                </div>
                <q-input
                  v-model="nomeResponsavel"
                  outlined
                  dense
                  placeholder="Ex: Maria Oliveira"
                  :rules="[(val) => !!val || 'Nome do responsável obrigatório']"
                  hide-bottom-space
                  lazy-rules
                  input-id="pessoas-input-responsavel"
                  class="pessoas-input-responsavel"
                />
              </div>
            </template>

            <div class="col-12 col-sm-4">
              <div class="text-caption text-weight-medium q-mb-xs">
                Status <span class="text-negative">*</span>
              </div>
              <q-select
                v-model="ativoInativo"
                :options="ativo_inativo"
                outlined
                dense
                emit-value
                map-options
                id="pessoas-select-status"
                class="pessoas-select-status"
              />
            </div>

            <div class="col-12 col-sm-4">
              <div class="text-caption text-weight-medium q-mb-xs">Código do Cliente</div>
              <q-input
                v-model="codigo"
                outlined
                dense
                readonly
                input-id="pessoas-input-codigo-form"
                class="pessoas-input-codigo-form"
              />
            </div>
          </div>
        </q-card>

        <!-- Dados de Contato -->
        <q-card class="q-pa-md b-r-10 q-mb-md pessoas-card-secao">
          <div class="row items-center q-mb-md">
            <q-avatar size="28px" color="primary" text-color="white" class="pessoas-secao-numero">02</q-avatar>
            <span class="text-subtitle1 text-bold q-mx-sm">Dados de Contato</span>
          </div>

          <div class="row q-col-gutter-md q-mb-md pessoas-dados-contato">
            <div class="col-12 col-sm-4">
              <div class="text-caption text-weight-medium q-mb-xs">E-mail</div>
              <q-input
                v-model="email"
                outlined
                dense
                placeholder="exemplo@email.com"
                hide-bottom-space
                lazy-rules
                input-id="pessoas-input-email"
                class="pessoas-input-email"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md pessoas-dados-telefones">
            <div class="col-12 col-sm-4">
              <div class="text-caption text-weight-medium q-mb-xs">
                Telefone 1 <span class="text-negative">*</span>
              </div>
              <q-input
                v-model="telefone1"
                mask="(##) #####-####"
                outlined
                dense
                placeholder="(00) 00000-0000"
                :rules="[(val) => !!val || 'Telefone obrigatório']"
                hide-bottom-space
                lazy-rules
                input-id="pessoas-input-telefone1"
                class="pessoas-input-telefone1"
              />
            </div>
            <div class="col-12 col-sm-4">
              <div class="text-caption text-weight-medium q-mb-xs">Telefone 2</div>
              <q-input
                v-model="telefone2"
                mask="(##) #####-####"
                outlined
                dense
                placeholder="(00) 00000-0000"
                input-id="pessoas-input-telefone2"
                class="pessoas-input-telefone2"
              />
            </div>
            <div class="col-12 col-sm-4">
              <div class="text-caption text-weight-medium q-mb-xs">Telefone Fixo</div>
              <q-input
                v-model="telefone_fixo"
                mask="(##) ####-####"
                outlined
                dense
                placeholder="(00) 0000-0000"
                input-id="pessoas-input-telefone-fixo"
                class="pessoas-input-telefone-fixo"
              />
            </div>
          </div>
        </q-card>

        <!-- Dados de Endereço -->
        <q-card class="q-pa-md b-r-10 q-mb-md pessoas-card-secao">
          <div class="row items-center q-mb-md">
            <q-avatar size="28px" color="primary" text-color="white" class="pessoas-secao-numero">03</q-avatar>
            <span class="text-subtitle1 q-mx-sm text-bold">Dados de Endereço</span>
          </div>

          <div class="row q-col-gutter-md pessoas-dados-endereco">
            <div class="col-12 col-sm-4">
              <div class="text-caption text-weight-medium q-mb-xs">CEP</div>
              <q-input
                v-model="cep"
                mask="#####-###"
                outlined
                dense
                placeholder="00000-000"
                hide-bottom-space
                lazy-rules
                input-id="pessoas-input-cep"
                class="pessoas-input-cep"
                @input="buscarCep(cep)"
              />
            </div>
            <div class="col-12 col-sm-4">
              <div class="text-caption text-weight-medium q-mb-xs">Endereço</div>
              <q-input
                v-model="endereco"
                outlined
                dense
                placeholder="Ex: Rua das Flores"
                hide-bottom-space
                lazy-rules
                input-id="pessoas-input-endereco"
                class="pessoas-input-endereco"
              />
            </div>
            <div class="col-12 col-sm-4">
              <div class="text-caption text-weight-medium q-mb-xs">Número</div>
              <q-input
                v-model="numero"
                outlined
                dense
                placeholder="Ex: 123"
                hide-bottom-space
                lazy-rules
                input-id="pessoas-input-numero"
                class="pessoas-input-numero"
              />
            </div>
            <div class="col-12 col-sm-4">
              <div class="text-caption text-weight-medium q-mb-xs">Bairro</div>
              <q-input
                v-model="bairro"
                outlined
                dense
                placeholder="Ex: Centro"
                hide-bottom-space
                lazy-rules
                input-id="pessoas-input-bairro"
                class="pessoas-input-bairro"
              />
            </div>
            <div class="col-12 col-sm-4">
              <div class="text-caption text-weight-medium q-mb-xs">Cidade</div>
              <q-input
                v-model="cidade"
                outlined
                dense
                placeholder="Ex: Brasília"
                hide-bottom-space
                lazy-rules
                input-id="pessoas-input-cidade"
                class="pessoas-input-cidade"
              />
            </div>
            <div class="col-12 col-sm-4">
              <div class="text-caption text-weight-medium q-mb-xs">UF</div>
              <q-select
                v-model="ufSelect"
                :options="uf_select"
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
        </q-card>

        <!-- Observações -->
        <q-card class="q-pa-md b-r-10 q-mb-md pessoas-card-secao">
          <div class="row items-center q-mb-md">
            <q-avatar size="28px" color="primary" text-color="white" class="pessoas-secao-numero">04</q-avatar>
            <span class="text-subtitle1 text-bold q-mx-sm">Observações</span>
          </div>

          <div class="row pessoas-observacoes">
            <div class="col-12">
              <q-input
                v-model="observacoes"
                type="textarea"
                outlined
                dense
                placeholder="Anotações adicionais sobre este cadastro..."
                input-style="resize: none;"
                rows="5"
                input-id="pessoas-input-observacoes"
                class="pessoas-input-observacoes"
              />
            </div>
          </div>
        </q-card>

        <!-- Botões -->
        <div class="row q-mt-lg q-mb-xl q-gutter-md justify-start pessoas-form-acoes">
          <q-btn
            id="pessoas-btn-salvar"
            class="pessoas-btn-salvar b-r-6"
            label="Salvar Cadastro"
            color="positive"
            unelevated
            type="submit"
          />
          <q-btn
            id="pessoas-btn-cancelar"
            class="pessoas-btn-cancelar b-r-6"
            label="Cancelar"
            color="negative"
            unelevated
            @click="abrirDialogCancelar()"
          />
        </div>
      </q-form>
    </div>

    <!-- Tabela -->
    <div
      v-if="!mostrarFormCadastroPF && !mostrarFormCadastroPJ"
      class="q-mt-lg pessoas-tabela"
    >
      <q-table
        :data="rowsFiltradas"
        :columns="colunasCadastroProdutos"
        row-key="id"
        :rows-per-page-options="[10, 20, 50]"
        no-data-label="Nenhum registro encontrado"
        class=" pessoas-tabela-clientes b-r-10"
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
    <q-dialog
      v-model="dialogCancelar"
      persistent
      class="pessoas-dialog-cancelar"
    >
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
import Vue from "vue";
import Component from "vue-class-component";
import listCadastroPessoas from "../../config/listCadastroPessoas.json";
import clienteService, { Cliente } from "../../services/clienteService";

// ===== Funções puras de validação de documento =====

function validarCPF(cpf: string): boolean {
  const numeros = (cpf || "").replace(/\D/g, "");
  if (numeros.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(numeros)) return false; // todos os dígitos iguais

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(numeros[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(numeros[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(numeros[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(numeros[10])) return false;

  return true;
}

function validarCNPJ(cnpj: string): boolean {
  const numeros = (cnpj || "").replace(/\D/g, "");
  if (numeros.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(numeros)) return false; // todos os dígitos iguais

  const calcularDigito = (base: string, pesos: number[]): number => {
    const soma = base
      .split("")
      .reduce((acc, num, i) => acc + parseInt(num) * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const digito1 = calcularDigito(numeros.substring(0, 12), pesos1);
  if (digito1 !== parseInt(numeros[12])) return false;

  const digito2 = calcularDigito(numeros.substring(0, 13), pesos2);
  if (digito2 !== parseInt(numeros[13])) return false;

  return true;
}

@Component
export default class ModuleComponent extends Vue {
  colunasCadastroProdutos = listCadastroPessoas.columns;

  // ===== data =====
  // Variáveis do formulário de cadastro / edição
  tipoPessoa: string | null = null;
  nome = "";
  documento = "";
  codigo = "";
  rg = "";

  // Variáveis exclusivas para o filtro
  filtroTipoPessoa: string | null = null;
  filtroNome = "";
  filtroDocumento = "";
  filtroCodigo = "";

  editandoId: number | null = null;
  clienteParaExcluir: any = null;

  // Controle de UI
  mostrarFormCadastroPF = false;
  mostrarFormCadastroPJ = false;
  dialogCancelar = false;
  dialogExcluir = false;

  // Dados do Formulário
  dtaNascimento = "";
  nmeSocial = "";
  razaoSocial = "";
  nomeResponsavel = "";
  ativoInativo = "Ativo";
  telefone1 = "";
  telefone2 = "";
  telefone_fixo = "";
  email = "";
  cep = "";
  endereco = "";
  numero = "";
  bairro = "";
  cidade = "";
  ufSelect = "DF";
  observacoes = "";

  // Tabela
  rows: Cliente[] = [];

  // Opções
  opcoesTipoPessoa = [
    { label: "Pessoa Física", value: "PF" },
    { label: "Pessoa Jurídica", value: "PJ" },
  ];
  ativo_inativo = [
    { label: "Ativo", value: "Ativo" },
    { label: "Inativo", value: "Inativo" },
  ];
  uf_select = [
    { label: "AC", value: "AC" },
    { label: "AL", value: "AL" },
    { label: "AM", value: "AM" },
    { label: "AP", value: "AP" },
    { label: "BA", value: "BA" },
    { label: "CE", value: "CE" },
    { label: "DF", value: "DF" },
    { label: "ES", value: "ES" },
    { label: "GO", value: "GO" },
    { label: "MA", value: "MA" },
    { label: "MG", value: "MG" },
    { label: "MS", value: "MS" },
    { label: "MT", value: "MT" },
    { label: "PA", value: "PA" },
    { label: "PB", value: "PB" },
    { label: "PE", value: "PE" },
    { label: "PI", value: "PI" },
    { label: "PR", value: "PR" },
    { label: "RJ", value: "RJ" },
    { label: "RN", value: "RN" },
    { label: "RO", value: "RO" },
    { label: "RR", value: "RR" },
    { label: "RS", value: "RS" },
    { label: "SC", value: "SC" },
    { label: "SE", value: "SE" },
    { label: "SP", value: "SP" },
    { label: "TO", value: "TO" },
  ];

  async created() {
    await this.carregarClientes();
  }

  // Filtros efetivamente aplicados
  filtroAplicadoTipoPessoa: string | null = null;
  filtroAplicadoNome = "";
  filtroAplicadoDocumento = "";
  filtroAplicadoCodigo = "";

  get rowsFiltradas() {
    return this.rows.filter((c: Cliente) => {
      const nomeOk =
        !this.filtroAplicadoNome ||
        c.nome_cliente
          .toLowerCase()
          .includes(this.filtroAplicadoNome.toLowerCase());

      const codigoOk =
        !this.filtroAplicadoCodigo ||
        c.codigo_cliente
          ?.toLowerCase()
          .includes(this.filtroAplicadoCodigo.toLowerCase());

      const docOk =
        !this.filtroAplicadoDocumento ||
        c.cpf?.includes(this.filtroAplicadoDocumento) ||
        c.cnpj?.includes(this.filtroAplicadoDocumento);

      const tipoOk =
        !this.filtroAplicadoTipoPessoa ||
        c.tipo_pessoa === this.filtroAplicadoTipoPessoa;

      return nomeOk && codigoOk && docOk && tipoOk;
    });
  }

  // ===== Validação de documento (expostas pro template) =====
  validarCPF(val: string) {
    return validarCPF(val);
  }

  validarCNPJ(val: string) {
    return validarCNPJ(val);
  }

  // ===== Métodos =====
  async carregarClientes() {
    try {
      this.rows = await clienteService.listarClientes();
    } catch (err) {
      this.$q.notify({
        type: "negative",
        message: "Erro ao carregar clientes!",
      });
    }
  }

  async salvar() {
    const form = this.$refs.formCadastro as any;
    const valido = await form.validate();
    if (!valido) return;

    if (!this.tipoPessoa) {
      this.$q.notify({
        type: "negative",
        message: "Selecione o tipo de pessoa",
        position: "bottom",
      });
      return;
    }
    if (!this.nome) {
      this.$q.notify({
        type: "negative",
        message: "Nome completo obrigatório",
        position: "bottom",
      });
      return;
    }
    if (!this.documento) {
      this.$q.notify({
        type: "negative",
        message: "CPF/CNPJ obrigatório",
        position: "bottom",
      });
      return;
    }

    try {
      const payload: Cliente = {
        tipo_pessoa: this.tipoPessoa ?? "",
        nome_cliente: this.nome,
        cpf: this.tipoPessoa === "PF" ? this.documento : undefined,
        cnpj: this.tipoPessoa === "PJ" ? this.documento : undefined,
        codigo_cliente: this.codigo,
        status: this.ativoInativo,
        data_nascimento:
          this.tipoPessoa === "PF" ? this.dtaNascimento : undefined,
        nome_social: this.tipoPessoa === "PF" ? this.nmeSocial : undefined,
        razao_social: this.tipoPessoa === "PJ" ? this.razaoSocial : undefined,
        nome_responsavel:
          this.tipoPessoa === "PJ" ? this.nomeResponsavel : undefined,
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
        observacoes: this.observacoes,
      };

      if (this.editandoId) {
        await clienteService.atualizarCliente(this.editandoId, payload);
        this.$q.notify({
          type: "positive",
          message: "Cliente atualizado com sucesso!",
        });
      } else {
        await clienteService.criarCliente(payload);
        this.$q.notify({
          type: "positive",
          message: "Cliente cadastrado com sucesso!",
        });
      }

      await this.carregarClientes();
      this.confirmarCancelamento();
    } catch (err) {
      this.$q.notify({ type: "negative", message: "Erro ao salvar cadastro!" });
    }
  }

  async reativarCliente(row: any) {
    try {
      await clienteService.atualizarCliente(row.id, {
        ...row,
        status: "Ativo",
      });
      this.$q.notify({
        type: "positive",
        message: "Cliente reativado com sucesso!",
      });
      await this.carregarClientes();
    } catch {
      this.$q.notify({
        type: "negative",
        message: "Erro ao reativar cliente!",
      });
    }
  }

  async buscarCep(cep: string) {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`,
      );
      const data = await response.json();

      if (data.erro) {
        this.$q.notify({ type: "negative", message: "CEP não encontrado" });
        return;
      }

      this.endereco = data.logradouro;
      this.bairro = data.bairro;
      this.cidade = data.localidade;
      this.ufSelect = data.uf;
    } catch (err) {
      this.$q.notify({ type: "negative", message: "Erro ao buscar CEP" });
    }
  }

  abrirDialogCancelar() {
    this.dialogCancelar = true;
  }

  formatarDocumento(row: any): string {
    if (row.tipo_pessoa === "PF") {
      const cpf = row.cpf?.replace(/\D/g, "") ?? "";
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else {
      const cnpj = row.cnpj?.replace(/\D/g, "") ?? "";
      return cnpj.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5",
      );
    }
  }

  editar(row: any) {
    this.editandoId = row.id;
    this.tipoPessoa = row.tipo_pessoa;
    this.nome = row.nome_cliente;
    this.documento = row.cpf || row.cnpj;
    this.codigo = row.codigo_cliente;
    this.ativoInativo = row.status;
    this.dtaNascimento = row.data_nascimento;
    this.nmeSocial = row.nome_social;
    this.razaoSocial = row.razao_social;
    this.nomeResponsavel = row.nome_responsavel;
    this.telefone1 = row.telefone_1;
    this.telefone2 = row.telefone_2;
    this.telefone_fixo = row.telefone_fixo;
    this.email = row.email;
    this.cep = row.cep;
    this.endereco = row.endereco;
    this.numero = row.numero;
    this.bairro = row.bairro;
    this.cidade = row.cidade;
    this.ufSelect = row.uf;
    this.observacoes = row.observacoes;

    this.mostrarFormCadastroPF = row.tipo_pessoa === "PF";
    this.mostrarFormCadastroPJ = row.tipo_pessoa === "PJ";
  }

  confirmarExcluir(row: any) {
    this.clienteParaExcluir = row;
    this.dialogExcluir = true;
  }

  async executarExclusao() {
    try {
      await clienteService.atualizarCliente(this.clienteParaExcluir.id, {
        ...this.clienteParaExcluir,
        status: "Inativo",
      });
      this.$q.notify({
        type: "positive",
        message: "Cliente inativado com sucesso!",
      });
      this.dialogExcluir = false;
      this.clienteParaExcluir = null;
      await this.carregarClientes();
    } catch {
      this.$q.notify({
        type: "negative",
        message: "Erro ao inativar cliente!",
      });
    }
  }

  async mostrarFormulario() {
    this.limparCamposFormulario();

    // Começa com PF por padrão ao abrir novo cadastro
    this.tipoPessoa = "PF";
    this.mostrarFormCadastroPF = true;
    this.mostrarFormCadastroPJ = false;

    if (!this.editandoId) {
      try {
        this.codigo = await clienteService.proximoCodigo();
      } catch (err) {
        this.$q.notify({
          type: "negative",
          message: "Erro ao gerar código do cliente",
        });
      }
    }
  }

  mudarTipoPessoaNoForm(tipo: string) {
    if (this.editandoId) return; // não permite trocar o tipo em edição
    this.tipoPessoa = tipo;
    this.mostrarFormCadastroPF = tipo === "PF";
    this.mostrarFormCadastroPJ = tipo === "PJ";
  }

  confirmarCancelamento() {
    this.dialogCancelar = false;
    this.mostrarFormCadastroPF = false;
    this.mostrarFormCadastroPJ = false;
    this.$nextTick(() => {
      const form = this.$refs.formCadastro as any;
      if (form) form.resetValidation();
    });
    this.limparCamposFormulario();
  }

  limparCamposFormulario() {
    this.editandoId = null;
    this.tipoPessoa = null;
    this.nome = "";
    this.documento = "";
    this.codigo = "";
    this.rg = "";
    this.dtaNascimento = "";
    this.nmeSocial = "";
    this.razaoSocial = "";
    this.nomeResponsavel = "";
    this.ativoInativo = "Ativo";
    this.telefone1 = "";
    this.telefone2 = "";
    this.telefone_fixo = "";
    this.email = "";
    this.cep = "";
    this.endereco = "";
    this.numero = "";
    this.bairro = "";
    this.cidade = "";
    this.ufSelect = "DF";
    this.observacoes = "";
  }

  aplicarFiltro() {
    this.filtroAplicadoTipoPessoa = this.filtroTipoPessoa;
    this.filtroAplicadoNome = this.filtroNome;
    this.filtroAplicadoDocumento = this.filtroDocumento;
    this.filtroAplicadoCodigo = this.filtroCodigo;
  }

  refreshTable() {
    // Limpa os campos
    this.filtroTipoPessoa = null;
    this.filtroNome = "";
    this.filtroDocumento = "";
    this.filtroCodigo = "";

    // Remove os filtros aplicados
    this.filtroAplicadoTipoPessoa = null;
    this.filtroAplicadoNome = "";
    this.filtroAplicadoDocumento = "";
    this.filtroAplicadoCodigo = "";

    if (this.$refs.selectTipoPessoa) {
      (this.$refs.selectTipoPessoa as any).resetValidation();
    }
  }

  get filtroDocumentoFormatado() {
    const numeros = this.filtroDocumento;

    if (numeros.length <= 11) {
      return numeros
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
    }

    return numeros
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
      .replace(
        /^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/,
        "$1.$2.$3/$4-$5"
      );
  }

  atualizarFiltroDocumento(valor: string) {
    this.filtroDocumento = valor
      .replace(/\D/g, "")
      .substring(0, 14);
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

.b-r-6 {
  border-radius: 6px;
}

.card-filtro {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.pessoas-btn-filtrar,
.pessoas-btn-limpar {
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.pessoas-tabela-clientes {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.pessoas-tabela-clientes th {
  font-weight: 700 !important;
  color: #1f2937 !important;
}

/* ===== Cards de seção do formulário ===== */
.pessoas-card-tipo,
.pessoas-card-secao {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.pessoas-secao-numero {
  font-size: 12px;
  font-weight: 700;
}

/* ===== Cards de seleção do Tipo de Cadastro ===== */
.pessoas-tipo-card {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1.5px solid #e0e5ea;
  border-radius: 10px;
  padding: 12px 16px;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
  position: relative;
}

.pessoas-tipo-card:hover {
  border-color: #b8c4d0;
}

.pessoas-tipo-card-ativo {
  border-color: #1976d2;
  background: #f5faff;
}

.pessoas-tipo-card-desabilitado {
  cursor: not-allowed;
  opacity: 0.7;
}

.pessoas-tipo-card-desabilitado:hover {
  border-color: inherit;
}

.pessoas-tipo-avatar {
  background: #eef1f4;
  color: #6b7280;
}

.pessoas-tipo-avatar-ativo {
  background: #dceeff;
  color: #1976d2;
}

.pessoas-tipo-label {
  font-size: 14px;
  color: #444;
}

.pessoas-tipo-check {
  position: absolute;
  right: 12px;
}

/* ===== Breadcrumb ===== */
.pessoas-breadcrumb-voltar {
  padding-left: 0;
}

/* ===== Bordas dos inputs ===== */
:deep(.pessoas-select-tipo .q-field__control:before),
:deep(.pessoas-input-nome .q-field__control:before),
:deep(.pessoas-input-documento .q-field__control:before),
:deep(.pessoas-input-codigo .q-field__control:before) {
  border-color: #d8dee5 !important;
}

/* Borda no hover (mouse em cima, sem estar focado) */
:deep(.pessoas-select-tipo .q-field--outlined:hover .q-field__control:before),
:deep(.pessoas-input-nome .q-field--outlined:hover .q-field__control:before),
:deep(
  .pessoas-input-documento .q-field--outlined:hover .q-field__control:before
),
:deep(.pessoas-input-codigo .q-field--outlined:hover .q-field__control:before) {
  border-color: #c4ccd6 !important;
}

/* Borda quando o campo está focado (clicado) */
:deep(.pessoas-select-tipo.q-field--focused .q-field__control:after),
:deep(.pessoas-input-nome.q-field--focused .q-field__control:after),
:deep(.pessoas-input-documento.q-field--focused .q-field__control:after),
:deep(.pessoas-input-codigo.q-field--focused .q-field__control:after) {
  border-color: #1976d2 !important;
}
</style>
