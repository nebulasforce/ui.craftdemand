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
  Grid,
  Divider,
  Flex,
  FocusTrap,
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
  createMenu,
  deleteMenu,
  editMenu,
  getMenu,
  list as menuListApi,
} from '@/api/menu/api';
import {
  createMenuRequest,
  deleteMenuRequest,
  editMenuRequest,
} from '@/api/menu/request';
import { listData } from '@/api/menu/response';
import { Menu } from '@/api/menu/typings';
import { DeleteConfirm } from '@/components/DeleteConfirm/DeleteConfirm';
import { DynamicIcon } from '@/components/DynamicIcon';
import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';
import { TreeTable } from '@/components/TreeTable/TreeTable';
import notify from '@/utils/notify';
import { formatTimestamp } from '@/utils/time';
import classes from './style.module.css';

interface MenuPageRenderProps {
  initialData: listData | null;
}

type MenuNode = Menu & {
  children?: MenuNode[];
};

interface StatusItem {
  label: string;
  color: string;
}

interface OpenAddEditModalParams {
  action: 'add' | 'edit';
  menu?: Menu;
}

interface AdvancedSearchFilters {
  name: string;
  status: string;
}

const statusMap: { [key: number]: StatusItem } = {
  0: { label: '启用', color: 'green' },
  1: { label: '禁用', color: 'orange' },
  [-1]: { label: '已删除', color: 'red' },
};

const statusOptions = Object.entries(statusMap)
  .filter(([key]) => parseInt(key, 10) >= 0)
  .map(([value, { label }]) => ({ value, label }));

const getStatusLabel = (status: number | string) => {
  const n = typeof status === 'string' ? parseInt(status, 10) : status;
  return statusMap[n]?.label ?? '未知';
};

const getStatusColor = (status: number | string) => {
  const n = typeof status === 'string' ? parseInt(status, 10) : status;
  return statusMap[n]?.color ?? 'gray';
};

const MenuPageRender = ({ initialData }: MenuPageRenderProps) => {
  const { setActive, setSection } = useNavbar();
  const router = useRouter();

  useEffect(() => {
    setSection('System');
    setActive('Menu');
  }, []);

  const items = [
    { title: '首页', href: '/' },
    { title: '系统' },
    { title: '菜单管理' },
  ];

  const [searchKeyword, setSearchKeyword] = useState('');
  const searchKeywordRef = useRef(searchKeyword);
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    searchKeywordRef.current = searchKeyword;
  }, [searchKeyword]);

  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedSearchFilters>({
    name: '',
    status: '',
  });

  const [data, setData] = useState<MenuNode[]>(
    (initialData?.lists as MenuNode[]) ?? []
  );
  const [page, setPage] = useState(initialData?.page ?? 1);
  const [pageSize] = useState(initialData?.pageSize ?? 10);
  const [count, setCount] = useState(initialData?.count ?? 0);
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [totalPage, setTotalPage] = useState(initialData?.totalPage ?? 0);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (page === 1) {
      searchParams.delete('page');
    } else {
      searchParams.set('page', page.toString());
    }
    router.push(`?${searchParams.toString()}`, { scroll: false });
  }, [page, router]);

  const loadData = async (newPage?: number) => {
    const currentPage = newPage ?? page;
    const currentKeyword = searchKeywordRef.current;
    setLoading(true);
    try {
      const searchParams: Record<string, any> = {
        page: currentPage,
        pageSize,
      };
      if (currentKeyword?.trim()) {
        searchParams.keyword = currentKeyword.toLowerCase();
      }
      if (advancedSearchOpen) {
        if (advancedFilters.name) searchParams.name = advancedFilters.name;
        if (advancedFilters.status) {
          searchParams.status = parseInt(advancedFilters.status, 10);
        }
      }
      const response = await menuListApi(searchParams);
      if (response.code === 0 && response.data) {
        setPage(currentPage);
        setData((response.data.lists as MenuNode[]) ?? []);
        setTotalPage(response.data.totalPage ?? 0);
        setCount(response.data.count ?? 0);
        setSelection([]);
      } else {
        notify(response.message ?? '加载失败', 'error');
      }
    } catch {
      notify('连接服务失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (newPage: number) => {
    await loadData(newPage);
  };

  const handleAdvancedFilterChange = (
    field: keyof AdvancedSearchFilters,
    value: string
  ) => {
    setAdvancedFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetAdvancedFilters = () => {
    setAdvancedFilters({ name: '', status: '' });
  };

  const handleSearchChange = (value: string) => {
    if (searchTimer) clearTimeout(searchTimer);
    setSearchKeyword(value);
    const timer = setTimeout(() => loadData(1), 500);
    setSearchTimer(timer);
  };

  const handleAdvancedSearch = () => {
    loadData(1);
  };

  const [addEditAction, setAddEditAction] = useState<'add' | 'edit'>('add');
  const [addEditModalOpened, addEditModalActions] = useDisclosure(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  const [viewDetailModalOpened, viewDetailModalActions] = useDisclosure(false);
  const [viewingMenu, setViewingMenu] = useState<Menu | null>(null);

  const openViewDetailModal = async (menu: Menu) => {
    setLoading(true);
    try {
      const response = await getMenu({ id: menu.id });
      if (response.code === 0 && response.data) {
        setViewingMenu(response.data);
        viewDetailModalActions.open();
      } else {
        notify(response.message ?? '获取菜单详情失败', 'error');
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Internal Error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAddEditModal = ({ action, menu }: OpenAddEditModalParams) => {
    setAddEditAction(action);
    if (action === 'edit' && menu) {
      setEditingMenu(menu);
      addEditForm.setValues({
        id: menu.id,
        name: menu.name,
        icon: menu.icon,
        url: menu.url,
        route: menu.route ?? '',
        target: menu.target ?? '',
        sort: menu.sort ?? 0,
        status: menu.status,
      });
    } else {
      setEditingMenu(null);
      addEditForm.setValues({
        id: '',
        name: '',
        icon: '',
        url: '',
        route: '',
        target: '',
        sort: 0,
        status: 0,
      });
    }
    addEditModalActions.open();
  };

  const handleDeleteOne = async (item: Menu) => {
    setLoading(true);
    try {
      const req: deleteMenuRequest = { ids: [item.id] };
      const response = await deleteMenu(req);
      if (response.code === 0) {
        notify('菜单删除成功', 'success');
        await loadData(page);
      } else {
        notify(response.message ?? '删除失败', 'error');
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Internal Error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selection.length === 0) return;
    setLoading(true);
    try {
      const req: deleteMenuRequest = { ids: selection };
      const response = await deleteMenu(req);
      if (response.code === 0) {
        notify(`成功删除 ${response.data?.count ?? selection.length} 条菜单`, 'success');
        await loadData(page);
      } else {
        notify(response.message ?? '删除失败', 'error');
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Internal Error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addEditForm = useForm({
    initialValues: {
      id: '',
      name: '',
      icon: '',
      url: '',
      route: '',
      target: '',
      sort: 0,
      status: 0,
    },
    validate: {
      name: (val) => (!val?.trim() ? '此字段为必填项' : null),
      icon: (val) => (!val?.trim() ? '此字段为必填项' : null),
      url: (val) => (!val?.trim() ? '此字段为必填项' : null),
      status: (val) =>
        val === undefined || val === null ? '此字段为必填项' : null,
    },
  });

  const handleAddEditSubmit = async (values: typeof addEditForm.values) => {
    if (addEditAction === 'add') {
      setLoading(true);
      try {
        const payload: createMenuRequest = {
          name: values.name,
          icon: values.icon,
          url: values.url,
          route: values.route || undefined,
          target: values.target || undefined,
          sort: values.sort,
          status: values.status,
        };
        const response = await createMenu(payload);
        if (response.code === 0) {
          notify('菜单添加成功', 'success');
          loadData(page);
          addEditModalActions.close();
        } else {
          notify(response.message ?? '添加失败', 'error');
        }
      } catch (err) {
        notify(err instanceof Error ? err.message : 'Internal Error', 'error');
      } finally {
        setLoading(false);
      }
    } else if (editingMenu) {
      setLoading(true);
      try {
        const payload: editMenuRequest = {
          id: values.id,
          name: values.name,
          icon: values.icon,
          url: values.url,
          route: values.route || undefined,
          target: values.target || undefined,
          sort: values.sort,
          status: values.status,
        };
        const response = await editMenu(payload);
        if (response.code === 0) {
          notify('菜单更新成功', 'success');
          loadData(page);
          addEditModalActions.close();
        } else {
          notify(response.message ?? '更新失败', 'error');
        }
      } catch (err) {
        notify(err instanceof Error ? err.message : 'Internal Error', 'error');
      } finally {
        setLoading(false);
      }
    }
    addEditForm.reset();
  };

  return (
    <Box>
      <Breadcrumbs>
        {items.map((item, index) =>
          item.href ? (
            <Anchor key={index} component={Link} href={item.href}>
              {item.title}
            </Anchor>
          ) : (
            <Anchor key={index} component="span" role="button">
              {item.title}
            </Anchor>
          )
        )}
      </Breadcrumbs>
      <Paper pt="xs" pb="xs">
        <Box mb="md">
          <Title order={3}>菜单管理</Title>
          <Text size="sm" c="dimmed">
            管理侧边栏与前端菜单项。
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
              leftSection={
                advancedSearchOpen ? (
                  <IconChevronUp size={16} />
                ) : (
                  <IconChevronDown size={16} />
                )
              }
              fullWidth
            >
              {advancedSearchOpen ? '隐藏高级搜索' : '高级搜索'}
            </Button>
          </Grid.Col>
        </Grid>

        <Collapse in={advancedSearchOpen} transitionDuration={200}>
          <Paper p="md" mb="lg" withBorder>
            <Title order={5} mb="md">
              高级筛选
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              <TextInput
                label="名称"
                value={advancedFilters.name}
                onChange={(e) =>
                  handleAdvancedFilterChange('name', e.target.value)
                }
                placeholder="搜索名称"
              />
              <Select
                label="状态"
                value={advancedFilters.status || null}
                onChange={(v) => handleAdvancedFilterChange('status', v ?? '')}
                placeholder="选择状态"
                data={statusOptions}
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
                    : `${selection.length} 条菜单`
                }
                title="删除选中的菜单"
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
                添加菜单
              </Button>
            </Group>
          </Flex>
        </SimpleGrid>

        <TreeTable
          data={data}
          loading={loading}
          page={page}
          pageSize={pageSize}
          totalPage={totalPage}
          count={count}
          selection={selection}
          onSelectionChange={setSelection}
          onPageChange={handlePageChange}
          onView={openViewDetailModal}
          onEdit={(menu) => openAddEditModal({ action: 'edit', menu })}
          onDelete={handleDeleteOne}
        />
      </Paper>

      <Modal
        opened={addEditModalOpened}
        title={addEditAction === 'add' ? '添加菜单' : '编辑菜单'}
        onClose={addEditModalActions.close}
        size="lg"
      >
        <Box pos="relative">
          <LoadingOverlay visible={loading} />
          <FocusTrap active>
            <form onSubmit={addEditForm.onSubmit(handleAddEditSubmit)}>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  required
                  data-autofocus
                  label="名称"
                  placeholder="输入菜单名称"
                  value={addEditForm.values.name}
                  onChange={(e) =>
                    addEditForm.setFieldValue('name', e.currentTarget.value)
                  }
                  error={addEditForm.errors.name}
                  radius="md"
                />
                <TextInput
                  required
                  label="图标"
                  placeholder="如 IconHome"
                  value={addEditForm.values.icon}
                  onChange={(e) =>
                    addEditForm.setFieldValue('icon', e.currentTarget.value)
                  }
                  error={addEditForm.errors.icon}
                  radius="md"
                  rightSection={
                    addEditForm.values.icon ? (
                      <DynamicIcon
                        name={addEditForm.values.icon}
                        size={18}
                        stroke={1.5}
                      />
                    ) : null
                  }
                />
                <TextInput
                  required
                  label="URL"
                  placeholder="菜单链接"
                  value={addEditForm.values.url}
                  onChange={(e) =>
                    addEditForm.setFieldValue('url', e.currentTarget.value)
                  }
                  error={addEditForm.errors.url}
                  radius="md"
                />
                <TextInput
                  label="路由"
                  placeholder="路由 path"
                  value={addEditForm.values.route}
                  onChange={(e) =>
                    addEditForm.setFieldValue('route', e.currentTarget.value)
                  }
                  radius="md"
                />
                <TextInput
                  label="目标"
                  placeholder="如 _blank"
                  value={addEditForm.values.target}
                  onChange={(e) =>
                    addEditForm.setFieldValue('target', e.currentTarget.value)
                  }
                  radius="md"
                />
                <NumberInput
                  label="排序"
                  value={addEditForm.values.sort}
                  onChange={(v) =>
                    addEditForm.setFieldValue(
                      'sort',
                      typeof v === 'number' ? v : 0
                    )
                  }
                  min={0}
                  radius="md"
                />
                <Select
                  required
                  label="状态"
                  value={addEditForm.values.status.toString()}
                  onChange={(v) =>
                    addEditForm.setFieldValue(
                      'status',
                      parseInt(v ?? '0', 10)
                    )
                  }
                  data={statusOptions}
                  error={addEditForm.errors.status}
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

      <Modal
        opened={viewDetailModalOpened}
        title="菜单详情"
        onClose={viewDetailModalActions.close}
        size="lg"
      >
        <Box pos="relative">
          <LoadingOverlay visible={loading} />
          {viewingMenu && (
            <Stack gap="md">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Box>
                  <Text size="sm" fw={500} mb={5}>
                    名称
                  </Text>
                  <Text size="sm">{viewingMenu.name ?? '-'}</Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>
                    图标
                  </Text>
                  <Group gap="xs">
                    {viewingMenu.icon && (
                      <DynamicIcon
                        name={viewingMenu.icon}
                        size={18}
                        stroke={1.5}
                      />
                    )}
                    <Text size="sm">{viewingMenu.icon ?? '-'}</Text>
                  </Group>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>
                    URL
                  </Text>
                  <Text size="sm">{viewingMenu.url ?? '-'}</Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>
                    路由
                  </Text>
                  <Text size="sm">{viewingMenu.route ?? '-'}</Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>
                    目标
                  </Text>
                  <Text size="sm">{viewingMenu.target ?? '-'}</Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>
                    排序
                  </Text>
                  <Text size="sm">{viewingMenu.sort ?? '-'}</Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>
                    状态
                  </Text>
                  <Text size="sm" c={getStatusColor(viewingMenu.status)}>
                    {getStatusLabel(viewingMenu.status)}
                  </Text>
                </Box>
              </SimpleGrid>
              <Divider my="sm" />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Box>
                  <Text size="sm" fw={500} mb={5}>
                    创建人
                  </Text>
                  <Text size="sm">
                    {viewingMenu.creator
                      ? viewingMenu.creator.nickname ||
                        viewingMenu.creator.username ||
                        '-'
                      : '-'}
                  </Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>
                    创建时间
                  </Text>
                  <Text size="sm">
                    {viewingMenu.createdAt
                      ? formatTimestamp(viewingMenu.createdAt)
                      : '-'}
                  </Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>
                    更新人
                  </Text>
                  <Text size="sm">
                    {viewingMenu.updater
                      ? viewingMenu.updater.nickname ||
                        viewingMenu.updater.username ||
                        '-'
                      : '-'}
                  </Text>
                </Box>
                <Box>
                  <Text size="sm" fw={500} mb={5}>
                    更新时间
                  </Text>
                  <Text size="sm">
                    {viewingMenu.updatedAt
                      ? formatTimestamp(viewingMenu.updatedAt)
                      : '-'}
                  </Text>
                </Box>
              </SimpleGrid>
              <Flex justify="flex-end" mt="lg">
                <Button onClick={viewDetailModalActions.close}>关闭</Button>
              </Flex>
            </Stack>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default MenuPageRender;
