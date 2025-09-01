// 获取图片完整URL
export const getImageUrl = (relativePath: string | undefined): string => {
  if (relativePath) {
    // 如果已经是完整URL则直接返回
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return relativePath;
    }

    // 拼接基础URL和相对路径
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';
    return `${baseUrl}${relativePath.startsWith('/') ? '' : '/'}${relativePath}`;
  }
  return '';
};
