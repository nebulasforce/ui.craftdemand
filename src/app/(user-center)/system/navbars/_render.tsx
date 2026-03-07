'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconChevronDown, IconChevronUp, IconEdit, IconEye, IconPlus, IconSearch, IconTrash, IconX } from '@tabler/icons-react';
import cx from 'clsx';
import { ActionIcon, Anchor, Box, Breadcrumbs, Button, Checkbox, Collapse, ColorInput, Divider, Flex, FocusTrap, Grid, Group, LoadingOverlay, Modal, NumberInput, Pagination, Paper, ScrollArea, Select, SimpleGrid, Stack, Table, Text, TextInput, Title, Tooltip } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { createNavbar, deleteNavbar, editNavbar, getNavbar, list as navbarList } from '@/api/navbar/api';

import { createNavbarRequest, deleteNavbarRequest, editNavbarRequest } from '@/api/navbar/request';
import { listData } from '@/api/navbar/response';
import { Navbar } from '@/api/navbar/typings';
import { DeleteConfirm } from '@/components/DeleteConfirm/DeleteConfirm';
import { DynamicIcon } from '@/components/DynamicIcon';
import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';
import notify from '@/utils/notify';
import { formatTimestamp } from '@/utils/time';
import classes from './style.module.css';


interface NavbarsProps {
  initialData: listData | null;
  labelOptions: string[];
}

interface statusItem {
  label: string;
  color: string;
}

interface openAddEditModalParams {
  action: 'add' | 'edit';
  navbar?: Navbar;
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
  section: string;
  status: string;
}


const NavbarsPageRender = ({ initialData, labelOptions }: NavbarsProps) => {
  // 将 labelOptions 字符串数组转换为 Select 组件需要的格式
  const sectionOptions = labelOptions.map(item => ({
    value: item,
    label: item,
  }));
  const { setActive, setSection } = useNavbar();
  const router = useRouter();

  useEffect(() => {
    setSection('System');
    setActive('Navbars');
  }, []);


  // 面包屑
  const items = [
    { title: '首页', href: '/' },
    { title: '系统' },
    { title: '导航栏' }
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
    section: '',
    status: '',
  });

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

      const response = await navbarList(searchParams);
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
          <Text size="sm">
            {item.label || '-'}
          </Text>
        </Table.Td>
        <Table.Td>
          <Tooltip label={item.icon} withArrow>
            <Group gap="xs">
              <DynamicIcon name={item.icon} size={18} stroke={1.5} />
              <Text size="sm" c="dimmed">
                {item.icon}
              </Text>
            </Group>
          </Tooltip>
        </Table.Td>
        <Table.Td>
          <Text size="sm" lineClamp={1}>
            {item.url}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm">
            {item.sort}
          </Text>
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
            <ActionIcon onClick={() => { openAddEditModal({ action: 'edit', navbar: item }) }} variant="light" size="md" aria-label="编辑">
              <IconEdit size={14} stroke={1.5} />
            </ActionIcon>
            <DeleteConfirm onConfirm={() => { handleDeleteOneNavbar(item) }} itemName={item.name}>
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
      section: '',
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
  const [editingNavbar, setEditingNavbar] = useState<Navbar | null>(null);

  // 查看详情相关状态
  const [viewDetailModalOpened, viewDetailModalActions] = useDisclosure(false);
  const [viewingNavbar, setViewingNavbar] = useState<Navbar | null>(null);

  // 打开查看详情模态窗口
  const openViewDetailModal = async (navbar: Navbar) => {
    setLoading(true);
    try {
      const response = await getNavbar({ id: navbar.id });
      if (response.code === 0 && response.data) {
        setViewingNavbar(response.data);
        viewDetailModalActions.open();
      } else {
        notify(response.message || 'Failed to load navbar details', 'error');
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
  const openAddEditModal = ({ action, navbar }: openAddEditModalParams) => {
    setAddEditAction(action);

    if (action === 'edit' && navbar) {
      setEditingNavbar(navbar);
      addEditForm.setValues({
        id: navbar.id,
        name: navbar.name,
        code: navbar.code,
        icon: navbar.icon,
        url: navbar.url,
        label: navbar.label || '',
        color: navbar.color || '',
        sort: navbar.sort || 0,
        status: navbar.status,
      });
    } else {
      setEditingNavbar(null);
      addEditForm.setValues({
        id: '',
        name: '',
        code: '',
        icon: '',
        url: '',
        label: '',
        color: '',
        sort: 0,
        status: 0,
      });
    }

    addEditModalActions.open();
  };

  const handleDeleteOneNavbar = async (navbar: Navbar) => {
    setLoading(true);
    try {
      const requestData: deleteNavbarRequest = {
        ids: [navbar.id],
      };
      const response = await deleteNavbar(requestData);
      if (response.code === 0) {
        notify('导航栏删除成功', 'success');
        await loadData(page);
      } else {
        notify(response.message || 'Failed to delete the navbar', 'error');
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

  // 批量删除选中的导航栏
  const handleDeleteSelected = async () => {
    if (selection.length === 0) {
      return;
    }
    setLoading(true);
    try {
      const requestData: deleteNavbarRequest = {
        ids: selection,
      };
      const response = await deleteNavbar(requestData);
      if (response.code === 0) {
        notify(`成功删除 ${response.data?.count || selection.length} 条导航栏`, 'success');
        await loadData(page);
      } else {
        notify(response.message || 'Failed to delete the navbars', 'error');
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
      id: editingNavbar?.id || '',
      name: editingNavbar?.name || '',
      code: editingNavbar?.code || '',
      icon: editingNavbar?.icon || '',
      url: editingNavbar?.url || '',
      label: editingNavbar?.label || '',
      color: editingNavbar?.color || '',
      sort: editingNavbar?.sort || 0,
      status: editingNavbar?.status ?? 0,
    },
    validate: {
      name: (val) => {
        if (!val || val.trim() === '') {
          return '此字段为必填项';
        }
        return null;
      },
      code: (val) => {
        if (!val || val.trim() === '') {
          return '此字段为必填项';
        }
        return null;
      },
      icon: (val) => {
        if (!val || val.trim() === '') {
          return '此字段为必填项';
        }
        return null;
      },
      url: (val) => {
        if (!val || val.trim() === '') {
          return '此字段为必填项';
        }
        return null;
      },
      label: (val) => {
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
        const formattedData: createNavbarRequest = {
          name: values.name,
          code: values.code,
          icon: values.icon,
          url: values.url,
          section: values.label,
          label: values.label,
          color: values.color || undefined,
          sort: values.sort,
          status: values.status,
        };
        const response = await createNavbar(formattedData);

        if (response.code === 0) {
          loadData(page).then()
          notify('导航栏添加成功', 'success');
        } else {
          notify(response.message || 'Failed to add the navbar', 'error');
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
      if (!editingNavbar) { return; }
      setLoading(true);
      try {
        const formattedData: editNavbarRequest = {
          id: values.id,
          name: values.name,
          code: values.code,
          icon: values.icon,
          url: values.url,
          section: values.label,
          label: values.label,
          color: values.color || undefined,
          sort: values.sort,
          status: values.status,
        };
        const response = await editNavbar(formattedData);

        if (response.code === 0) {
          loadData(page).then()
          notify('导航栏更新成功', 'success');
        } else {
          notify(response.message || 'Failed to update the navbar', 'error');
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
          <Title order={3}>导航栏管理</Title>
          <Text size="sm" c="dimmed">
            高效管理和控制导航栏菜单项。
          </Text>
        </Box>
        <Divider mb="lg" my="xs" variant="dashed" />
        <Grid>
          <Grid.Col span={{ base: 12, sm: 9 }} mb="xs">
            {/* 基础搜索组件 */}
            <TextInput
              placeholder="搜索名称、编码等..."
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
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              <TextInput
                label="名称"
                value={advancedFilters.name}
                onChange={(e) => handleAdvancedFilterChange('name', e.target.value)}
                placeholder="搜索名称"
              />
              <Select
                label="分组"
                value={advancedFilters.section || null}
                onChange={(value) => handleAdvancedFilterChange('section', value || '')}
                placeholder="选择分组"
                data={sectionOptions}
                clearable
              />
              <Select
                label="状态"
                value={statusOptions.find(opt => opt.label === advancedFilters.status)?.value || null}
                onChange={(value) => {
                  const selectedOption = statusOptions.find(opt => opt.value === value);
                  handleAdvancedFilterChange('status', selectedOption?.label || '');
                }}
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
                itemName={selection.length === 1 ? data.find(item => selection.includes(item.id))?.name : `${selection.length} 条导航栏`}
                title="删除选中的导航栏"
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
                添加导航栏
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
                    <Table.Th miw={80}>分组</Table.Th>
                    <Table.Th miw={120}>图标</Table.Th>
                    <Table.Th miw={150}>URL</Table.Th>
                    <Table.Th miw={60}>排序</Table.Th>
                    <Table.Th miw={80}>状态</Table.Th>
                    <Table.Th>操作</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rows.length > 0 ? (
                    rows
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={8} align="center">
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
        title={addEditAction === 'add' ? '添加导航栏' : '编辑导航栏'}
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
                  placeholder="输入导航栏名称"
                  value={addEditForm.values.name}
                  onChange={(event) =>
                    addEditForm.setFieldValue('name', event.currentTarget.value)
                  }
                  error={addEditForm.errors.name}
                  radius="md"
                />
                <TextInput
                  required
                  label="编码"
                  placeholder="输入导航栏编码"
                  value={addEditForm.values.code}
                  onChange={(event) =>
                    addEditForm.setFieldValue('code', event.currentTarget.value)
                  }
                  error={addEditForm.errors.code}
                  radius="md"
                />
                <TextInput
                  required
                  label="图标"
                  placeholder="输入图标名称，如 IconHome"
                  value={addEditForm.values.icon}
                  onChange={(event) =>
                    addEditForm.setFieldValue('icon', event.currentTarget.value)
                  }
                  error={addEditForm.errors.icon}
                  radius="md"
                  rightSection={
                    addEditForm.values.icon && (
                      <DynamicIcon name={addEditForm.values.icon} size={18} stroke={1.5} />
                    )
                  }
                />
                <TextInput
                  required
                  label="URL"
                  placeholder="输入导航栏URL"
                  value={addEditForm.values.url}
                  onChange={(event) =>
                    addEditForm.setFieldValue('url', event.currentTarget.value)
                  }
                  error={addEditForm.errors.url}
                  radius="md"
                />
                <Select
                  label="分组"
                  required
                  value={addEditForm.values.label}
                  onChange={(value) => addEditForm.setFieldValue('label', value || '')}
                  placeholder="选择分组"
                  data={sectionOptions}
                  error={addEditForm.errors.label}
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
                <NumberInput
                  label="排序"
                  placeholder="输入排序值"
                  value={addEditForm.values.sort}
                  onChange={(value) =>
                    addEditForm.setFieldValue('sort', typeof value === 'number' ? value : 0)
                  }
                  radius="md"
                  min={0}
                />
                <ColorInput
                  label="颜色"
                  placeholder="选择颜色"
                  value={addEditForm.values.color}
                  onChange={(value) => addEditForm.setFieldValue('color', value)}
                  format="hex"
                  swatches={['#2e2e2e', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}
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
        title="导航栏详情"
        onClose={viewDetailModalActions.close}
        size="lg"
      >
        <Box pos="relative">
          <LoadingOverlay visible={loading} />
          {viewingNavbar && (
            <Stack gap="md">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Box>
                  <Text size="sm" fw={500} mb={5}>名称</Text>
                  <Text size="sm">{viewingNavbar.name || '-'}</Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>编码</Text>
                  <Text size="sm">{viewingNavbar.code || '-'}</Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>图标</Text>
                  <Group gap="xs">
                    {viewingNavbar.icon && (
                      <DynamicIcon name={viewingNavbar.icon} size={18} stroke={1.5} />
                    )}
                    <Text size="sm">{viewingNavbar.icon || '-'}</Text>
                  </Group>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>URL</Text>
                  <Text size="sm">{viewingNavbar.url || '-'}</Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>分组</Text>
                  <Text size="sm">{viewingNavbar.section || '-'}</Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>状态</Text>
                  <Text size="sm" c={getStatusColor(viewingNavbar.status)}>
                    {getStatusLabel(viewingNavbar.status)}
                  </Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>排序</Text>
                  <Text size="sm">{viewingNavbar.sort ?? '-'}</Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>颜色</Text>
                  <Group gap="xs">
                    {viewingNavbar.color && (
                      <Box
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          backgroundColor: viewingNavbar.color,
                          border: '1px solid var(--mantine-color-default-border)',
                        }}
                      />
                    )}
                    <Text size="sm">{viewingNavbar.color || '-'}</Text>
                  </Group>
                </Box>
              </SimpleGrid>

              <Divider my="sm" />

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Box>
                  <Text size="sm" fw={500} mb={5}>创建人</Text>
                  <Text size="sm">
                    {viewingNavbar.creator ? (viewingNavbar.creator.nickname || viewingNavbar.creator.username || '-') : '-'}
                  </Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>创建时间</Text>
                  <Text size="sm">
                    {viewingNavbar.createdAt ? formatTimestamp(viewingNavbar.createdAt) : '-'}
                  </Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>更新人</Text>
                  <Text size="sm">
                    {viewingNavbar.updater ? (viewingNavbar.updater.nickname || viewingNavbar.updater.username || '-') : '-'}
                  </Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>更新时间</Text>
                  <Text size="sm">
                    {viewingNavbar.updatedAt ? formatTimestamp(viewingNavbar.updatedAt) : '-'}
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

export default NavbarsPageRender;
