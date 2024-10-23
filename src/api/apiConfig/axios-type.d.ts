import 'axios';

declare module 'axios' {
  export interface AxiosResult<T = any> {
    /** 状态码 */
    code: number;
    /** 响应数据 */
    data: T;
    /** 提示信息 */
    msg: string;
  }
}
