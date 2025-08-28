'use client';
import { useEffect } from 'react';
import { Title } from '@mantine/core';
import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';

interface SettingPageProps {
  initialData: any
}

const SettingPageRender =  ({ initialData }:SettingPageProps) => {
  const { setActive, setSection } = useNavbar();
  useEffect(() => {
    setSection('Account');
    setActive('Other Settings');
  }, []); // 合并依赖项


  return (
    <>
      <Title order={2}>{ initialData }</Title>
    </>
  );
}

export default SettingPageRender;
