const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexInfo.vue') }
    ]
  },
  {
  path: '/Tabla',
  component: () => import('layouts/MainLayout.vue'),
  children: [
    { path: '', component: () => import('pages/PageTabla.vue') }
    ]
  },
  {
  path: '/Registro',
  component: () => import('layouts/MainLayout.vue'),
  children: [
    { path: '', component: () => import('pages/RegistroUser.vue') }
    ]
  },
  {
  path: '/Login',
  component: () => import('layouts/MainLayout.vue'),
  children: [
    { path: '', component: () => import('pages/LoginUser.vue') }
    ]
  },
  {
    path: '/MenuEmpresa',
  component: () => import('layouts/MainLayout.vue'),
  children: [
    { path: '', component: () => import('pages/MenuEmpresa.vue') }
    ]
  },
  {
    path: '/Menu',
  component: () => import('layouts/MainLayout.vue'),
  children: [
    { path: '', component: () => import('pages/IndexMenu.vue') }
    ]
  },
  {
  path: '/RegistroEmpresa',
  component: () => import('layouts/MainLayout.vue'),
  children: [
    { path: '', component: () => import('pages/RegistroEmpresa.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
