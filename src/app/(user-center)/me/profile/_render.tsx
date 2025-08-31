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
import { useUser } from '@/contexts/UserContext/UserContext';
import '@mantine/dates/styles.css';

import { IconCalendar } from '@tabler/icons-react';
import { CityItem } from '@/api/data/typings';
import { editMyProfile } from '@/api/me/api';
import notify from '@/utils/notify';

interface ProfilePageProps {
  initialData?: any;
  provinces: getProvincesData | null;
  cities: getCitiesData | null;
}

const createCitiesMap = (cities: Record<string, CityItem[]> | null) => {
  // 确保基础数据安全
  const safeCities = cities || {};

  // 遍历所有省份下的城市，构建ID到名称的映射
  return Object.values(safeCities).reduce((map, cityList) => {
    cityList.forEach(city => {
      map[city.id] = city.name;
    });
    return map;
  }, {} as Record<string, string>);
}

const ProfilePageRender = ({ provinces, cities }: ProfilePageProps) => {
  const { setActive, setSection } = useNavbar();
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useUser();


  const provinceMap = (provinces ?? []).reduce((map, province) => {
    map[province.id] = province.name;
    return map;
  }, {} as Record<string, string>);

  const citiesMap = createCitiesMap(cities);

  const [availableCities, setAvailableCities] = useState<CityItem[]>([] as CityItem[]);

  // 处理省份变更，更新城市列表
  const handleProvinceChange = (value: string | null) => {
    if (value && cities) {
      form.setFieldValue('province', value);
      // 安全地获取第一个城市ID，避免空数组错误
      form.setFieldValue('city', cities[value]?.[0]?.id || '');
      // 更新可用城市列表
      setAvailableCities(cities[value] || []);
    }
  };

  // 表单提交处理
  const handleSubmit = async (values: typeof form.values): Promise<void> => {
    if (!user) {return;} // 确保用户存在

    setLoading(true);
    try {
      // 处理表单数据，转换为API需要的格式
      const formattedData = {
        ...values,
        // 处理日期格式 - 确保后端能正确解析
        birthday: values.birthday ? new Date(values.birthday).toISOString().split('T')[0] : '',
        province: {
          id: values.province,
          name: provinceMap[values.province]
        },
        city: {
          id: values.city,
          name: citiesMap[values.city]
        }
      };

      // 调用编辑个人资料API
      const response = await editMyProfile(formattedData);

      if (response.code === 0) {
        notify('Profile updated successfully', 'success');

        // 更新本地用户上下文
        if (updateUser) {
          updateUser({
            ...user,
            profile: {
              ...user.profile,
              ...formattedData
            }
          })
        }
      } else {
        notify(response.message || 'Failed to update profile', 'error');
      }
    } catch (err) {
      if (err instanceof Error) {
        notify(err.message, 'error');
      } else {
        notify('系统错误', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    form.reset();
  };

  useEffect(() => {
    setSection('Account');
    setActive('User Profile');
  }, [setSection, setActive]); // 添加缺失的依赖项

  useEffect(() => {
    if (user?.profile?.province?.id && cities) {
      setAvailableCities(cities[user.profile.province.id] || []);
    }
  }, [cities, user?.profile?.province?.id]); // 更精确的依赖项

  const items = [{ title: 'Home', href: '/' }, { title: 'User Profile' }];

  const form = useForm({
    initialValues: {
      nickname: user?.profile?.nickname || '',
      avatar: user?.profile?.avatar || '',
      signature: user?.profile?.signature || '',
      gender: user?.profile?.gender || 1,
      birthday: user?.profile?.birthday || '',
      province: user?.profile?.province?.id || '',
      city: user?.profile?.city?.id || '',
      address: user?.profile?.address || '',
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
      province: (val) => {
        if (!val) {
          return 'Please select a province';
        }
        return null;
      },
      city: (val) => {
        if (!val) {
          return 'Please select a city';
        }
        return null;
      },
      address: (val) => {
        if (!val) {
          return 'This field is required';
        }
        return null;
      },
    },
  });

  return (
    <Box>
      {/* 面包屑 */}
      <Breadcrumbs>
        {items.map((item, index) =>
          item.href ? (
            <Anchor key={index} component={Link} href={item.href}>
              {item.title}
            </Anchor>
          ) : (
            <Anchor
              key={index}
              role="button"
              component="span"
              onClick={() => {}}
            >
              {item.title}
            </Anchor>
          )
        )}
      </Breadcrumbs>

      {/* 页面容器 */}
      <Paper pt="lg" pb="lg">
        {/* 页面容器 - 标题 */}
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
            {/* 页面内容 - 表单 */}
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Grid>
                <Grid.Col span={{ base: 12, md: 12, lg: 6, xl: 5 }}>
                  <Stack>
                    {/* 昵称（文本） */}
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
                          error={form.errors.nickname}
                          radius="md"
                        />
                      </Grid.Col>
                    </Grid>

                    {/* 个人签名(textarea) */}
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
                          error={form.errors.signature}
                          radius="md"
                          resize="vertical"
                        />
                      </Grid.Col>
                    </Grid>

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

                    {/* 出生日期 (datepicker) */}
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
                          maxDate={new Date()}
                          error={form.errors.birthday}
                        />
                      </Grid.Col>
                    </Grid>

                    {/* 位置 - 省市联动 (下拉框) */}
                    <Grid>
                      {/* 省份选择 */}
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

                      {/* 城市选择 */}
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

                    {/* 详细地址 (文本) */}
                    <Grid>
                      <Grid.Col span={12} pr={{ base: 0, sm: 'sm' }}>
                        <Textarea
                          required
                          label="Address"
                          placeholder="Enter your detailed address"
                          value={form.values.address}
                          onChange={(event) =>
                            form.setFieldValue('address', event.currentTarget.value)
                          }
                          error={form.errors.address}
                          radius="md"
                          resize="vertical"
                        />
                      </Grid.Col>
                    </Grid>

                    {/* 表单按钮 */}
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

                <Grid.Col span={{ base: 12, md: 12, lg: 6, xl: 7 }}>
                  {/* 头像上传区域 */}
                  <Stack align="center" px={{ lg: 'xl' }}>
                    <Avatar
                      src={form.values.avatar || '/avatar_default.png'}
                      alt={user?.account?.username || 'User avatar'}
                      size={120}
                      radius={120}
                      mx="auto"
                    />
                    <Button variant="default" mt="md">
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
