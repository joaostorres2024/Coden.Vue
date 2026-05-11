import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/login',
    component: () => import('pages/Login.vue')
  },
  {
    path: '/adminLogin',
    component: () => import('pages/Admin/AdminLogin.vue')
  },
  {
    path: '/admin',
    component: () => import('layouts/layoutAdmin.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/Admin/Admin.vue') },
      { path: '/AdminUsuario', component: () => import('pages/Admin/AdminUsuario.vue') },
      { path: '/AdminEstabelecimento', component: () => import('pages/Admin/AdminEstabelecimento.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/layoutCoden.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('../pages/Home.vue') },
      { path: 'CadastroPessoas', component: () => import('../pages/Cadastro/CadastroPessoas.vue') },
      { path: 'CadastroProdutos', component: () => import('../pages/Cadastro/CadastroProdutos.vue') },
      { path: 'NotaFiscalEntrada', component: () => import('../pages/Financeiro/NotaFiscalEntrada.vue') },
      { path: 'NotaFiscalSaida', component: () => import('../pages/Financeiro/NotaFiscalSaida.vue') },
      { path: 'RelatorioEstoque', component: () => import('../pages/Relatorios/RelatorioEstoque.vue') },
      { path: 'RelatorioVendas', component: () => import('../pages/Relatorios/RelatorioVendas.vue') },
      { path: 'Integracoes', component: () => import('../pages/Integracoes.vue') },
      { path: 'Whatsapp', component: () => import('../pages/Whatsapp.vue') },
      { path: 'VendaBalcao', component: () => import('../pages/Vendas/VendaBalcao.vue') },
      { path: 'Configuracoes', component: () => import('../pages/Configuracoes.vue') },
      { path: 'Perfil', component: () => import('../pages/Perfil.vue') },
      { path: 'GerenciamentoCaixa', component: () => import('../pages/GerenciamentoCaixa.vue') },
      { path: 'Ajuda', component: () => import('../pages/Ajuda.vue') }
    ]
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
