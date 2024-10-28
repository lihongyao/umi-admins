import request from '@/api/apiConfig';

export async function list(params: API.ListParams) {
  return request<API.List<API.UserProps>>({
    url: '/api/user',
    params,
  });
}

export async function feedbacks(params: API.ListParams) {
  return request<API.List<API.FeedbackItemProps>>({
    url: '/api/user/feedbacks',
    params,
  });
}
