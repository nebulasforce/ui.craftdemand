'use client';

// src/app/(user-center)/me/profile/_render.tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Anchor,
  Avatar,
  Box,
  Breadcrumbs,
  Divider,
  Button,
  FocusTrap,
  Grid,
  Group,
  LoadingOverlay,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { getCitiesData, getProvincesData } from '@/api/data/response';
import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';
import { useUser } from '@/contexts/UserContext/UserContext'; // 导入hooks
import '@mantine/dates/styles.css'; // 确保导入日期组件样式

import { IconCalendar } from '@tabler/icons-react';
import { CityItem } from '@/api/data/typings';

interface ProfilePageProps {
  initialData?: any;
  provinces: getProvincesData | null;
  cities: getCitiesData | null;
}

const ProfilePageRender = ({ initialData, provinces, cities }: ProfilePageProps) => {
  const { setActive, setSection } = useNavbar();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const [availableCities, setAvailableCities] = useState<CityItem[]>([]);

  // 处理省份变更，更新城市列表
  const handleProvinceChange = (value: string | null) => {
    if (value && cities) {
      form.setFieldValue('province', value);
      // 重置城市选择
      form.setFieldValue('city', cities[value][0].id);
      // 更新可用城市列表
      setAvailableCities(cities[value]);
    }
  };

  // 表单提交处理
  const handleSubmit = async (values: typeof form.values): Promise<void> => {
    setLoading(true);
    try {
      // 这里添加实际的提交逻辑
      console.log('提交的表单数据:', values);
      // 模拟API请求延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (e) {
      console.error('Update failed:', e);
    } finally {
      setLoading(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    form.reset();
  };

  console.log('initialData', initialData);

  useEffect(() => {
    setSection('Account');
    setActive('User Profile');
  }, []); // 合并依赖项

  const items = [{ title: 'Home', href: '/' }, { title: 'User Profile' }];

  const form = useForm({
    initialValues: {
      nickname: user?.profile.name,
      avatar: user?.profile.avatar,
      signature: user?.profile.signature,
      gender: user?.profile.gender || 1,
      birthday: user?.profile.birthday,
      province: user?.profile.province.id,
      city: user?.profile.city.id,
      address: user?.profile.address,
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
      birthday: (val) => {
        if (!val) {
          return 'This field is required';
        }
        return null;
      },
    },
  });

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
                <Grid.Col span={{ base: 12, md: 12 , lg: 6, xl: 5 }}>
                  <Stack>
                    {/*页面内容 - 表单 -  昵称（文本） */}
                    <Grid>
                      <Grid.Col span={8} pr={{ base: 0, sm: 'sm' }}>
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
                      </Grid.Col>
                    </Grid>
                    {/*页面内容 - 表单 -  个人签名(textarea) */}
                    <Grid>
                      <Grid.Col span={12} pr={{ base: 0, sm: 'sm' }}>
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
                      </Grid.Col>
                    </Grid>
                    {/*页面内容 - 表单 -  性别 (radio) */}
                    {/* 性别 (radio) */}
                    <RadioGroup
                      label="Gender"
                      required
                      value={form.values.gender.toString()}
                      onChange={(value) => form.setFieldValue('gender', parseInt(value, 10))}
                      mb="md"
                    >
                      <Group>
                        <Radio value="1" label="Male" />
                        <Radio value="2" label="Female" />
                        <Radio value="0" label="Other" />
                      </Group>
                    </RadioGroup>
                    {/*页面内容 - 表单 -  出生日期 (datepicker) */}
                    <Grid>
                      <Grid.Col span={8} pr={{ base: 0, sm: 'sm' }}>
                        <DatePickerInput
                          label="Birthday"
                          required
                          placeholder="Select your birthday"
                          value={form.values.birthday}
                          rightSection={<IconCalendar size="16" />}
                          onChange={(date) => form.setFieldValue('birthday', date || '')}
                          valueFormat="YYYY-MM-DD"
                          maxDate={new Date()} // 禁用未来日期（符合生日逻辑）
                        />
                      </Grid.Col>
                    </Grid>
                    {/*页面内容 - 表单 - 位置 -  省市联动 (下拉框) */}
                    {/* 省市选择 - 并排显示 */}
                    <Grid>
                      {/* 省份选择 - 占50%宽度 */}
                      <Grid.Col span={5} pr={{ base: 0, sm: 'sm' }}>
                        <Select
                          required
                          label="Province"
                          placeholder="Select province"
                          value={form.values.province}
                          onChange={handleProvinceChange}
                          data={
                            provinces?.map((province) => ({
                              value: province.id,
                              label: province.name,
                            })) || []
                          }
                          error={form.errors.province}
                          radius="md"
                          disabled={!provinces?.length}
                        />
                      </Grid.Col>

                      {/* 城市选择 - 占50%宽度 */}
                      <Grid.Col span={5} pl={{ base: 0, sm: 'sm' }}>
                        <Select
                          required
                          label="City"
                          placeholder="Select city"
                          value={form.values.city}
                          onChange={(value) => form.setFieldValue('city', value || '')}
                          data={availableCities.map((city) => ({
                            value: city.id,
                            label: city.name,
                          }))}
                          disabled={!form.values.province || !availableCities.length}
                          error={form.errors.city}
                          radius="md"
                        />
                      </Grid.Col>
                    </Grid>
                    {/*页面内容 - 表单 - 详细地址 (文本) */}
                    <Grid>
                      <Grid.Col span={12} pr={{ base: 0, sm: 'sm' }}>
                        <Textarea
                          required
                          label="Address"
                          placeholder="Tell us about yourself"
                          value={form.values.address}
                          onChange={(event) =>
                            form.setFieldValue('address', event.currentTarget.value)
                          }
                          error={form.errors.address} // 显示验证错误
                          radius="md"
                          resize="vertical"
                        />
                      </Grid.Col>
                    </Grid>
                    {/*页面内容 - 表单按钮 */}
                    <Group justify="flex-end" mt="lg">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        disabled={loading}
                      >
                        Reset
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                      >
                        Save Changes
                      </Button>
                    </Group>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 12 , lg: 6, xl: 7  }}>{/*页面内容 - 表单 - 头像 */}
                  <Stack align="center" px={{ lg: 'xl' }}>
                    <Avatar
                      src={form.values.avatar|| '/avatar_default.png'}
                      alt={user?.account.username}
                      size={120}
                      radius={120}
                      mx="auto"
                    />
                    <Button variant="default"  mt="md">
                      Save Avatar
                    </Button>
                  </Stack>
                </Grid.Col>
              </Grid>
            </form>
          </FocusTrap>
        </Box>
      </Paper>
    </Box>
  );
};
export default ProfilePageRender;
