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
      notify('系统错误', 'error');
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
      notify('系统错误', 'error');
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

  const items = [{ title: 'Home', href: '/' }, { title: 'Authentication' }];
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

  const [passwordModalOpened, setPasswordModalActions] = useDisclosure(false);
  const passwordForm = useForm({
    initialValues: {
      confirmPassword: '',
      password: '',
      currentPassword: '',
    },
    validate: {
      confirmPassword: (val) => {
        if (!val) {
          return 'This field is required';
        }
        return null;
      },
      currentPassword: (val) => {
        if (!val) {
          return 'This field is required';
        }
        return null;
      },
      password: (val) => {
        if (!val) {
          return 'This field is required';
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
        if (!val) {
          return 'This field is required';
        }
        return null;
      },
      authCode: (val) => {
        if (!val) {
          return 'This field is required';
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
        if (!val) {
          return 'This field is required';
        }
        return null;
      },
      authCode: (val) => {
        if (!val) {
          return 'This field is required';
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
        notify('The password updated successfully', 'success');
      } else {
        notify(response.message || 'Failed to update the email', 'error');
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
        notify('The email updated successfully', 'success');
        emailForm.setFieldValue('authCode', '');
        setEmailActive(true)
        setTimeout(() => {
          setEmailEditCountdown(-1);
        }, 1000);
      } else {
        notify(response.message || 'Failed to update the email', 'error');
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
        notify('The mobile updated successfully', 'success');
        mobileForm.setFieldValue('authCode', '');
        setMobileActive(true)
        setTimeout(() => {
          setMobileEditCountdown(-1);
        }, 1000);
      } else {
        notify(response.message || 'Failed to update the mobile', 'error');
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
      notify('Error checking username availability', 'error');
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
      notify('Error checking email availability', 'error');
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
      notify('Error checking mobile availability', 'error');
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
      notify('Please enter a valid email address', 'error'); // 提示信息改为邮箱相关
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
        notify(`Verification code sent to ${email} failed`, 'error');
      }else {
        notify(`Verification code sent to ${email} successfully`, 'success');
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
      notify('Please enter a valid mobile number', 'error');
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
        notify(`Verification code sent to ${mobile} failed`, 'error');
      }else {
        notify(`Verification code sent to ${mobile} successfully`, 'success');
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
                      <Button leftSection={<IconEdit size={14} />} onClick={usernameModalActions.open} disabled={usernameEditDisabled}  variant="default" size="xs">
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
                    Your password is {passwordSet? 'set':'not set'}.
                  </Text>
                </Grid.Col>
                <Grid.Col display="flex"  span={{ base: 2, md: 2, lg: 2, xl: 2 }}>
                  <Flex align="center">
                    <Button leftSection={<IconEdit size={14} />} onClick={setPasswordModalActions.open} variant="default" size="xs">
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
                    Your email is {emailActive? 'verified':'unverified'}:  <Space w="md" component="span" /> <b>{user?.account?.email}</b>
                  </Text>
                </Grid.Col>
                <Grid.Col display="flex"  span={{ base: 2, md: 2, lg: 2, xl: 2 }}>
                  <Flex align="center">
                    <Button leftSection={<IconEdit size={14} />} onClick={setEmailModalActions.open} variant="default" size="xs">
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
                    Your mobile number is {mobileActive? 'verified':'unverified'}:  <Space w="md" component="span" /> <b>{user?.account?.mobile}</b>
                  </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 2, md: 2, lg: 2, xl: 2 }}>
                  <Button leftSection={<IconEdit size={14} />} onClick={setMobileModalActions.open} size="xs" variant="default">
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
        <FocusTrap active>
          <form onSubmit={usernameForm.onSubmit(handleUsernameFormSubmit)}>
          <TextInput
            label="Username"
            required
            placeholder="Enter new username"
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
            <Button type="submit" disabled={loading}>Save</Button>
          </Flex>
        </form>
        </FocusTrap>
      </Modal>

      {/*独立的password*/}
      <Modal
        opened={passwordModalOpened}
        title="Edit Password"
        onClose={setPasswordModalActions.close}
        size="md"
      >
        <FocusTrap active>
          <form onSubmit={passwordForm.onSubmit(handlePasswordFormSubmit)}>
          <PasswordInput
            label="Current password"
            required
            placeholder="Current Password"
            key={passwordForm.key('currentPassword')}
            {...passwordForm.getInputProps('currentPassword')}
          />

          <PasswordInput
            label="Password"
            required
            placeholder="Password"
            key={passwordForm.key('password')}
            {...passwordForm.getInputProps('password')}
          />
          <PasswordInput
            mt="sm"
            label="Confirm password"
            required
            placeholder="Confirm password"
            key={passwordForm.key('confirmPassword')}
            {...passwordForm.getInputProps('confirmPassword')}
          />

          <Flex justify="flex-end" gap="sm" mt="lg">
            <Button type="submit" disabled={loading}>Save</Button>
          </Flex>
        </form>
        </FocusTrap>
      </Modal>

      {/*email修改窗口*/}
      <Modal
        opened={emailModalOpened}
        title="Edit Email"
        onClose={setEmailModalActions.close}
        size="md"
      >
        <FocusTrap active>
          <form onSubmit={emailForm.onSubmit(handleEmailFormSubmit)}>
          <TextInput
            label="Email"
            required
            placeholder="Enter new Email"
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
              label="Verification Code"
              placeholder="Enter verification code"
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
              {emailEditCountdown > 0 ? `${emailEditCountdown} S` : 'Send Code'}
            </Button>
          </Flex>
          <Flex justify="flex-end" gap="sm" mt="lg">
            <Button type="submit" disabled={loading}>Save</Button>
          </Flex>
        </form>
        </FocusTrap>
      </Modal>

      {/*mobile修改窗口*/}
      <Modal
        opened={mobileModalOpened}
        title="Edit Mobile"
        onClose={setMobileModalActions.close}
        size="md"
      >
        <FocusTrap active>
          <form onSubmit={mobileForm.onSubmit(handleMobileFormSubmit)}>
          <TextInput
            label="Mobile"
            required
            placeholder="Enter new Mobile"
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
              label="Verification Code"
              placeholder="Enter verification code"
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
              {mobileEditCountdown > 0 ? `${mobileEditCountdown} S` : 'Send Code'}
            </Button>
          </Flex>
          <Flex justify="flex-end" gap="sm" mt="lg">
            <Button type="submit" disabled={loading}>Save</Button>
          </Flex>
        </form>
        </FocusTrap>
      </Modal>
    </Box>
  );
}

export default AccountPageRender;
