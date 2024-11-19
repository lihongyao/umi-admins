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
    /** 当前页 */
    current?: number;
    /** 每页大小 */
    pageSize?: number;
    /** 其他过滤项属性 */
    [__prop__: string]: any;
  }

  // ~~~~~~~~~~~~~~~~~~
  // 公共类型
  // ~~~~~~~~~~~~~~~~~~
  type OssConfigProps = {
    /** OSS 上传目录名，如 “images”，❗️注意：目录前后不加斜杠，多级目录之间需加斜杠，如 “images/avatar” */
    dir: string;
    /** OSS 上传服务器的地址，通常是一个包含 bucket 和 region 的完整 URL */
    host: string;
    /** OSS 签名策略 */
    policy: string;
    /** OSS 签名 */
    signature: string;
    /** OSS 的 Access Key ID，用于身份验证和授权 */
    accessKeyId: string;
    /** OSS 上传签名的过期时间 */
    expiration: string;
  };
  type OssStsConfigProps = {
    /** OSS 上传目录名，如 “images”，❗️注意：目录前后不加斜杠，多级目录之间需加斜杠，如 “images/avatar” */
    dir: string;
    /** OSS bucket 名称 */
    bucket: string;
    /** OSS 区域 */
    region: string;
    /** OSS 访问端点 */
    endpoint: string;
    /** STS token 的 Access Key ID */
    accessKeyId: string;
    /** STS token 的 Access Key Secret */
    accessKeySecret: string;
    /** STS token 的安全令牌 */
    stsToken: string;
    /** STS token 的过期时间 */
    expiration: string;
  };

  type ConfigProps = {
    id: number;
    title: string;
    key: string;
    value?: string;
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
    avatarUrl: string;
  };

  // ~~~~~~~~~~~~~~~~~~
  // 轮播图管理
  // ~~~~~~~~~~~~~~~~~~
  type BannerProps = {
    /** ID */
    id: number;
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
  type SysAccessProps = {
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
    children?: SysAccessProps[];
  };
  type SysRoleProps = {
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
  type SysUserProps = {
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
    id: number;
    /** 用户昵称 */
    nickname: string;
    /** 用户头像 */
    avatarUrl: string;
    /** 手机号 */
    phone: string;
    /** 创建时间 */
    createTime: string;
    /** 最后登录时间 */
    lastLoginTime: string;
    /** 用户状态 */
    status: number;
  };
  type FeedbackProps = {
    id: number;
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
  type AuditProps = {
    id: number;
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
  type NewsProps = {
    id: number;
    /** 新闻标题 */
    title: string;
    /** 新闻类型：1 行业动态，2 公司动态 */
    type: number;
    /** 新闻来源 */
    source: string;
    /** 新闻详情 */
    content: string;
    /** 发布人员 */
    published_by: string;
    /** 发布时间 */
    publish_time: string;
    /** 发布状态：0 未发布，1 已发布 */
    status: number;
    /** 新闻封面 */
    cover_url: string;
  };
}
