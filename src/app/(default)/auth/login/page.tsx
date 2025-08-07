"use client";
import { LoginForm } from '@/components/AuthenticationForm/LoginForm';
import { Container } from '@mantine/core';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const LoginPage = () => {

  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/');
    }
  }, [isLoading, user, router]);

  return (
    <Container size={460} my={60}>
      <LoginForm />
    </Container>
  )
}

export default LoginPage;
