import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

interface JwtParseResult {
  valid: boolean;
  payload: Record<string, any> | null;
  error?: string;
}

// 工具函数：安全解析 JWT（处理 Base64URL 编码问题）
const safeParseJwt = (token: string): JwtParseResult => {
  // 检查 token 格式（必须是三部分）
  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, payload: null, error: 'tokens must be at least 3 characters' };
  }

  // 处理 Base64URL 编码（转换为标准 Base64）
  const payloadBase64 = parts[1]
    .replace(/-/g, '+') // 替换 URL 安全字符
    .replace(/_/g, '/');

  // 补充 Base64 填充字符（长度必须是4的倍数）
  const padLength = (4 - (payloadBase64.length % 4)) % 4;
  const paddedPayload = payloadBase64 + '='.repeat(padLength);

  // 解码并解析 JSON
  const payload = JSON.parse(atob(paddedPayload));
  return { valid: true, payload };
};

// 验证 token 有效性
const verifyToken = async (token: string): Promise<{ valid: boolean; error: string }> => {
  try {
    // 1. 先检查环境变量
    const secret = process.env.JWT_SECRET;
    const issuer = process.env.JWT_ISSUER;
    if (!secret) {
      return { valid: false, error: 'JWT_SECRET 未配置' };
    }
    if (!issuer) {
      return { valid: false, error: 'JWT_ISSUER 未配置' };
    }

    // 2. 预解析 token 查看基本信息（辅助调试）
    const parseResult = safeParseJwt(token);
    if (!parseResult.valid) {
      return { valid: false, error: `解析失败: ${parseResult.error}` };
    }
    // 3. 执行正式验证
    const secretKey = new TextEncoder().encode(secret);
    //const aaa = await jwtVerify(token, secret);
    await jwtVerify(token, secretKey, {
      algorithms: ['HS256'], // 必须与后端一致
      issuer,
    });
    //console.error("aaa",aaa)

    return { valid: true, error: '' };
  } catch (error) {
    const message = error instanceof Error ? error.message : '验证失败';
    return { valid: false, error: message };
  }
};

// 定义需要认证的受保护路由（支持通配符）
// 所有以 /me 开头的路由都需要认证
const protectedRoutes = ['/my/*'];

// 定义无需认证的公开路由（可选，用于精确排除某些路由）
const publicRoutes = ['/auth/login', '/auth/register', '/', '/about'];

export async function proxy(request: NextRequest) {
  // 1. 获取当前访问的路径
  const currentPath = request.nextUrl.pathname;
  // 2 从 cookie 中获取认证 token（与前端存储的 cookie 键名一致）
  const token = request.cookies.get('token')?.value;
  // const token = Cookies.get('token');
  // const isAuthenticated = !!token;
  // 验证 token
  let isAuthenticated = false;
  if (token) {
    const result = await verifyToken(token);
    isAuthenticated = result.valid;

    // 清除无效 token
    if (!isAuthenticated) {
      const response = NextResponse.next();
      response.cookies.delete('token');
      return response;
    }
  }

  // 3. 已认证用户访问登录页 → 重定向到首页
  // 注意：只有在 token 真正有效时才重定向，避免误判
  if (isAuthenticated && currentPath.startsWith('/auth/login')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 4. 检查是否为公开路由（公开路由直接放行）
  const isPublicRoute = publicRoutes.some(
    (route) => currentPath === route || currentPath.startsWith(`${route}/`)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 5. 检查是否访问受保护路由
  const isAccessingProtectedRoute = protectedRoutes.some((route) => {
    const baseRoute = route.replace('/*', ''); // 提取基础路径（如 /me/* → /me）
    return currentPath === baseRoute || currentPath.startsWith(`${baseRoute}/`);
  });

  // 6. 未认证且访问受保护路由 → 重定向到登录页
  if (!isAuthenticated && isAccessingProtectedRoute) {
    const loginUrl = new URL('/auth/login', request.url);
    // 记录原访问路径，登录后可跳转回来（排除登录页自身）
    if (!currentPath.startsWith('/auth/login')) {
      loginUrl.searchParams.set('redirect', currentPath);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 7. 其他情况 → 正常访问
  return NextResponse.next();
}

// 配置中间件生效的路由范围
// 排除 API 路由、静态资源等不需要认证的路径
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\.json|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico).*)',
  ],
};
