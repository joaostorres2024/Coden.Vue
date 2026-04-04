import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/login',
    component: () => import('pages/Login.vue')
  },
  {
    path: '/',
    component: () => import('layouts/layoutCoden.vue'),
    children: [
      {
        path: 'CadastroPessoas',
        component: () => import('../pages/Cadastro/CadastroPessoas.vue')
      },
      {
        path: 'CadastroProdutos',
        component: () => import('../pages/Cadastro/CadastroProdutos.vue')
      },
      {
        path: 'NotaFiscalEntrada',
        component: () => import('../pages/Financeiro/NotaFiscalEntrada.vue')
      },
      {
        path: 'NotaFiscalSaida',
        component: () => import('../pages/Financeiro/NotaFiscalSaida.vue')
      },
      {
        path: 'RelatorioEstoque',
        component: () => import('../pages/Relatorios/RelatorioEstoque.vue')
      },
      {
        path: 'RelatorioVendas',
        component: () => import('../pages/Relatorios/RelatorioVendas.vue')
      },
      {
        path: 'RelatorioCompras',
        component: () => import('../pages/Relatorios/RelatorioCompras.vue')
      },
      {
        path: 'VendaBalcao',
        component: () => import('../pages/Vendas/VendaBalcao.vue')
      },
      {
        path: 'NotaFiscalVenda',
        component: () => import('../pages/Vendas/NotaFiscalVenda.vue')
      },
      {
        path: 'Configuracoes',
        component: () => import('../pages/Configuracoes.vue')
      },
      {
        path: 'Perfil',
        component: () => import('../pages/Perfil.vue')
      }
    ]
  },

  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
