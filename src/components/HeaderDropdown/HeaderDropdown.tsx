import { ForwardRefExoticComponent, Fragment, ReactNode, RefAttributes, useEffect, useState } from 'react';
import Link from 'next/link';
import { IconArrowsLeftRight, IconChevronRight, IconLogout, IconMessageCircle, IconPhoto, IconSearch, IconSettings, IconUser, IconUserCog, type Icon, type IconProps } from '@tabler/icons-react';
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
  em,
  Group,
  Kbd,
  LoadingOverlay,
  Menu,
  NavLink,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { listGroup } from '@/api/headDropdown/api';
import { listGroupData } from '@/api/headDropdown/response';
import { User } from '@/api/my/typings';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import notify from '@/utils/notify';
import { getImageUrl } from '@/utils/path';
import { useNotifications } from '@/contexts/NotificationContext/NotificationContext';
import classes from './HeaderDropdown.module.css'


// TablerIcon 定义Tabler图标的类型（匹配实际的ForwardRef组件类型）
type TablerIcon = ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;

// 定义菜单项类型
interface DropdownItem {
  label: string; // 菜单项文本
  icon?: TablerIcon; // 菜单项图标
  url: string; // 菜单项链接
  color?: string; // 菜单项颜色
  rightSection?: ReactNode; // 菜单项右侧内容
  onClick?: () => void; // 菜单项点击事件
  // 可以添加更多Mantine Menu.Item支持的属性
}

// 定义下拉菜单分组类型
interface DropdownGroup {
  label: string; // 分组标题
  items: DropdownItem[]; // 分组内的菜单项
  isDivider?: boolean; // 是否为分隔线
}

export interface HeaderDropdownProps {
  user: User;
  dropdowns?: DropdownGroup[];
}


// 转换函数：将逗号分隔的按键字符串转为<Kbd>组件组合
const convertKeysToKbd = (keysString?: string): ReactNode => {
  if (!keysString) {return null;}

  // 分割字符串并过滤空值
  const keys = keysString.split(',').map(key => key.trim()).filter(Boolean);

  if (keys.length === 0) {return null;}

  // 生成<Kbd>组件数组，用+连接
  return keys.map((key, index) => (
    <Fragment key={key}>
      <Kbd size="xs">{key}</Kbd>
      {index < keys.length - 1 && <span className="mx-1">+</span>}
    </Fragment>
  ));
};

export function HeaderDropdown({ user }: HeaderDropdownProps) {
  const [data, setData] = useState<listGroupData>();
  const [loading, setLoading] = useState(true);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const theme = useMantineTheme();

  // 媒体查询 - 检测屏幕尺寸
  const isMobile = useMediaQuery(`(max-width: ${em(theme.breakpoints.sm)})`);

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
        notify('Internal Error', 'error');
      }
    }
  };
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchData().then(() => {
        setLoading(false);
      });
    }
  }, [isAuthenticated]);

  // 图标映射表
  const iconMap = {
    IconUser,
    IconUserCog,
    IconSettings,
    IconSearch,
    IconPhoto,
    IconChevronRight,
    IconMessageCircle,
    IconLogout,
    IconArrowsLeftRight,
  };

  const eventMap = {
    logout: () => {
      logout().then();
      setDrawerOpened(false);
    },
  };

  const getMenuGroups = (): DropdownGroup[] => {
    if (!data) {
      return [];
    }

    return Object.entries(data).map(([groupKey, items], index, array) => {
      // 处理菜单项（已移除排序，因为接口返回的数据已经排序完成）
      const processedItems = items.map((item) => {
        // 获取图标组件
        const IconComponent = iconMap[item.icon as keyof typeof iconMap];

        // 获取事件处理函数
        const handleEvent =
          item.event && eventMap[item.event as keyof typeof eventMap]
            ? eventMap[item.event as keyof typeof eventMap]
            : undefined;

        return {
          label: item.name,
          icon: IconComponent,
          url: item.url,
          color: item.color || undefined,
          rightSection: convertKeysToKbd(item.rightSection) || undefined,
          onClick: handleEvent ? () => {
            handleEvent();
            setDrawerOpened(false);
          } : undefined,
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
  const { unreadCount } = useNotifications();
  // const unreadCount = 2 // 测试样式
  // 移动端抽屉内容
  const renderDrawerContent = () => (
    <Stack gap="md">
      <Group align="center">
        <Avatar
          src={getImageUrl(user.profile.avatar) || '/avatar_default.png'}
          radius="xl"
          alt={user.account.username}
          style={{ position: 'relative' }}
         />
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {user.account.username}
          </Text>
          <Text c="dimmed" size="xs">
            {user.profile.nickname}
          </Text>
        </div>
      </Group>

      <Divider />

      {menuGroups.map((menuGroup, groupIndex) => (
        <Fragment key={groupIndex}>
          {/* 渲染分组标题 */}
          {menuGroup.label && (
            <Text size="sm" fw={600} c="dimmed" pl="sm">
              {menuGroup.label}
            </Text>
          )}

          {/* 渲染分组内的菜单项 */}
          <Stack gap="1">
            {menuGroup.items.map((item, itemIndex) => (
              <NavLink
                key={`item-${groupIndex}-${itemIndex}`}
                component={Link}
                href={item.url ? item.url : {}}
                label={item.label}
                c={item.color}
                onClick={item.onClick}
                py="xs"
                px="sm"
                // 左侧图标（NavLink原生支持，无需手动嵌套）
                leftSection={item.icon ? <item.icon size={18} /> : null}
                // 右侧内容
                rightSection={item.rightSection || null}
               />
            ))}
          </Stack>

          {/* 渲染分隔线（如果需要） */}
          {menuGroup.isDivider && <Divider key={`divider-${groupIndex}`} my="0"/>}
        </Fragment>
      ))}
    </Stack>
  );

  // 用户信息显示部分（始终保持显示）
  const userInfoSection = (
    <UnstyledButton
      onClick={() => isMobile && setDrawerOpened(true)}
      style={{
        width: isMobile ? '100%' : 'auto',
        display: 'flex',
        alignItems: 'center' // 确保按钮自身内容垂直居中
      }}
    >
      <Group
        align="center"
        justify="flex-start"
        style={{
          float: 'left',
          height: '100%',
        }} // 占满按钮高度，确保垂直居中生效
      >
        <Box pos="relative">
          <Avatar
            src={getImageUrl(user.profile.avatar) || '/avatar_default.png'}
            radius="xl"
            alt={user.account.username}
            style={{ position: 'relative' }}
          />
          {unreadCount > 0 && (
            <Badge
              size="sm"
              variant="filled"
              color="red"
              className={classes.notificationBadge}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Box>
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {user.account.username}
          </Text>
          <Text c="dimmed" size="xs">
            {user.profile.nickname}
          </Text>
        </div>
        <IconChevronRight size={16} />
      </Group>
    </UnstyledButton>
  );

  return (
    <Box pos="relative">
      {/* 桌面端使用下拉菜单 */}
      {!isMobile && (
        <Menu width={200} withinPortal trigger="click-hover" >
          <Menu.Target>
            {userInfoSection}
          </Menu.Target>
          <Menu.Dropdown>
            <LoadingOverlay visible={loading} />
            {menuGroups.map((menuGroup, groupIndex) => (
              <Fragment key={groupIndex}>
                {/* 渲染label */}
                {menuGroup.label && <Menu.Label>{menuGroup.label}</Menu.Label>}
                {/* 渲染分组内的菜单项 */}
                {menuGroup.items.map((item, itemIndex) => (
                  <Menu.Item
                    key={`item-${groupIndex}-${itemIndex}`}
                    component={item.url ? Link : undefined}
                    href={item.url ? item.url : {}}
                    color={item.color as any}
                    onClick={item.onClick}
                    leftSection={item.icon ? <item.icon size={14} /> : null}
                    rightSection={item.rightSection}
                  >
                    {item.label}
                  </Menu.Item>
                ))}
                {/* 渲染分隔线（如果需要） */}
                {menuGroup.isDivider && <Menu.Divider key={`divider-${groupIndex}`} />}
              </Fragment>
            ))}
          </Menu.Dropdown>
        </Menu>
      )}

      {/* 移动端使用抽屉 */}
      {isMobile && (
        <>
          {userInfoSection}
          <Drawer
            opened={drawerOpened}
            onClose={() => setDrawerOpened(false)}
            withCloseButton={false}
            position="right"
            size="80%"
            padding="md"
            zIndex={1000001}
          >
            {renderDrawerContent()}
          </Drawer>
        </>
      )}
    </Box>
  );
}
