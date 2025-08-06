// src/app/(independent)/test/page.tsx
"use client";

import { Button, Card, Title, Text, Space } from '@mantine/core';

export default function IndependentTestPage() {
  return (
    <Card shadow="lg" p={6} radius="md">
      <Title order={1}>完全独立的测试页面</Title>
      <Text mt={3} color="dimmed">
        这个页面不继承根布局的任何组件（包括Header和Footer），使用完全独立的布局。
      </Text>

      <Space h="lg" />

      <Text>页面特性：</Text>
      <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
        <li>无全局Header</li>
        <li>无全局Footer</li>
        <li>使用独立的布局配置</li>
        <li>不依赖根布局的任何组件</li>
      </ul>

      <Space h="lg" />

      <Button color="primary">测试按钮</Button>
    </Card>
  );
}
