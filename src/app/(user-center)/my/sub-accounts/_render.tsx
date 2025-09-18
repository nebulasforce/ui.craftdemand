'use client';
import {
  Anchor,
  Box,
  Stack,
  Breadcrumbs,
  Divider,
  Pagination,
  Paper,
  Text,
  Title,
  Avatar,
  Checkbox,
  Group,
  Table,
  ScrollArea,
  Flex,
} from '@mantine/core';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';
import cx from 'clsx';
import classes from './style.module.css'
import { mySubAccountListData } from '@/api/my/response';

const data = [
  {
    id: '1',
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
    name: 'Robert Wolfkisser',
    job: 'Engineer',
    email: 'rob_wolf@gmail.com',
  },
  {
    id: '2',
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png',
    name: 'Jill Jailbreaker',
    job: 'Engineer',
    email: 'jj@breaker.com',
  },
  {
    id: '3',
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
    name: 'Henry Silkeater',
    job: 'Designer',
    email: 'henry@silkeater.io',
  },
  {
    id: '4',
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Bill Horsefighter',
    job: 'Designer',
    email: 'bhorsefighter@gmail.com',
  },
  {
    id: '5',
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png',
    name: 'Jeremy Footviewer',
    job: 'Manager',
    email: 'jeremy@foot.dev',
  },
];

interface SubAccountsProps {
  initialData: mySubAccountListData | null;
}

const SubAccountsPageRender =  ({ initialData }:SubAccountsProps) => {
  const { setActive, setSection } = useNavbar();
  useEffect(() => {
    setSection('Account');
    setActive('Sub Accounts');
  }, []); // 合并依赖项


  console.log("initialData",initialData);

  // 面包屑
  const items = [{ title: 'Home', href: '/' }, { title: 'Sub Accounts' }];

  const [selection, setSelection] = useState(['1']);
  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.id)));

  const rows = data.map((item) => {
    const selected = selection.includes(item.id);
    return (
      <Table.Tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
        <Table.Td>
          <Checkbox checked={selection.includes(item.id)} onChange={() => toggleRow(item.id)} />
        </Table.Td>
        <Table.Td>
          <Group gap="sm">
            <Avatar size={26} src={item.avatar} radius={26} />
            <Text size="sm" fw={500}>
              {item.name}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>{item.email}</Table.Td>
        <Table.Td>{item.job}</Table.Td>
      </Table.Tr>
    );
  });

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
      <Paper pt="lg" pb="lg">
        {/* 页面容器 - 标题 */}
        <Box mb="lg">
          <Title order={3}>Sub Accounts</Title>
          <Text size="sm" c="dimmed">
            Manage and control sub-accounts under your main account.
          </Text>
        </Box>
        <Divider mb="lg" my="xs" variant="dashed" />
        <Box pos="relative">
          <Stack
            gap="lg"
          >
            <ScrollArea>
              <Table miw={800} verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th w={40}>
                      <Checkbox
                        onChange={toggleAll}
                        checked={selection.length === data.length}
                        indeterminate={selection.length > 0 && selection.length !== data.length}
                      />
                    </Table.Th>
                    <Table.Th>User</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Job</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </ScrollArea>
            <Flex
              justify="flex-end"
              direction="row"
            >
              <Pagination total={10} />
            </Flex>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

export default SubAccountsPageRender;
