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
}
