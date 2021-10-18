import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/basis', component: '@/pages/basis' },
  ],
  fastRefresh: {},
  // 不用dva
  dva: false,
});
