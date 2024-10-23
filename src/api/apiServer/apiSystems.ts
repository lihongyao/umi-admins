import request from '@/api/apiConfig';

// ~~~~~~~~~~~~~~~~~~
// 权限管理
// ~~~~~~~~~~~~~~~~~~
export async function access() {
  return request<API.SystemsAccessProps[]>({ url: '/api/systems/access/list' });
}

export async function accessAddOrUpdate(data: any) {
  return request({
    url: '/api/systems/access/addOrUpdate',
    method: 'POST',
    data,
  });
}
export async function accessDelete(authId: number) {
  return request({
    url: `/api/systems/access/remove/${authId}`,
    method: 'DELETE',
  });
}

// ~~~~~~~~~~~~~~~~~~
// 角色管理
// ~~~~~~~~~~~~~~~~~~
export async function roles() {
  return request<API.SystemRoleProps[]>({
    url: '/api/systems/roles/list',
  });
}
export async function roleDelete(roleId: number) {
  return request({
    url: `/api/systems/roles/remove/${roleId}`,
    method: 'DELETE',
  });
}

export async function roleAddAndUpdate(data: any) {
  return request({
    url: '/api/systems/roles/addOrUpdate',
    method: 'POST',
    data,
  });
}
export async function roleSwichStatus(id: number) {
  return request({
    url: `/api/systems/roles/switch-status/${id}`,
    method: 'PUT',
  });
}

// ~~~~~~~~~~~~~~~~~~
// 系统用户
// ~~~~~~~~~~~~~~~~~~
export async function users(data: any = {}) {
  return request<API.List<API.SystemsUserProps>>({
    url: '/api/administrators/list',
    method: 'POST',
    data,
  });
}

export async function userAddAndUpdate(data: any) {
  return request({
    url: '/api/administrators/addOrUpdate',
    method: 'POST',
    data,
  });
}
export async function userSwichStatus(id: number) {
  return request({
    url: `/api/administrators/switch-status/${id}`,
    method: 'PUT',
  });
}

export async function userResetPsw(id: number) {
  return request({
    url: `/api/administrators/reset-psw/${id}`,
    method: 'PUT',
  });
}

export async function changePsw(data: any) {
  return request({
    url: '/api/administrators/change-psw',
    method: 'PUT',
    data,
  });
}
