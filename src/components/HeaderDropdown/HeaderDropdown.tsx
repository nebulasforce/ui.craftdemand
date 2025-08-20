import {
  IconUserCog,
  IconUser,
  IconSettings,
  IconSearch,
  IconPhoto,
  IconChevronRight,
  IconMessageCircle,
  IconLogout,
  IconArrowsLeftRight,
  type Icon,
  type IconProps,
} from '@tabler/icons-react';
import { Group, Avatar,Box, Text, Menu, UnstyledButton, LoadingOverlay } from '@mantine/core';
import { User } from '@/api/me/typings';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { ForwardRefExoticComponent,ReactNode,RefAttributes,Fragment, useState, useEffect } from 'react';
import { listGroupData } from '@/api/headDropdown/response';
import { listGroup } from '@/api/headDropdown/api';
import notify from '@/utils/notify';

// TablerIcon 定义Tabler图标的类型（匹配实际的ForwardRef组件类型）
type TablerIcon = ForwardRefExoticComponent<
  IconProps & RefAttributes<Icon>
>;

// 定义菜单项类型
interface DropdownItem {
  label: string;           // 菜单项文本
  icon?: TablerIcon;  // 菜单项图标
  url?: string;            // 菜单项链接
  color?: string;          // 菜单项颜色
  rightSection?: ReactNode; // 菜单项右侧内容
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
  const [data ,setData] = useState<listGroupData>();
  const [loading, setLoading] = useState(true);

  const fetchData = async (): Promise<void> => {
    try {
      const response = await listGroup();
      if (response.code === 0) {
        setData(response.data);
      }
    } catch (err) {
      if (err instanceof Error) {
        notify(err.message, 'error');
      } else {
        notify('系统错误', 'error');
      }
    }
  }
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchData().then(() =>{
        setLoading(false);
      } );
    }
  }, [isAuthenticated]);



  // 图标映射表
  const iconMap = {
    IconUser,
    IconUserCog,
    IconSettings ,
    IconSearch,
    IconPhoto,
    IconChevronRight,
    IconMessageCircle,
    IconLogout,
    IconArrowsLeftRight,
  }

  const eventMap = {
    logout,
  }

  const getMenuGroups = (): DropdownGroup[] => {
    if (!data) {
      return [];
    }

    return Object.entries(data).map(([groupKey, items], index, array) => {
      // 处理菜单项（已移除排序，因为接口返回的数据已经排序完成）
      const processedItems = items.map(item => {
          // 获取图标组件
          const IconComponent = iconMap[item.icon as keyof typeof iconMap];

          // 获取事件处理函数
          const handleEvent = item.event && eventMap[item.event as keyof typeof eventMap]
            ? eventMap[item.event as keyof typeof eventMap]
            : undefined;

          return {
            label: item.name,
            icon: IconComponent,
            url: item.url,
            color: item.color || undefined,
            rightSection: item.rightSection || undefined,
            onClick: handleEvent,
          };
        });

      return {
        label: groupKey === '_' ? '' : groupKey, // 特殊处理分隔线分组
        items: processedItems,
        isDivider: index < array.length - 1, // 最后一个分组不加分隔线
      };
    });
  };
  const menuGroups = getMenuGroups();
  return (
    <Box pos="relative">
      <Menu width={200} withinPortal trigger="hover">
        <LoadingOverlay  visible={loading} />
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
          {
            menuGroups.map((menuGroup,groupIndex) => (
              <Fragment key={groupIndex}>
                {/* 渲染label */}
                {menuGroup.label && (
                  <Menu.Label>Application</Menu.Label>
                )}
                {/* 渲染分组内的菜单项 */}
                {menuGroup.items.map((item, itemIndex) => (
                  <Menu.Item
                    key={`item-${groupIndex}-${itemIndex}`}
                    component={item.url ? 'a' : undefined}
                    href={item.url ? item.url :undefined}
                    color={item.color as any}
                    onClick={item.onClick}
                    leftSection={item.icon ? <item.icon size={14} /> : null}
                    rightSection={item.rightSection}
                  >
                    {item.label}
                  </Menu.Item>
                ))}
                {/* 渲染分隔线（如果需要） */}
                {menuGroup.isDivider && (
                  <Menu.Divider key={`divider-${groupIndex}`} />
                )}
              </Fragment>
            ))
          }
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
}
