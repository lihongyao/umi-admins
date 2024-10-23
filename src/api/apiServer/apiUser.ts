import request from '@/api/apiConfig';

export async function login(data: API.LoginWithAccount) {
  return request<API.LoginResponse>({
    url: '/api/user/login',
    method: 'POST',
    data,
  });
}

export async function sendCaptcha(phone: string) {
  return request<API.LoginResponse>({
    url: '/api/user/sendCaptcha',
    method: 'POST',
    data: { phone },
  });
}
export async function list(data: any) {
  return request<API.List<API.UserProps>>({
    url: '/api/user/list',
    method: 'POST',
    data,
  });
}

export async function feedbacks(data: any) {
  return request<API.List<API.FeedbackItemProps>>({
    url: '/api/user/feedbacks',
    method: 'POST',
    data,
  });
}
