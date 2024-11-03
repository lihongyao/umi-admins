import request from '@/api/apiConfig';

export async function ossConfig<T>() {
  return request<T>({
    url: '/api/upload/getSignForOSS',
  });
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request<{ path: string }>({
    url: '/api/sys/file/upload',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    method: 'POST',
    data: formData,
  });
}
