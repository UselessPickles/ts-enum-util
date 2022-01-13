import { defineConfig } from 'umi';
import theme from './config/theme';
import routes from './config/routes';
import localENV from './.umirc.local.ts';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes,
  dynamicImport: {},
  base: process.env.NODE_ENV == 'development' ? '/' : '/game-management-frontend',
  publicPath: process.env.NODE_ENV == 'development' ? '/' : '/game-management-frontend/',
  theme,
  fastRefresh: {},
  // https://github.com/umijs/umi/issues/6766
  // mfsu: {},
  // 不用dva
  dva: false,
  proxy: {
    '/utils_service': {
      target: localENV.define.PROCESS_ENV.APP_API_BASE_URL,
      changeOrigin: true,
    },
    '/commercialize-manager': {
      target: localENV.define.PROCESS_ENV.APP_API_BASE_URL,
      changeOrigin: true,
      pathRewrite: {
        '/commercialize-manager': '',
      },
    },
    '/intelligent-manager': {
      target: localENV.define.PROCESS_ENV.APP_API_BASE_URL,
      changeOrigin: true,
    },
  },
  define: {
    PROCESS_ENV: {
      APP_NAME: '566game',
      APP_CN_NAME: '566 游戏管理平台',
    },
  },
  externals: {
    xlsx: 'window.XLSX',
  },
  scripts: ['https://unpkg.com/xlsx@0.17.5/dist/xlsx.full.min.js'],
});
