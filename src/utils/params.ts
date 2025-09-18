/**
 * 安全获取查询参数，处理可能的数组情况
 * @param param - 原始查询参数（可能是字符串、字符串数组或 undefined）
 * @param defaultValue - 可选的默认值，如果参数不存在则返回此值
 * @returns 处理后的参数（字符串或默认值）
 */
export function getQueryParam(
  param: string | string[] | undefined,
  defaultValue?: string
): string | undefined {
  // 如果参数是数组，取第一个元素
  if (Array.isArray(param)) {
    return param[0] ?? defaultValue;
  }

  // 如果参数不存在，返回默认值
  return param ?? defaultValue;
}

/**
 * 安全获取数字类型的查询参数
 * @param param - 原始查询参数
 * @param defaultValue - 可选的默认值（数字类型）
 * @returns 解析后的数字或默认值
 */
export function getNumberQueryParam(
  param: string | string[] | undefined,
  defaultValue?: number
): number | undefined {
  const strValue = getQueryParam(param);

  // 如果无法获取字符串值，直接返回默认值
  if (strValue === undefined) {
    return defaultValue;
  }

  // 解析为数字
  const numValue = Number(strValue);

  // 如果解析失败，返回默认值
  return isNaN(numValue) ? defaultValue : numValue;
}



