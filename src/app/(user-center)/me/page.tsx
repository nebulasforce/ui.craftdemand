'use client';

// src/app/(self-setting)/me/page.tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Anchor,
  Box,
  Breadcrumbs,
  Divider,
  FocusTrap,
  Grid,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  RadioGroup, Group, Radio,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';

const SettingsPage = () => {
  const { setActive, setSection } = useNavbar();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setSection('Account');
    setActive('User Profile');
  }, []); // 合并依赖项

  const items = [{ title: 'Home', href: '/' }, { title: 'User Profile' }];

  const form = useForm({
    initialValues: {
      nickname: '',
      signature: '',
      gender: 'male',
      birthdate: '',
      province: '',
      city: '',
      address: '',
    },
    validate: {
      nickname: (val) => {
        if (!val) {
          return 'This field is required';
        }
        return null;
      },
      signature: (val) => {
        if (!val) {
          return 'This field is required';
        }
        return null;
      },
    },
  });
  // handleSubmit 表单处理
  const handleSubmit = async (): Promise<void> => {
    setLoading(true);
    try {
    } catch (e) {}
  };

  return (
    <Box>
      {/*面包屑*/}
      {/*https://mantine.dev/core/breadcrumbs/#*/}
      <Breadcrumbs>
        {items.map((item, index) =>
          item.href ? (
            <Anchor key={index} component={Link} href={item.href}>
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
      <Paper pt="lg" pb="lg">
        {/*页面容器 - 标题*/}
        <Box mb="lg">
          <Title order={3}>User Profile</Title>
          <Text size="sm" c="dimmed">
            Enhance your profile to let us get to know you better.
          </Text>
        </Box>
        <Divider mb="lg" my="xs" variant="dashed" />
        <Box pos="relative">
          <LoadingOverlay visible={loading} />
          <FocusTrap active>
            {/*页面内容 - 表单 */}
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Grid>
                <Grid.Col span={{ base: 12, md: 5 }}>
                  <Stack>
                    {/*页面内容 - 表单 -  昵称（文本） */}
                    <TextInput
                      required
                      data-autofocus
                      label="Nickname"
                      placeholder="Input your nickname"
                      value={form.values.nickname}
                      onChange={(event) =>
                        form.setFieldValue('nickname', event.currentTarget.value)
                      }
                      error={form.errors.nickname} // 显示验证错误
                      radius="md"
                    />
                    {/*页面内容 - 表单 -  个人签名(textarea) */}
                    <Textarea
                      required
                      label="Signature"
                      placeholder="Tell us about yourself"
                      value={form.values.signature}
                      onChange={(event) =>
                        form.setFieldValue('signature', event.currentTarget.value)
                      }
                      error={form.errors.signature} // 显示验证错误
                      radius="md"
                      resize="vertical"
                    />
                    {/*页面内容 - 表单 -  性别 (radio) */}
                    {/* 性别 (radio) */}
                    <RadioGroup
                      label="Gender"
                      required
                      value={form.values.gender}
                      onChange={(value) => form.setFieldValue('gender', value)}
                      mb="md"
                    >
                      <Group>
                        <Radio value="male" label="Male" />
                        <Radio value="female" label="Female" />
                        <Radio value="other" label="Other" />
                      </Group>
                    </RadioGroup>
                    {/*页面内容 - 表单 -  出生日期 (datepicker) */}
                    {/*页面内容 - 表单 - 位置 -  省市联动 (下拉框) */}
                    {/*页面内容 - 表单 - 详细地址 (文本) */}
                    {/*页面内容 - 表单按钮 */}
                  </Stack>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>{/*页面内容 - 表单 - 头像 */}</Grid.Col>
              </Grid>
            </form>
          </FocusTrap>
        </Box>
      </Paper>
    </Box>
  );
};
export default SettingsPage;
