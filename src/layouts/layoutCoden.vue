<template>
  <q-layout view="hHh Lpr lFf">
    <!-- CABEÇALHO -->
    <q-header unelevated :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
      <q-toolbar>
        <q-btn flat dense round color="black" icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title>
          <img
            style="width: 90px; vertical-align: middle; margin-top: -10px"
            :src="require('../assets/Logo Coden.png')"
            alt="Logo Coden"
            @click="$router.push('/')"
            class="cursor-pointer q-mr-lg"
          />
          <span class="text-bold text-black"> Olá, </span>
          <span class="text-bold text-primary">{{ user }}</span>
        </q-toolbar-title>
        <q-space />
        <div class="row items-center q-gutter-sm cursor-pointer q-mr-sm" @click="drawerPerfil = !drawerPerfil">
          <q-avatar size="36px" color="primary" text-color="white">{{ iniciais }}</q-avatar>
          <div class="column" style="line-height: 1.2">
            <span class="text-black text-weight-bold" style="font-size: 13px">{{ user }}</span>
            <span class="text-grey-6" style="font-size: 11px">Configurações e Perfil</span>
          </div>
          <q-icon name="expand_more" color="black" />
        </div>
      </q-toolbar>
    </q-header>

<!-- DRAWER ESQUERDO -->
<q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="260" content-class="bg-primary">
  <div class="column no-wrap full-height">

    <q-separator class="q-mb-sm bg-primary" />

    <!-- Menu -->
    <q-scroll-area style="flex: 1">
      <q-list class="q-px-sm q-py-xs">

        <!-- Dashboard -->
        <q-item
          clickable v-ripple
          class="menu-item b-r-10 q-mb-xs text-white"
          :class="$route.path === '/' ? 'menu-item-active' : ''"
          @click="$router.push('/')"
        >
          <q-item-section avatar>
            <q-icon name="o_dashboard" size="20px" color="white" />
          </q-item-section>
          <q-item-section class="menu-label">Dashboard</q-item-section>
        </q-item>

        <!-- Cadastro -->
        <div class="menu-section-label q-px-sm q-mt-md q-mb-xs">CADASTRO</div>

        <q-item
          clickable v-ripple
          class="menu-item b-r-10 q-mb-xs text-white"
          :class="$route.path === '/CadastroPessoas' ? 'menu-item-active' : ''"
          @click="$router.push('/CadastroPessoas')"
        >
          <q-item-section avatar>
            <q-icon name="o_groups" size="20px" color="white" />
          </q-item-section>
          <q-item-section class="menu-label">Pessoas</q-item-section>
        </q-item>

        <q-item
          clickable v-ripple
          class="menu-item b-r-10 q-mb-xs text-white"
          :class="$route.path === '/CadastroProdutos' ? 'menu-item-active' : ''"
          @click="$router.push('/CadastroProdutos')"
        >
          <q-item-section avatar>
            <q-icon name="shelves" size="20px" color="white" />
          </q-item-section>
          <q-item-section class="menu-label">Produtos</q-item-section>
        </q-item>

        <!-- Financeiro -->
        <div class="menu-section-label q-px-sm q-mt-md q-mb-xs">FINANCEIRO</div>

        <q-item
          clickable v-ripple
          class="menu-item b-r-10 q-mb-xs text-white"
          :class="$route.path === '/NotaFiscalEntrada' ? 'menu-item-active' : ''"
          @click="$router.push('/NotaFiscalEntrada')"
        >
          <q-item-section avatar>
            <q-icon name="trending_up" size="20px" color="white" />
          </q-item-section>
          <q-item-section class="menu-label">NF Entrada</q-item-section>
        </q-item>

        <q-item
          clickable v-ripple
          class="menu-item b-r-10 q-mb-xs text-white"
          :class="$route.path === '/NotaFiscalSaida' ? 'menu-item-active' : ''"
          @click="$router.push('/NotaFiscalSaida')"
        >
          <q-item-section avatar>
            <q-icon name="trending_down" size="20px" color="white" />
          </q-item-section>
          <q-item-section class="menu-label">NF Saída</q-item-section>
        </q-item>

        <!-- Relatórios -->
        <div class="menu-section-label q-px-sm q-mt-md q-mb-xs">RELATÓRIOS</div>

        <q-item
          clickable v-ripple
          class="menu-item b-r-10 q-mb-xs text-white"
          :class="$route.path === '/RelatorioEstoque' ? 'menu-item-active' : ''"
          @click="$router.push('/RelatorioEstoque')"
        >
          <q-item-section avatar>
            <q-icon name="o_inventory" size="20px" color="white" />
          </q-item-section>
          <q-item-section class="menu-label">Estoque</q-item-section>
        </q-item>

        <q-item
          clickable v-ripple
          class="menu-item b-r-10 q-mb-xs text-white"
          :class="$route.path === '/RelatorioVendas' ? 'menu-item-active' : ''"
          @click="$router.push('/RelatorioVendas')"
        >
          <q-item-section avatar>
            <q-icon name="o_sell" size="20px" color="white" />
          </q-item-section>
          <q-item-section class="menu-label">Vendas</q-item-section>
        </q-item>

        <!-- Outros -->
        <div class="menu-section-label q-px-sm q-mt-md q-mb-xs">OUTROS</div>

        <q-item
          clickable v-ripple
          class="menu-item b-r-10 q-mb-xs text-white"
          :class="$route.path === '/VendaBalcao' ? 'menu-item-active' : ''"
          @click="$router.push('/VendaBalcao')"
        >
          <q-item-section avatar>
            <q-icon name="point_of_sale" size="20px" color="white" />
          </q-item-section>
          <q-item-section class="menu-label">Vendas Balcão</q-item-section>
        </q-item>

        <q-item
          clickable v-ripple
          class="menu-item b-r-10 q-mb-xs text-white"
          :class="$route.path === '/Integracoes' ? 'menu-item-active' : ''"
          @click="$router.push('/Integracoes')"
        >
          <q-item-section avatar>
            <q-icon name="webhook" size="20px" color="white" />
          </q-item-section>
          <q-item-section class="menu-label">Integrações</q-item-section>
        </q-item>

                <q-item
          clickable v-ripple
          class="menu-item b-r-10 q-mb-xs text-white"
          :class="$route.path === '/Agentes' ? 'menu-item-active' : ''"
          @click="$router.push('/Agentes')"
        >
          <q-item-section avatar>
            <q-icon name="support_agent" size="20px" color="white" />
          </q-item-section>
          <q-item-section class="menu-label">Agentes de IA</q-item-section>
        </q-item>

        <q-item
          clickable v-ripple
          class="menu-item b-r-10 q-mb-xs text-white"
          :class="$route.path === '/Whatsapp' ? 'menu-item-active' : ''"
          @click="$router.push('/Whatsapp')"
        >
          <q-item-section avatar>
            <q-icon name="fab fa-whatsapp" size="20px" color="white" />
          </q-item-section>
          <q-item-section class="menu-label">WhatsApp</q-item-section>
        </q-item>

        <q-item
          clickable v-ripple
          class="menu-item b-r-10 q-mb-xs text-white"
          :class="$route.path === '/Ajuda' ? 'menu-item-active' : ''"
          @click="$router.push('/Ajuda')"
        >
          <q-item-section avatar>
            <q-icon name="help_outline" size="20px" color="white" />
          </q-item-section>
          <q-item-section class="menu-label">Ajuda</q-item-section>
        </q-item>

      </q-list>
    </q-scroll-area>

  </div>
</q-drawer>

    <!-- OVERLAY PERFIL -->
    <template v-if="drawerPerfil">
      <div class="fixed-full" style="z-index: 1999; background: transparent" @click="drawerPerfil = false" />
    </template>

    <!-- DRAWER PERFIL -->
    <q-drawer v-model="drawerPerfil" side="right" overlay bordered :width="260" :breakpoint="0" style="z-index: 2000">
      <div class="column full-height">
        <div class="q-pa-lg row items-center q-gutter-md">
          <q-avatar size="48px" color="primary" text-color="white">{{ iniciais }}</q-avatar>
          <div class="column">
            <span class="text-weight-bold" style="font-size: 14px">{{ user }}</span>
            <span class="text-grey-6" style="font-size: 12px">Administrador</span>
          </div>
        </div>
        <q-separator />
        <q-list class="q-pa-sm q-mt-sm">
          <q-item clickable v-ripple class="b-r-8" @click="$router.push('/Perfil'); drawerPerfil = false">
            <q-item-section avatar><q-icon name="business" color="grey-7" size="20px" /></q-item-section>
            <q-item-section><span style="font-size: 13px">Perfil da Empresa</span></q-item-section>
          </q-item>
          <q-item clickable v-ripple class="b-r-8" @click="toggleDark(); drawerPerfil = false">
            <q-item-section avatar><q-icon :name="$q.dark.isActive ? 'light_mode' : 'dark_mode'" color="grey-7" size="20px" /></q-item-section>
            <q-item-section><span style="font-size: 13px">{{ $q.dark.isActive ? 'Modo Claro' : 'Modo Escuro' }}</span></q-item-section>
          </q-item>
          <q-item clickable v-ripple class="b-r-8" @click="$router.push('/Configuracoes'); drawerPerfil = false">
            <q-item-section avatar><q-icon name="settings" color="grey-7" size="20px" /></q-item-section>
            <q-item-section><span style="font-size: 13px">Configurações</span></q-item-section>
          </q-item>
          <q-item clickable v-ripple class="b-r-8" disable>
            <q-item-section avatar><q-icon name="support_agent" color="grey-4" size="20px" /></q-item-section>
            <q-item-section>
              <span style="font-size: 13px" class="text-grey-5">Helpdesk</span>
              <span class="text-caption text-grey-4">Em breve</span>
            </q-item-section>
          </q-item>
        </q-list>
        <q-space />
        <q-separator />
        <q-list class="q-pa-sm">
          <q-item clickable v-ripple class="b-r-8" @click="Sair()">
            <q-item-section avatar><q-icon name="logout" color="negative" size="20px" /></q-item-section>
            <q-item-section><span class="text-negative" style="font-size: 13px">Sair</span></q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <!-- CONTEÚDO -->
<q-page-container>
  <q-page class="bg-accent q-px-lg">
    <transition name="page" mode="out-in">
      <router-view />
    </transition>
  </q-page>
</q-page-container>
    <!-- FOOTER -->
    <q-footer bordered>
      <div class="row justify-center bg-grey-8">
        © 2026 Coden —
        <a href="" style="text-decoration: underline; color: white">Todos os direitos reservados</a>
        | Versão Alpha
      </div>
    </q-footer>

    <!-- ===== CHAT IA FLUTUANTE ===== -->
    <transition name="fade-up">
      <div
        v-if="dialogIA"
        style="
          position: fixed;
          bottom: 120px;
          right: 18px;
          width: 370px;
          max-height: 520px;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          background: white;
          z-index: 3000;
          display: flex;
          flex-direction: column;
        "
      >
        <!-- Header -->
        <div
          class="row items-center justify-between bg-primary q-pa-md"
          style="border-radius: 16px 16px 0 0; flex-shrink: 0"
        >
          <div class="row items-center q-gutter-sm">
            <q-icon name="auto_awesome" color="white" size="20px" />
            <span class="text-white text-weight-bold">Assistente Coden</span>
          </div>
          <q-btn icon="close" flat round dense color="white" @click="dialogIA = false" />
        </div>

        <!-- Mensagens -->
        <div ref="chatBox" style="flex: 1; overflow-y: auto; padding: 16px; max-height: 360px">
          <div v-if="mensagens.length === 0" class="column items-center q-py-lg">
            <q-icon name="auto_awesome" size="48px" color="purple-3" />
            <div class="text-body2 q-mt-md text-center text-grey-7">
              Olá! Sou o assistente do Coden ERP. Como posso ajudar?
            </div>
            <div class="row q-gutter-xs q-mt-md flex-wrap justify-center">
              <q-chip clickable color="primary" text-color="white" size="sm" @click="perguntaRapida('Como cadastrar um produto?')">Cadastrar produto</q-chip>
              <q-chip clickable color="primary" text-color="white" size="sm" @click="perguntaRapida('Como emitir uma NF de saída?')">NF de saída</q-chip>
              <q-chip clickable color="primary" text-color="white" size="sm" @click="perguntaRapida('Como realizar uma venda balcão?')">Venda balcão</q-chip>
<q-chip clickable color="primary" text-color="white" size="sm" @click="perguntaRapida('Gerar relatório de estoque')">📦 Relatório Estoque</q-chip>
<q-chip clickable color="primary" text-color="white" size="sm" @click="perguntaRapida('Gerar relatório de vendas')">💰 Relatório Vendas</q-chip>
<q-chip clickable color="primary" text-color="white" size="sm" @click="perguntaRapida('Nova venda')">🛒 Nova Venda</q-chip>
            </div>
          </div>

          <div v-for="(msg, i) in mensagens" :key="i" class="q-mb-sm">
            <!-- Usuário -->
            <div v-if="msg.tipo === 'user'" class="row justify-end">
              <div style="background: #6c3fc5; color: white; border-radius: 12px 12px 0 12px; padding: 8px 12px; max-width: 80%; font-size: 13px; line-height: 1.4">
                {{ msg.texto }}
              </div>
            </div>
            <!-- IA -->
            <div v-else class="row justify-start items-end q-gutter-xs">
              <q-avatar size="28px" color="primary" text-color="white" icon="auto_awesome" style="flex-shrink: 0" />
              <div style="background: #f3f4f6; border-radius: 12px 12px 12px 0; padding: 8px 12px; max-width: 80%; font-size: 13px; line-height: 1.4">
                {{ msg.texto }}
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="iaCarregando" class="row justify-start items-end q-gutter-xs q-mt-sm">
            <q-avatar size="28px" color="primary" text-color="white" icon="auto_awesome" style="flex-shrink: 0" />
            <div style="background: #f3f4f6; border-radius: 12px; padding: 8px 12px">
              <q-spinner-dots color="primary" size="20px" />
            </div>
          </div>
        </div>

        <!-- Input -->
        <div style="border-top: 1px solid #e5e7eb; padding: 8px; display: flex; gap: 8px; align-items: center; flex-shrink: 0">
          <q-input
            v-model="perguntaAtual"
            placeholder="Digite sua pergunta..."
            outlined
            dense
            style="flex: 1"
            :disable="iaCarregando"
            @keyup.enter="enviarPergunta()"
          />
          <q-btn
            icon="send"
            color="primary"
            round
            unelevated
            size="sm"
            :loading="iaCarregando"
            :disable="!perguntaAtual.trim()"
            @click="enviarPergunta()"
          />
        </div>
      </div>
    </transition>

    <!-- ===== BOTÃO FLUTUANTE IA ===== -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]" style="z-index: 3001">
      <q-btn
        fab
        :icon="dialogIA ? 'close' : 'auto_awesome'"
        :color="dialogIA ? 'grey-7' : 'primary'"
        @click="dialogIA = !dialogIA"
      >
        <q-tooltip>{{ dialogIA ? 'Fechar' : 'Assistente IA' }}</q-tooltip>
      </q-btn>
    </q-page-sticky>

  </q-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class ModuleComponent extends Vue {

  leftDrawerOpen = true
  drawerPerfil = false
  user = ''

  // ===== IA =====
  dialogIA = false
  perguntaAtual = ''
  iaCarregando = false
  mensagens: { tipo: 'user' | 'ia', texto: string }[] = []

  created() {
    const token = localStorage.getItem('token')
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]))
      this.user = payload.nome ?? localStorage.getItem('nomeUsuario') ?? ''
    }
  }

  get iniciais(): string {
    if (!this.user) return '?'
    const partes = this.user.trim().split(' ')
    const primeira = partes[0]?.[0] ?? ''
    const segunda = partes[1]?.[0] ?? ''
    return (primeira + segunda).toUpperCase()
  }

  toggleDark() {
    this.$q.dark.toggle()
  }

  Sair() {
    localStorage.removeItem('token')
    this.$router.push('/login')
  }

  perguntaRapida(texto: string) {
    this.perguntaAtual = texto
    this.enviarPergunta()
  }

async enviarPergunta() {
  if (!this.perguntaAtual.trim()) return

  const pergunta = this.perguntaAtual
  this.perguntaAtual = ''
  this.mensagens.push({ tipo: 'user', texto: pergunta })
  this.iaCarregando = true

  await this.$nextTick()
  const chatBox = this.$refs.chatBox as HTMLElement
  if (chatBox) chatBox.scrollTop = chatBox.scrollHeight

  try {
    const perguntaLower = pergunta.toLowerCase()

    // ===== AÇÕES DO SISTEMA =====

    // Relatório de Estoque
    if (perguntaLower.includes('estoque') && (perguntaLower.includes('relatório') || perguntaLower.includes('relatorio') || perguntaLower.includes('gere') || perguntaLower.includes('gerar'))) {
      this.mensagens.push({ tipo: 'ia', texto: 'Redirecionando para o Relatório de Estoque...' })
      this.dialogIA = false
      await this.$router.push('/RelatorioEstoque')
      // Aguarda a tela carregar e clica no botão
      setTimeout(() => {
        const btn = document.querySelector('[data-gerar-estoque]') as HTMLElement
        if (btn) btn.click()
      }, 800)
      this.iaCarregando = false
      if (chatBox) chatBox.scrollTop = chatBox.scrollHeight
      return
    }

    if (perguntaLower.includes('vendas') && (perguntaLower.includes('relatório') || perguntaLower.includes('relatorio') || perguntaLower.includes('gere') || perguntaLower.includes('gerar'))) {
      this.mensagens.push({ tipo: 'ia', texto: 'Redirecionando para o Relatório de Vendas...' })
      this.dialogIA = false
      await this.$router.push('/RelatorioVendas')
      // Aguarda a tela carregar e clica no botão
      setTimeout(() => {
        const btn = document.querySelector('[data-gerar-vendas]') as HTMLElement
        if (btn) btn.click()
      }, 800)
      this.iaCarregando = false
      if (chatBox) chatBox.scrollTop = chatBox.scrollHeight
      return
    }

// Cadastrar Produto
if ((perguntaLower.includes('cadastrar') || perguntaLower.includes('adicionar')) && perguntaLower.includes('produto')) {
  this.mensagens.push({ tipo: 'ia', texto: '📦 Redirecionando para o Cadastro de Produtos...' })
  await this.$router.push('/CadastroProdutos')
  this.iaCarregando = false
  return
}

// Cadastrar Cliente
if ((perguntaLower.includes('cadastrar') || perguntaLower.includes('adicionar')) && (perguntaLower.includes('cliente') || perguntaLower.includes('pessoa'))) {
  this.mensagens.push({ tipo: 'ia', texto: '👤 Redirecionando para o Cadastro de Pessoas...' })
  await this.$router.push('/CadastroPessoas')
  this.iaCarregando = false
  return
}

// Nova Venda
if (perguntaLower.includes('nova venda') || perguntaLower.includes('realizar venda') || perguntaLower.includes('iniciar venda')) {
  this.mensagens.push({ tipo: 'ia', texto: '🛒 Redirecionando para Vendas Balcão...' })
  await this.$router.push('/VendaBalcao')
  this.iaCarregando = false
  return
}

// NF Entrada
if (perguntaLower.includes('nf entrada') || perguntaLower.includes('nota fiscal entrada')) {
  this.mensagens.push({ tipo: 'ia', texto: '📄 Redirecionando para NF Entrada...' })
  await this.$router.push('/NotaFiscalEntrada')
  this.iaCarregando = false
  return
}

// NF Saída
if (perguntaLower.includes('nf saída') || perguntaLower.includes('nf saida') || perguntaLower.includes('nota fiscal saída')) {
  this.mensagens.push({ tipo: 'ia', texto: '📄 Redirecionando para NF Saída...' })
  await this.$router.push('/NotaFiscalSaida')
  this.iaCarregando = false
  return
}

    // ===== RESPOSTA NORMAL DA IA =====
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente especializado do ERP Coden, sistema de gestão empresarial brasileiro.

SOBRE O SISTEMA:
- Cadastro de Pessoas (clientes PF e PJ)
- Cadastro de Produtos (com grupos, estoque, preço de custo e venda)
- Vendas Balcão (seleciona cliente → adiciona produtos → finaliza com pagamento)
- NF Entrada (cadastra nota fiscal de entrada e produtos automaticamente)
- NF Saída (gerada automaticamente ao finalizar uma venda)
- Relatório de Estoque e Relatório de Vendas
- Formas de pagamento: Dinheiro, Cartão, PIX

COMANDOS QUE ENTENDO:
- "Gerar relatório de estoque" → redireciono para a tela
- "Gerar relatório de vendas" → redireciono para a tela
- "Cadastrar produto" → redireciono para a tela
- "Cadastrar cliente" → redireciono para a tela
- "Nova venda" → redireciono para Vendas Balcão

REGRAS:
- Responda SEMPRE em português brasileiro
- Seja direto e objetivo, máximo 3 parágrafos
- Use emojis para facilitar a leitura`
          },
          {
            role: 'user',
            content: pergunta
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    const data = await response.json()
    const resposta = data.choices[0].message.content
    this.mensagens.push({ tipo: 'ia', texto: resposta })

  } catch {
    this.mensagens.push({ tipo: 'ia', texto: 'Desculpe, ocorreu um erro ao consultar a IA. Tente novamente.' })
  } finally {
    this.iaCarregando = false
    await this.$nextTick()
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight
  }
}
}
</script>

<style>
.b-r-10 { border-radius: 10px; }
.margin-auto { margin-top: auto; }
.q-expansion-item__toggle-icon { color: white; }

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.2s ease;
}
.fade-up-enter,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(80px);
}
.page-enter-active {
  animation: pageIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.page-leave-active {
  animation: pageOut 0.25s cubic-bezier(0.55, 0, 1, 0.45) forwards;
}

@keyframes pageIn {
  0% {
    opacity: 0;
    transform: translateY(12px) scale(0.99);
    filter: blur(4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes pageOut {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-8px) scale(0.99);
    filter: blur(4px);
  }
}
.menu-item {
  color: white;
  min-height: 40px;
  transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.18s ease;
  will-change: transform;
}
.menu-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}
.menu-item:active {
  transform: translateY(1px);
}
.menu-item-active {
  background: rgba(255, 255, 255, 0.22);
  font-weight: 600;
  transform: translateY(0) !important;
}
.menu-footer {
  transition: background 0.18s ease;
}
.menu-footer:hover {
  background: rgba(255, 255, 255, 0.1);
}
.menu-label {
  font-size: 13px;
}
.menu-section-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.45);
}
</style>
