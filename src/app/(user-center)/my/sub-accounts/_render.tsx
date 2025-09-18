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


interface SubAccountsProps {
  initialData: mySubAccountListData | null;
}

const SubAccountsPageRender =  ({ initialData }:SubAccountsProps) => {
  const { setActive, setSection } = useNavbar();
  useEffect(() => {
    setSection('Account');
    setActive('Sub Accounts');
  }, []); // 合并依赖项

  const data = initialData?.lists || [];

  // 面包屑
  const items = [{ title: 'Home', href: '/' }, { title: 'Sub Accounts' }];


  const [page, setPage] = useState(initialData?.page || 1);
  const [selection, setSelection] = useState<string[]>([]);
  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.account.id)));

  const rows = data.map((item) => {
    const selected = selection.includes(item.account.id);
    return (
      <Table.Tr key={item.account.id} className={cx({ [classes.rowSelected]: selected })}>
        <Table.Td>
          <Checkbox checked={selection.includes(item.account.id)} onChange={() => toggleRow(item.account.id)} />
        </Table.Td>
        <Table.Td>
          <Group gap="sm">
            <Avatar size={26} src={item.profile.avatar} radius={26} />
            <Text size="sm" fw={500}>
              {item.account.username}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>{item.account.mobile}</Table.Td>
        <Table.Td>{item.account.email}</Table.Td>
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
                    <Table.Th>Username</Table.Th>
                    <Table.Th>Mobile</Table.Th>
                    <Table.Th>Email</Table.Th>

                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </ScrollArea>
            <Flex
              justify="flex-end"
              direction="row"
            >
              <Pagination total={initialData?.totalPage||0} withEdges value={page} onChange={setPage}  siblings={2}  />
            </Flex>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

export default SubAccountsPageRender;
