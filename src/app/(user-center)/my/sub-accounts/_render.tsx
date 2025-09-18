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
import { mySubAccountList } from '@/api/my/api'; // 导入API
import notify from '@/utils/notify'; // 导入通知工具
import { useRouter } from 'next/navigation'; // 导入Next.js路由钩子

interface SubAccountsProps {
  initialData: mySubAccountListData | null;
}

const SubAccountsPageRender =  ({ initialData }:SubAccountsProps) => {
  const { setActive, setSection } = useNavbar();
  const router = useRouter();

  useEffect(() => {
    setSection('Account');
    setActive('Sub Accounts');
  }, []); // 合并依赖项



  // 面包屑
  const items = [{ title: 'Home', href: '/' }, { title: 'Sub Accounts' }];


  // 状态管理
  const [data, setData] = useState(initialData?.lists || []);
  const [page, setPage] = useState(initialData?.page || 1);
  const [pageSize, ] = useState(initialData?.pageSize || 10);
  const [totalPage, setTotalPage] = useState(initialData?.totalPage || 0);
  const [count, setCount] = useState(initialData?.count || 0);
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);

  // 当page变化时更新URL
  useEffect(() => {
    // 构建新的查询参数
    const searchParams = new URLSearchParams(window.location.search);
    if (page === 1) {
      // 如果是第一页，移除page参数使URL更简洁
      searchParams.delete('page');
    } else {
      searchParams.set('page', page.toString());
    }
    // 更新URL而不触发页面重载
    router.push(`?${searchParams.toString()}`, { scroll: false });
  }, [page, router]);

  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.account.id)));

  // 计算显示范围
  const calculateDisplayRange = () => {
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, count);
    return `${start}-${end} of ${count}`;
  };

  // 处理分页变化
  const handlePageChange = async (newPage: number) => {
    if (newPage === page || loading) {return;}

    setLoading(true);
    try {
      const response = await mySubAccountList({ page: newPage,pageSize });
      if (response.code === 0 && response.data) {
        setPage(newPage);
        setData(response.data.lists || []);
        setTotalPage(response.data.totalPage || 0);
        setCount(response.data.count || 0);
        setSelection([]); // 清空选择状态
        // 滚动到表格顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        notify(response.message || 'Failed to load data', 'error');
      }
    } catch (error) {
      notify('Failed to connect to server', 'error');
    } finally {
      setLoading(false);
    }
  };

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
              <Table miw={800} >
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

              direction="row"
              justify="space-between" align="center"
            >
              {/* 显示条目信息 */}
              <Text size="sm" c="dimmed">
                {calculateDisplayRange()}
              </Text>
              {/*分页控制*/}
              <Pagination total={totalPage||0} withEdges value={page} onChange={handlePageChange}  siblings={2}  />
            </Flex>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

export default SubAccountsPageRender;
