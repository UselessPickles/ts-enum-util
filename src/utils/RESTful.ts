/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import type { ResponseError, RequestOptionsInit } from 'umi-request';
import { extend } from 'umi-request';
import { message, notification } from 'antd';
import { history } from 'umi';
export type NOTIFY_TYPE = 'FAIL' | 'SUCCESS' | boolean | undefined;

export interface configType {
  REQUEST_URL: string | undefined;
  SECURITY_REQ_URL: string | undefined;
  HOME_NAME: string;
  PROJECT_NAME: string;
  SERVICE: string;
  WITH_OUT_COOKIE: string[];
  NOTIFICATION_KEY: string;
}

export const config: configType = {
  REQUEST_URL: PROCESS_ENV.APP_API_BASE,
  SECURITY_REQ_URL:
    (PROCESS_ENV.APP_API_SECURITY_URL
      ? PROCESS_ENV.APP_API_SECURITY_URL
      : PROCESS_ENV.APP_API_BASE) + PROCESS_ENV.APP_API_SECURITY,
  HOME_NAME: '/',
  PROJECT_NAME: '/commercialize-manager',
  SERVICE: '/commercialize-manager',
  WITH_OUT_COOKIE: ['sidebarStatus'],
  NOTIFICATION_KEY: 'notificationKey',
};

export interface CustomRequestConfig extends RequestOptionsInit {
  fullUrl?: string;
  service?: string;
  api?: string;
  noFormat?: boolean;
  throwErr?: boolean;
  notify?: NOTIFY_TYPE;
}

export type ResponseHandler = (response: any, options?: CustomRequestConfig) => void;

/**
 * 配置request请求时的默认参数
 */
const RESTful = extend({
  errorHandler, // 默认错误处理
  timeout: 0,
  credentials: 'include',
});

const throwKeys: RegExp[] = [/权限标识列表为空/];

function errorHandler(err: ResponseError) {
  if ((err.request as any)?.options?.data?.data?.noError) return;

  if (([true, 'FAIL'] as NOTIFY_TYPE[]).includes(err.request.options?.notify ?? 'FAIL')) {
    if (err.message === 'redirectToLogin') {
      notification.error({
        message: '授权失败',
        description: '登录过期，请重新登录',
        key: config.NOTIFICATION_KEY,
      });
    } else {
      notification.error({
        key: config.NOTIFICATION_KEY,
        message: '请求失败',
        description: err.message,
      });
    }
  }
  if (throwKeys.some((item) => item.test(err.message)) || err?.request?.options?.throwErr) {
    throw new Error(err.message);
  }
}

// token inject
RESTful.interceptors.request.use(
  (url, options) => {
    return {
      url,
      options: {
        ...options,
        headers: {
          ...options.headers,
          token: localStorage.getItem('token') as string,
        },
      },
    };
  },
  { global: false },
);

// url format
RESTful.interceptors.request.use(
  (url, { fullUrl, service, api, ...options }: CustomRequestConfig) => {
    const fullApi =
      fullUrl ?? config.REQUEST_URL + (service ?? config.SERVICE) + '/api/' + (api ?? url);

    if (!fullApi) {
      throw new Error('invalid url');
    }

    return {
      url: fullApi,
      options: {
        ...options,
      },
    };
  },
  { global: false },
);

// body format
RESTful.interceptors.request.use(
  (url, options) => {
    return {
      url,
      options: {
        ...options,
        data: {
          shandle: 0,
          handle: 0,
          data: options.data,
        },
      },
    };
  },
  { global: false },
);

const authHandler: ResponseHandler = (response) => {
  switch (response?.result?.status) {
    case -402: {
      // 删除sessionStorage会触发重新登录
      localStorage.clear();
      history.replace({
        pathname: '/user/login',
        query: {
          authRedirectFrom: location.pathname + location.search,
        },
      });
      try {
        if (window !== window?.top) {
          window?.parent?.location?.reload();
        }
      } catch (e) {
        console.error(e);
      }
      throw new Error('redirectToLogin');
    }
  }
};

const notifyHandler: ResponseHandler = (response, options) => {
  switch (response?.result?.status) {
    case -401:
    case 0: {
      if (([true, 'FAIL'] as NOTIFY_TYPE[]).includes(options?.notify ?? 'FAIL')) {
        throw new Error(response?.result?.msg ?? '网络异常');
      }
      break;
    }
    default: {
      if (([true, 'SUCCESS'] as NOTIFY_TYPE[]).includes(options?.notify)) {
        message.success(response?.data?.msg ?? '操作成功');
      }
      break;
    }
  }
};

// biz preprocess
RESTful.interceptors.response.use(
  async (response, options: CustomRequestConfig) => {
    if (response.ok) {
      if (response?.headers?.get?.('Content-Type')?.includes?.('application/json')) {
        const res = await response?.clone().json();
        authHandler(res);
        notifyHandler(res, options);
      }
      return response;
    }

    throw new Error('网络异常');
  },
  { global: false },
);

export default RESTful;
