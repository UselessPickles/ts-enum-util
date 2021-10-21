import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/login', component: '@/pages/Login' },
    { path: '/', redirect: '/home', exact: true },
    // { path: '/home', redirect: '/recommand/type', exact: true },
    // {
    //   path: '/recommand/type',
    //   component: '@/pages/RecommandMananger/TypeMananger'
    // },
    {
      path: '/',
      component: '@/layouts/BasicLayout',
      routes: [
        { path: '/home', component: '@/pages/Home', wrappers: ['@/pages/Authroized'] },
        { path: '/other', component: '@/pages/Other', wrappers: ['@/pages/Authroized'] },
        {
          path: '/recommand/type',
          component: '@/pages/RecommandMananger/TypeMananger',
          wrappers: ['@/pages/Authroized'],
        },
      ],
    },
  ],
  fastRefresh: {},
  // 不用dva
  dva: false,
  proxy: {
    '/utils_service': {
      target: 'https://marketing-dev.yingzhongshare.com',
      changeOrigin: true,
    },
    '/commercialize-manager': {
      target: 'https://marketing-dev.yingzhongshare.com',
      changeOrigin: true,
      pathRewrite: {
        '/commercialize-manager': '',
      },
    },
  },
});
