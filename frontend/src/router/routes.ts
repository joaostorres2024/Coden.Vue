import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/layoutCoden.vue'),
    children: [
      {
        path: 'CadastroPessoas',
        component: () => import('../pages/Cadastro/CadastroPessoas.vue')
      }
    ]
  },

  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
