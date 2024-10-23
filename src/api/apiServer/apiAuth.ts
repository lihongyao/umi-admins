import request from '@/api/apiConfig';

export async function login(data: API.LoginWithAccount) {
  return request<API.LoginResponse>({
    url: '/api/auth/login',
    method: 'POST',
    data,
  });
}
export async function sendCaptcha(phone: string) {
  return request<API.LoginResponse>({
    url: '/api/auth/sendCaptcha',
    method: 'POST',
    data: { phone },
  });
}

export async function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'POST',
  });
}
