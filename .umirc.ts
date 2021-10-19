import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    {
      path: '/gameStore/mgt',
      routes: [
        { path: '/gameStore/mgt/', redirect: '/gameStore/mgt/test' },
        { path: '/gameStore/mgt/:env', component: '@/pages/gameStore/mgt' },
      ],
    },
    { path: '/gameStore/sync', component: '@/pages/gameStore/sync' },
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
