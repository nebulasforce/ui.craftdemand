// src/components/AuthenticationForm/RegisterForm.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Flex,
  FocusTrap,
  Group,
  LoadingOverlay,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useInterval } from '@mantine/hooks';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import notify from '@/utils/notify';
import { GoogleButton } from './GoogleButton';
import { TwitterButton } from './TwitterButton';

// sendVerificationCode 假设这里有发送验证码的函数
const sendVerificationCode = async (mobile: string) => {
  // 模拟发送验证码的逻辑
  return new Promise((resolve) => {
    setTimeout(() => {
      notify(`Verification code sent to ${mobile} successfully`, 'success');
      resolve(true);
    }, 1000);
  });
};

export function RegisterForm(props: PaperProps) {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(() => {
    if (typeof window !== 'undefined') {
      const cd = localStorage.getItem('countdown');
      return cd ? Math.max(0, Number(cd)) : 0;
    }
    return 0;
  });
  const { register } = useAuth();
  const router = useRouter();

  const usernameRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    initialValues: {
      username: '', // 用户名(注册使用)
      email: '', // 邮箱(注册使用)
      mobile: '', // 手机号(注册使用)
      password: '', // 密码
      captcha: '', // 验证码
      terms: true, // 是否同意条款
    },

    validate: {
      username: (val) => {
        if (val.trim()?.length < 3) {
          return 'Username must be at least 3 characters';
        }
        return null;
      },
      email: (val) => {
        if (val && !/^\S+@\S+$/.test(val)) {
          return 'Invalid email address';
        }
        return null;
      },
      mobile: (val) => {
        if (val && !/^1[3-9]\d{9}$/.test(val)) {
          return 'Invalid mobile number';
        }
        return null;
      },
      password: (val) => {
        if (!val) {
          return 'Password is required';
        }
        if (val.length < 6) {
          return 'Password should include at least 6 characters';
        }
        return null;
      },

      captcha: (val) => {
        if (!val || val.length !== 6) {
          return 'Verification code is 6 digits';
        }
        return null;
      },
      terms: (val) => {
        if (!val) {
          return 'You must accept the terms and conditions';
        }
        return null;
      },
    },
  });

  // 发送验证码
  const handleSendCaptcha = async () => {
    const { mobile } = form.values;

    // 验证手机号
    if (!mobile || !/^1[3-9]\d{9}$/.test(mobile)) {
      notify('Please enter a valid mobile number', 'error');
      return;
    }

    // 防止重复发送
    if (countdown > 0) {
      return;
    }

    try {
      setCountdown(60); // 设置倒计时60秒
      const success = await sendVerificationCode(mobile);
      if (!success) {
        setCountdown(0);
      } // 发送失败则重置倒计时
    } catch (error) {
      setCountdown(0);
    }
  };

  // 倒计时逻辑
  useInterval(
    () => {
      if (countdown > 0) {
        setCountdown((c) => c - 1); // 使用函数式更新确保拿到最新值
        localStorage.setItem('countdown', countdown.toString());
      } else {
        localStorage.removeItem('countdown');
      }
    },
    1000,
    { autoInvoke: true }
  ); // 固定1000ms间隔

  // 焦点自动获取逻辑
  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  // handleSubmit 表单处理
  const handleSubmit = async (): Promise<void> => {
    setLoading(true);
    try {
      const params = {
        username: form.values.username,
        mobile: form.values.mobile,
        email: form.values.email,
        password: form.values.password,
        captcha: form.values.captcha,
      };
      const result = await register(params);
      if (result.success) {
        notify('Register successfully', 'success');
        router.push('/auth'); // 注册成功后跳转到登录页
      } else {
        notify(result.message || 'Register failed', 'error');
      }
    } catch (error) {
      if (error instanceof Error) {
        notify(error.message, 'error');
      } else {
        notify('Authed failed', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper radius="md" p="lg" withBorder {...props}>
      <LoadingOverlay visible={loading} />
      <Text size="lg" component="span" fw={500}>
        Welcome to Mantine, Register with
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl">Google</GoogleButton>
        <TwitterButton radius="xl">Twitter</TwitterButton>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />
      <FocusTrap active>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              required
              label="Username"
              placeholder="Your username"
              value={form.values.username}
              onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
              error={form.errors.username}
              radius="md"
              ref={usernameRef} // 添加 ref
            />

            <TextInput
              required
              label="Email"
              placeholder="Your email"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email}
              radius="md"
            />

            <TextInput
              required
              label="Mobile"
              placeholder="Your mobile number"
              value={form.values.mobile}
              onChange={(event) => form.setFieldValue('mobile', event.currentTarget.value)}
              error={form.errors.mobile}
              radius="md"
            />

            {/* 验证码输入框和发送按钮 */}
            <Flex justify="space-between" gap="xs">
              <TextInput
                required
                label="Verification Code"
                placeholder="Enter verification code"
                value={form.values.captcha}
                onChange={(event) => form.setFieldValue('captcha', event.currentTarget.value)}
                error={form.errors.captcha}
                radius="md"
                flex={3} // 占据3/4宽度
              />
              <Button
                variant="outline"
                radius="md"
                onClick={handleSendCaptcha}
                disabled={loading || countdown > 0}
                flex={1} // 占据1/4宽度
                style={{
                  minWidth: 120, // 设置最小宽度，防止文本溢出
                  alignSelf: 'flex-end', // 确保按钮与输入框底部对齐
                }}
              >
                {countdown > 0 ? `${countdown} S` : 'Send Code'}
              </Button>
            </Flex>
            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password}
              radius="md"
            />
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor component={Link} href="/auth/login" c="dimmed" size="xs">
              Already have an account? Login
            </Anchor>
            <Button type="submit" radius="xl">
              Register
            </Button>
          </Group>
        </form>
      </FocusTrap>
    </Paper>
  );
}
