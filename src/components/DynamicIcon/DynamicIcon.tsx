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
