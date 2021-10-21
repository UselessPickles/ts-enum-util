import request from '@/utils/RESTful';

export function queryMenu(): Promise<any> {
  return request('sys/sysmenu/list_for_tree', {
    service: '/yingzhong-security',
    method: 'POST',
    data: {
      id: PROCESS_ENV.APP_API_SUBSYSTEMID,
      area_system_type: 1,
    },
  })?.then((res) => res?.data);
}

export async function accountLogin(params) {
  return request('user/sysUser/login', {
    service: '/yingzhong-security',
    method: 'POST',
    data: params,
  });
}
