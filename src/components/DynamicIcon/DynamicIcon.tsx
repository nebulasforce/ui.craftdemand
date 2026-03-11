"use client";

import { useEffect, useState } from "react";
import * as TablerIcons from "@tabler/icons-react";
import type { TablerIconsProps } from "@tabler/icons-react";

interface DynamicIconProps extends React.SVGAttributes<SVGSVGElement> {
  name: string;
  size?: string | number;
  stroke?: string | number;
}

type IconComponent = React.ComponentType<TablerIconsProps>;

export const DynamicIcon = ({ name, size = 24, ...props }: DynamicIconProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 当 name 为空或未提供时，不渲染任何内容，也不发出警告
  if (!name) {
    return null;
  }

  const Icon = TablerIcons[name as keyof typeof TablerIcons] as IconComponent | undefined;

  if (!Icon) {
    if (mounted) {
      console.warn(`Icon "${name}" not found in @tabler/icons-react`);
    }
    return (
      <span
        style={{
          display: "inline-block",
          width: size,
          height: size,
        }}
      />
    );
  }

  return <Icon size={size} {...props} />;
};

export default DynamicIcon;
