// src/utils/path.ts

import apiConfig from '../../config/api.config';

// 获取图片完整URL
export const getImageUrl = (relativePath: string | undefined): string => {
  if (!relativePath) {return '';}

  // 如果已经是完整URL则直接返回
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }

  // 拼接基础URL和相对路径，处理斜杠问题
  const baseUrl = apiConfig.baseURL;
  return `${baseUrl}${relativePath.startsWith('/') ? '' : '/'}${relativePath}`;
};
