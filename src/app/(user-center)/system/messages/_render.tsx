"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconChevronDown, IconChevronUp, IconSearch, IconX } from '@tabler/icons-react';
import {
  ActionIcon,
  Anchor,
  Box,
  Breadcrumbs,
  Button,
  Collapse,
  Divider,
  Grid,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { messageList } from '@/api/message/api';
import { messageListData } from '@/api/message/response';
import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';
import notify from '@/utils/notify';


// import { useNotifications } from '@/contexts/NotificationContext/NotificationContext';


interface MessagesProps {
  initialData: messageListData | null;
}

// 定义高级搜索条件接口
interface AdvancedSearchFilters {
  title: string;
  status: string;
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


const MessagesPageRender =  ({ initialData }:MessagesProps) => {
  const { setActive, setSection } = useNavbar();
  // const { markAsRead } = useNotifications();
  const router = useRouter();

  useEffect(() => {
    setSection('System');
    setActive('Messages');
  }, []); // 添加缺失的依赖项


  // useEffect(() => {
  //   markAsRead();
  // }, [markAsRead]);

  // 基础搜索状态
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);
  // 高级搜索状态
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedSearchFilters>({
    title: '',
    status: '',
  });

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
  const [selection, setSelection] = useState<string[]>([]);


  // 当page变化时更新URL 刷新后页面正常
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

      const response = await messageList(searchParams);
      if ((response.code === 0) && (response.data)){
        setTotalPage(response.data.totalPage || 0);
        setPage(currentPage);
        setData(response.data.lists || []);
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
      title: '',
      status: '',
    });
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
        { /*页面内容 - 标题 */}
        <Box mb="md">
          <Title order={3}>Messages</Title>
          <Text size="sm" c="dimmed">
            Manage your messages efficiently.
          </Text>
        </Box>
        {/*虚线*/}
        <Divider mb="lg" my="xs" variant="dashed" />
        <Grid>
          {/*基础搜索*/}
          <Grid.Col span={{ base: 12, sm: 9 }} mb="xs">
            <TextInput
              placeholder="Search by title, type etc..."
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
        {/*高级搜索部分 - 可折叠*/}
        <Collapse in={advancedSearchOpen} transitionDuration={200}>
          <Paper p="md" mb="lg" withBorder>
            <Title order={5} mb="md">Advanced Filters</Title>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
              <TextInput
                label="Title"
                value={advancedFilters.title}
                onChange={(e) => handleAdvancedFilterChange('title', e.target.value)}
                placeholder="Search by title"
                disabled={loading}
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
      </Paper>
    </Box>
  );
}

export default MessagesPageRender;
