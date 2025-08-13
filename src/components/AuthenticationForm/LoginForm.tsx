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
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import notify from '@/utils/notify';
import Link from 'next/link';
import { getPublicKey } from '@/api/data/api';
import { getPublicKeyData } from '@/api/data/response';
import JSEncrypt from 'jsencrypt';
import Typist from 'react-typist';
import 'react-typist/dist/Typist.css'; // 导入默认样式


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
    }catch(err) {
      if (err instanceof Error) {
        notify(err.message, 'error');
      } else {
        notify('系统错误', 'error');
      }
    }
  }

  // RSA加密函数
  const encryptPassword =  (password: string) => {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(String(publicKey));
    return encrypt.encrypt(password) || '';
  };

  useEffect(() => {
    setLoading(true);
    fetchPublicKey().then(()=>{
      setLoading(false);
    })
  }, []);

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
      const encryptedPassword = encryptPassword(form.values.password)
      const params = {
        loginId: form.values.loginId,
        password: encryptedPassword,
      };
      const result = await login(params);
      if (result.success) {
        notify('Login successfully', 'success');
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
      <Text size="lg" component="span" fw={500}>
        <Typist cursor={{hideWhenDone:true}}>Welcome to Mantine, login with </Typist>
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
