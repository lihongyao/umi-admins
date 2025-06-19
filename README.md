# 前言

在公司做项目时，如果不是面向企业用户（toB）或者对布局排版有特殊要求，后台管理系统通常是基于框架进行开发，灵活地实现功能。由于我在开发后台管理系统时通常使用 React 和 Ant Design，为了方便后期的复用，我基于常见的业务需求搭建了一套框架，使用 Umijs、TypeScript、axios 和 ProComponents 构建了一个后台管理系统模板。

需要注意的是，我并没有直接使用 ProComponents 的整套模板进行二次封装，因为全量代码过于庞大，很多功能并不需要，显得冗余。我选择基于 [Umijs](https://umijs.org/) 的 Simple 模板进行开发，并根据具体的业务场景安装必要的依赖。

**框架环境**：

node：<mark>v22.16.0</mark>

pnpm：<mark>10.11.1</mark>

**仓库地址**：https://gitee.com/lihongyao/umi-admins

# 目录结构

```
umi-admins
.
├── .husky                    # git提交规范
├── .config                   # 配置文件
│   ├── config.development.ts # 开发环境
│   ├── config.production.ts  # 生产环境
│   ├── config.qa.ts          # 测试环境
│   ├── config.ts             # 统一配置
│   ├── defaultSettings.ts    # 默认配置
│	└── routes.ts             # 路由配置
├── mock
│	└── apis.ts               # 数据mock，前期开发时模拟后端数据结构
├── public                    # 该文件下的目录打包时将直接拷贝至根目录
├── src                       # 源码文件
│   ├── api                   # 前后端交互
│   │   ├── apiConfig         # axios 封装，请求拦截、响应拦截，统一异常处理
│   │   └── apiServer         # 业务接口定义，命名格式：apiXXX，在index.ts中统一导出
│   │   │   ├── typings.d.ts  # 统一接口TS类型定义
│   │   │   └── ....
│   ├── assets                # 静态资源
│   ├── components            # 全局组件
│   │   ├── @lgs              # 自己封装的常用组件
│   │   └── ....              # 项目内通用组件
│   ├── constants             # 全局常量定义
│   ├── hooks                 # Hooks
│   ├── models                # 状态管理
│   ├── pages                 # 业务页面
│   ├── utils                 # 工具类
│   ├── access.ts             # 权限管理
│   ├── app.tsx               # 全局配置：Layout...
│   ├── global.less           # 全局样式
│   ├── global.tsx            # 全局脚本
│   ├── .env                  # 环境变量，主要配置PORT/HOST（本地启动域名）
│   └── .env.d.ts             # 环境变量，类型定义，主要针对于 config.xxx.ts 中定义的变量做类型声明
└── ...                       # 杂项配置文件
```

# 指南

1. 克隆项目 OR 下载到本地
2. 在编辑器中打开项目（推荐私用 `VSCode`）
3. 安装依赖：`pnpm install`
4. 在 **`configs/config.development.ts`** 文件中修改 **后台 A** 的 IP 地址为本机地址
5. 启动项目：`pnpm dev`

# 前后端交互约定

响应数据类型

```ts
// -- 基础响应结构
export interface AxiosResult<T = any> {
  /** 状态码 */
  code: number;
  /** 响应数据 */
  data: T;
  /** 提示信息 */
  msg: string;
}

// -- 列表响应结构
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

const response: AxiosResult<List<T>>;

// -- 列表请求
interface ListParams {
  /** 当前页 */
  current?: number;
  /** 每页大小 */
  pageSize?: number;
  /** 其他过滤项属性 */
  [__prop__: string]: any;
}
```

推荐使用 RESTful API，这里以商品为例：

```ts
// 1.新建商品
POST /api/goods
// 2.更新商品
PUT /api/goods
// 3.获取商品列表
GET /api/goods
// 4.获取商品详情
GET /api/goods/:id
// 5.删除商品
DELETE /api/goods/:id
// 6.切换商品某个状态
PUT /api/goods/switch-status/:id
```

> 以上约定，仅供参考

# 提示

有任何问题欢迎留言，或+微信：17398888669

# 异常处理

## 1. git commit 规范

在 macOS 系统中，当你执行 git commit 时并不会去校验提交规范，控制台抛出如下提示：

```shell
hint: The '.husky/pre-commit' hook was ignored because it's not set as executable.
hint: You can disable this warning with `git config advice.ignoredHook false`.
hint: The '.husky/commit-msg' hook was ignored because it's not set as executable.
hint: You can disable this warning with `git config advice.ignoredHook false`.
```

解决方案 → 控制台输入如下指令：

```shell
$ chmod 777 .husky/*
```

再次提交时，将会触发 git 提交规范校验。
