// src/components/AuthenticationForm/LoginForm.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import JSEncrypt from 'jsencrypt';

import {
  Anchor,
  Button,
  Divider,
  FocusTrap, // 添加 FocusTrap 组件
  Group,
  LoadingOverlay,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  type PaperProps,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { getPublicKey } from '@/api/data/api';
import { getPublicKeyData } from '@/api/data/response';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import notify from '@/utils/notify';
import { GoogleButton } from './GoogleButton';
import { TwitterButton } from './TwitterButton';

export function LoginForm(props: PaperProps) {
  const [loading, setLoading] = useState(false);
  const [publicKey, setPublicKey] = useState<getPublicKeyData>();
  const { login } = useAuth();
  const searchParams = useSearchParams(); // 获取 URL 中的查询参数
  // 直接从查询参数中提取 redirect 值（解码后的路径）
  const redirectPath = searchParams.get('redirect') || '/'; // 默认跳转首页
  const router = useRouter();

  const fetchPublicKey = async (): Promise<void> => {
    try {
      const response = await getPublicKey();
      if (response.code === 0) {
        setPublicKey(response.data);
      }
    } catch (err) {
      if (err instanceof Error) {
        notify(err.message, 'error');
      } else {
        notify('内部错误', 'error');
      }
    }
  };

  // RSA加密函数
  const encryptPassword = (password: string) => {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(String(publicKey));
    return encrypt.encrypt(password) || '';
  };

  useEffect(() => {
    setLoading(true);
    fetchPublicKey().then(() => {
      setLoading(false);
    });
  }, []);

  const form = useForm({
    initialValues: {
      loginId: '', // 统一的登录id字段
      password: '', // 密码
      captcha: '', // 验证码
    },

    validate: {
      loginId: (val) => {
        if (!val || val.trim() === '') {
          return '此字段为必填项';
        }
        return null;
      },
      password: (val) => {
        if (!val) {
          return '密码为必填项';
        }
        if (val.length < 6) {
          return '密码至少需要6个字符';
        }
        return null;
      },

      captcha: (val) => {
        if (val) {
          if (val.length !== 6) {
            return '验证码为6位数字';
          }
        }
        return null;
      },
    },
  });

  // handleSubmit 表单处理
  const handleSubmit = async (): Promise<void> => {
    setLoading(true);
    try {
      const encryptedPassword = encryptPassword(form.values.password);
      const params = {
        loginId: form.values.loginId,
        password: encryptedPassword,
      };
      const result = await login(params);
      if (result.success) {
        notify('欢迎回来！登录成功', 'success');
        router.push(redirectPath);
        // // 验证跳转路径的安全性，防止XSS攻击
        // if (redirectPath.startsWith('/') && !redirectPath.startsWith('//')) {
        //   router.push(redirectPath);
        // } else {
        //   console.error('redirectPath',redirectPath)
        //   router.push('/');
        // }
      } else {
        // 根据响应结果判断，如果需要显示图形验证码则显示图形验证码
        notify(result.message || '登录失败', 'error');
      }
    } catch (error) {
      if (error instanceof Error) {
        notify(error.message, 'error');
      } else {
        notify('登录失败', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper radius="md" p="lg" pos="relative" withBorder {...props}>
      <LoadingOverlay visible={loading} />
      <Text size="lg" component="span" fw={500}>
        欢迎使用管理系统，使用以下方式登录
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl">Google</GoogleButton>
        <TwitterButton radius="xl">Twitter</TwitterButton>
      </Group>

      <Divider label="或使用手机/邮箱/用户名继续" labelPosition="center" my="lg" />
      {/* 添加 FocusTrap 包装表单内容 */}
      <FocusTrap active>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              required
              data-autofocus
              label="邮箱/手机/用户名"
              placeholder="请输入您的邮箱、手机或用户名"
              value={form.values.loginId}
              onChange={(event) => form.setFieldValue('loginId', event.currentTarget.value)}
              error={form.errors.loginId} // 显示验证错误
              radius="md"
            />
            <PasswordInput
              required
              label="密码"
              placeholder="请输入您的密码"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password}
              radius="md"
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor component={Link} href="/auth/register" c="dimmed" size="xs">
              还没有账号？注册
            </Anchor>
            <Button type="submit" radius="xl">
              登录
            </Button>
          </Group>
        </form>
      </FocusTrap>
    </Paper>
  );
}
