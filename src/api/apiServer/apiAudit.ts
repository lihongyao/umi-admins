import request from '@/api/apiConfig';

export async function list(params: API.ListParams) {
  return request<API.List<API.AuditProps>>({
    url: '/api/audit',
    params,
  });
}

export async function audit(data: any) {
  return request({
    url: '/api/audit',
    method: 'PUT',
    data,
  });
}
