"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Anchor, Box, Breadcrumbs } from '@mantine/core';
import { messageListData } from '@/api/message/response';
import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';


interface MessagesProps {
  initialData: messageListData | null;
}

const MessagesPageRender =  ({ initialData }:MessagesProps) => {
  const { setActive, setSection } = useNavbar();
  useEffect(() => {
    setSection('System');
    setActive('Messages');
  }, []); // 添加缺失的依赖项


  // 面包屑
  const items = [
    { title: 'Home', href: '/' },
    { title: 'System' },
    { title: 'Messages' }
  ];

  // 状态管理
  const [page, setPage] = useState(initialData?.page || 1);
  const [data, setData] = useState(initialData?.lists || []);
  const [pageSize, ] = useState(initialData?.pageSize || 10);
  const [totalPage, setTotalPage] = useState(initialData?.totalPage || 0);
  const [count, setCount] = useState(initialData?.count || 0);
  const [loading, setLoading] = useState(false);

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
    </Box>
  );
}

export default MessagesPageRender;
