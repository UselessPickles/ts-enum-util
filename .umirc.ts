import { defineConfig } from 'umi';
import theme from './config/theme';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/user',
      component: '@/layouts/UserLayout',
      routes: [{ path: '/user/login', component: '@/pages/User/Login' }],
    },
    // { path: '/user/login', component: '@/pages/User/Login' },
    { path: '/', redirect: '/home', exact: true },
    {
      path: '/',
      component: '@/layouts/BasicLayout',
      routes: [
        { path: '/home', component: '@/pages/Home', wrappers: ['@/pages/Authorized'] },
        { path: '/other', component: '@/pages/Other', wrappers: ['@/pages/Authorized'] },

        {
          path: '/gameStore/mgt',
          routes: [
            { path: '/gameStore/mgt/', redirect: '/gameStore/mgt/test' },
            { path: '/gameStore/mgt/:env', component: '@/pages/gameStore/mgt' },
          ],
        },
      ],
    },
  ],
  theme,
  fastRefresh: {},
  // 不用dva
  dva: false,
  proxy: {
    '/utils_service': {
      target: 'https://test.yingzhongshare.com',
      changeOrigin: true,
    },
    '/commercialize-manager': {
      target: 'https://test.yingzhongshare.com',
      changeOrigin: true,
      pathRewrite: {
        '/commercialize-manager': '',
      },
    },
    '/intelligent-manager': {
      target: 'https://test.yingzhongshare.com',
      changeOrigin: true,
    },
  },
  define: {
    PROCESS_ENV: {
      APP_NAME: '566game',
    },
  },
});
