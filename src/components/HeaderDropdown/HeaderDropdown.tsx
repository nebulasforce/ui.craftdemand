import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconChevronRight,
  IconMessageCircle,
  IconLogout,
  IconArrowsLeftRight,
} from '@tabler/icons-react';
import { Group, Avatar, Text, Menu, UnstyledButton } from '@mantine/core';
import { User } from '@/api/me/typings';
import { useAuth } from '@/contexts/AuthContext/AuthContext';


// 定义菜单项类型
interface DropdownItem {
  label: string;           // 菜单项文本
  icon?: React.Component;  // 菜单项图标
  url?: string;            // 菜单项链接
  color?: string;          // 菜单项颜色
  rightSection?: React.ReactNode; // 菜单项右侧内容
  onClick?: () => void;    // 菜单项点击事件
  // 可以添加更多Mantine Menu.Item支持的属性
}

// 定义下拉菜单分组类型
interface DropdownGroup {
  label: string;           // 分组标题
  items: DropdownItem[];   // 分组内的菜单项
  isDivider?: boolean;     // 是否为分隔线
}

export interface HeaderDropdownProps {
  user: User;
  dropdowns?: DropdownGroup[];
}

export function HeaderDropdown({ user }: HeaderDropdownProps) {
  const { logout } = useAuth();
  return (
    <Menu withinPortal>
      <Menu.Target>
        <UnstyledButton>
          <Group>
            <Avatar src={user.profile.avatar || '/avatar_default.png'} radius="xl" alt={user.account.username} />
            <div style={{flex:1}} >
              <Text size="sm" fw={500}>{user.account.username}</Text>
              <Text c="dimmed" size="xs">{user.profile.name}</Text>
            </div>
            <IconChevronRight size={16} />
          </Group>

        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item component="a" href="/settings" leftSection={<IconSettings size={14} />}>
          Settings
        </Menu.Item>
        <Menu.Item leftSection={<IconMessageCircle size={14} />}>
          Messages
        </Menu.Item>
        <Menu.Item leftSection={<IconPhoto size={14} />}>
          Gallery
        </Menu.Item>
        <Menu.Item
          leftSection={<IconSearch size={14} />}
          rightSection={
            <Text size="xs" c="dimmed">
              ⌘K
            </Text>
          }
        >
          Search
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          leftSection={<IconArrowsLeftRight size={14} />}
        >
          Transfer my data
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={<IconLogout size={14} />}
          onClick={logout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
