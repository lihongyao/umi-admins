import { apiCommon } from '@/api/apiServer';
import Tools from '@likg/tools';
import OSS from 'ali-oss';
import { message } from 'antd';
import COS from 'cos-js-sdk-v5';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
export default class Utils {
  /**
   * 检查权限 -- 功能权限
   * @param code
   * @returns
   */
  public static checkAccessForFunc = (code: string) => {
    const loc = localStorage.getItem('USERINFOS') ?? '{}';
    const access = (JSON.parse(loc).access ?? []) as Array<string>;
    return new Promise((resolve) => {
      if (access.includes(code)) {
        resolve(null);
      } else {
        message.info('抱歉，你无权操作该项');
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
      return CryptoJS.AES.encrypt(word, process.env.SECRET_KEY!).toString();
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
      return CryptoJS.AES.decrypt(word, process.env.SECRET_KEY!).toString(
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
    mode?: 'server' | 'oss' | 'oss_sts' | 'tencent';
    dir?: string;
  }): Promise<string> {
    const { file, mode, dir = '/images' } = options;
    if (mode === 'oss_sts') {
      // 🔥 OSS STS 临时授权上传 -- 上传文件
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
    } else if (mode === 'tencent') {
      // 🔥 腾讯云 COS 上传
      const cos = new COS({});
      return '';
    }
    return '';
  }

  /**
   * 获取新页码
   * 表格删除数据后，重新计算页码
   * @param pageInfo
   * @returns
   */
  public static getNewPage(pageInfo?: {
    pageSize: number;
    total: number;
    current: number;
  }) {
    // -- 获取当前页码和分页信息
    const current = pageInfo?.current || 1;
    const pageSize = pageInfo?.pageSize || 10;
    const total = pageInfo?.total || 0;
    // -- 删除后总数据量
    const newTotal = total - 1;
    // -- 如果当前页没有数据了，将页码-1
    const newPage = Math.max(
      1,
      Math.ceil(newTotal / pageSize) < current ? current - 1 : current,
    );
    // -- 返回新数据
    return newPage;
  }

  /**
   * 格式化时间戳
   * @param {number} timestamp 毫秒级时间戳
   * @returns {string} 格式化后的时间字符串
   */
  public static formatTimestamp(timestamp: number) {
    const today = dayjs().startOf('day'); // 今天零点
    const targetDate = dayjs(timestamp);

    // 判断是否为今天
    if (targetDate.isSame(today, 'day')) {
      return `今天 ${targetDate.format('HH:mm:ss')}`;
    } else {
      return targetDate.format('YYYY-MM-DD HH:mm:ss');
    }
  }

  /**
   * 格式化时间戳为时分秒
   * @param totalSeconds
   * @returns
   */
  public static formatSecondsToHMS(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // 按需拼接时间单位
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || hours > 0) parts.push(`${minutes}m`); // 若有小时，则显示分钟（即使为0）
    parts.push(`${seconds}s`); // 始终显示秒

    return parts.join('，');
  }
}
