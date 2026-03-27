'use client';

import { ActionIcon } from '@mantine/core';
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from '@tabler/icons-react';
import classes from './SidebarHoverToggle.module.css';

interface SidebarHoverToggleProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarHoverToggle({ collapsed, onToggle }: SidebarHoverToggleProps) {
  return (
    <div
      className={classes.toggle}
      data-collapsed={collapsed || undefined}
      data-expanded={!collapsed || undefined}
    >
      <ActionIcon
        variant="filled"
        radius="xl"
        size="lg"
        className={classes.action}
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <IconLayoutSidebarLeftExpand size={18} /> : <IconLayoutSidebarLeftCollapse size={18} />}
      </ActionIcon>
    </div>
  );
}
