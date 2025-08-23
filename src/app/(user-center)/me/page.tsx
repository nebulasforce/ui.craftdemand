'use client';

// src/app/(self-setting)/me/page.tsx
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Anchor, Box, Breadcrumbs, Paper, Title,Text,Divider } from '@mantine/core';
import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';

const SettingsPage = () => {
  const { setActive, setSection } = useNavbar();

  useEffect(() => {
      setSection('Account');
      setActive('User Profile');
  }, []); // 合并依赖项


  const items = [
    { title: 'Mantine', href: 'http://www.mantine.com' },
    { title: 'Mantine hooks', href: '#' },
    { title: 'use-id' },
  ];

  return (
    <Box>
      {/*面包屑*/}
      {/*https://mantine.dev/core/breadcrumbs/#*/}
      <Breadcrumbs>
        {items.map((item, index) =>
          item.href ? (
            <Anchor
              key={index}
              component={Link}
              href={item.href}
            >
              {item.title}
            </Anchor>
          ) : (
            <Anchor
              key={index}
              role="button" // 声明按钮角色
              component="span"
              onClick={() => {
                // setSection('System');
              }}
            >
              {item.title}
            </Anchor>
          )
        )}
      </Breadcrumbs>
      {/*页面容器*/}
      <Paper pt="lg" pb="lg" >
        {/*页面容器 - 标题*/}
        <Box mb="lg">
          <Title order={3}>User Profile</Title>
          <Text size="sm" c="dimmed">
            Enhance your profile to let us get to know you better.
          </Text>
        </Box>
        <Divider mb="lg" my="xs" variant="dashed" />

        {/*页面内容 - 表单 */}
        {/*页面内容 - 表单 -  昵称（文本） */}
        {/*页面内容 - 表单 -  个人签名(textarea) */}
        {/*页面内容 - 表单 -  性别 (radio) */}
        {/*页面内容 - 表单 -  出生日期 (datepicker) */}
        {/*页面内容 - 表单 - 位置 -  省市联动 (下拉框) */}
        {/*页面内容 - 表单 - 详细地址 (文本) */}
        {/*页面内容 - 表单按钮 */}
      </Paper>
    </Box>
  );
};
export default SettingsPage;
