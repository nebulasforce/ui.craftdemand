import { useEffect, useState } from 'react';
import {
  Icon2fa,
  IconBellRinging,
  IconDatabaseImport,
  IconFileAnalytics,
  IconFingerprint,
  IconKey,
  IconLicense,
  IconLogout,
  IconMessage2,
  IconMessages,
  IconReceipt2,
  IconReceiptRefund,
  IconSettings,
  IconShoppingCart,
  IconSwitchHorizontal,
  IconUsers,
} from '@tabler/icons-react';
import { Box, LoadingOverlay, SegmentedControl, Text } from '@mantine/core';
import classes from './NavbarSegmented.module.css';
import { listGroupData } from '@/api/navbar/response';
import { listGroup } from '@/api/navbar/api';
import notify from '@/utils/notify';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import Link from 'next/link';

type SectionType = Extract<keyof listGroupData, string>

// 图标映射表，将接口返回的图标字符串映射到实际组件
const iconMap = {
  Icon2fa,
  IconBellRinging,
  IconDatabaseImport,
  IconFileAnalytics,
  IconFingerprint,
  IconKey,
  IconLicense,
  IconMessage2,
  IconMessages,
  IconReceipt2,
  IconReceiptRefund,
  IconSettings,
  IconShoppingCart,
  IconUsers,
};

const defaultSegments = [
  { label: 'Account', value: 'Account' },
  { label: 'System', value: 'System' },
];

export function NavbarSegmented() {
  const [data ,setData] = useState<listGroupData>();
  const [segments, setSegments] = useState<{ label: string; value: SectionType }[]>(defaultSegments);
  const [section, setSection] = useState<SectionType>('Account');
  const [active, setActive] = useState('Billing');
  const [loading, setLoading] = useState(true);

  const fetchData = async (): Promise<void> => {
    try {
      const response = await listGroup();
      if (response.code === 0) {
        if (response.data) {
          setData(response.data);
          // 提取其他数据
          // 从data的一级键生成分段控制器选项
          const generatedSegments = generateSegments(response.data);
          setSegments(generatedSegments);

          // 设置默认选中的分段（第一个分段）
          const defaultSection = generatedSegments[0]?.value || 'Account';
          setSection(defaultSection);

          // 设置默认激活项
          const firstItems = response.data[defaultSection] || [];
          if (firstItems.length > 0) {
            setActive(firstItems[0].name);
          }
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        notify(err.message, 'error');
      } else {
        notify('系统错误', 'error');
      }
    }
  }

  // 生成分段控制器选项：label为原始键名
  const generateSegments = (data: listGroupData) => {
      // 获取data对象的所有一级键
      const keys = Object.keys(data);

      // 转换为分段控制器需要的格式：label保持原始键名
      return keys.map(key => ({
        label: key,               // 显示的标签（如"Account"、"System"）
        value: key
      }));
  };

  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchData().then(() =>{
        setLoading(false);
      } );
    }
  }, [isAuthenticated]);


  const getLinks = () => {
    // 接口数据存在时使用接口数据
    if (data && section && data[section]) {
      return data[section]
        .sort((a, b) => (a.sort || 0) - (b.sort || 0))
        .map((item) => {
          const IconComponent = iconMap[item.icon as keyof typeof iconMap] || (() => null);
          return (
            <Link
              className={classes.link}
              data-active={item.name === active || undefined}
              href={item.url}
              key={item.code}
              onClick={(event) => {
                event.preventDefault();
                setActive(item.name);
              }}
            >
              <IconComponent className={classes.linkIcon} stroke={1.5} />
              <span>{item.name}</span>
            </Link>
          );
        });
    }
  }

  return (
      <nav className={classes.navbar}>
        <Box pos="relative" className={classes.top}>
          <LoadingOverlay  visible={loading} />
          <div>
            <Text fw={500} size="sm" className={classes.title} c="dimmed" mb="xs">
              bgluesticker@mantine.dev
            </Text>

            <SegmentedControl
              value={section}
              onChange={(value: any) => setSection(value)}
              transitionTimingFunction="ease"
              fullWidth
              data={segments}
            />
          </div>

          <div className={classes.navbarMain}>{getLinks()}</div>
        </Box>

        <Box className={classes.footerContainer} >
          <div className={classes.footer}>
            <Link href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
              <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
              <span>Change account</span>
            </Link>

            <Link href="#" className={classes.link} onClick={logout}>
              <IconLogout className={classes.linkIcon} stroke={1.5} />
              <span>Logout</span>
            </Link>
          </div>
        </Box>
      </nav>
  );
}
