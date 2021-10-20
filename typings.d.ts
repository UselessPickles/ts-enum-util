declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;
  const url: string;
  export default url;
}

interface PROCESS_ENV_IN {
  APP_API_BASE: string;
  APP_API_BASE_URL: string;
  APP_API_SECURITY: string;
  APP_API_SECURITY_URL: string;
  APP_API_SUBSYSTEMID: number;
  NODE_ENV: string;
  APP_NAME: string;
}

declare let PROCESS_ENV: PROCESS_ENV_IN;
