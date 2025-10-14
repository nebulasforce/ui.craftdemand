export const convertParams = (searchParams: Record<string, any>) => {
  const params: Record<string, string | number> = {};

  // 遍历所有 searchParams 并自动转换
  for (const [key, value] of Object.entries(searchParams)) {
    // 跳过undefined值
    if (value === undefined) {
      continue;
    }

    // 处理数组参数（取第一个值）
    const stringValue = Array.isArray(value) ? value[0] : value;

    // 如果值不是字符串类型，直接赋值
    if (typeof stringValue !== 'string') {
      params[key] = stringValue;
      continue;
    }

    // 尝试转换为数字（如果是数字字符串）
    const numValue = parseInt(stringValue, 10);
    if (!isNaN(numValue) && stringValue === numValue.toString()) {
      params[key] = numValue;
    } else {
      params[key] = stringValue;
    }
  }

  return params;
};
