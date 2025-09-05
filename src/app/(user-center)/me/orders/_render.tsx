'use client';
import { useEffect } from 'react';
import { Title } from '@mantine/core';
import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';

interface OrdersPageProps {
  initialData: any
}

const OrdersPageRender =  ({ initialData }:OrdersPageProps) => {
  const { setActive, setSection } = useNavbar();
  useEffect(() => {
    setSection('Account');
    setActive('Orders');
  }, []); // 合并依赖项


  return (
    <>
      <Title order={2}>{ initialData }</Title>
    </>
  );
}

export default OrdersPageRender;
