export default [
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
      { path: '/', redirect: '/home', exact: true },
      { path: '/user/login', component: '@/pages/User/Login' },
      {
        path: '/',
        component: '@/layouts/BasicLayout',
        wrappers: ['@/pages/Authorized'],
        routes: [
          { path: '/RecommazndMananger', redirect: '/RecommandMananger/TypeMananger' },
          {
            path: '/RecommandMananger/TypeMananger',
            component: '@/pages/RecommandMananger/TypeMananger',
          },
          {
            path: '/RecommandMananger/homeManager',
            component: '@/pages/RecommandMananger/homeManager',
          },
        ],
      },
      {
        path: '/gameStore/mgt',
        routes: [
          { path: '/gameStore/mgt/', redirect: '/gameStore/mgt/test' },
          { path: '/gameStore/mgt/:env', component: '@/pages/GameStore/mgt' },
        ],
      },
      {
        path: '/hot-words',
        component: '@/pages/HotWords',
      },
      { path: '/lab', component: '@/pages/Lab' },
    ],
  },
];
