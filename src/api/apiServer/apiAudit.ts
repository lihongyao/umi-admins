import request from '@/api/apiConfig';

export async function list(params: API.ListParams) {
  return request<API.List<API.AuditProps>>({
    url: '/api/audit',
    params,
  });
}
