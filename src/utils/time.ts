// 时间格式化函数：将时间戳转换为"YYYY-MMDD HH:MM:SS"格式
export const formatTimestamp = (timestamp: string | number | undefined) => {
  if (!timestamp) {
    return '--';
  }

  // 处理可能的字符串类型时间戳
  const timestampNum = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;

  // 处理秒级时间戳（如果是10位数字）
  const date = new Date(timestampNum.toString().length === 10 ? timestampNum * 1000 : timestampNum);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}${day} ${hours}:${minutes}:${seconds}`;
};
