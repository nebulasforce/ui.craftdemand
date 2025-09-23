'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { nprogress } from '@mantine/nprogress';
import '@mantine/nprogress/styles.css';

export function NProgressListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPathnameRef = useRef(pathname);

  useEffect(() => {
    // 只有路径真正变化时才显示
    if (pathname === lastPathnameRef.current) {return;}

    lastPathnameRef.current = pathname;

    // 关键：立即显示进度条
    nprogress.start();
    nprogress.set(0.3);

    // 固定时间后完成（模拟加载）
    const timer = setTimeout(() => {
      nprogress.complete();
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}
