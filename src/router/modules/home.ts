const { VITE_HIDE_HOME } = import.meta.env
const Layout = () => import('@/layout/index.vue')

export default {
  path: '/',
  name: 'Home',
  component: Layout,
  redirect: '/welcome',
  meta: {
    icon: 'ep:home-filled',
    title: '首页',
    i18nKey: 'menus.pureHome',
    rank: 0
  },
  children: [
    {
      path: '/welcome',
      name: 'Welcome',
      component: () => import('@/views/welcome/index.vue'),
      meta: {
        title: '首页',
        i18nKey: 'menus.pureHome',
        showLink: VITE_HIDE_HOME === 'true' ? false : true
      }
    }
  ]
} satisfies RouteConfigsTable
