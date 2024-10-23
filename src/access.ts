/**
 * @see https://umijs.org/docs/max/access
 * */

const accessList: string[] = [];

// -- 首先在 <configs.js> 文件中启用权限管理
// -- 添加路由时，设置 access 字段，字段名为权限名称，如：ACCESS_NAME
// -- 登录时，后端返回的权限列表保存在 <initialState.access> 字段下
export default (initialState?: { currentUser?: API.LoginResponse }) => {
  const { currentUser } = initialState || {};
  let obj: Record<string, boolean> = {};
  accessList.forEach((access) => {
    obj[access] = currentUser?.access.includes(access) || false;
  });
  return obj;
};
