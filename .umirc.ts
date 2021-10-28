import { defineConfig } from 'umi';
import theme from './config/theme';
import routes from './config/routes';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes,
  dynamicImport: {},
  base: '/game-management-frontend',
  publicPath: '/game-management-frontend/',
  theme,
  fastRefresh: {},
  // https://github.com/umijs/umi/issues/6766
  // mfsu: {},
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
    '/intelligent-manager': {
      target: 'https://marketing-dev.yingzhongshare.com',
      changeOrigin: true,
    },
  },
  define: {
    PROCESS_ENV: {
      APP_NAME: '566game',
      APP_CN_NAME: '566 游戏管理平台',
    },
  },
});
