'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconEye,
  IconPlus,
  IconSearch,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import cx from 'clsx';
import {
  ActionIcon,
  Anchor,
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Collapse,
  ColorInput,
  Divider,
  Flex,
  FocusTrap,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  NumberInput,
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
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  createHeadDropdown,
  deleteHeadDropdown,
  editHeadDropdown,
  getHeadDropdown,
  list as headDropdownList,
} from '@/api/headDropdown/api';
import {
  createHeadDropdownRequest,
  deleteHeadDropdownRequest,
  editHeadDropdownRequest,
} from '@/api/headDropdown/request';
import { listData } from '@/api/headDropdown/response';
import { HeadDropdown } from '@/api/headDropdown/typings';
import { DeleteConfirm } from '@/components/DeleteConfirm/DeleteConfirm';
import { DynamicIcon } from '@/components/DynamicIcon';
import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';
import notify from '@/utils/notify';
import { formatTimestamp } from '@/utils/time';
import classes from './style.module.css';

interface HeaderDropdownsProps {
  initialData: listData | null;
  /** 分组选项，来自服务端 headDropdown ListGroup 接口 */
  groupOptions: string[];
}

interface openAddEditModalParams {
  action: 'add' | 'edit';
  item?: HeadDropdown;
}

// 定义高级搜索条件接口
interface AdvancedSearchFilters {
  name: string;
  section: string;
}

const HeaderDropdownsPageRender = ({ initialData, groupOptions }: HeaderDropdownsProps) => {
  // 将分组选项转换为 Select 组件需要的格式（分组来自服务端 ListGroup 接口）
  const sectionOptions = groupOptions.map((item) => ({
    value: item,
    label: item,
  }));
  const { setActive, setSection } = useNavbar();
  const router = useRouter();

  useEffect(() => {
    setSection('System');
    setActive('HeaderDropdowns');
  }, []);

  // 面包屑
  const items = [
    { title: '首页', href: '/' },
    { title: '系统' },
    { title: '下拉管理' },
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
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
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
          if (!value) return;

          // 分组条件使用 label 字段传给后端
          if (key === 'section') {
            searchParams.label = value;
            return;
          }

          searchParams[key] = value;
        });
      }

      const response = await headDropdownList(searchParams);
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
          <Text size="sm">{item.label || '-'}</Text>
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
          <Text size="sm" lineClamp={1}>
            {item.rightSection || '-'}
          </Text>
        </Table.Td>
        <Table.Td>
          <ActionIcon.Group>
            <ActionIcon
              onClick={() => {
                openViewDetailModal(item);
              }}
              variant="light"
              size="md"
              aria-label="查看详情"
            >
              <IconEye size={14} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              onClick={() => {
                openAddEditModal({ action: 'edit', item });
              }}
              variant="light"
              size="md"
              aria-label="编辑"
            >
              <IconEdit size={14} stroke={1.5} />
            </ActionIcon>
            <DeleteConfirm
              onConfirm={() => {
                handleDeleteOne(item);
              }}
              itemName={item.name}
            >
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
    setAdvancedFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 重置高级搜索条件
  const resetAdvancedFilters = () => {
    setAdvancedFilters({
      name: '',
      section: '',
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
  const [editingItem, setEditingItem] = useState<HeadDropdown | null>(null);

  // 查看详情相关状态
  const [viewDetailModalOpened, viewDetailModalActions] = useDisclosure(false);
  const [viewingItem, setViewingItem] = useState<HeadDropdown | null>(null);

  // 打开查看详情模态窗口
  const openViewDetailModal = async (item: HeadDropdown) => {
    setLoading(true);
    try {
      const response = await getHeadDropdown({ id: item.id });
      if (response.code === 0 && response.data) {
        setViewingItem(response.data);
        viewDetailModalActions.open();
      } else {
        notify(response.message || 'Failed to load header dropdown details', 'error');
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
  const openAddEditModal = ({ action, item }: openAddEditModalParams) => {
    setAddEditAction(action);

    if (action === 'edit' && item) {
      setEditingItem(item);
      addEditForm.setValues({
        id: item.id,
        name: item.name,
        code: item.code,
        icon: item.icon,
        url: item.url,
        label: item.label || '',
        color: item.color || '',
        sort: item.sort || 0,
        event: item.event || '',
        rightSection: item.rightSection || '',
      });
    } else {
      setEditingItem(null);
      addEditForm.setValues({
        id: '',
        name: '',
        code: '',
        icon: '',
        url: '',
        label: '',
        color: '',
        sort: 0,
        event: '',
        rightSection: '',
      });
    }

    addEditModalActions.open();
  };

  const handleDeleteOne = async (item: HeadDropdown) => {
    setLoading(true);
    try {
      const requestData: deleteHeadDropdownRequest = {
        ids: [item.id],
      };
      const response = await deleteHeadDropdown(requestData);
      if (response.code === 0) {
        notify('头部下拉删除成功', 'success');
        await loadData(page);
      } else {
        notify(response.message || 'Failed to delete the header dropdown', 'error');
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

  // 批量删除选中项
  const handleDeleteSelected = async () => {
    if (selection.length === 0) {
      return;
    }
    setLoading(true);
    try {
      const requestData: deleteHeadDropdownRequest = {
        ids: selection,
      };
      const response = await deleteHeadDropdown(requestData);
      if (response.code === 0) {
        notify(`成功删除 ${response.data?.count || selection.length} 条头部下拉`, 'success');
        await loadData(page);
      } else {
        notify(response.message || 'Failed to delete the header dropdowns', 'error');
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
      id: editingItem?.id || '',
      name: editingItem?.name || '',
      code: editingItem?.code || '',
      icon: editingItem?.icon || '',
      url: editingItem?.url || '',
      label: editingItem?.label || '',
      color: editingItem?.color || '',
      sort: editingItem?.sort || 0,
      event: editingItem?.event || '',
      rightSection: editingItem?.rightSection || '',
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
    },
  });

  const handleAdEditFormSubmit = async (values: typeof addEditForm.values): Promise<void> => {
    if (addEditAction === 'add') {
      setLoading(true);
      try {
        const formattedData: createHeadDropdownRequest = {
          name: values.name,
          code: values.code,
          icon: values.icon,
          url: values.url,
          section: values.label,
          label: values.label,
          color: values.color || undefined,
          sort: values.sort,
          event: values.event || undefined,
          rightSection: values.rightSection || undefined,
        };
        const response = await createHeadDropdown(formattedData);

        if (response.code === 0) {
          loadData(page).then();
          notify('头部下拉添加成功', 'success');
        } else {
          notify(response.message || 'Failed to add the header dropdown', 'error');
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
      if (!editingItem) {
        return;
      }
      setLoading(true);
      try {
        const formattedData: editHeadDropdownRequest = {
          id: values.id,
          name: values.name,
          code: values.code,
          icon: values.icon,
          url: values.url,
          section: values.label,
          label: values.label,
          color: values.color || undefined,
          sort: values.sort,
          event: values.event || undefined,
          rightSection: values.rightSection || undefined,
        };
        const response = await editHeadDropdown(formattedData);

        if (response.code === 0) {
          loadData(page).then();
          notify('头部下拉更新成功', 'success');
        } else {
          notify(response.message || 'Failed to update the header dropdown', 'error');
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
            <Anchor
              key={index}
              role="button"
              component="span"
              onClick={() => {
                }}
            >
              {item.title}
            </Anchor>
          ),
        )}
      </Breadcrumbs>
      <Paper pt="xs" pb="xs">
        {/* 页面容器 - 标题 */}
        <Box mb="md">
          <Title order={3}>下拉管理</Title>
          <Text size="sm" c="dimmed">
            管理头部下拉菜单项及其分组。
          </Text>
        </Box>
        <Divider mb="lg" my="xs" variant="dashed" />
        <Grid>
          <Grid.Col span={{ base: 12, sm: 9 }} mb="xs">
            {/* 基础搜索组件 */}
            <TextInput
              placeholder="搜索名称等..."
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
              leftSection={advancedSearchOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
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
            </SimpleGrid>

            <Group gap="sm" mt="md" justify="flex-end">
              <Button variant="ghost" onClick={resetAdvancedFilters}>
                重置
              </Button>
              <Button onClick={handleAdvancedSearch}>应用</Button>
            </Group>
          </Paper>
        </Collapse>
        <Divider mb="lg" my="xs" variant="dashed" />

        <SimpleGrid mb="sm">
          <Flex justify="flex-end" align="center" direction="row">
            <Group>
              <DeleteConfirm
                onConfirm={handleDeleteSelected}
                itemName={
                  selection.length === 1
                    ? data.find((item) => selection.includes(item.id))?.name
                    : `${selection.length} 条头部下拉`
                }
                title="删除选中的头部下拉"
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
                添加头部下拉
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
                    <Table.Th miw={120}>快捷键</Table.Th>
                    <Table.Th>操作</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rows.length > 0 ? (
                    rows
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={7} align="center">
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
        title={addEditAction === 'add' ? '添加头部下拉' : '编辑头部下拉'}
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
                  placeholder="输入名称"
                  value={addEditForm.values.name}
                  onChange={(event) => addEditForm.setFieldValue('name', event.currentTarget.value)}
                  error={addEditForm.errors.name}
                  radius="md"
                />
                <TextInput
                  required
                  label="编码"
                  placeholder="输入编码"
                  value={addEditForm.values.code}
                  onChange={(event) => addEditForm.setFieldValue('code', event.currentTarget.value)}
                  error={addEditForm.errors.code}
                  radius="md"
                />
                <TextInput
                  required
                  label="图标"
                  placeholder="输入图标名称，如 IconUser"
                  value={addEditForm.values.icon}
                  onChange={(event) => addEditForm.setFieldValue('icon', event.currentTarget.value)}
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
                  placeholder="输入 URL"
                  value={addEditForm.values.url}
                  onChange={(event) => addEditForm.setFieldValue('url', event.currentTarget.value)}
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
                  swatches={[
                    '#2e2e2e',
                    '#868e96',
                    '#fa5252',
                    '#e64980',
                    '#be4bdb',
                    '#7950f2',
                    '#4c6ef5',
                    '#228be6',
                    '#15aabf',
                    '#12b886',
                    '#40c057',
                    '#82c91e',
                    '#fab005',
                    '#fd7e14',
                  ]}
                />
                <TextInput
                  label="事件标识"
                  placeholder="如 logout"
                  value={addEditForm.values.event}
                  onChange={(event) => addEditForm.setFieldValue('event', event.currentTarget.value)}
                  radius="md"
                />
                <TextInput
                  label="快捷键（逗号分隔）"
                  placeholder="例如 Ctrl,K 或 Cmd,K"
                  value={addEditForm.values.rightSection}
                  onChange={(event) =>
                    addEditForm.setFieldValue('rightSection', event.currentTarget.value)
                  }
                  radius="md"
                />
              </SimpleGrid>
              <Flex justify="flex-end" gap="sm" mt="lg">
                <Button type="submit" disabled={loading}>
                  保存
                </Button>
              </Flex>
            </form>
          </FocusTrap>
        </Box>
      </Modal>

      {/*查看详情弹窗*/}
      <Modal
        opened={viewDetailModalOpened}
        title="头部下拉详情"
        onClose={viewDetailModalActions.close}
        size="lg"
      >
        <Box pos="relative">
          <LoadingOverlay visible={loading} />
          {viewingItem && (
            <Stack gap="md">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Box>
                  <Text size="sm" fw={600} mb={5}>
                    名称
                  </Text>
                  <Text size="sm">{viewingItem.name || '-'}</Text>
                </Box>
                <Box>
                  <Text size="sm" fw={600} mb={5}>
                    编码
                  </Text>
                  <Text size="sm">{viewingItem.code || '-'}</Text>
                </Box>
                <Box>
                  <Text size="sm" fw={600} mb={5}>
                    图标
                  </Text>
                  <Group gap="xs">
                    {viewingItem.icon && (
                      <DynamicIcon name={viewingItem.icon} size={18} stroke={1.5} />
                    )}
                    <Text size="sm">{viewingItem.icon || '-'}</Text>
                  </Group>
                </Box>
                <Box>
                  <Text size="sm" fw={600} mb={5}>
                    URL
                  </Text>
                  <Text size="sm">{viewingItem.url || '-'}</Text>
                </Box>
                <Box>
                  <Text size="sm" fw={600} mb={5}>
                    分组
                  </Text>
                  <Text size="sm">{viewingItem.section || '-'}</Text>
                </Box>
                <Box>
                  <Text size="sm" fw={600} mb={5}>
                    排序
                  </Text>
                  <Text size="sm">{viewingItem.sort ?? '-'}</Text>
                </Box>
                <Box>
                  <Text size="sm" fw={600} mb={5}>
                    颜色
                  </Text>
                  <Group gap="xs">
                    {viewingItem.color && (
                      <Box
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          backgroundColor: viewingItem.color,
                          border: '1px solid var(--mantine-color-default-border)',
                        }}
                      />
                    )}
                    <Text size="sm">{viewingItem.color || '-'}</Text>
                  </Group>
                </Box>
                <Box>
                  <Text size="sm" fw={600} mb={5}>
                    事件标识
                  </Text>
                  <Text size="sm">{viewingItem.event || '-'}</Text>
                </Box>
                <Box>
                  <Text size="sm" fw={600} mb={5}>
                    快捷键
                  </Text>
                  <Text size="sm">{viewingItem.rightSection || '-'}</Text>
                </Box>
              </SimpleGrid>

              <Divider my="sm" />

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Box>
                  <Text size="sm" fw={600} mb={5}>
                    创建人
                  </Text>
                  <Text size="sm">
                    {viewingItem.creator
                      ? viewingItem.creator.nickname ||
                        viewingItem.creator.username ||
                        '-'
                      : '-'}
                  </Text>
                </Box>
                <Box>
                  <Text size="sm" fw={600} mb={5}>
                    创建时间
                  </Text>
                  <Text size="sm">
                    {viewingItem.createdAt ? formatTimestamp(viewingItem.createdAt) : '-'}
                  </Text>
                </Box>
                <Box>
                  <Text size="sm" fw={600} mb={5}>
                    更新人
                  </Text>
                  <Text size="sm">
                    {viewingItem.updater
                      ? viewingItem.updater.nickname ||
                        viewingItem.updater.username ||
                        '-'
                      : '-'}
                  </Text>
                </Box>
                <Box>
                  <Text size="sm" fw={600} mb={5}>
                    更新时间
                  </Text>
                  <Text size="sm">
                    {viewingItem.updatedAt ? formatTimestamp(viewingItem.updatedAt) : '-'}
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
};

export default HeaderDropdownsPageRender;

