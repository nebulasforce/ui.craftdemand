'use client';
import { useEffect } from 'react';
import { Title } from '@mantine/core';
import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';

interface SecurityPageProps {
  initialData: any
}

const SecurityPageRender =  ({ initialData }:SecurityPageProps) => {
  const { setActive, setSection } = useNavbar();
  useEffect(() => {
    setSection('Account');
    setActive('Security');
  }, []); // 合并依赖项


  return (
    <>
      <Title order={2}>{ initialData }</Title>
    </>
  );
}

export default SecurityPageRender;
