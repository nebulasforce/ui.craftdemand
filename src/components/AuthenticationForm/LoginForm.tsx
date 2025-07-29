// src/components/AuthenticationForm/LoginForm.tsx
"use client"

import {
  Anchor,
  Button,
  Divider,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { GoogleButton } from './GoogleButton';
import { TwitterButton } from './TwitterButton';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import notify from '@/utils/notify';
import Link from 'next/link';



export function LoginForm(props: PaperProps) {

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  // 创建 ref 用于存储输入框引用
  const loginIdRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    initialValues: {
      loginId: '',  // 统一的登录id字段
      password: '', // 密码
      captcha: '', // 验证码
    },

    validate: {
      loginId: (val) => {
        if (!val) {
          return 'This field is required';
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
        if(val) {
          if (val.length !== 6) {
            return 'Verification code is 6 digits'
          }
        }
        return null;
      }
    }
  });


  // 焦点自动获取逻辑
  useEffect(() => {
    if (loginIdRef.current) {
      loginIdRef.current.focus();
    }
  }, []);

  // handleSubmit 表单处理
  const handleSubmit = async (): Promise<void> => {
    setLoading(true);
    try {
      const params = {
        loginId: form.values.loginId,
        password: form.values.password,
      };
      const result = await login(params);
      if (result.success) {
        notify('Login successfully', 'success');
        router.push('/'); // 登录成功后跳转到首页
      } else {
        // 根据响应结果判断，如果需要显示图形验证码则显示图形验证码
        notify(result.message || 'Login failed', 'error');
      }
    } catch (error) {
      if (error instanceof Error) {
        notify(error.message, 'error');
      } else {
        notify('Login failed', 'error');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Paper radius="md" p="lg" pos="relative"  withBorder {...props}>
      <LoadingOverlay visible={loading} />
      <Text size="lg" fw={500}>
        Welcome to Mantine, login with
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl">Google</GoogleButton>
        <TwitterButton radius="xl">Twitter</TwitterButton>
      </Group>

      <Divider label="Or continue with mobile / email / username" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            required
            label="Email/Mobile/Username"
            placeholder="Enter your email, mobile or username"
            value={form.values.loginId}
            onChange={(event) => form.setFieldValue('loginId', event.currentTarget.value)}
            error={form.errors.loginId} // 显示验证错误
            radius="md"
            ref={loginIdRef} // 添加 ref
          />
          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password}
            radius="md"
          />
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor component={Link}  href="/auth/register" c="dimmed" size="xs">
            Don't have an account? Register
          </Anchor>
          <Button type="submit" radius="xl">
            Login
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
