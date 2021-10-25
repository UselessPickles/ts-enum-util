// 本地环境-测试服务器
// module.exports = {
//   define: {
//     PROCESS_ENV: {
//       APP_API_BASE: '/five_six_six_manager',
//       APP_API_BASE_URL: 'https://test.yingzhongshare.com',
//       // APP_API_BASE_URL: "http://192.168.35.138:8080",
//       APP_API_SECURITY: '/yingzhong-security',
//       APP_API_SECURITY_URL: 'https://test.yingzhongshare.com',
//       APP_API_SUBSYSTEMID: 1153,
//       NODE_ENV: 'development',
//     },
//   },
// };

// 本地环境-开发服务器
module.exports = {
  define: {
    PROCESS_ENV: {
      APP_API_BASE: '/five_six_six_manager',
      APP_API_BASE_URL: 'http://marketing-dev.yingzhongshare.com',
      // APP_API_BASE_URL: "http://192.168.35.138:8080",
      APP_API_SECURITY: '/yingzhong-security',
      APP_API_SECURITY_URL: 'http://marketing-dev.yingzhongshare.com',
      APP_API_SUBSYSTEMID: 1153,
      NODE_ENV: 'development',
    },
  },
};
