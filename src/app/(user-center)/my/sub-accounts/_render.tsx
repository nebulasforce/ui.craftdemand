'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconChevronDown, IconChevronUp, IconEdit, IconPlus, IconSearch, IconTrash, IconX } from '@tabler/icons-react';
// 导入Next.js路由钩子
import cx from 'clsx';
import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Collapse,
  Divider,
  Flex,
  Grid,
  Group,
  LoadingOverlay,
  Pagination,
  Paper,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { mySubAccountList } from '@/api/my/api'; // 导入API
import { mySubAccountListData } from '@/api/my/response';
import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';
import notify from '@/utils/notify'; // 导入通知工具
import { formatTimestamp } from '@/utils/time';
import classes from './style.module.css';


interface SubAccountsProps {
  initialData: mySubAccountListData | null;
}

// 定义状态项接口
interface statusItem {
  label: string;
  color: string;
}

const statusMap:{[key:number]:statusItem} = {
  0: { label: 'Active', color: 'green' },
  1: { label: 'Disabled', color: 'orange' },
  2: { label: 'Deleted', color: 'red' },
}
// 状态选项数据 - 用于下拉选择器
const statusOptions = Object.entries(statusMap).map(([value, { label }]) => ({
  value,
  label,
}));

// 获取状态显示文本
const getStatusLabel = (status: number | string) => {
  const statusNumber = typeof status === 'string' ? parseInt(status, 10) : status;
  return statusMap[statusNumber]?.label || '未知';
};

// 获取状态显示颜色
const getStatusColor = (status: number | string) => {
  const statusNumber = typeof status === 'string' ? parseInt(status, 10) : status;
  return statusMap[statusNumber]?.color || 'gray';
};

// 定义高级搜索条件接口
interface AdvancedSearchFilters {
  username: string;
  mobile: string;
  email: string;
  status: string;
}



const SubAccountsPageRender =  ({ initialData }:SubAccountsProps) => {
  const { setActive, setSection } = useNavbar();
  const router = useRouter();

  useEffect(() => {
    setSection('Account');
    setActive('Sub Accounts');
  }, []); // 合并依赖项



  // 面包屑
  const items = [
    { title: 'Home', href: '/' },
    { title: 'Account' },
    { title: 'Sub Accounts' }
  ];

  // 基础搜索状态
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);

  // 高级搜索状态
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedSearchFilters>({
    username: '',
    mobile: '',
    email: '',
    status: '',
  });

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

  // 数据加载方法，同时支持基础搜索和高级搜索
  const loadData = async (newPage?: number) => {
    const currentPage = newPage ?? page;

    setLoading(true);
    try {
      // 先构建基础参数
      const baseParams = {
        page: currentPage,
        pageSize,
      };

      // 动态构建搜索参数
      const searchParams: Record<string, any> = { ...baseParams };

      // 只有在非高级搜索或高级搜索无有效字段时，才添加keyword（且keyword有值）
      const useKeyword = !(advancedSearchOpen && Object.values(advancedFilters).some(v => v));
      if (useKeyword && searchKeyword) {
        searchParams.keyword = searchKeyword;
      }

      // 添加高级搜索参数（只包含有值的字段）
      if (advancedSearchOpen) {
        Object.entries(advancedFilters).forEach(([key, value]) => {
          if (value) {
            searchParams[key] = value;
          }
        });
      }

      const response = await mySubAccountList(searchParams);
      if (response.code === 0 && response.data) {
        setPage(currentPage);
        setData(response.data.lists || []);
        setTotalPage(response.data.totalPage || 0);
        setCount(response.data.count || 0);
        setSelection([]);
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

  // 处理分页变化
  const handlePageChange = async (newPage: number) => {
    await loadData(newPage);
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
        <Table.Td>{formatTimestamp(item.account.lastLogin)}</Table.Td>
        <Table.Td>
          <Text c={getStatusColor(item.account.status)}>
            {getStatusLabel(item.account.status)}
          </Text>
        </Table.Td>
        <Table.Td>
          <ActionIcon.Group>
            <ActionIcon variant="light" size="md" aria-label="Edit">
              <IconEdit size={14} stroke={1.5} />
            </ActionIcon>
            <ActionIcon variant="light" size="md" aria-label="Delete">
              <IconTrash size={14} stroke={1.5} />
            </ActionIcon>
          </ActionIcon.Group>
        </Table.Td>
      </Table.Tr>
    );
  });

// 处理高级搜索字段变化
  const handleAdvancedFilterChange = (field: keyof AdvancedSearchFilters, value: string) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 重置高级搜索条件
  const resetAdvancedFilters = () => {
    setAdvancedFilters({
      username: '',
      mobile: '',
      email: '',
      status: '',
    });
  };

  // 处理基础搜索输入
  const handleSearchChange = (value: string) => {
    // 清除之前的计时器
    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    setSearchKeyword(value);

    // 设置新的防抖计时器
    setSearchTimer(setTimeout(() => {
      // 搜索时重置到第一页
      loadData(1).then();
    }, 500)); // 500ms防抖
  };

  // 处理高级搜索提交
  const handleAdvancedSearch = () => {
    loadData(1).then();
  };

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
      <Paper pt="xs" pb="xs">
        {/* 页面容器 - 标题 */}
        <Box mb="md">
          <Title order={3}>Sub Accounts</Title>
          <Text size="sm" c="dimmed">
            Manage and control sub-accounts under your main account.
          </Text>
        </Box>
        <Divider mb="lg" my="xs" variant="dashed" />
        <Grid>
          <Grid.Col span={{ base: 12, sm: 9 }} mb="xs">
              {/* 基础搜索组件 */}
              <TextInput
                placeholder="Search by username, mobile or email..."
                value={searchKeyword}
                onChange={(e) => handleSearchChange(e.target.value)}
                leftSection={<IconSearch size={16} stroke={1.5} />}
                rightSection={
                  searchKeyword && (
                    <ActionIcon
                      variant="default"
                      size="sm"
                      onClick={() => handleSearchChange('')}
                      aria-label="Clear search"
                    >
                      <IconX size={14} stroke={1.5} />
                    </ActionIcon>
                  )
                }
                radius="md"
                disabled={loading}
              />
            </Grid.Col>
            <Grid.Col  span={{ base: 12, sm: 3 }} mb="xs">
              {/* 高级搜索切换按钮 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAdvancedSearchOpen(!advancedSearchOpen)}
                leftSection={advancedSearchOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                fullWidth
              >
                {advancedSearchOpen ? 'Hide Advanced Search' : 'Advanced Search'}
              </Button>
            </Grid.Col>
        </Grid>

        {/* 高级搜索部分 - 可折叠 */}
        <Collapse in={advancedSearchOpen} transitionDuration={200}>
          <Paper p="md" mb="lg" withBorder>
            <Title order={5} mb="md">Advanced Filters</Title>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
              <TextInput
                label="Username"
                value={advancedFilters.username}
                onChange={(e) => handleAdvancedFilterChange('username', e.target.value)}
                placeholder="Search by username"
                disabled={loading}
              />
              <TextInput
                label="Mobile"
                value={advancedFilters.mobile}
                onChange={(e) => handleAdvancedFilterChange('mobile', e.target.value)}
                placeholder="Search by mobile number"
                disabled={loading}
              />
              <TextInput
                label="Email"
                value={advancedFilters.email}
                onChange={(e) => handleAdvancedFilterChange('email', e.target.value)}
                placeholder="Search by email"
              />
              <Select
                label="Status"
                value={advancedFilters.status}
                onChange={(value) => handleAdvancedFilterChange('status', value || '')}
                placeholder="Select status"
                data={statusOptions}
                disabled={loading}
              />
            </SimpleGrid>

            <Group gap="sm" mt="md" justify="flex-end">
              <Button variant="ghost" onClick={resetAdvancedFilters} disabled={loading}>
                Reset
              </Button>
              <Button onClick={handleAdvancedSearch} disabled={loading}>
                Apply Filters
              </Button>
            </Group>
          </Paper>
        </Collapse>
        <Divider mb="lg" my="xs" variant="dashed" />

        <SimpleGrid mb="sm">
          <Flex
            justify="flex-end"
            align="center"
            direction="row"
          >
            <Group>
              <Button
                variant="danger"
                leftSection={<IconTrash size={16} stroke={1.5} />}
                disabled={selection.length === 0 || loading}
              >
                Delete Selected
              </Button>
              <Button
                leftSection={<IconPlus size={16} stroke={1.5} />}
                disabled={loading}
              >
                Add Sub Account
              </Button>
            </Group>
          </Flex>
        </SimpleGrid>


        <Box pos="relative">
          <Stack gap="lg" justify="flex-end">
            <LoadingOverlay visible={loading} />
            <ScrollArea>
              <Table  verticalSpacing="xs" highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th w={40}>
                      <Checkbox
                        onChange={toggleAll}
                        checked={selection.length === data.length}
                        indeterminate={selection.length > 0 && selection.length !== data.length}
                      />
                    </Table.Th>
                    <Table.Th miw={150}>Username</Table.Th>
                    <Table.Th>Mobile</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th miw={180}>Last Login</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rows.length > 0 ? (
                    rows
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={4} align="center">
                        <Text c="dimmed">No data available</Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </ScrollArea>
            {/* 分页控制区 - 固定在底部 */}
              <Flex direction="row" justify="space-between" align="center">
                {/* 显示条目信息 */}
                <Text size="sm" c="dimmed">
                  {calculateDisplayRange()}
                </Text>
                {/* 分页控制 */}
                <Pagination
                  total={totalPage || 0}
                  withEdges
                  value={page}
                  size="sm"
                  onChange={handlePageChange}
                  siblings={2}
                  disabled={loading || totalPage <= 1}
                />
              </Flex>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

export default SubAccountsPageRender;
