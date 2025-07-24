// src/components/AuthenticationForm/AuthenticationForm.tsx

"use client"
import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Flex,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle, useInterval } from '@mantine/hooks';
import { GoogleButton } from './GoogleButton';
import { TwitterButton } from './TwitterButton';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import notify from '@/utils/notify';


// sendVerificationCode 假设这里有发送验证码的函数
const sendVerificationCode = async (mobile: string) => {
  // 模拟发送验证码的逻辑
  return new Promise((resolve) => {
    setTimeout(() => {
      notify(`Verification code sent to ${  mobile  } successfully`, 'success');
      resolve(true);
    }, 1000);
  });
};


export function AuthenticationForm(props: PaperProps) {
  const [type, toggle] = useToggle(['login', 'register']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { login, register } = useAuth();
  const router = useRouter();
  const form = useForm({
    initialValues: {
      loginId: '',  // 统一的登录id字段
      username: '', // 用户名(注册使用)
      email: '', // 邮箱(注册使用)
      mobile: '', // 手机号(注册使用)
      password: '', // 密码
      captcha: '', // 验证码
      terms: true, // 是否同意条款
    },

    validate: {
      loginId: (val) => {
        if (!val) { return 'This field is required'; }
        const isEmail = /^\S+@\S+$/.test(val);
        const isMobile = /^1[3-9]\d{9}$/.test(val);
        if (!isEmail && !isMobile) {
          return 'Please enter a valid email or mobile number';
        }
        return null;
      },
      username: (val) => (val?.length < 3 ? 'Username must be at least 3 characters' : null),
      email: (val) => (val && !/^\S+@\S+$/.test(val) ? 'Invalid email address' : null),
      mobile: (val) => (val && !/^1[3-9]\d{9}$/.test(val) ? 'Invalid mobile number' : null),
      password: (val) => (val?.length < 6 ? 'Password should include at least 6 characters' : null),
      captcha: (val) => (type === 'register' && (!val || val.length !== 6) ? 'Verification code is 6 digits' : null),
      terms: (val) => (type === 'register' && !val ? 'You must accept the terms and conditions' : null),
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
      return
    }

    try {
      setCountdown(60); // 设置倒计时60秒
      const success = await sendVerificationCode(mobile);
      if (!success) {setCountdown(0)} // 发送失败则重置倒计时
    } catch (error) {
      setCountdown(0);
    }
  };

  // 倒计时逻辑
  useInterval(() => {
    if (countdown > 0) {
      setCountdown(countdown - 1);
    }
  }, 1000);

  // handleSubmit 表单处理
  const handleSubmit = async (): Promise<void> => {
    setLoading(true);
    try {
      if (type === 'login') {
        const params = {
          loginId: form.values.loginId,
          password: form.values.password,
        };
        const result = await login(params);
        if (result) {
          notify('Login successfully', 'success');
          router.push('/'); // 登录成功后跳转到首页
        }
      } else if (type === 'register') {
        const params = {
          username: form.values.username,
          mobile: form.values.mobile,
          email: form.values.email,
          password: form.values.password,
          captcha: form.values.captcha,
        };
        const result = await register(params);
        if (result) {
          notify('Register successfully', 'success');
          router.push('/auth/login'); // 注册成功后跳转到登录页
        }
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
  }

  return (
    <Paper radius="md" p="lg" withBorder {...props}>
      <LoadingOverlay visible={loading} />
      <Text size="lg" fw={500}>
        Welcome to Mantine, {type} with
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl">Google</GoogleButton>
        <TwitterButton radius="xl">Twitter</TwitterButton>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {type === 'login' && (
            <TextInput
              label="Email/Mobile/Username"
              placeholder="Enter your email, mobile or username"
              value={form.values.loginId}
              onChange={(event) => form.setFieldValue('loginId', event.currentTarget.value)}
              radius="md"
            />
          )}

          {type === 'register' && (
            <>
              <TextInput
                required
                label="Username"
                placeholder="Your username"
                value={form.values.username}
                onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
                error={form.errors.username}
                radius="md"
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
                    alignSelf: 'flex-end' // 确保按钮与输入框底部对齐
                  }}
                >
                  {countdown > 0 ? `${countdown} S` : 'Send Code'}
                </Button>
              </Flex>
            </>
          )}

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
          />

          {type === 'register' && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
            />
          )}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
