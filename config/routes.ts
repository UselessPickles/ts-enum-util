export default [
  {
    path: '/',
    component: '@/layouts/GlobalLayout',
    routes: [
      { path: '/', redirect: '/home', exact: true },
      {
        path: '/user',
        routes: [{ path: '/user/login', component: '@/pages/User/Login' }],
      },
      {
        path: '/',
        component: '@/layouts/BasicLayout',
        wrappers: ['@/pages/Authorized'],
        routes: [
          { path: '/home', component: '@/pages/Home' },
          { path: '/other', component: '@/pages/Other' },
          {
            path: '/RecommandMananger',
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
              { path: '/gameStore/mgt/:env', component: '@/pages/gameStore/mgt' },
            ],
          },
          { path: '/lab', component: '@/pages/lab' },
          {
            path: '/autoTesting',
            routes: [{ path: '/autoTesting', component: '@/pages/autoTesting' }],
          },
        ],
      },
    ],
  },
];
