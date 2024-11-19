import request from '@/api/apiConfig';

export async function list(params: API.ListParams) {
  return request<API.List<API.BannerProps>>({
    url: '/api/banners',
    params,
  });
}
export async function add(data: any) {
  return request({
    url: '/api/banners',
    method: 'POST',
    data,
  });
}
export async function edit(data: any) {
  return request({
    url: '/api/banners',
    method: 'PUT',
    data,
  });
}
export async function del(id: number) {
  return request({
    url: '/api/banners',
    method: 'DELETE',
    data: { id },
  });
}
export async function switchStatus(id: number, status: number) {
  return request({
    url: '/api/banners/switchStatus',
    method: 'PUT',
    data: { id, status },
  });
}

export async function getLocations() {
  return request<API.BannerLocationProps[]>({ url: '/api/banners/locations' });
}
