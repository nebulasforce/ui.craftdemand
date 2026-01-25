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
  Flex, FocusTrap,
  Grid, Loader,
  Modal,
  Paper, PasswordInput,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure, useInterval } from '@mantine/hooks';
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
import {
  editMyEmail,
  editMyMobile,
  editMyPassword,
  editMyUsername,
  sendEmailVerifiedCode,
  sendMobileVerifiedCode,
} from '@/api/my/api';
import notify from '@/utils/notify';
import useDebounce from '@/utils/debouce';
import { check } from '@/api/auth/api';
import {
  editMyEmailRequest,
  editMyMobileRequest, editMyPasswordRequest,
  sendEmailVerifiedCodeRequest,
  sendMobileVerifiedCodeRequest,
} from '@/api/my/request';

// sendMobileVerificationCode 假设这里有发送验证码的函数
const sendMobileVerificationCode = async (mobile: string) => {
  try {
    // 调用服务端接口
    const response = await sendMobileVerifiedCode({
      mobile,
    } as sendMobileVerifiedCodeRequest);

    if (response.code === 0) {
      return true;
    }
    return false;

  } catch (err) {
    if (err instanceof Error) {
      notify(err.message, 'error');
    } else {
      notify('内部错误', 'error');
    }
    return false;
  }
};

// sendEmailVerificationCode 假设这里有发送验证码的函数
const sendEmailVerificationCode = async (email: string) => {
  try {
    // 调用服务端接口
    const response = await sendEmailVerifiedCode({
      email,
    } as sendEmailVerifiedCodeRequest);

    if (response.code === 0) {
      return true;
    }
    return false;

  } catch (err) {
    if (err instanceof Error) {
      notify(err.message, 'error');
    } else {
      notify('内部错误', 'error');
    }
    return false
  }
};

interface AccountPageProps {
  initialData?: any
}

// eslint-disable-next-line no-empty-pattern
const AccountPageRender =  ({  }:AccountPageProps) => {
  const { setActive, setSection } = useNavbar();
  const { user ,updateUser} = useUser();
  const [loading, setLoading] = useState(false);


  const usernameActive = 1 << 0;
  const hasUsernameEditPermission = () => {
    if (user?.account?.active === undefined) {return true;}
    return !((user.account.active & usernameActive) === 0);
  }
  const [usernameEditDisabled, setUsernameEditDisabled] = useState<boolean>(hasUsernameEditPermission());

  const passwordSetFlag = 1 << 1;
  const hasPasswordSet = () => {
    if (user?.account?.active === undefined) {return false;}
    return (user.account.active & passwordSetFlag) !== 0;
  }
  const [passwordSet] = useState<boolean>(hasPasswordSet());

  const emailActiveFlag = 1 << 2;
  const hasEmailActive = () => {
    if (user?.account?.active === undefined) {return false;}
    return (user.account.active & emailActiveFlag) !== 0;
  }
  const [emailActive, setEmailActive] = useState<boolean>(hasEmailActive());


  const mobileActiveFlag = 1 << 3;
  const hasMobileActive = () => {
    if (user?.account?.active === undefined) {return false;}
    return (user.account.active & mobileActiveFlag) !== 0;
  }
  const [mobileActive,setMobileActive] = useState<boolean>(hasMobileActive());

  const items = [
    { title: '首页', href: '/' },
    { title: '账户' },
    { title: '认证资料' }
  ];
  useEffect(() => {
    setSection('Account');
    setActive('Authentication');
  }, [setActive, setSection]); // 合并依赖项


  const [emailEditCountdown, setEmailEditCountdown] = useState(() => {
    if (typeof window !== 'undefined') {
      const cd = localStorage.getItem('emailEditCountdown');
      return cd ? Math.max(0, Number(cd)) : 0;
    }
    return 0;
  });

  const [mobileEditCountdown, setMobileEditCountdown] = useState(() => {
    if (typeof window !== 'undefined') {
      const cd = localStorage.getItem('mobileEditCountdown');
      return cd ? Math.max(0, Number(cd)) : 0;
    }
    return 0;
  });


  const [checkUsernameLoading, setCheckUsernameLoading] = useState(false);
  const [checkEmailLoading, setCheckEmailLoading] = useState(false);
  const [checkMobileLoading, setCheckMobileLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [mobileAvailable, setMobileAvailable] = useState<boolean | null>(null);

  const [usernameModalOpened, usernameModalActions] = useDisclosure(false);
  const usernameForm = useForm({
    initialValues: {
      username: user?.account?.username || '',
    },
    validate: {
      username: (val) => {
        if (!val || val.trim() === '') {
          return '此字段为必填项';
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

  const [passwordModalOpened, setPasswordModalActions] = useDisclosure(false);
  const passwordForm = useForm({
    initialValues: {
      confirmPassword: '',
      password: '',
      currentPassword: '',
    },
    validate: {
      confirmPassword: (val) => {
        if (!val || val.trim() === '') {
          return '此字段为必填项';
        }
        return null;
      },
      currentPassword: (val) => {
        if (!val) {
          return '此字段为必填项';
        }
        return null;
      },
      password: (val) => {
        if (!val) {
          return '此字段为必填项';
        }
        return null;
      },
    }
  })

  // 弹窗关闭时重置状态
  useEffect(() => {
    if (!passwordModalOpened) {
      // usernameForm.reset();
    } else {
      passwordForm.setFieldValue('currentPassword', '');
      passwordForm.setFieldValue('password', '');
      passwordForm.setFieldValue('confirmPassword', '');
    }
  }, [passwordModalOpened]);

  const [emailModalOpened, setEmailModalActions] = useDisclosure(false);
  const emailForm = useForm({
    initialValues: {
      email: '',
      authCode: '',
    },
    validate: {
      email: (val) => {
        if (!val || val.trim() === '') {
          return '此字段为必填项';
        }
        return null;
      },
      authCode: (val) => {
        if (!val) {
          return '此字段为必填项';
        }
        return null;
      },
    }
  })

  // 弹窗关闭时重置状态
  useEffect(() => {
    if (!emailModalOpened) {
      // usernameForm.reset();
    } else {
      emailForm.setFieldValue('email', user?.account?.email||'');
      emailForm.setFieldValue('captcha', '');

    }
  }, [emailModalOpened]);

  const [mobileModalOpened, setMobileModalActions] = useDisclosure(false);
  const mobileForm = useForm({
    initialValues: {
      mobile: '',
      authCode: '',
    },
    validate: {
      mobile: (val) => {
        if (!val || val.trim() === '') {
          return '此字段为必填项';
        }
        return null;
      },
      authCode: (val) => {
        if (!val) {
          return '此字段为必填项';
        }
        return null;
      },
    }
  })

  // 弹窗关闭时重置状态
  useEffect(() => {
    if (!mobileModalOpened) {
      // usernameForm.reset();
    } else {
      mobileForm.setFieldValue('mobile', user?.account?.mobile||'');
      mobileForm.setFieldValue('captcha', '');
    }
  }, [mobileModalOpened]);



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
          setUsernameEditDisabled(true)
        }
        notify('用户名更新成功', 'success');
      } else {
        notify(response.message || '更新用户名失败', 'error');
      }
    } catch (err) {
      if (err instanceof Error) {
        notify(err.message, 'error');
      } else {
        notify('内部错误', 'error');
      }
    } finally {
      setLoading(false);
    }
  };


  const handlePasswordFormSubmit = async (values: typeof passwordForm.values): Promise<void> => {
    if (!user) {return;} // 确保用户存在
    setLoading(true);

    try {
      // 处理表单数据，转换为API需要的格式
      const params = {
        ...values,
      } as editMyPasswordRequest;

      // 调用编辑个人资料API
      const response = await editMyPassword(params);

      if (response.code === 0) {
        setPasswordModalActions.close()
        // 更新本地用户上下文
        notify('密码更新成功', 'success');
      } else {
        notify(response.message || '更新密码失败', 'error');
      }
    } catch (err) {
      if (err instanceof Error) {
        notify(err.message, 'error');
      } else {
        notify('内部错误', 'error');
      }
    } finally {
      setLoading(false);
    }
  }

  const handleEmailFormSubmit = async (values: typeof emailForm.values): Promise<void> => {
    if (!user) {return;} // 确保用户存在
    setLoading(true);
    try {
      // 处理表单数据，转换为API需要的格式
      const params = {
        ...values,
      } as editMyEmailRequest;

      // 调用编辑个人资料API
      const response = await editMyEmail(params);

      if (response.code === 0) {
        setEmailModalActions.close()
        // 更新本地用户上下文
        if (updateUser && user) {
          updateUser({
            ...user,
            account: {
              ...user.account,
              'email': params.email,
            },
            profile: {
              ...user.profile,
            }
          })
        }
        notify('邮箱更新成功', 'success');
        emailForm.setFieldValue('authCode', '');
        setEmailActive(true)
        setTimeout(() => {
          setEmailEditCountdown(-1);
        }, 1000);
      } else {
        notify(response.message || '更新邮箱失败', 'error');
      }
    } catch (err) {
      if (err instanceof Error) {
        notify(err.message, 'error');
      } else {
        notify('内部错误', 'error');
      }
    } finally {
      setLoading(false);
    }
  }

  const handleMobileFormSubmit = async (values: typeof mobileForm.values): Promise<void> => {
    if (!user) {return;} // 确保用户存在
    setLoading(true);
    try {
      // 处理表单数据，转换为API需要的格式
      const params = {
        ...values,
      } as editMyMobileRequest;

      // 调用编辑个人资料API
      const response = await editMyMobile(params);

      if (response.code === 0) {
        setMobileModalActions.close()
        // 更新本地用户上下文
        if (updateUser && user) {
          updateUser({
            ...user,
            account: {
              ...user.account,
              'mobile': params.mobile,
            },
            profile: {
              ...user.profile,
            }
          })
        }
        notify('手机号更新成功', 'success');
        mobileForm.setFieldValue('authCode', '');
        setMobileActive(true)
        setTimeout(() => {
          setMobileEditCountdown(-1);
        }, 1000);
      } else {
        notify(response.message || '更新手机号失败', 'error');
      }
    } catch (err) {
      if (err instanceof Error) {
        notify(err.message, 'error');
      } else {
        notify('内部错误', 'error');
      }
    } finally {
      setLoading(false);
    }
  }

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
        setUsernameAvailable(false);
      }
    } catch (err) {
      notify('检查用户名可用性时出错', 'error');
      setUsernameAvailable(null);
    } finally {
      setCheckUsernameLoading(false);
    }
  }, 500);

  // 防抖处理邮箱校验，500ms延迟
  const debouncedCheckEmail = useDebounce(async (email: string) => {
    const trimmedEmail = email.trim();

    // 无需校验的情况
    if (!trimmedEmail || trimmedEmail.length < 3 || trimmedEmail === user?.account?.email) {
      setCheckEmailLoading(false);
      setEmailAvailable(null);
      return;
    }

    setCheckEmailLoading(true);
    try {
      const response = await check({ key: trimmedEmail });
      if (response.code === 0 && response.data?.registerAble) {
        setEmailAvailable(response.data?.registerAble);
      } else {
        setEmailAvailable(false);
      }
    } catch (err) {
      notify('检查邮箱可用性时出错', 'error');
      setEmailAvailable(null);
    } finally {
      setCheckEmailLoading(false);
    }
  }, 500);

  // 防抖处理手机号校验，500ms延迟
  const debouncedCheckMobile = useDebounce(async (mobile: string) => {
    const trimmedMobile = mobile.trim();

    // 无需校验的情况
    if (!trimmedMobile || trimmedMobile.length < 3 || trimmedMobile === user?.account?.mobile) {
      setCheckMobileLoading(false);
      setMobileAvailable(null);
      return;
    }

    setCheckMobileLoading(true);
    try {
      const response = await check({ key: trimmedMobile });
      if (response.code === 0 && response.data?.registerAble) {
        setMobileAvailable(response.data?.registerAble);
      } else {
        setMobileAvailable(false);
      }
    } catch (err) {
      notify('检查手机号可用性时出错', 'error');
      setMobileAvailable(null);
    } finally {
      setCheckMobileLoading(false);
    }
  }, 500);

  // 处理用户名输入变化
  const handleUsernameChange = (event:ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    usernameForm.setFieldValue('username', value);
    debouncedCheckUsername(value);
  };

  const handleEmailChange = (event:ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    emailForm.setFieldValue('email', value);
    debouncedCheckEmail(value);
  };

  const handleMobileChange = (event:ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    mobileForm.setFieldValue('mobile', value);
    debouncedCheckMobile(value);
  };

  // handleEmailSendCaptcha 发送邮箱验证码
  const handleEmailSendCaptcha = async () => {
    const { email } = emailForm.values; // 变量名从mobile改为email，表单也对应修改

    // 验证邮箱格式（调整为邮箱正则表达式）
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      notify('请输入有效的邮箱地址', 'error'); // 提示信息改为邮箱相关
      return;
    }

    // 防止重复发送（这部分逻辑无需修改）
    if (emailEditCountdown > 0) {
      return;
    }

    try {
      setEmailEditCountdown(60); // 设置倒计时60秒
      // 调用发送邮箱验证码的接口（函数名改为邮箱相关）
      const success = await sendEmailVerificationCode(email);
      if (!success) {
        setEmailEditCountdown(0); // 发送失败则重置倒计时
        notify(`验证码发送到 ${email} 失败`, 'error');
      }else {
        notify(`验证码已成功发送到 ${email}`, 'success');
      }
    } catch (error) {
      setEmailEditCountdown(0);
    }
  };

  // 发送手机验证码
  const handleMobileSendCaptcha = async () => {
    const { mobile } = mobileForm.values;
    // 验证手机号
    if (!mobile || !/^1[3-9]\d{9}$/.test(mobile)) {
      notify('请输入有效的手机号码', 'error');
      return;
    }
    // 防止重复发送
    if (mobileEditCountdown > 0) {
      return;
    }
    try {
      setMobileEditCountdown(60); // 设置倒计时60秒
      const success = await sendMobileVerificationCode(mobile);
      if (!success) {
        setEmailEditCountdown(0); // 发送失败则重置倒计时
        notify(`验证码发送到 ${mobile} 失败`, 'error');
      }else {
        notify(`验证码已成功发送到 ${mobile}`, 'success');
      }
    } catch (error) {
      setMobileEditCountdown(0);
    }
  };

  // 倒计时逻辑
  useInterval(
    () => {
      if (emailEditCountdown > 0) {
        setEmailEditCountdown((c) => c - 1); // 使用函数式更新确保拿到最新值
        localStorage.setItem('emailEditCountdown', emailEditCountdown.toString());
      } else {
        localStorage.removeItem('emailEditCountdown');
      }
    },
    1000,
    { autoInvoke: true }
  ); // 固定1000ms间隔

  // 倒计时逻辑
  useInterval(
    () => {
      if (mobileEditCountdown > 0) {
        setMobileEditCountdown((c) => c - 1); // 使用函数式更新确保拿到最新值
        localStorage.setItem('mobileEditCountdown', mobileEditCountdown.toString());
      } else {
        localStorage.removeItem('mobileEditCountdown');
      }
    },
    1000,
    { autoInvoke: true }
  ); // 固定1000ms间隔

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

      <Paper pt="xs" pb="xs">
        {/* 页面容器 - 标题 */}
        <Box mb="md">
          <Title order={3}>认证资料</Title>
          <Text size="sm" c="dimmed">
            验证您的认证资料，以增强账户安全性并访问更多功能。
          </Text>
        </Box>
        <Divider mb="lg" my="xs" variant="dashed" />

        <Box pos="relative">
            <Stack gap="lg"  >
              {/*username*/}
              <Grid>
                <Grid.Col  span={{ base: 10, md: 10, lg: 6, xl: 6 }} >
                  <Text  size="sm">用户名</Text>
                  <Text size="sm" c="dimmed">
                    用户名只能设置一次：  <Space w="md" component="span" />
                    <Text inherit c="blue" fw={700} component="span">
                      {user?.account?.username}
                    </Text>
                  </Text>
                </Grid.Col>
                <Grid.Col display="flex"  span={{ base: 2, md: 2, lg: 2, xl: 2 }}>
                    <Flex align="center">
                      <Button leftSection={<IconEdit size={14} />} onClick={usernameModalActions.open} disabled={usernameEditDisabled}  variant="default" size="xs">
                        编辑
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
                  <Text  size="sm">密码</Text>
                  <Text size="sm" c="dimmed">
                    您的密码{passwordSet? '已设置':'未设置'}。
                  </Text>
                </Grid.Col>
                <Grid.Col display="flex"  span={{ base: 2, md: 2, lg: 2, xl: 2 }}>
                  <Flex align="center">
                    <Button leftSection={<IconEdit size={14} />} onClick={setPasswordModalActions.open} variant="default" size="xs">
                      编辑
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
                  <Text  size="sm">邮箱</Text>
                  <Text size="sm" c="dimmed">
                    您的邮箱{emailActive? '已验证':'未验证'}：  <Space w="md" component="span" />
                    <Text inherit c="blue" component="span">
                      <b>{user?.account?.email}</b>
                    </Text>
                  </Text>
                </Grid.Col>
                <Grid.Col display="flex"  span={{ base: 2, md: 2, lg: 2, xl: 2 }}>
                  <Flex align="center">
                    <Button leftSection={<IconEdit size={14} />} onClick={setEmailModalActions.open} variant="default" size="xs">
                      编辑
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
                  <Text  size="sm">手机号码</Text>
                  <Text size="sm" c="dimmed">
                    您的手机号码{mobileActive? '已验证':'未验证'}：  <Space w="md" component="span" />
                    <Text inherit c="blue" component="span">
                      <b>{user?.account?.mobile}</b>
                    </Text>
                  </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 2, md: 2, lg: 2, xl: 2 }}>
                  <Button leftSection={<IconEdit size={14} />} onClick={setMobileModalActions.open} size="xs" variant="default">
                    编辑
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
                  <Text  size="sm">社交账号</Text>
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
        title="编辑用户名"
        onClose={usernameModalActions.close}
        size="md"
      >
        <FocusTrap active>
          <form onSubmit={usernameForm.onSubmit(handleUsernameFormSubmit)}>
          <TextInput
            label="用户名"
            required
            placeholder="请输入新用户名"
            key={usernameForm.key('username')}
            value={usernameForm.values.username}
            {...usernameForm.getInputProps('username')}
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
            <Button type="submit" disabled={loading}>保存</Button>
          </Flex>
        </form>
        </FocusTrap>
      </Modal>

      {/*独立的password*/}
      <Modal
        opened={passwordModalOpened}
        title="编辑密码"
        onClose={setPasswordModalActions.close}
        size="md"
      >
        <FocusTrap active>
          <form onSubmit={passwordForm.onSubmit(handlePasswordFormSubmit)}>
          <PasswordInput
            label="当前密码"
            required
            placeholder="请输入当前密码"
            key={passwordForm.key('currentPassword')}
            {...passwordForm.getInputProps('currentPassword')}
          />

          <PasswordInput
            label="新密码"
            required
            placeholder="请输入新密码"
            key={passwordForm.key('password')}
            {...passwordForm.getInputProps('password')}
          />
          <PasswordInput
            mt="sm"
            label="确认密码"
            required
            placeholder="请确认新密码"
            key={passwordForm.key('confirmPassword')}
            {...passwordForm.getInputProps('confirmPassword')}
          />

          <Flex justify="flex-end" gap="sm" mt="lg">
            <Button type="submit" disabled={loading}>保存</Button>
          </Flex>
        </form>
        </FocusTrap>
      </Modal>

      {/*email修改窗口*/}
      <Modal
        opened={emailModalOpened}
        title="编辑邮箱"
        onClose={setEmailModalActions.close}
        size="md"
      >
        <FocusTrap active>
          <form onSubmit={emailForm.onSubmit(handleEmailFormSubmit)}>
          <TextInput
            label="邮箱"
            required
            placeholder="请输入新邮箱"
            key={emailForm.key('email')}
            value={emailForm.values.email}
            {...emailForm.getInputProps('email')}
            // onChange={(event) =>
            //   usernameForm.setFieldValue('username', event.currentTarget.value)
            // }
            onChange={handleEmailChange}
            rightSection={
              checkEmailLoading ? (
                <Loader size={16} />
              ) : emailForm.values.email.trim() && emailForm.values.email.trim() !== user?.account?.email && emailAvailable !== null ? (
                emailAvailable ? (
                  <IconCheck color="green" size={16} />
                ) : (
                  <IconX color="red" size={16} />
                )
              ) : null
            }
            error={emailForm.errors.email}
          />
          {/* 验证码输入框和发送按钮 */}
          <Flex justify="space-between" gap="xs">
            <TextInput
              required
              label="验证码"
              placeholder="请输入验证码"
              value={emailForm.values.authCode}
              onChange={(event) => emailForm.setFieldValue('authCode', event.currentTarget.value)}
              error={emailForm.errors.authCode}
              radius="md"
              flex={3} // 占据3/4宽度
            />
            <Button
              variant="outline"
              radius="md"
              onClick={handleEmailSendCaptcha}
              disabled={loading || emailEditCountdown > 0}
              flex={1} // 占据1/4宽度
              style={{
                minWidth: 120, // 设置最小宽度，防止文本溢出
                alignSelf: 'flex-end', // 确保按钮与输入框底部对齐
              }}
            >
              {emailEditCountdown > 0 ? `${emailEditCountdown} 秒` : '发送验证码'}
            </Button>
          </Flex>
          <Flex justify="flex-end" gap="sm" mt="lg">
            <Button type="submit" disabled={loading}>保存</Button>
          </Flex>
        </form>
        </FocusTrap>
      </Modal>

      {/*mobile修改窗口*/}
      <Modal
        opened={mobileModalOpened}
        title="编辑手机号"
        onClose={setMobileModalActions.close}
        size="md"
      >
        <FocusTrap active>
          <form onSubmit={mobileForm.onSubmit(handleMobileFormSubmit)}>
          <TextInput
            label="手机号"
            required
            placeholder="请输入新手机号"
            key={mobileForm.key('mobile')}
            value={mobileForm.values.mobile}
            {...mobileForm.getInputProps('mobile')}
            // onChange={(event) =>
            //   usernameForm.setFieldValue('username', event.currentTarget.value)
            // }
            onChange={handleMobileChange}
            rightSection={
              checkMobileLoading ? (
                <Loader size={16} />
              ) : mobileForm.values.mobile.trim() && mobileForm.values.mobile.trim() !== user?.account?.mobile && mobileAvailable !== null ? (
                mobileAvailable ? (
                  <IconCheck color="green" size={16} />
                ) : (
                  <IconX color="red" size={16} />
                )
              ) : null
            }
            error={mobileForm.errors.mobile}
          />
          {/* 验证码输入框和发送按钮 */}
          <Flex justify="space-between" gap="xs">
            <TextInput
              required
              label="验证码"
              placeholder="请输入验证码"
              value={mobileForm.values.authCode}
              onChange={(event) => mobileForm.setFieldValue('authCode', event.currentTarget.value)}
              error={mobileForm.errors.authCode}
              radius="md"
              flex={3} // 占据3/4宽度
            />
            <Button
              variant="outline"
              radius="md"
              onClick={handleMobileSendCaptcha}
              disabled={loading || mobileEditCountdown > 0}
              flex={1} // 占据1/4宽度
              style={{
                minWidth: 120, // 设置最小宽度，防止文本溢出
                alignSelf: 'flex-end', // 确保按钮与输入框底部对齐
              }}
            >
              {mobileEditCountdown > 0 ? `${mobileEditCountdown} 秒` : '发送验证码'}
            </Button>
          </Flex>
          <Flex justify="flex-end" gap="sm" mt="lg">
            <Button type="submit" disabled={loading}>保存</Button>
          </Flex>
        </form>
        </FocusTrap>
      </Modal>
    </Box>
  );
}

export default AccountPageRender;
