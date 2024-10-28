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

  interface ListParams {
    current: number;
    pageSize: number;
    [__prop__: string]: any;
  }
  // ~~~~~~~~~~~~~~~~~~
  // 公共类型
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

  type ConfigProps = {
    id: number;
    title: string;
    key: string;
    value: string;
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
  type LoginResponse = {
    /** token */
    token: string;
    /** 权限列表 */
    access: string[];
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
    status: number;
    /** 轮播图片链接 */
    bannerPic: string;
    /** 权重 */
    weight: string;
    /** 跳转链接 */
    jumpUrl: string;
    /** 开始时间 */
    startTime: string;
    /** 结束始时间 */
    endTime: string;
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
    id: number | string;
    /** 父级权限ID */
    parentId?: string;
    /** 权限代码 */
    code: string;
    /** 权限名称 */
    name: string;
    /** 深度 */
    depth: number;
    /** 子集权限 */
    children?: SystemsAccessProps[];
  };
  type SystemRoleProps = {
    id: number;
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
    authIds: string[];
    /** 启用状态 */
    status: number;
  };
  type SystemsUserProps = {
    id: number;
    username: string /** 用户名 */;
    nickname: string /** 用户昵称 */;
    avatarUrl: string /** 用户头像 */;
    roleId: string /** 角色ID */;
    createBy: string /** 创建者 */;
    createTime: string /** 创建时间 */;
    lastLoginTime: string /** 最后登录时间 */;
    status: number /** 状态 */;
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
  // 用户相关
  // ~~~~~~~~~~~~~~~~~~
  type UserProps = {
    id: string;
    /** 用户昵称 */
    nickname: string;
    /** 用户头像 */
    avatarUrl: string;
    /** 手机号 */
    phone: string;
    /** 创建时间 */
    createTime: string;
    /** 用户状态 */
    status: number;
  };
  type FeedbackItemProps = {
    id: string;
    /** 反馈时间 */
    createTime: string;
    /** 反馈内容 */
    content: string;
    /** 反馈用户 */
    nickname: string;
    /** 联系方式 */
    phone: string;
    /** 用户头像 */
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
