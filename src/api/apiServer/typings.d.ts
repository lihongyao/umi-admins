declare namespace API {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // 分页列表
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
  /**********************
   ** 阿里云储存
   **********************/
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

  /**********************
   ** 登录相关
   **********************/
  type LoginWithAccount = {
    username: string;
    password: string;
  };

  type LoginResult = {
    token: string /** token */;
    access: Array<string> /** 权限列表 */;
    nickname: string /** 用户昵称 */;
    avatar: string /** 用户头像 */;
  };
  /**********************
   ** 轮播广告
   **********************/
  type BannerItemProps = {
    id: string /** ID */;
    state: number /** 启用/禁用状态 */;
    bannerPic: string /** 轮播图片链接 */;
    weight: string /** 权重 */;
    jumpUrl: string /** 跳转链接 */;
    start: string /** 展示开始时间 */;
    end: string /** 展示结束时间 */;
    locationCode: string /** 展示位置编码 */;
  };
  type BannerLocationProps = {
    locationCode: string;
    locationName: string;
  };
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // 权限管理
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  /**********************
   ** 系统管理
   **********************/
  type SystemsAccessProps = {
    id: string;
    parentId?: string;
    code: string;
    name: string;
    depth: number;
    children?: Array<SystemsAccessProps>;
  };
  type SystemRoleProps = {
    id: string;
    roleName: string /** 角色名称 */;
    createBy: string /** 创建者 */;
    createDate: string /** 创建时间 */;
    updateBy: string /** 更新者 */;
    updateDate: string /** 更新时间 */;
    authIds: Array<string> /** 权限列表 */;
  };
  type SystemsUserProps = {
    id: string;
    username: string /** 用户名 */;
    nickname: string /** 用户昵称 */;
    avatar: string /** 用户头像 */;
    roleId: string /** 角色ID */;
    createBy: string /** 创建者 */;
    createDate: string /** 创建时间 */;
    lastLoginTime: string /** 最后登录时间 */;
    state: number /** 状态 */;
  };

  /**********************
   ** 配置管理
   **********************/
  type ConfigProps = {
    id: string | number;
    title: string;
    key: string;
    value: string;
  };

  /**********************
   ** 用户列表
   **********************/
  type UserProps = {
    id: string;
    nickname: string;
    avatarUrl: string;
    phone: string;
    createDate: string;
  };

  type FeedbackItemProps = {
    id: string;
    createDate: string;
    content: string;
    nickname: string;
    phone: string;
    avatarUrl: string;
  };

  /**********************
   ** 审核列表
   **********************/
  type AuditItemProps = {
    id: string;
    works: string;
    name: string;
    desc: string;
    unit: string;
    createDate: string;
    state: number;
    mobile: string;
    roomName: string;
  };
  /**********************
   ** 新闻管理
   **********************/
  type NewsItemProps = {
    id: string;
    title: string;
    content: string;
  };
}
