import { NextResponse, type NextRequest } from 'next/server';
// import Cookies from 'js-cookie';

// 定义需要认证的受保护路由（支持通配符）
// 所有以 /me 开头的路由都需要认证
const protectedRoutes = ['/me/*'];

// 定义无需认证的公开路由（可选，用于精确排除某些路由）
const publicRoutes = ['/auth/login', '/auth/register', '/', '/about'];

export function middleware(request: NextRequest) {
  // 1. 获取当前访问的路径
  const currentPath = request.nextUrl.pathname;
  // 2 从 cookie 中获取认证 token（与前端存储的 cookie 键名一致）
  const token = request.cookies.get('token')?.value;
  // const token = Cookies.get('token');
  const isAuthenticated = !!token;

  // 3. 已认证用户访问登录页 → 重定向到个人中心 - 有可能token已过期
  if (isAuthenticated && currentPath.startsWith('/auth/login')) {
    return NextResponse.redirect(new URL('/me', request.url)); // 需要跳转一个需要认证的保护路由
  }

  // 4. 检查是否为公开路由（公开路由直接放行）
  const isPublicRoute = publicRoutes.some(route =>
    currentPath === route || currentPath.startsWith(`${route}/`)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }


  // 5. 检查是否访问受保护路由
  const isAccessingProtectedRoute = protectedRoutes.some(route => {
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
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\.json|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico).*)'
  ]
};
