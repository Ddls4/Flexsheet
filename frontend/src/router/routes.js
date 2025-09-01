const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexInfo.vue') }
    ]
  },
  {
  path: '/tabla',
  component: () => import('layouts/MainLayout.vue'),
  children: [
    { path: '', component: () => import('pages/PageTabla.vue') }
    ]
  },
  {
  path: '/registro',
  component: () => import('layouts/MainLayout.vue'),
  children: [
    { path: '', component: () => import('pages/RegistroUser.vue') }
    ]
  },
  {
  path: '/login',
  component: () => import('layouts/MainLayout.vue'),
  children: [
    { path: '', component: () => import('pages/LoginUser.vue') }
    ]
  },
  {
    path: '/1',
  component: () => import('layouts/MainLayout.vue'),
  children: [
    { path: '', component: () => import('pages/IndexInfo.vue') }
    ]
  },
  {
    path: '/Menu',
  component: () => import('layouts/MainLayout.vue'),
  children: [
    { path: '', component: () => import('pages/IndexMenu.vue') }
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
