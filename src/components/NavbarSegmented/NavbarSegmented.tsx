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

const tabs = {
  account: [
    { link: '', label: 'Notifications', icon: IconBellRinging },
    { link: '', label: 'Billing', icon: IconReceipt2 },
    { link: '', label: 'Security', icon: IconFingerprint },
    { link: '', label: 'SSH Keys', icon: IconKey },
    { link: '', label: 'Databases', icon: IconDatabaseImport },
    { link: '', label: 'Authentication', icon: Icon2fa },
    { link: '', label: 'Other Settings', icon: IconSettings },
  ],
  general: [
    { link: '', label: 'Orders', icon: IconShoppingCart },
    { link: '', label: 'Receipts', icon: IconLicense },
    { link: '', label: 'Reviews', icon: IconMessage2 },
    { link: '', label: 'Messages', icon: IconMessages },
    { link: '', label: 'Customers', icon: IconUsers },
    { link: '', label: 'Refunds', icon: IconReceiptRefund },
    { link: '', label: 'Files', icon: IconFileAnalytics },
  ],
};

export function NavbarSegmented() {
  const [data ,setData] = useState<listGroupData>();
  const [section, setSection] = useState<'account' | 'general'>('account');
  const [active, setActive] = useState('Billing');
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

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchData().then(() =>{
      setLoading(false);
    } );
  }, [isAuthenticated]);

  const links = tabs[section].map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

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
              data={[
                { label: 'Account', value: 'account' },
                { label: 'System', value: 'general' },
              ]}
            />
          </div>

          <div className={classes.navbarMain}>{links}</div>
        </Box>

        <Box className={classes.footerContainer} >
          <div className={classes.footer}>
            <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
              <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
              <span>Change account</span>
            </a>

            <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
              <IconLogout className={classes.linkIcon} stroke={1.5} />
              <span>Logout</span>
            </a>
          </div>
        </Box>
      </nav>
  );
}
