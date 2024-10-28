import request from '@/api/apiConfig';

export async function list(params: API.ListParams) {
  return request<API.List<API.AuditItemProps>>({
    url: '/api/audit',
    params,
  });
}
