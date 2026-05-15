<template>
  <div class="q-pa-md">

    <!-- Cabeçalho -->
    <div class="text-bold text-black row items-center" style="font-size: 32px">
      <q-icon name="dashboard" class="q-mr-md" size="32px" />Dashboard
    </div>
    <p class="text-grey-7 text-body2 q-mb-md">
      Acompanhe em tempo real as principais métricas do sistema — vendas, faturamento, estoque e clientes ativos.
    </p>
    <q-separator class="q-mb-lg" />

    <!-- Saudação -->
    <div class="text-h6 text-bold q-mb-lg">Bem-vindo, <span class="text-primary">{{ user }} 👋</span></div>

    <!-- Cards de Resumo -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="b-r-10 q-pa-md">
          <div class="row items-center justify-between">
            <div>
              <div class="text-caption text-grey-6">Vendas Hoje</div>
              <div class="text-h5 text-bold text-black q-mt-xs">{{ resumo.vendasHoje }}</div>
            </div>
            <q-icon name="point_of_sale" size="40px" color="primary" style="opacity: 0.2" />
          </div>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="b-r-10 q-pa-md">
          <div class="row items-center justify-between">
            <div>
              <div class="text-caption text-grey-6">Faturamento Hoje</div>
              <div class="text-h6 text-bold text-black q-mt-xs">{{ resumo.faturamentoHoje }}</div>
            </div>
            <q-icon name="attach_money" size="40px" color="positive" style="opacity: 0.2" />
          </div>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="b-r-10 q-pa-md">
          <div class="row items-center justify-between">
            <div>
              <div class="text-caption text-grey-6">Estoque Baixo</div>
              <div class="text-h5 text-bold text-black q-mt-xs">{{ resumo.estoqueBaixo }}</div>
            </div>
            <q-icon name="inventory_2" size="40px" color="warning" style="opacity: 0.2" />
          </div>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="b-r-10 q-pa-md">
          <div class="row items-center justify-between">
            <div>
              <div class="text-caption text-grey-6">Clientes Ativos</div>
              <div class="text-h5 text-bold text-black q-mt-xs">{{ resumo.clientesAtivos }}</div>
            </div>
            <q-icon name="groups" size="40px" color="primary" style="opacity: 0.2" />
          </div>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">

      <!-- Vendas por UF -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="b-r-10">
          <q-card-section class="q-pb-none">
            <div class="text-subtitle1 text-weight-bold">Vendas por UF</div>
            <div class="text-caption text-grey-6">Passe o mouse sobre o estado para ver os detalhes</div>
          </q-card-section>
          <q-card-section>
            <div style="position: relative">
              <svg
                viewBox="0 0 800 900"
                style="width: 100%; height: auto"
                @mouseleave="tooltip.visible = false"
              >
                <g v-for="estado in estados" :key="estado.uf">
                  <path
                    :d="estado.path"
                    :fill="corEstado(estado.uf)"
                    stroke="white"
                    stroke-width="1.5"
                    style="cursor: pointer; transition: opacity 0.2s"
                    @mouseenter="mostrarTooltip($event, estado)"
                    @mouseleave="tooltip.visible = false"
                  />
                  <text
                    :x="estado.cx"
                    :y="estado.cy"
                    text-anchor="middle"
                    font-size="9"
                    font-weight="bold"
                    fill="white"
                    style="pointer-events: none; user-select: none"
                  >
                    {{ estado.uf }}
                  </text>
                </g>
              </svg>

              <!-- Tooltip -->
              <div
                v-if="tooltip.visible"
                :style="`position: absolute; top: ${tooltip.y}px; left: ${tooltip.x}px; transform: translate(-50%, -110%); pointer-events: none; z-index: 100`"
                style="background: rgba(0,0,0,0.85); color: white; border-radius: 8px; padding: 8px 12px; font-size: 12px; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.3)"
              >
                <div class="text-weight-bold" style="font-size: 14px">{{ tooltip.uf }}</div>
                <div>Vendas: <strong>{{ tooltip.totalVendas }}</strong></div>
                <div>Total: <strong>{{ tooltip.valorTotal }}</strong></div>
              </div>

              <!-- Legenda -->
              <div class="row items-center q-gutter-sm q-mt-sm justify-center">
                <div class="row items-center q-gutter-xs">
                  <div style="width: 12px; height: 12px; border-radius: 2px; background: #e3f2fd" />
                  <span class="text-caption text-grey-6">Sem vendas</span>
                </div>
                <div class="row items-center q-gutter-xs">
                  <div style="width: 12px; height: 12px; border-radius: 2px; background: #90caf9" />
                  <span class="text-caption text-grey-6">Baixo</span>
                </div>
                <div class="row items-center q-gutter-xs">
                  <div style="width: 12px; height: 12px; border-radius: 2px; background: #1565c0" />
                  <span class="text-caption text-grey-6">Alto</span>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Últimas Vendas -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="b-r-10">
          <q-card-section class="q-pb-none">
            <div class="text-subtitle1 text-weight-bold">Últimas Vendas</div>
            <div class="text-caption text-grey-6">Vendas mais recentes</div>
          </q-card-section>
          <q-card-section class="q-pt-sm">
            <div v-if="ultimasVendas.length === 0" class="column items-center q-py-xl text-grey-5">
              <q-icon name="receipt_long" size="48px" />
              <div class="q-mt-sm">Nenhuma venda encontrada</div>
            </div>
            <q-list separator v-else>
              <q-item v-for="venda in ultimasVendas" :key="venda.id" class="q-px-none">
                <q-item-section avatar>
                  <q-avatar :color="corPagamento(venda.forma_pagamento)" text-color="white" size="36px" icon="receipt" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-medium">{{ venda.nome_cliente || 'Consumidor Final' }}</q-item-label>
                  <q-item-label caption>{{ formatarData(venda.data) }} — {{ labelPagamento(venda.forma_pagamento) }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <span class="text-weight-bold text-positive">{{ formatarReais(venda.total) }}</span>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Produtos com Estoque Baixo -->
    <q-card flat bordered class="b-r-10">
      <q-card-section class="q-pb-none">
        <div class="row items-center justify-between">
          <div>
            <div class="text-subtitle1 text-weight-bold">⚠️ Produtos com Estoque Baixo</div>
            <div class="text-caption text-grey-6">Produtos abaixo do estoque mínimo</div>
          </div>
          <q-btn label="Ver Relatório" icon="inventory" flat color="primary" @click="$router.push('/RelatorioEstoque')" />
        </div>
      </q-card-section>
      <q-card-section>
        <div v-if="produtosBaixos.length === 0" class="column items-center q-py-md text-grey-5">
          <q-icon name="check_circle" size="40px" color="positive" />
          <div class="q-mt-sm text-positive">Todos os produtos estão com estoque adequado!</div>
        </div>
        <q-table
          v-else
          :data="produtosBaixos"
          :columns="colunasBaixo"
          flat hide-bottom dense
          :rows-per-page-options="[5]"
        >
          <template v-slot:body-cell-situacao="props">
            <q-td align="center">
              <q-badge :color="props.row.estoque_atual === 0 ? 'negative' : 'warning'">
                {{ props.row.estoque_atual === 0 ? 'Zerado' : 'Baixo' }}
              </q-badge>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import api from '../services/api'

@Component
export default class HomeComponent extends Vue {

  carregando = false
  vendasUF: any[] = []
  ultimasVendas: any[] = []
  produtosBaixos: any[] = []
  user = ''

  resumo = {
    vendasHoje: 0,
    faturamentoHoje: 'R$ 0,00',
    estoqueBaixo: 0,
    clientesAtivos: 0
  }

  cores = ['primary', 'positive', 'warning', 'negative', 'teal', 'purple', 'orange', 'blue']

  colunasBaixo = [
    { name: 'codigo_produto', label: 'Código', field: 'codigo_produto', align: 'left' },
    { name: 'nome_produto', label: 'Produto', field: 'nome_produto', align: 'left' },
    { name: 'estoque_atual', label: 'Estoque Atual', field: 'estoque_atual', align: 'center' },
    { name: 'estoque_minimo', label: 'Estoque Mínimo', field: 'estoque_minimo', align: 'center' },
    { name: 'situacao', label: 'Situação', field: 'situacao', align: 'center' }
  ]

  async created() {
    const token = localStorage.getItem('token')
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]))
      this.user = payload.nome ?? ''
    }
    await this.carregarDados()
  }

  async carregarDados() {
    this.carregando = true
    try {
      await Promise.all([
        this.carregarVendasUF(),
        this.carregarUltimasVendas(),
        this.carregarEstoqueBaixo(),
        this.carregarResumo()
      ])
    } finally {
      this.carregando = false
    }
  }

  async carregarVendasUF() {
    try {
      const result = await api.get('/api/vendas/dashboard/uf')
      this.vendasUF = result.data
    } catch { /* ignora */ }
  }

  async carregarUltimasVendas() {
    try {
      const result = await api.get('/api/vendas/relatorio')
      this.ultimasVendas = result.data.slice(0, 5)
    } catch { /* ignora */ }
  }

  async carregarEstoqueBaixo() {
    try {
      const result = await api.get('/api/products/relatorio/estoque')
      const produtos = result.data
      this.produtosBaixos = produtos.filter((p: any) => {
        const estoque = Number(p.estoque_atual)
        const minimo = Number(p.estoque_minimo)
        return estoque <= minimo
      }).slice(0, 5)
      this.resumo.estoqueBaixo = this.produtosBaixos.length
    } catch { /* ignora */ }
  }

  async carregarResumo() {
    try {
      const hoje = new Date().toISOString().split('T')[0]
      const result = await api.get(`/api/vendas/relatorio?de=${hoje}&ate=${hoje}`)
      const vendas = result.data
      this.resumo.vendasHoje = vendas.length
      const total = vendas.reduce((acc: number, v: any) => acc + parseFloat(v.total || 0), 0)
      this.resumo.faturamentoHoje = this.formatarReais(total)

      const clientes = await api.get('/api/clientes')
      this.resumo.clientesAtivos = clientes.data.filter((c: any) => c.status === 'Ativo').length
    } catch { /* ignora */ }
  }

  labelPagamento(forma: string): string {
    const mapa: Record<string, string> = { pix: 'PIX', cartao: 'Cartão', dinheiro: 'Dinheiro' }
    return mapa[forma?.toLowerCase()] || forma || '-'
  }

  corPagamento(forma: string): string {
    const mapa: Record<string, string> = { pix: 'teal', cartao: 'blue', dinheiro: 'green' }
    return mapa[forma?.toLowerCase()] || 'grey'
  }

  formatarReais(valor: any): string {
    const numero = typeof valor === 'string' ? parseFloat(valor) : Number(valor)
    if (isNaN(numero)) return 'R$ 0,00'
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  formatarData(data: any): string {
    if (!data) return '-'
    return new Date(data).toLocaleDateString('pt-BR')
  }

  tooltip = {
  visible: false,
  x: 0,
  y: 0,
  uf: '',
  totalVendas: 0,
  valorTotal: ''
}

estados = [
  { uf: 'AC', cx: 95, cy: 410, path: 'M 90 390 L 60 400 L 55 420 L 80 435 L 110 430 L 125 415 L 110 395 Z' },
  { uf: 'AL', cx: 620, cy: 385, path: 'M 605 375 L 595 385 L 600 400 L 620 405 L 635 395 L 630 378 Z' },
  { uf: 'AM', cx: 195, cy: 310, path: 'M 110 240 L 90 270 L 95 310 L 120 340 L 150 360 L 185 370 L 220 365 L 260 350 L 280 320 L 275 285 L 250 260 L 220 245 L 185 235 L 155 240 Z' },
  { uf: 'AP', cx: 280, cy: 165, path: 'M 255 140 L 240 160 L 250 185 L 270 195 L 295 188 L 305 168 L 292 148 Z' },
  { uf: 'BA', cx: 555, cy: 440, path: 'M 480 370 L 460 390 L 455 420 L 460 455 L 475 490 L 500 510 L 535 515 L 570 510 L 600 490 L 615 460 L 610 425 L 590 400 L 565 385 L 540 375 Z' },
  { uf: 'CE', cx: 590, cy: 325, path: 'M 555 305 L 540 320 L 545 340 L 565 352 L 590 350 L 615 338 L 618 318 L 600 305 Z' },
  { uf: 'DF', cx: 490, cy: 468, path: 'M 482 462 L 478 470 L 486 476 L 494 472 L 494 463 Z' },
  { uf: 'ES', cx: 610, cy: 530, path: 'M 596 515 L 588 528 L 593 545 L 610 550 L 624 540 L 622 522 Z' },
  { uf: 'GO', cx: 490, cy: 490, path: 'M 450 455 L 435 475 L 438 505 L 458 525 L 485 530 L 512 520 L 525 498 L 520 470 L 500 455 Z' },
  { uf: 'MA', cx: 480, cy: 295, path: 'M 430 268 L 410 285 L 415 310 L 435 328 L 465 330 L 495 318 L 505 295 L 490 272 L 462 262 Z' },
  { uf: 'MG', cx: 545, cy: 510, path: 'M 490 475 L 470 495 L 472 525 L 490 548 L 520 560 L 555 558 L 585 545 L 600 520 L 595 493 L 572 475 L 545 468 L 515 470 Z' },
  { uf: 'MS', cx: 415, cy: 565, path: 'M 365 535 L 348 558 L 355 588 L 378 608 L 410 612 L 440 600 L 455 575 L 448 548 L 425 532 Z' },
  { uf: 'MT', cx: 360, cy: 450, path: 'M 290 395 L 268 420 L 270 460 L 290 495 L 325 515 L 365 518 L 400 505 L 420 478 L 415 442 L 390 415 L 355 400 L 320 395 Z' },
  { uf: 'PA', cx: 340, cy: 270, path: 'M 240 200 L 215 225 L 215 260 L 230 295 L 265 315 L 305 325 L 345 318 L 380 300 L 400 270 L 395 238 L 370 215 L 335 205 L 300 205 Z' },
  { uf: 'PB', cx: 625, cy: 355, path: 'M 608 345 L 598 355 L 603 368 L 620 372 L 638 363 L 638 348 Z' },
  { uf: 'PE', cx: 600, cy: 370, path: 'M 558 360 L 542 370 L 546 385 L 568 392 L 598 390 L 618 378 L 614 362 L 592 355 Z' },
  { uf: 'PI', cx: 530, cy: 318, path: 'M 495 290 L 478 308 L 480 332 L 500 350 L 528 352 L 550 338 L 552 312 L 532 292 Z' },
  { uf: 'PR', cx: 435, cy: 638, path: 'M 388 615 L 370 632 L 375 655 L 398 668 L 428 668 L 455 652 L 458 628 L 438 612 Z' },
  { uf: 'RJ', cx: 590, cy: 562, path: 'M 568 550 L 558 562 L 565 575 L 582 580 L 600 572 L 603 557 L 588 548 Z' },
  { uf: 'RN', cx: 635, cy: 335, path: 'M 618 320 L 608 332 L 612 348 L 630 353 L 648 342 L 645 325 Z' },
  { uf: 'RO', cx: 200, cy: 408, path: 'M 165 385 L 148 402 L 152 425 L 175 438 L 205 435 L 222 418 L 218 395 L 195 382 Z' },
  { uf: 'RR', cx: 195, cy: 185, path: 'M 168 158 L 152 178 L 158 205 L 182 218 L 210 212 L 222 190 L 212 165 L 190 155 Z' },
  { uf: 'RS', cx: 400, cy: 730, path: 'M 350 695 L 330 718 L 335 748 L 360 768 L 395 770 L 425 752 L 435 722 L 418 698 L 388 685 Z' },
  { uf: 'SC', cx: 435, cy: 685, path: 'M 390 672 L 375 685 L 382 700 L 405 708 L 432 705 L 450 690 L 445 675 L 420 668 Z' },
  { uf: 'SE', cx: 625, cy: 415, path: 'M 610 404 L 602 415 L 608 428 L 625 432 L 638 422 L 635 408 Z' },
  { uf: 'SP', cx: 490, cy: 600, path: 'M 440 570 L 420 590 L 425 618 L 450 635 L 485 635 L 515 618 L 518 590 L 498 570 L 468 565 Z' },
  { uf: 'TO', cx: 448, cy: 378, path: 'M 415 340 L 398 360 L 400 390 L 420 415 L 450 420 L 475 405 L 478 375 L 458 350 L 432 338 Z' }
]

corEstado(uf: string): string {
  const venda = this.vendasUF.find((v: any) => v.uf === uf)
  if (!venda) return '#e3f2fd'

  const max = this.vendasUF[0]?.total_vendas || 1
  const ratio = venda.total_vendas / max

  if (ratio > 0.7) return '#1565c0'
  if (ratio > 0.4) return '#1976d2'
  if (ratio > 0.2) return '#42a5f5'
  return '#90caf9'
}

mostrarTooltip(event: MouseEvent, estado: any) {
  const svg = (event.target as SVGElement).closest('svg')
  if (!svg) return
  const rect = svg.getBoundingClientRect()
  const parentRect = (svg.parentElement as HTMLElement).getBoundingClientRect()

  const venda = this.vendasUF.find((v: any) => v.uf === estado.uf)

  this.tooltip = {
    visible: true,
    x: event.clientX - parentRect.left,
    y: event.clientY - parentRect.top,
    uf: estado.uf,
    totalVendas: venda?.total_vendas || 0,
    valorTotal: this.formatarReais(venda?.valor_total || 0)
  }
}
}
</script>

<style scoped>
.b-r-10 { border-radius: 10px; }
.border { border: 1px solid #ccc; }
</style>
