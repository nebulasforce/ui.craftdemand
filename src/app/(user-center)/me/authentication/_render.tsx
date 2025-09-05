'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ActionIcon,
  Anchor,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Flex,
  Grid, Loader,
  Modal,
  Paper,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';
import { useUser } from '@/contexts/UserContext/UserContext';
import { useForm } from '@mantine/form';
import {
  IconCheck,
  IconX,
  IconEdit,
  IconBrandGoogleFilled,
  IconBrandX,
  IconBrandWechat,
  IconBrandAlipay
} from '@tabler/icons-react';
import { editMyUsername } from '@/api/me/api';
import notify from '@/utils/notify';
import useDebounce from '@/utils/debouce';
import { check } from '@/api/auth/api';


interface AccountPageProps {
  initialData: any
}

const AccountPageRender =  ({ initialData }:AccountPageProps) => {
  const { setActive, setSection } = useNavbar();
  const { user ,updateUser} = useUser();
  const [loading, setLoading] = useState(false);

  const usernameActive = 1 << 0;
  const hasUsernameEditPermission = () => {
    if (user?.account?.active === undefined) {return true;}
    return !((user.account.active & usernameActive) === 0);
  }

  const passwordSet = 1 << 1;
  const hasPasswordSet = () => {
    if (user?.account?.active === undefined) {return false;}
    return (user.account.active & passwordSet) !== 0;
  }

  const emailActive = 1 << 2;
  const hasEmailActive = () => {
    if (user?.account?.active === undefined) {return false;}
    return (user.account.active & emailActive) !== 0;
  }

  const mobileActive = 1 << 3;
  const hasMobileActive = () => {
    if (user?.account?.active === undefined) {return false;}
    return (user.account.active & mobileActive) !== 0;
  }

  const items = [{ title: 'Home', href: '/' }, { title: 'Authentication' }];
  useEffect(() => {
    setSection('Account');
    setActive('Authentication');
  }, [setActive, setSection]); // 合并依赖项


  const [checkUsernameLoading, setCheckUsernameLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);


  const [usernameModalOpened, usernameModalActions] = useDisclosure(false);
  const usernameForm = useForm({
    initialValues: {
      username: user?.account?.username || '',
    },
    validate: {
      username: (val) => {
        if (!val) {
          return 'This field is required';
        }
        return null;
      },
    },
  });

  // 弹窗关闭时重置状态
  useEffect(() => {
    if (!usernameModalOpened) {
      setCheckUsernameLoading(false);
      setUsernameAvailable(null);
      // usernameForm.reset();
    } else {
      usernameForm.setFieldValue('username', user?.account?.username||'');
    }
  }, [usernameModalOpened]);

  // 表单提交处理
  const handleUsernameFormSubmit = async (values: typeof usernameForm.values): Promise<void> => {
    if (!user) {return;} // 确保用户存在

    setLoading(true);
    try {
      // 处理表单数据，转换为API需要的格式
      const formattedData = {
        ...values,
      };

      // 调用编辑个人资料API
      const response = await editMyUsername(formattedData);

      if (response.code === 0) {
        usernameModalActions.close()
        // 更新本地用户上下文
        if (updateUser && user) {
          updateUser({
            ...user,
            account: {
              ...user.account,
              ...formattedData,
            },
            profile: {
              ...user.profile,
            }
          })
        }
        notify('The username updated successfully', 'success');
      } else {
        notify(response.message || 'Failed to update the username', 'error');
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


  // 防抖处理用户名校验，500ms延迟
  const debouncedCheckUsername = useDebounce(async (username: string) => {
    const trimmedUsername = username.trim();

    // 无需校验的情况
    if (!trimmedUsername || trimmedUsername.length < 3 || trimmedUsername === user?.account?.username) {
      setCheckUsernameLoading(false);
      setUsernameAvailable(null);
      return;
    }

    setCheckUsernameLoading(true);
    try {
      const response = await check({ key: trimmedUsername });
      if (response.code === 0 && response.data?.registerAble) {
        setUsernameAvailable(response.data?.registerAble);
      } else {
        notify(response.message || 'Failed to check username availability', 'error');
        setUsernameAvailable(null);
      }
    } catch (err) {
      notify('Error checking username availability', 'error');
      setUsernameAvailable(null);
    } finally {
      setCheckUsernameLoading(false);
    }
  }, 500);

  // 处理用户名输入变化
  const handleUsernameChange = (event:ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    usernameForm.setFieldValue('username', value);
    debouncedCheckUsername(value);
  };

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
            <Anchor key={index} role="button" component="span" onClick={() => {}}>
              {item.title}
            </Anchor>
          )
        )}
      </Breadcrumbs>

      <Paper pt="lg" pb="lg">
        {/* 页面容器 - 标题 */}
        <Box mb="lg">
          <Title order={3}>Authentication</Title>
          <Text size="sm" c="dimmed">
            Verify your identity to enhance account security and access additional features.
          </Text>
        </Box>
        <Divider mb="lg" my="xs" variant="dashed" />

        <Box pos="relative">
            <Stack gap="lg"  >
              {/*username*/}
              <Grid>
                <Grid.Col  span={{ base: 10, md: 10, lg: 6, xl: 6 }} >
                  <Text  size="sm">Username</Text>
                  <Text size="sm" c="dimmed">
                    Username can only be set once:  <Space w="md" component="span" /> <b>{user?.account?.username}</b>
                  </Text>
                </Grid.Col>
                <Grid.Col display="flex"  span={{ base: 2, md: 2, lg: 2, xl: 2 }}>
                    <Flex align="center">
                      <Button leftSection={<IconEdit size={14} />} onClick={usernameModalActions.open} disabled={hasUsernameEditPermission()}  variant="default" size="xs">
                        Edit
                      </Button>
                    </Flex>
                </Grid.Col>
              </Grid>

              <Grid >
                <Grid.Col  span={{ base: 12, md: 12, lg: 8, xl: 8 }}>
                  <Divider my="xs" />
                </Grid.Col>
              </Grid>

              {/*password*/}
              <Grid>
                <Grid.Col  span={{ base: 10, md: 10, lg: 6, xl: 6 }} >
                  <Text  size="sm">Password</Text>
                  <Text size="sm" c="dimmed">
                    Your password is {hasPasswordSet()? 'set':'not set'}.
                  </Text>
                </Grid.Col>
                <Grid.Col display="flex"  span={{ base: 2, md: 2, lg: 2, xl: 2 }}>
                  <Flex align="center">
                    <Button leftSection={<IconEdit size={14} />} variant="default" size="xs">
                      Edit
                    </Button>
                  </Flex>
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={{ base: 12, md: 12, lg: 8, xl: 8 }}>
                  <Divider my="xs" />
                </Grid.Col>
              </Grid>

              {/*email*/}
              <Grid>
                <Grid.Col  span={{ base: 10, md: 10, lg: 6, xl: 6 }} >
                  <Text  size="sm">Email</Text>
                  <Text size="sm" c="dimmed">
                    Your email is {hasEmailActive()? 'verified':'unverified'}:  <Space w="md" component="span" /> <b>{user?.account?.email}</b>
                  </Text>
                </Grid.Col>
                <Grid.Col display="flex"  span={{ base: 2, md: 2, lg: 2, xl: 2 }}>
                  <Flex align="center">
                    <Button leftSection={<IconEdit size={14} />} variant="default" size="xs">
                      Edit
                    </Button>
                  </Flex>
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={{ base: 12, md: 12, lg: 8, xl: 8 }}>
                  <Divider my="xs" />
                </Grid.Col>
              </Grid>

              {/*mobile*/}
              <Grid>
                <Grid.Col  span={{ base: 10, md: 10, lg: 6, xl: 6 }} >
                  <Text  size="sm">Mobile Number</Text>
                  <Text size="sm" c="dimmed">
                    Your mobile number is {hasMobileActive()? 'verified':'unverified'}:  <Space w="md" component="span" /> <b>{user?.account?.mobile}</b>
                  </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 2, md: 2, lg: 2, xl: 2 }}>
                  <Button leftSection={<IconEdit size={14} />} size="xs" variant="default">
                    Edit
                  </Button>
                </Grid.Col>
              </Grid>

              <Grid >
                <Grid.Col  span={{ base: 12, md: 12, lg: 8, xl: 8 }}>
                  <Divider my="xs" />
                </Grid.Col>
              </Grid>

              {/*三方*/}
              <Grid>
                <Grid.Col  span={{ base: 12, md: 12, lg: 8, xl: 8 }} >
                  <Text  size="sm">Social Account</Text>
                </Grid.Col>
              </Grid>
              <Grid >
                <Grid.Col  span={{ base: 12, md: 12, lg: 8, xl: 8 }} >
                  <Flex
                    gap="md"
                  >
                    <ActionIcon size="lg" variant="default" aria-label="ActionIcon with size as a number">
                      <IconBrandGoogleFilled size={24} />
                    </ActionIcon>
                    <ActionIcon size="lg" variant="default" aria-label="ActionIcon with size as a number">
                      <IconBrandX size={24} />
                    </ActionIcon>
                    <ActionIcon size="lg" variant="default" aria-label="ActionIcon with size as a number">
                      <IconBrandWechat size={24} />
                    </ActionIcon>
                    <ActionIcon size="lg" variant="default" aria-label="ActionIcon with size as a number">
                      <IconBrandAlipay size={24} />
                    </ActionIcon>
                  </Flex>
                </Grid.Col>
              </Grid>

            </Stack>

        </Box>
      </Paper>


      {/* 独立的 Username 弹窗 */}
      <Modal
        opened={usernameModalOpened}
        title="Edit Username"
        onClose={usernameModalActions.close}
        size="md"
      >
        <form onSubmit={usernameForm.onSubmit(handleUsernameFormSubmit)}>
          <TextInput
            label="Username"
            required
            placeholder="Enter new username"
            value={usernameForm.values.username}
            // onChange={(event) =>
            //   usernameForm.setFieldValue('username', event.currentTarget.value)
            // }
            onChange={handleUsernameChange}
            rightSection={
              checkUsernameLoading ? (
                <Loader size={16} />
              ) : usernameForm.values.username.trim() && usernameForm.values.username.trim() !== user?.account?.username && usernameAvailable !== null ? (
                usernameAvailable ? (
                  <IconCheck color="green" size={16} />
                ) : (
                  <IconX color="red" size={16} />
                )
              ) : null
            }
            error={usernameForm.errors.username}
          />
          <Flex justify="flex-end" gap="sm" mt="lg">
            <Button type="submit" disabled={loading}>Save</Button>
          </Flex>
        </form>
      </Modal>
    </Box>
  );
}

export default AccountPageRender;
