declare namespace API {
  // ~~~~~~~~~~~~~~~~~~
  // 分页列表
  // ~~~~~~~~~~~~~~~~~~
  interface List<T> {
    /** 列表数据 */
    data: T[];
    /** 当前页 */
    current: number;
    /** 每页条数 */
    pageSize: number;
    /** 总条数 */
    total: number;
  }
  // ~~~~~~~~~~~~~~~~~~
  // 阿里云储存
  // ~~~~~~~~~~~~~~~~~~
  type OSSConfigProps = {
    dir: string;
    expire: string;
    host: string;
    accessKeyId: string;
    policy: string;
    signature: string;
  };
  type OSSSTSConfigProps = {
    accessKeyId: string;
    accessKeySecret: string;
    bucket: string;
    endpoint: string;
    expiration: string;
    folder_path: string;
    policy: string;
    region: string;
    securityToken: string;
  };

  // ~~~~~~~~~~~~~~~~~~
  // 登录相关
  // ~~~~~~~~~~~~~~~~~~
  type LoginWithAccount = {
    /** 用户名 */
    username: string;
    /** 用户密码 */
    password: string;
  };

  type LoginResult = {
    /** token */
    token: string;
    /** 权限列表 */
    access: Array<string>;
    /** 用户昵称 */
    nickname: string;
    /** 用户头像 */
    avatar: string;
  };
  // ~~~~~~~~~~~~~~~~~~
  // 轮播广告
  // ~~~~~~~~~~~~~~~~~~
  type BannerItemProps = {
    /** ID */
    id: string;
    /** 启用/禁用状态 */
    state: number;
    /** 轮播图片链接 */
    bannerPic: string;
    /** 权重 */
    weight: string;
    /** 跳转链接 */
    jumpUrl: string;
    start: string;
    /** 展示开始时间 */
    end: string /** 展示结束时间 */;
    /** 展示位置编码 */
    locationCode: string;
  };
  type BannerLocationProps = {
    locationCode: string;
    locationName: string;
  };
  // ~~~~~~~~~~~~~~~~~~
  // 系统管理
  // ~~~~~~~~~~~~~~~~~~
  type SystemsAccessProps = {
    /** 权限ID */
    id: number;
    /** 父级权限ID */
    parentId?: string;
    /** 权限代码 */
    code: string;
    /** 权限名称 */
    name: string;
    /** 深度 */
    depth: number;
    /** 子集权限 */
    children?: Array<SystemsAccessProps>;
  };
  type SystemRoleProps = {
    id: string;
    /** 角色名称 */
    roleName: string;
    /** 创建者 */
    createBy: string;
    /** 创建时间 */
    createTime: string;
    /** 更新者 */
    updateBy: string;
    /** 更新时间 */
    updateTime: string;
    /** 权限列表 */
    authIds: Array<string>;
  };
  type SystemsUserProps = {
    id: string;
    username: string /** 用户名 */;
    nickname: string /** 用户昵称 */;
    avatar: string /** 用户头像 */;
    roleId: string /** 角色ID */;
    createBy: string /** 创建者 */;
    createTime: string /** 创建时间 */;
    lastLoginTime: string /** 最后登录时间 */;
    state: number /** 状态 */;
  };
  type LogsProps = {
    /** 日志ID */
    id: number;
    /** 操作人昵称 */
    nickname: string;
    /** 操作内容 */
    content: string;
    /** 操作时间 */
    createTime: string;
  };

  // ~~~~~~~~~~~~~~~~~~
  // 配置管理
  // ~~~~~~~~~~~~~~~~~~
  type ConfigProps = {
    id: string | number;
    title: string;
    key: string;
    value: string;
  };

  // ~~~~~~~~~~~~~~~~~~
  // 用户列表
  // ~~~~~~~~~~~~~~~~~~
  type UserProps = {
    id: string;
    nickname: string;
    avatarUrl: string;
    phone: string;
    createTime: string;
    state: number;
  };

  type FeedbackItemProps = {
    id: string;
    createTime: string;
    content: string;
    nickname: string;
    phone: string;
    avatarUrl: string;
  };

  // ~~~~~~~~~~~~~~~~~~
  // 审核列表
  // ~~~~~~~~~~~~~~~~~~
  type AuditItemProps = {
    id: string;
    works: string;
    name: string;
    desc: string;
    unit: string;
    createTime: string;
    state: number;
    mobile: string;
    roomName: string;
  };

  // ~~~~~~~~~~~~~~~~~~
  // 新闻管理
  // ~~~~~~~~~~~~~~~~~~
  type NewsItemProps = {
    id: string;
    title: string;
    content: string;
  };
}
