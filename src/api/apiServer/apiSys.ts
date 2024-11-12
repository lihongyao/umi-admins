import request from '@/api/apiConfig';

// ~~~~~~~~~~~~~~~~~~
// 登录相关
// ~~~~~~~~~~~~~~~~~~
export async function login(data: API.LoginWithAccount) {
  return request<API.LoginResponse>({
    url: '/api/sys/login',
    method: 'POST',
    data,
  });
}
export async function sendCaptcha(phone: string) {
  return request<API.LoginResponse>({
    url: '/api/sys/sendCaptcha',
    method: 'POST',
    data: { phone },
  });
}
export async function logout() {
  return request({
    url: '/api/sys/logout',
    method: 'POST',
  });
}

export async function changePsw(data: any) {
  return request({
    url: '/api/sys/change-psw',
    method: 'PUT',
    data,
  });
}

// ~~~~~~~~~~~~~~~~~~
// 权限管理
// ~~~~~~~~~~~~~~~~~~
export async function access() {
  return request<API.SysAccessProps[]>({ url: '/api/sys/access' });
}
export async function accessAdd(data: any) {
  return request({
    url: '/api/sys/access',
    method: 'POST',
    data,
  });
}
export async function accessEdit(data: any) {
  return request({
    url: '/api/sys/access',
    method: 'PUT',
    data,
  });
}
export async function accessDelete(id: number) {
  return request({
    url: `/api/sys/access/${id}`,
    method: 'DELETE',
  });
}

// ~~~~~~~~~~~~~~~~~~
// 角色管理
// ~~~~~~~~~~~~~~~~~~
export async function roles() {
  return request<API.SysRoleProps[]>({
    url: '/api/sys/roles',
  });
}
export async function roleAdd(data: any) {
  return request({
    url: '/api/sys/roles',
    method: 'POST',
    data,
  });
}
export async function roleEdit(data: any) {
  return request({
    url: '/api/sys/roles',
    method: 'PUT',
    data,
  });
}
export async function roleDelete(id: number) {
  return request({
    url: `/api/sys/roles/${id}`,
    method: 'DELETE',
  });
}

export async function roleSwichStatus(id: number, status: number) {
  return request({
    url: '/api/sys/roles/switch-status',
    method: 'PUT',
    data: { id, status },
  });
}

// ~~~~~~~~~~~~~~~~~~
// 系统用户
// ~~~~~~~~~~~~~~~~~~
export async function users(params: API.ListParams) {
  return request<API.List<API.SysUserProps>>({
    url: '/api/sys/user',
    params,
  });
}

export async function userAdd(data: any) {
  return request({
    url: '/api/sys/user',
    method: 'POST',
    data,
  });
}
export async function userEdit(data: any) {
  return request({
    url: '/api/sys/user',
    method: 'PUT',
    data,
  });
}
export async function userSwichStatus(id: number, status: number) {
  return request({
    url: '/api/sys/user/switch-status',
    method: 'PUT',
    data: { id, status },
  });
}
export async function userResetPsw(id: number) {
  return request({
    url: `/api/sys/user/reset-psw/${id}`,
    method: 'PUT',
  });
}

export async function userDelete(id: number) {
  return request({
    url: `/api/sys/user/${id}`,
    method: 'DELETE',
  });
}

// ~~~~~~~~~~~~~~~~~~
// 操作日志
// ~~~~~~~~~~~~~~~~~~
export async function logs(params: API.ListParams) {
  return request<API.List<API.LogsProps>>({
    url: '/api/sys/logs',
    params,
  });
}
