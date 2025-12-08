// 时间格式化函数：将时间戳转换为"YYYY-MM-DD HH:MM:SS"格式
export const formatTimestamp = (timestamp: string | number | undefined) => {
  if (!timestamp && timestamp !== 0) {
    return '--';
  }

  // 处理可能的字符串类型时间戳（int 字符串格式）
  let timestampNum: number;
  if (typeof timestamp === 'string') {
    // 移除可能的空格和特殊字符
    const cleaned = timestamp.trim();
    timestampNum = parseInt(cleaned, 10);
    // 如果解析失败，尝试使用 Number
    if (isNaN(timestampNum)) {
      timestampNum = Number(cleaned);
    }
  } else {
    timestampNum = timestamp;
  }

  // 验证时间戳是否有效
  if (isNaN(timestampNum) || timestampNum <= 0) {
    return '--';
  }

  // 处理秒级时间戳（如果是10位数字，转换为毫秒）
  const timestampStr = timestampNum.toString();
  const isSecondsTimestamp = timestampStr.length === 10;
  const date = new Date(isSecondsTimestamp ? timestampNum * 1000 : timestampNum);

  // 验证日期是否有效
  if (isNaN(date.getTime())) {
    return '--';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
