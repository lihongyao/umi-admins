import { apiCommon } from '@/api/apiServer';
import Tools from '@likg/tools';
import OSS from 'ali-oss';
import { message } from 'antd';
import CryptoJS from 'crypto-js';

export default class Utils {
  /**
   * 检查权限 -- 功能权限
   * @param code
   * @returns
   */
  public static checkAccessForFunc = (code: string) => {
    const loc = localStorage.getItem('USERINFOs') ?? '{}';
    const access = (JSON.parse(loc).access ?? []) as Array<string>;
    return new Promise((resolve) => {
      if (access.includes(code)) {
        resolve(null);
      } else {
        message.info('您当前没有权限哟~');
      }
    });
  };

  /**
   * 加密
   * @param word
   * @returns
   */
  public static encrypt = (word: string) => {
    try {
      return CryptoJS.AES.encrypt(word, process.env.SECRET_KEY).toString();
    } catch {
      return null;
    }
  };

  /**
   * 解密
   * @param word
   * @returns
   */
  public static decrypt = (word: string) => {
    try {
      return CryptoJS.AES.decrypt(word, process.env.SECRET_KEY).toString(
        CryptoJS.enc.Utf8,
      );
    } catch (error) {
      return null;
    }
  };

  /**
   * md5 加密
   * @param word
   * @returns
   */
  public static md5 = (word: string) => {
    return CryptoJS.MD5(word).toString();
  };

  /**
   * 文件上传
   * @param options
   * @param options.file 上传文件
   * @param options.mode 上传模式
   * @param options.dir 文件目录，默认为 /images
   * @returns
   */
  public static async upload(options: {
    file: File;
    mode?: 'server' | 'oss' | 'oss_sts';
    dir?: string;
  }): Promise<string> {
    const { file, mode, dir = '/images' } = options;
    if (mode === 'oss_sts') {
      // -- 获取配置项
      const resp = await apiCommon.getOssStsConfigs();
      // -- 异常处理
      if (resp.code !== 200) return '';
      // -- 构建 ali-oss
      const client = new OSS({
        bucket: resp.data.bucket,
        region: resp.data.region,
        endpoint: resp.data.endpoint,
        accessKeyId: resp.data.accessKeyId,
        accessKeySecret: resp.data.accessKeySecret,
        stsToken: resp.data.stsToken,
      });
      // -- 构建 key
      const key = Tools.getFilePath(file, `${resp.data.dir}${dir}`);
      const data = await client?.put(key, file);

      if (data.res.status !== 200) return '';
      return data.url;
    }
    return '';
  }
}
