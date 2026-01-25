'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconChevronDown, IconChevronUp, IconEye, IconSearch, IconX } from '@tabler/icons-react';
import cx from 'clsx';
import { ActionIcon, Anchor, Box, Breadcrumbs, Button, Checkbox, Collapse, Divider, Flex, Grid, Group, LoadingOverlay, Modal, Pagination, Paper, ScrollArea, Select, SimpleGrid, Stack, Table, Tabs, Text, TextInput, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { myCustomMessageList, mySystemMessageList } from '@/api/my/api';
import { listData } from '@/api/message/response';
import { Message } from '@/api/message/typings';
import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';
import notify from '@/utils/notify';
import { formatTimestamp } from '@/utils/time';
import classes from './style.module.css';

interface NotificationsProps {
  initialCustomMessageData: listData | null;
  initialSystemMessageData: listData | null;
}

// 定义状态项接口
interface statusItem {
  label: string;
  color: string;
}

// 状态映射
const statusMap: {[key: number]: statusItem} = {
  0: { label: '未读', color: 'blue' },
  1: { label: '已读', color: 'green' },
};

// 获取状态显示文本
const getStatusLabel = (status: number | string) => {
  const statusNumber = typeof status === 'string' ? parseInt(status, 10) : status;
  return statusMap[statusNumber]?.label || 'Unknown';
};

// 获取状态显示颜色
const getStatusColor = (status: number | string) => {
  const statusNumber = typeof status === 'string' ? parseInt(status, 10) : status;
  return statusMap[statusNumber]?.color || 'gray';
};

// 定义高级搜索条件接口
interface AdvancedSearchFilters {
  title: string;
  status: string;
}

const NotificationsPageRender = ({ initialCustomMessageData, initialSystemMessageData }: NotificationsProps) => {
  const { setActive, setSection } = useNavbar();
  const router = useRouter();

  useEffect(() => {
    setSection('Account');
    setActive('Notifications');
  }, [setSection, setActive]);

  // 面包屑
  const items = [
    { title: '首页', href: '/' },
    { title: '我的' },
    { title: '消息通知' }
  ];

  // Tab 状态
  const [activeTab, setActiveTab] = useState<string>('custom');
  const isInitialMount = useRef(true);

  // 基础搜索状态
  const [searchKeyword, setSearchKeyword] = useState('');
  const searchKeywordRef = useRef(searchKeyword);
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);

  // 当searchKeyword变化时更新ref
  useEffect(() => {
    searchKeywordRef.current = searchKeyword;
  }, [searchKeyword]);

  // 高级搜索状态
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedSearchFilters>({
    title: '',
    status: '',
  });

  // 普通消息状态管理
  const [customMessageData, setCustomMessageData] = useState(initialCustomMessageData?.lists || []);
  const [customMessagePage, setCustomMessagePage] = useState(initialCustomMessageData?.page || 1);
  const [customMessagePageSize] = useState(initialCustomMessageData?.pageSize || 10);
  const [customMessageCount, setCustomMessageCount] = useState(initialCustomMessageData?.count || 0);
  const [customMessageTotalPage, setCustomMessageTotalPage] = useState(initialCustomMessageData?.totalPage || 0);

  // 系统消息状态管理
  const [systemMessageData, setSystemMessageData] = useState(initialSystemMessageData?.lists || []);
  const [systemMessagePage, setSystemMessagePage] = useState(initialSystemMessageData?.page || 1);
  const [systemMessagePageSize] = useState(initialSystemMessageData?.pageSize || 10);
  const [systemMessageCount, setSystemMessageCount] = useState(initialSystemMessageData?.count || 0);
  const [systemMessageTotalPage, setSystemMessageTotalPage] = useState(initialSystemMessageData?.totalPage || 0);

  // 通用状态
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);

  // 根据当前 tab 获取当前数据
  const getCurrentData = () => {
    return activeTab === 'custom' ? customMessageData : systemMessageData;
  };

  const getCurrentPage = () => {
    return activeTab === 'custom' ? customMessagePage : systemMessagePage;
  };

  const getCurrentPageSize = () => {
    return activeTab === 'custom' ? customMessagePageSize : systemMessagePageSize;
  };

  const getCurrentCount = () => {
    return activeTab === 'custom' ? customMessageCount : systemMessageCount;
  };

  const getCurrentTotalPage = () => {
    return activeTab === 'custom' ? customMessageTotalPage : systemMessageTotalPage;
  };

  // 当page变化时更新URL
  useEffect(() => {
    const currentPage = getCurrentPage();
    const searchParams = new URLSearchParams(window.location.search);
    if (currentPage === 1) {
      searchParams.delete('page');
    } else {
      searchParams.set('page', currentPage.toString());
    }
    router.push(`?${searchParams.toString()}`, { scroll: false });
  }, [customMessagePage, systemMessagePage, router]);

  // 监听 activeTab 变化，自动加载对应 tab 的数据
  useEffect(() => {
    // 跳过初始渲染，因为已经有初始数据了
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // tab 切换时重置到第一页并加载数据
    loadData(1).then();
  }, [activeTab]);

  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  const toggleAll = () => {
    const currentData = getCurrentData();
    setSelection((current) => (current.length === currentData.length ? [] : currentData.map((item) => item.id)));
  };

  // 计算显示范围
  const calculateDisplayRange = () => {
    const currentPage = getCurrentPage();
    const currentPageSize = getCurrentPageSize();
    const currentCount = getCurrentCount();
    const start = (currentPage - 1) * currentPageSize + 1;
    const end = Math.min(currentPage * currentPageSize, currentCount);
    return `${start}-${end} 共 ${currentCount}`;
  };

  // 数据加载方法
  const loadData = async (newPage?: number) => {
    const currentPage = newPage ?? getCurrentPage();
    const currentKeyword = searchKeywordRef.current;

    setLoading(true);
    try {
      const baseParams = {
        page: currentPage,
        pageSize: getCurrentPageSize(),
      };

      const searchParams: Record<string, any> = { ...baseParams };

      const useKeyword = !(advancedSearchOpen && Object.values(advancedFilters).some(v => v));
      if (useKeyword && searchKeyword) {
        searchParams.keyword = currentKeyword.toLowerCase();
      }

      if (advancedSearchOpen) {
        Object.entries(advancedFilters).forEach(([key, value]) => {
          if (value) {
            searchParams[key] = value;
          }
        });
      }

      let response;
      if (activeTab === 'custom') {
        response = await myCustomMessageList(searchParams);
        if (response.code === 0 && response.data) {
          setCustomMessagePage(currentPage);
          setCustomMessageData(response.data.lists || []);
          setCustomMessageTotalPage(response.data.totalPage || 0);
          setCustomMessageCount(response.data.count || 0);
        }
      } else {
        response = await mySystemMessageList(searchParams);
        if (response.code === 0 && response.data) {
          setSystemMessagePage(currentPage);
          setSystemMessageData(response.data.lists || []);
          setSystemMessageTotalPage(response.data.totalPage || 0);
          setSystemMessageCount(response.data.count || 0);
        }
      }

      if (response && response.code === 0) {
        setSelection([]);
      } else {
        notify(response?.message || 'Failed to load data', 'error');
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

  // 处理 tab 切换
  const handleTabChange = (value: string | null) => {
    if (value) {
      setActiveTab(value);
      setSelection([]);
      // 数据加载由 useEffect 监听 activeTab 变化自动触发
    }
  };

  const rows = getCurrentData().map((item) => {
    const selected = selection.includes(item.id);
    return (
      <Table.Tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
        <Table.Td>
          <Checkbox checked={selection.includes(item.id)} onChange={() => toggleRow(item.id)} />
        </Table.Td>
        <Table.Td>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm" lineClamp={2}>
            {item.content}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text c={getStatusColor(item.status)}>
            {getStatusLabel(item.status)}
          </Text>
        </Table.Td>
        <Table.Td>{item.createdAt ? formatTimestamp(item.createdAt) : '-'}</Table.Td>
        <Table.Td>
          <ActionIcon.Group>
            <ActionIcon onClick={() => openViewDetailModal(item)} variant="light" size="md" aria-label="View Detail">
              <IconEye size={14} stroke={1.5} />
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
      title: '',
      status: '',
    });
    handleAdvancedFilterChange('status', '');
  };

  // 处理基础搜索输入
  const handleSearchChange = (value: string) => {
    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    setSearchKeyword(value);
    const timer = setTimeout(() => {
      loadData(1).then();
    }, 500);
    setSearchTimer(timer);
  };

  // 处理高级搜索提交
  const handleAdvancedSearch = () => {
    loadData(1).then();
  };

  // 查看详情相关状态
  const [viewDetailModalOpened, viewDetailModalActions] = useDisclosure(false);
  const [viewingMessage, setViewingMessage] = useState<Message | null>(null);

  // 打开查看详情模态窗口
  const openViewDetailModal = (message: Message) => {
    setViewingMessage(message);
    viewDetailModalActions.open();
  };

  // 状态选项数据 - 用于下拉选择器
  const statusOptions = [
    { value: '0', label: '未读' },
    { value: '1', label: '已读' },
  ];

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
          <Title order={3}>消息通知</Title>
          <Text size="sm" c="dimmed">
            查看和管理您的消息通知。
          </Text>
        </Box>
        <Divider mb="lg" my="xs" variant="dashed" />

        <Grid>
          <Grid.Col span={{ base: 12, sm: 9 }} mb="xs">
            {/* 基础搜索组件 */}
            <TextInput
              placeholder="搜索标题、内容等..."
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
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 3 }} mb="xs">
            {/* 高级搜索切换按钮 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAdvancedSearchOpen(!advancedSearchOpen)}
              leftSection={
                advancedSearchOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />
              }
              fullWidth
            >
              {advancedSearchOpen ? '隐藏高级搜索' : '高级搜索'}
            </Button>
          </Grid.Col>
        </Grid>

        {/* Tab 切换 */}
        <Tabs value={activeTab} onChange={handleTabChange} mb="md">
          <Tabs.List>
            <Tabs.Tab value="custom">普通消息</Tabs.Tab>
            <Tabs.Tab value="system">系统消息</Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {/* 高级搜索部分 - 可折叠 */}
        <Collapse in={advancedSearchOpen} transitionDuration={200}>
          <Paper p="md" mb="lg" withBorder>
            <Title order={5} mb="md">
              高级筛选
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
              <TextInput
                label="标题"
                value={advancedFilters.title}
                onChange={(e) => handleAdvancedFilterChange('title', e.target.value)}
                placeholder="搜索标题"
              />
              <Select
                label="状态"
                value={advancedFilters.status || null}
                onChange={(value) => handleAdvancedFilterChange('status', value || '')}
                placeholder="选择状态"
                data={statusOptions}
                clearable
              />
            </SimpleGrid>

            <Group gap="sm" mt="md" justify="flex-end">
              <Button variant="ghost" onClick={resetAdvancedFilters}>
                重置
              </Button>
              <Button onClick={handleAdvancedSearch}>
                应用
              </Button>
            </Group>
          </Paper>
        </Collapse>
        <Divider mb="lg" my="xs" variant="dashed" />

        <Box pos="relative">
          <Stack gap="lg" justify="flex-end">
            <LoadingOverlay visible={loading} />
            <ScrollArea>
              <Table verticalSpacing="xs" highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th w={40}>
                      <Checkbox
                        onChange={toggleAll}
                        checked={selection.length === getCurrentData().length && getCurrentData().length > 0}
                        indeterminate={selection.length > 0 && selection.length !== getCurrentData().length}
                      />
                    </Table.Th>
                    <Table.Th miw={150}>标题</Table.Th>
                    <Table.Th>内容</Table.Th>
                    <Table.Th>状态</Table.Th>
                    <Table.Th miw={180}>创建时间</Table.Th>
                    <Table.Th>操作</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rows.length > 0 ? (
                    rows
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={6} align="center">
                        <Text c="dimmed">暂无数据</Text>
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
                total={getCurrentTotalPage() || 0}
                withEdges
                value={getCurrentPage()}
                size="sm"
                onChange={handlePageChange}
                siblings={2}
                disabled={loading || getCurrentTotalPage() <= 1}
              />
            </Flex>
          </Stack>
        </Box>
      </Paper>

      {/*查看详情弹窗*/}
      <Modal
        opened={viewDetailModalOpened}
        title="消息详情"
        onClose={viewDetailModalActions.close}
        size="md"
      >
        <Box pos="relative">
          <LoadingOverlay visible={loading} />
          {viewingMessage && (
            <Stack gap="md">
              <Box mb="md">
                <Text size="sm" fw={500} mb={5}>标题</Text>
                <Text size="sm">
                  {viewingMessage.title || '-'}
                </Text>
              </Box>
              
              <Box mb="md">
                <Text size="sm" fw={500} mb={5}>状态</Text>
                <Text size="sm" c={getStatusColor(viewingMessage.status)}>
                  {getStatusLabel(viewingMessage.status)}
                </Text>
              </Box>

              <Box mb="md">
                <Text size="sm" fw={500} mb={5}>内容</Text>
                <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                  {viewingMessage.content || '-'}
                </Text>
              </Box>

              {viewingMessage.createdAt && (
                <Box mb="md">
                  <Text size="sm" fw={500} mb={5}>创建时间</Text>
                  <Text size="sm">
                    {formatTimestamp(viewingMessage.createdAt)}
                  </Text>
                </Box>
              )}

              <Flex justify="flex-end" gap="sm" mt="lg">
                <Button onClick={viewDetailModalActions.close}>关闭</Button>
              </Flex>
            </Stack>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default NotificationsPageRender;
