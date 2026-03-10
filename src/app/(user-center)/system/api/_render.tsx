'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconChevronDown, IconChevronUp, IconEdit, IconEye, IconPlus, IconSearch, IconTrash, IconX } from '@tabler/icons-react';
import cx from 'clsx';
import { ActionIcon, Anchor, Badge, Box, Breadcrumbs, Button, Checkbox, Collapse, Divider, Flex, FocusTrap, Grid, Group, LoadingOverlay, Modal, NumberInput, Pagination, Paper, ScrollArea, Select, SimpleGrid, Stack, Table, Text, Textarea, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { createApi, deleteApi, editApi, getApi, list as apiList } from '@/api/api/api';

import { createApiRequest, deleteApiRequest, editApiRequest } from '@/api/api/request';
import { listData } from '@/api/api/response';
import { Api } from '@/api/api/typings';
import { DeleteConfirm } from '@/components/DeleteConfirm/DeleteConfirm';
import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';
import notify from '@/utils/notify';
import { formatTimestamp } from '@/utils/time';
import classes from './style.module.css';
import request from '@/utils/request';


interface ApiProps {
  initialData: listData | null;
  initialModules?: { name: string }[] | null;
}

interface statusItem {
  label: string;
  color: string;
}

interface openAddEditModalParams {
  action: 'add' | 'edit';
  api?: Api;
}

// 状态映射
const statusMap: { [key: number]: statusItem } = {
  0: { label: '启用', color: 'green' },
  1: { label: '禁用', color: 'orange' },
  [-1]: { label: '已删除', color: 'red' },
};

// 状态选项数据 - 用于下拉选择器
const statusOptions = Object.entries(statusMap)
  .filter(([key]) => parseInt(key, 10) >= 0)
  .map(([value, { label }]) => ({
    value,
    label,
  }));

// HTTP 方法选项
const methodOptions = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' },
  { value: 'PATCH', label: 'PATCH' },
];

// 类型映射 (type字段: 0=系统, 1=业务)
const typeMap: { [key: number]: { label: string; color: string } } = {
  0: { label: '系统', color: 'blue' },
  1: { label: '业务', color: 'teal' },
};

// 类型选项数据 - 用于下拉选择器
const typeOptions = Object.entries(typeMap).map(([value, { label }]) => ({
  value,
  label,
}));

// 获取类型显示文本
const getTypeLabel = (type: number | string) => {
  const typeNumber = typeof type === 'string' ? parseInt(type, 10) : type;
  return typeMap[typeNumber]?.label || '未知';
};

// 获取类型显示颜色
const getTypeColor = (type: number | string) => {
  const typeNumber = typeof type === 'string' ? parseInt(type, 10) : type;
  return typeMap[typeNumber]?.color || 'gray';
};

// 获取HTTP方法对应的颜色
const getMethodColor = (method: string) => {
  const colorMap: { [key: string]: string } = {
    GET: 'blue',
    POST: 'green',
    PUT: 'orange',
    DELETE: 'red',
    PATCH: 'violet',
  };
  return colorMap[method?.toUpperCase()] || 'gray';
};

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
  name: string;
  path: string;
  method: string;
  module: string;
  type: string;
  status: string;
}


const ApiPageRender = ({ initialData, initialModules }: ApiProps) => {
  const { setActive, setSection } = useNavbar();
  const router = useRouter();

  useEffect(() => {
    setSection('System');
    setActive('Api');
  }, []);


  // 面包屑
  const items = [
    { title: '首页', href: '/' },
    { title: '系统' },
    { title: 'API管理' }
  ];

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
    name: '',
    path: '',
    module: '',
    method: '',
    type: '',
    status: '',
  });

  // 模块下拉选项
  const [moduleOptions, setModuleOptions] = useState<{ value: string; label: string }[]>(
    () =>
      (initialModules || []).map((item) => ({
        value: item.name,
        label: item.name,
      }))
  );

  // 加载模块列表
  useEffect(() => {
    // 若服务端已提供模块数据，则不再在客户端重复请求
    if (moduleOptions.length > 0) {
      return;
    }
    const fetchModules = async () => {
      try {
        const res = await request<{
          code: number;
          data?: { name: string }[];
          message?: string;
        }>({
          url: '/api/v1/api/modules',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.code === 0 && Array.isArray(res.data)) {
          setModuleOptions(
            res.data.map((item) => ({
              value: item.name,
              label: item.name,
            }))
          );
        } else {
          notify(res.message || '获取模块列表失败', 'error');
        }
      } catch (error) {
        notify('获取模块列表失败', 'error');
      }
    };

    fetchModules().then();
  }, []);

  // 状态管理
  const [data, setData] = useState(initialData?.lists || []);
  const [page, setPage] = useState(initialData?.page || 1);
  const [pageSize] = useState(initialData?.pageSize || 10);
  const [count, setCount] = useState(initialData?.count || 0);
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [totalPage, setTotalPage] = useState(initialData?.totalPage || 0);

  // 当page变化时更新URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (page === 1) {
      searchParams.delete('page');
    } else {
      searchParams.set('page', page.toString());
    }
    router.push(`?${searchParams.toString()}`, { scroll: false });
  }, [page, router]);

  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.id)));

  // 计算显示范围
  const calculateDisplayRange = () => {
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, count);
    return `显示 ${start}-${end} 条，共 ${count} 条`;
  };

  // 数据加载方法，同时支持基础搜索和高级搜索
  const loadData = async (newPage?: number) => {
    const currentPage = newPage ?? page;
    const currentKeyword = searchKeywordRef.current;

    setLoading(true);
    try {
      const baseParams = {
        page: currentPage,
        pageSize,
      };

      const searchParams: Record<string, any> = { ...baseParams };

      // 关键字搜索始终生效（只要有值），不再被高级搜索覆盖
      if (currentKeyword && currentKeyword.trim() !== '') {
        searchParams.keyword = currentKeyword.toLowerCase();
      }

      if (advancedSearchOpen) {
        Object.entries(advancedFilters).forEach(([key, value]) => {
          if (value) {
            searchParams[key] = value;
          }
        });
      }

      const response = await apiList(searchParams);
      if (response.code === 0 && response.data) {
        setPage(currentPage);
        setData(response.data.lists || []);
        setTotalPage(response.data.totalPage || 0);
        setCount(response.data.count || 0);
        setSelection([]);
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
    const selected = selection.includes(item.id);
    return (
      <Table.Tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
        <Table.Td>
          <Checkbox checked={selection.includes(item.id)} onChange={() => toggleRow(item.id)} />
        </Table.Td>
        <Table.Td>
          <Text size="sm" fw={500}>
            {item.name}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm" lineClamp={1}>
            {item.module || '-'}
          </Text>
        </Table.Td>
        <Table.Td>
          <Badge color={getMethodColor(item.method)} variant="light" size="sm">
            {item.method}
          </Badge>
        </Table.Td>
        <Table.Td>
          <Text size="sm" lineClamp={1}>
            {item.path}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm" lineClamp={1}>
            {item.description || '-'}
          </Text>
        </Table.Td>
        <Table.Td>
          <Badge color={getTypeColor(item.type)} variant="light" size="sm">
            {getTypeLabel(item.type)}
          </Badge>
        </Table.Td>
        <Table.Td>
          <Text c={getStatusColor(item.status)}>
            {getStatusLabel(item.status)}
          </Text>
        </Table.Td>
        <Table.Td>
          <ActionIcon.Group>
            <ActionIcon onClick={() => { openViewDetailModal(item) }} variant="light" size="md" aria-label="查看详情">
              <IconEye size={14} stroke={1.5} />
            </ActionIcon>
            <ActionIcon onClick={() => { openAddEditModal({ action: 'edit', api: item }) }} variant="light" size="md" aria-label="编辑">
              <IconEdit size={14} stroke={1.5} />
            </ActionIcon>
            <DeleteConfirm onConfirm={() => { handleDeleteOneApi(item) }} itemName={item.name}>
              <ActionIcon variant="light" size="md" aria-label="删除">
                <IconTrash size={14} stroke={1.5} />
              </ActionIcon>
            </DeleteConfirm>
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
      name: '',
      path: '',
      module: '',
      method: '',
      type: '',
      status: '',
    });
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


  const [addEditAction, setAddEditAction] = useState<'add' | 'edit'>('add');
  const [addEditModalOpened, addEditModalActions] = useDisclosure(false);
  const [editingApi, setEditingApi] = useState<Api | null>(null);

  // 查看详情相关状态
  const [viewDetailModalOpened, viewDetailModalActions] = useDisclosure(false);
  const [viewingApi, setViewingApi] = useState<Api | null>(null);

  // 打开查看详情模态窗口
  const openViewDetailModal = async (api: Api) => {
    setLoading(true);
    try {
      const response = await getApi({ id: api.id });
      if (response.code === 0 && response.data) {
        setViewingApi(response.data);
        viewDetailModalActions.open();
      } else {
        notify(response.message || 'Failed to load API details', 'error');
      }
    } catch (err) {
      if (err instanceof Error) {
        notify(err.message, 'error');
      } else {
        notify('Internal Error', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // 打开表单模态窗口
  const openAddEditModal = ({ action, api }: openAddEditModalParams) => {
    setAddEditAction(action);

    if (action === 'edit' && api) {
      setEditingApi(api);
      addEditForm.setValues({
        id: api.id,
        name: api.name,
        module: api.module || '',
        path: api.path,
        method: api.method,
        description: api.description || '',
        type: api.type || 0,
        status: api.status,
      });
    } else {
      setEditingApi(null);
      addEditForm.setValues({
        id: '',
        name: '',
        module: '',
        path: '',
        method: 'GET',
        description: '',
        type: 0,
        status: 0,
      });
    }

    addEditModalActions.open();
  };

  const handleDeleteOneApi = async (api: Api) => {
    setLoading(true);
    try {
      const requestData: deleteApiRequest = {
        ids: [api.id],
      };
      const response = await deleteApi(requestData);
      if (response.code === 0) {
        notify('API删除成功', 'success');
        await loadData(page);
      } else {
        notify(response.message || 'Failed to delete the API', 'error');
      }
    } catch (err) {
      if (err instanceof Error) {
        notify(err.message, 'error');
      } else {
        notify('Internal Error', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // 批量删除选中的API
  const handleDeleteSelected = async () => {
    if (selection.length === 0) {
      return;
    }
    setLoading(true);
    try {
      const requestData: deleteApiRequest = {
        ids: selection,
      };
      const response = await deleteApi(requestData);
      if (response.code === 0) {
        notify(`成功删除 ${response.data?.count || selection.length} 条API`, 'success');
        await loadData(page);
      } else {
        notify(response.message || 'Failed to delete the APIs', 'error');
      }
    } catch (err) {
      if (err instanceof Error) {
        notify(err.message, 'error');
      } else {
        notify('Internal Error', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const addEditForm = useForm({
    initialValues: {
      id: editingApi?.id || '',
      name: editingApi?.name || '',
      module: editingApi?.module || '',
      path: editingApi?.path || '',
      method: editingApi?.method || 'GET',
      description: editingApi?.description || '',
      type: editingApi?.type || 0,
      status: editingApi?.status ?? 0,
    },
    validate: {
      name: (val) => {
        if (!val || val.trim() === '') {
          return '此字段为必填项';
        }
        return null;
      },
      path: (val) => {
        if (!val || val.trim() === '') {
          return '此字段为必填项';
        }
        return null;
      },
      method: (val) => {
        if (!val || val.trim() === '') {
          return '此字段为必填项';
        }
        return null;
      },
      status: (val) => {
        if (val === undefined || val === null) {
          return '此字段为必填项';
        }
        return null;
      },
    },
  });

  const handleAdEditFormSubmit = async (values: typeof addEditForm.values): Promise<void> => {
    if (addEditAction === 'add') {
      setLoading(true);
      try {
        const formattedData: createApiRequest = {
          name: values.name,
          module: values.module || undefined,
          path: values.path,
          method: values.method,
          description: values.description || undefined,
          type: values.type,
          status: values.status,
        };
        const response = await createApi(formattedData);

        if (response.code === 0) {
          loadData(page).then()
          notify('API添加成功', 'success');
        } else {
          notify(response.message || 'Failed to add the API', 'error');
        }
      } catch (err) {
        if (err instanceof Error) {
          notify(err.message, 'error');
        } else {
          notify('Internal Error', 'error');
        }
      } finally {
        setLoading(false);
        addEditModalActions.close();
      }

    } else if (addEditAction === 'edit') {
      if (!editingApi) { return; }
      setLoading(true);
      try {
        const formattedData: editApiRequest = {
          id: values.id,
          name: values.name,
          module: values.module || undefined,
          path: values.path,
          method: values.method,
          description: values.description || undefined,
          type: values.type,
          status: values.status,
        };
        const response = await editApi(formattedData);

        if (response.code === 0) {
          loadData(page).then()
          notify('API更新成功', 'success');
        } else {
          notify(response.message || 'Failed to update the API', 'error');
        }
      } catch (err) {
        if (err instanceof Error) {
          notify(err.message, 'error');
        } else {
          notify('Internal Error', 'error');
        }
      } finally {
        setLoading(false);
        addEditModalActions.close();
      }
    }
    addEditForm.reset();
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
            <Anchor key={index} role="button" component="span" onClick={() => { }}>
              {item.title}
            </Anchor>
          )
        )}
      </Breadcrumbs>
      <Paper pt="xs" pb="xs">
        {/* 页面容器 - 标题 */}
        <Box mb="md">
          <Title order={3}>API管理</Title>
          <Text size="sm" c="dimmed">
            高效管理和控制系统API接口。
          </Text>
        </Box>
        <Divider mb="lg" my="xs" variant="dashed" />
        <Grid>
          <Grid.Col span={{ base: 12, sm: 9 }} mb="xs">
            {/* 基础搜索组件 */}
            <TextInput
              placeholder="搜索名称、路径等..."
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

        {/* 高级搜索部分 - 可折叠 */}
        <Collapse in={advancedSearchOpen} transitionDuration={200}>
          <Paper p="md" mb="lg" withBorder>
            <Title order={5} mb="md">
              高级筛选
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 6 }} spacing="md">
              <TextInput
                label="名称"
                value={advancedFilters.name}
                onChange={(e) => handleAdvancedFilterChange('name', e.target.value)}
                placeholder="搜索名称"
              />
              <Select
                label="模块"
                value={advancedFilters.module || null}
                onChange={(value) => handleAdvancedFilterChange('module', value || '')}
                placeholder="选择模块"
                data={moduleOptions}
                clearable
                searchable
              />
              <TextInput
                label="路径"
                value={advancedFilters.path}
                onChange={(e) => handleAdvancedFilterChange('path', e.target.value)}
                placeholder="搜索路径"
              />
              <Select
                label="请求方法"
                value={advancedFilters.method || null}
                onChange={(value) => handleAdvancedFilterChange('method', value || '')}
                placeholder="选择方法"
                data={methodOptions}
                clearable
              />
              <Select
                label="类型"
                value={advancedFilters.type || null}
                onChange={(value) => handleAdvancedFilterChange('type', value || '')}
                placeholder="选择类型"
                data={typeOptions}
                clearable
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

        <SimpleGrid mb="sm">
          <Flex justify="flex-end" align="center" direction="row">
            <Group>
              <DeleteConfirm
                onConfirm={handleDeleteSelected}
                itemName={selection.length === 1 ? data.find(item => selection.includes(item.id))?.name : `${selection.length} 条API`}
                title="删除选中的API"
              >
                <Button
                  variant="danger"
                  leftSection={<IconTrash size={16} stroke={1.5} />}
                  disabled={selection.length === 0 || loading}
                >
                  删除选中
                </Button>
              </DeleteConfirm>
              <Button
                leftSection={<IconPlus size={16} stroke={1.5} />}
                onClick={() => openAddEditModal({ action: 'add' })}
              >
                添加API
              </Button>
            </Group>
          </Flex>
        </SimpleGrid>

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
                        checked={selection.length === data.length}
                        indeterminate={selection.length > 0 && selection.length !== data.length}
                      />
                    </Table.Th>
                    <Table.Th miw={100}>名称</Table.Th>
                    <Table.Th miw={120}>模块</Table.Th>
                    <Table.Th miw={80}>方法</Table.Th>
                    <Table.Th miw={200}>路径</Table.Th>
                    <Table.Th miw={150}>描述</Table.Th>
                    <Table.Th miw={80}>类型</Table.Th>
                    <Table.Th miw={80}>状态</Table.Th>
                    <Table.Th>操作</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rows.length > 0 ? (
                    rows
                  ) : (
                    <Table.Tr>
                    <Table.Td colSpan={9} align="center">
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

      {/*独立的添加/编辑弹窗*/}
      <Modal
        opened={addEditModalOpened}
        title={addEditAction === 'add' ? '添加API' : '编辑API'}
        onClose={addEditModalActions.close}
        size="lg"
      >
        <Box pos="relative">
          <LoadingOverlay visible={loading} />
          <FocusTrap active>
            <form onSubmit={addEditForm.onSubmit(handleAdEditFormSubmit)}>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  required
                  data-autofocus
                  label="名称"
                  placeholder="输入 API 名称"
                  value={addEditForm.values.name}
                  onChange={(event) =>
                    addEditForm.setFieldValue('name', event.currentTarget.value)
                  }
                  error={addEditForm.errors.name}
                  radius="md"
                />
                <Select
                  label="模块"
                  placeholder="选择模块"
                  value={addEditForm.values.module || null}
                  onChange={(value) => addEditForm.setFieldValue('module', value || '')}
                  data={moduleOptions}
                  clearable
                  searchable
                />
                <Box style={{ gridColumn: 'span 2' }}>
                  <Group align="flex-end" gap="sm" wrap="nowrap">
                    <Select
                      required
                      label="路径"
                      value={addEditForm.values.method}
                      onChange={(value) => addEditForm.setFieldValue('method', value || 'GET')}
                      placeholder="方法"
                      data={methodOptions}
                      error={addEditForm.errors.method}
                      style={{ maxWidth: 120 }}
                    />
                    <TextInput
                      required
                      placeholder="输入API路径，如 /api/v1/users"
                      value={addEditForm.values.path}
                      onChange={(event) =>
                        addEditForm.setFieldValue('path', event.currentTarget.value)
                      }
                      error={addEditForm.errors.path}
                      radius="md"
                      style={{ flex: 1 }}
                    />
                  </Group>
                </Box>
                <Select
                  label="类型"
                  required
                  value={addEditForm.values.type.toString()}
                  onChange={(value) => addEditForm.setFieldValue('type', parseInt(value || '0', 10))}
                  placeholder="选择类型"
                  data={typeOptions}
                  disabled={loading}
                  error={addEditForm.errors.type}
                />
                <Select
                  label="状态"
                  required
                  value={addEditForm.values.status.toString()}
                  onChange={(value) => addEditForm.setFieldValue('status', parseInt(value || '0', 10))}
                  placeholder="选择状态"
                  data={statusOptions}
                  disabled={loading}
                  error={addEditForm.errors.status}
                />
                <Textarea
                  label="描述"
                  placeholder="输入API描述"
                  value={addEditForm.values.description}
                  onChange={(event) =>
                    addEditForm.setFieldValue('description', event.currentTarget.value)
                  }
                  radius="md"
                  style={{ gridColumn: 'span 2' }}
                  rows={3}
                />
              </SimpleGrid>
              <Flex justify="flex-end" gap="sm" mt="lg">
                <Button type="submit" disabled={loading}>保存</Button>
              </Flex>
            </form>
          </FocusTrap>
        </Box>
      </Modal>

      {/*查看详情弹窗*/}
      <Modal
        opened={viewDetailModalOpened}
        title="API详情"
        onClose={viewDetailModalActions.close}
        size="lg"
      >
        <Box pos="relative">
          <LoadingOverlay visible={loading} />
          {viewingApi && (
            <Stack gap="md">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Box>
                  <Text size="sm" fw={500} mb={5}>名称</Text>
                  <Text size="sm">{viewingApi.name || '-'}</Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>模块</Text>
                  <Text size="sm">{viewingApi.module || '-'}</Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>请求方法</Text>
                  <Badge color={getMethodColor(viewingApi.method)} variant="light" size="sm">
                    {viewingApi.method || '-'}
                  </Badge>
                </Box>
                <Box style={{ gridColumn: 'span 2' }}>
                  <Text size="sm" fw={500} mb={5}>路径</Text>
                  <Text size="sm">{viewingApi.path || '-'}</Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>类型</Text>
                  <Badge color={getTypeColor(viewingApi.type)} variant="light" size="sm">
                    {getTypeLabel(viewingApi.type)}
                  </Badge>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>状态</Text>
                  <Text size="sm" c={getStatusColor(viewingApi.status)}>
                    {getStatusLabel(viewingApi.status)}
                  </Text>
                </Box>
                <Box style={{ gridColumn: 'span 2' }}>
                  <Text size="sm" fw={500} mb={5}>描述</Text>
                  <Text size="sm">{viewingApi.description || '-'}</Text>
                </Box>
              </SimpleGrid>

              <Divider my="sm" />

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Box>
                  <Text size="sm" fw={500} mb={5}>创建人</Text>
                  <Text size="sm">
                    {viewingApi.creator ? (viewingApi.creator.nickname || viewingApi.creator.username || '-') : '-'}
                  </Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>创建时间</Text>
                  <Text size="sm">
                    {viewingApi.createdAt ? formatTimestamp(viewingApi.createdAt) : '-'}
                  </Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>更新人</Text>
                  <Text size="sm">
                    {viewingApi.updater ? (viewingApi.updater.nickname || viewingApi.updater.username || '-') : '-'}
                  </Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>更新时间</Text>
                  <Text size="sm">
                    {viewingApi.updatedAt ? formatTimestamp(viewingApi.updatedAt) : '-'}
                  </Text>
                </Box>
              </SimpleGrid>

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

export default ApiPageRender;
