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
  Progress,
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
  FileButton,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { getCitiesData, getProvincesData } from '@/api/data/response';
import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';
import { useUser } from '@/contexts/UserContext/UserContext';
import '@mantine/dates/styles.css';
import { uploadRequest } from '@/api/file/request';
import { IconCalendar, IconUpload } from '@tabler/icons-react';
import { CityItem } from '@/api/data/typings';
import { editMyProfile } from '@/api/my/api';
import notify from '@/utils/notify';
import { upload } from '@/api/file/api';
import { getImageUrl } from '@/utils/path';

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

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0); // 新增：上传进度
  const [avatarDisplay, setAvatarDisplay] = useState<string>(user?.profile.avatar||'');

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
        // 更新本地用户上下文
        if (updateUser && user) {
          updateUser({
            ...user,
            profile: {
              ...user.profile,
              ...formattedData
            }
          })
        }
        notify('Profile updated successfully', 'success');
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
      setUploading(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    form.reset();
    setUploading(false);
  };


  const handleUpload = async () => {
    if (!file) { return; }
    setUploadProgress(0);
    // 验证文件大小
    if (file.size > 5 * 1024 * 1024) { // 5MB in bytes
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      notify(`File size is too large (${fileSizeMB}MB). Maximum allowed size is 5MB.`);
      setFile(null);
      return;
    }

    // 处理文件上传
    try {
      // 构造上传参数
      const uploadData: uploadRequest  = {
        path: '/avatar',
        file,
      }
      const response = await upload(uploadData,{
        onUploadProgress: (progressEvent:any) => {
          // 计算上传进度百分比
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setUploadProgress(percent);
          }
        },
      });
      if (response.code === 0) {
        if (response.data) {
          form.setFieldValue('avatar',response.data.target)
          setAvatarDisplay(response.data.target)
          // const requestEditMyAvatar: editMyAvatarRequest = {
          //   avatar: response.data.target
          // }
          // // editMyAvatar
          // const  responseEditMyAvatar = await editMyAvatar(requestEditMyAvatar)
          // if (responseEditMyAvatar.code === 0) {
          //   // 更新本地用户上下文
          //   if (updateUser && user) {
          //     updateUser({
          //       ...user,
          //       profile: {
          //         ...user.profile,
          //         avatar: response.data.target
          //       }
          //     })
          //   }
          //   // 更新用户头像
          //   notify('Avatar uploaded successfully', 'success');
          //   setFile(null);
          // }
        }
      } else {
        notify(response.message || 'Failed to upload avatar', 'error');
      }

    } catch (err) {
      if (err instanceof Error) {
        notify(err.message, 'error');
      } else {
        notify('系统错误', 'error');
      }
    }
  }

  useEffect(() => {
    setSection('Account');
    setActive('User Profile');
  }, [setSection, setActive]); // 添加缺失的依赖项

  useEffect(() => {
    if (user?.profile?.province?.id && cities) {
      setAvailableCities(cities[user.profile.province.id] || []);
    }
  }, [cities, user?.profile?.province?.id]); // 更精确的依赖项

   useEffect(() => {
    if (file) {
      setUploading(true);
      handleUpload().then(()=>{
        // setUploading(false);
      })
    }
  }, [file]);

  const items = [
    { title: 'Home', href: '/' },
    { title: 'Account' },
    { title: 'User Profile' }
  ];

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
        if (!val || val.trim() === '') {
          return 'This field is required';
        }
        return null;
      },
      signature: (val) => {
        if (!val || val.trim() === '') {
          return 'This field is required';
        }
        return null;
      },
      birthday: (val) => {
        if (!val || val.trim() === '') {
          return 'This field is required';
        }
        return null;
      },
      province: (val) => {
        if (!val || val.trim() === '') {
          return 'This field is required';
        }
        return null;
      },
      city: (val) => {
        if (!val || val.trim() === '') {
          return 'This field is required';
        }
        return null;
      },
      address: (val) => {
        if (!val || val.trim() === '') {
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
      <Paper pt="xs" pb="xs">
        {/* 页面容器 - 标题 */}
        <Box mb="md">
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
                    <TextInput
                      name="avatar"
                      value={form.values.avatar}
                      onChange={(event) => form.setFieldValue('avatar', event.currentTarget.value)}
                      hidden
                    />
                  </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 12, lg: 6, xl: 7 }}>
                  {/* 头像上传区域 */}
                  <Stack align="center" px={{ lg: 'xl' }}>
                    <Avatar
                      src={ getImageUrl(avatarDisplay) || '/avatar_default.png' }
                      alt={ user?.account?.username || 'User avatar' }
                      size={ 120 }
                      radius={ 120 }
                      mx="auto"
                    />
                    <FileButton
                      onChange={ setFile }
                      accept="image/*"
                      multiple={false}
                    >
                      {
                        (props) =>
                          <Button
                            {...props}
                            variant="default"
                            leftSection={<IconUpload size={14} />}
                            mt="md"
                          >
                            Upload Avatar
                          </Button>
                      }
                    </FileButton>
                    {
                      uploading && (
                        <Box w="70%">
                          <Progress.Root size="lg" >
                            <Progress.Section value={uploadProgress}>
                              <Progress.Label>
                                {uploadProgress}%
                              </Progress.Label>
                            </Progress.Section>
                          </Progress.Root>
                        </Box>
                      )
                    }
                    {/* 文件大小提示 */}
                    <Text size="xs" c="dimmed" >
                      Supports JPG, PNG. Max size 5MB
                    </Text>
                  </Stack>

                </Grid.Col>
              </Grid>
              <Grid>
                <Grid.Col span={12}>
                  {/* 表单按钮 */}
                  <Group justify="flex-start" mt="lg">
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
