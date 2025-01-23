const Layout = () => import('@/layout/index.vue')

export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      i18nKey: 'menus.pureLogin',
      showLink: false,
      rank: 101
    }
  },
  {
    path: '/redirect',
    component: Layout,
    meta: {
      title: '加载中…',
      i18nKey: 'status.pureLoad',
      showLink: false,
      rank: 102
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/layout/redirect.vue')
      }
    ]
  }
] satisfies Array<RouteConfigsTable>
