"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
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
  IconUser,
  IconUsers,
} from '@tabler/icons-react';
import { Box, SegmentedControl, Text } from '@mantine/core';
import { listGroupData } from '@/api/navbar/response';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';
import classes from './NavbarSegmented.module.css';

export type SectionType = Extract<keyof listGroupData, string>;

const iconMap = {
  IconUser,
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

const generateSegments = (data: listGroupData) => {
  const keys = Object.keys(data) as SectionType[];
  return keys.map((key) => ({
    label: key,
    value: key,
  }));
};

interface NavbarSegmentedProps {
  data: listGroupData;
}

export function NavbarSegmented({ data }: NavbarSegmentedProps) {
  // 初始化时就使用data生成segments，减少一次更新
  const [segments, setSegments] = useState<{ label: string; value: SectionType }[]>(
    generateSegments(data)
  );

  const { active, setActive, section, setSection } = useNavbar();
  const { logout } = useAuth();

  // 当data变化时更新segments
  useEffect(() => {
    const generatedSegments = generateSegments(data);
    if (JSON.stringify(generatedSegments) !== JSON.stringify(segments)) {
      setSegments(generatedSegments);
    }
  }, [data, segments]);


  const getLinks = () => {
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
              onClick={() => setActive(item.name)}
            >
              <IconComponent className={classes.linkIcon} stroke={1.5} />
              <span>{item.name}</span>
            </Link>
          );
        });
    }
  };

  return (
    <nav className={classes.navbar}>
      <Box pos="relative" className={classes.top}>
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

      <Box className={classes.footerContainer}>
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
