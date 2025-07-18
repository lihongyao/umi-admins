import request from '@/api/apiConfig';

export async function getOssConfigs() {
  return request<API.OssConfigProps>({
    url: '/api/upload/ossConfigs',
  });
}
export async function getOssStsConfigs() {
  return request<API.OssStsConfigProps>({
    url: '/api/upload/stsConfigs',
  });
}

export async function getCosSign(
  data: { fileName: string; business: number }[],
) {
  return request<API.CosSignProps>({
    url: '/v2/media/sign/update',
    method: 'POST',
    data,
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
