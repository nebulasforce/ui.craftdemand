import { Breadcrumbs as MBreadcrumbs, BreadcrumbsProps as MBreadcrumbsProps, Anchor } from '@mantine/core';
import { useBreadcrumbs } from '@/contexts/BreadcrumbsContext/BreadcrumbsContext';
import Link from 'next/link';

// 扩展Mantine的Breadcrumbs属性，添加自定义属性（如果需要）
interface BreadcrumbsProps extends Omit<MBreadcrumbsProps, 'children'> {
  // 保留自定义分隔符属性（可选，也可以直接使用原生separator）
  // 这里保留是为了保持默认值的兼容性
//   separator?: ReactNode;
}

// 独立的面包屑渲染组件
export default function Breadcrumbs(props: BreadcrumbsProps) {
  const { breadcrumbs } = useBreadcrumbs();

  return (
    <MBreadcrumbs py="md" {...props}>
      {breadcrumbs.map((item, index) => (
        item.path ? (
          <Anchor
            key={index}
            component={Link}
            href={item.path}
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            {item.label}
          </Anchor>
        ) : (
          <Anchor key={`${item.label}-${index}-${item.path || 'static'}`} component="span" onClick={(e) => {e.preventDefault()}}>
            {item.label}
          </Anchor>
        )
      ))}
    </MBreadcrumbs>
  );
}

