'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconEye,
  IconMinus,
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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  createDepartment,
  deleteDepartment,
  editDepartment,
  getDepartment,
  list as departmentListApi,
  listAll as departmentListAllApi,
} from '@/api/department/api';
import {
  createDepartmentRequest,
  deleteDepartmentRequest,
  editDepartmentRequest,
} from '@/api/department/request';
import { listAllData, listData } from '@/api/department/response';
import { Department } from '@/api/department/typings';
import { DeleteConfirm } from '@/components/DeleteConfirm/DeleteConfirm';
import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';
import notify from '@/utils/notify';
import classes from './style.module.css';

interface DepartmentsPageRenderProps {
  initialData: listData | null;
}

type DepartmentNode = Department & {
  children?: DepartmentNode[];
};

interface StatusItem {
  label: string;
  color: string;
}

interface OpenAddEditModalParams {
  action: 'add' | 'edit';
  department?: Department;
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

const DepartmentsPageRender = ({ initialData }: DepartmentsPageRenderProps) => {
  const { setActive, setSection } = useNavbar();
  const router = useRouter();

  useEffect(() => {
    setSection('System');
    setActive('Departments');
  }, [setActive, setSection]);

  const items = [
    { title: '首页', href: '/' },
    { title: '系统' },
    { title: '部门管理' },
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

  const [data, setData] = useState<DepartmentNode[]>(
    (initialData?.lists as DepartmentNode[]) ?? []
  );
  const [page, setPage] = useState(initialData?.page ?? 1);
  const [pageSize] = useState(initialData?.pageSize ?? 10);
  const [count, setCount] = useState(initialData?.count ?? 0);
  const [totalPage, setTotalPage] = useState(initialData?.totalPage ?? 0);
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const [allDepartments, setAllDepartments] = useState<listAllData>([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (page === 1) {
      searchParams.delete('page');
    } else {
      searchParams.set('page', page.toString());
    }
    router.push(`?${searchParams.toString()}`, { scroll: false });
  }, [page, router]);

  const loadAllDepartments = async () => {
    try {
      const response = await departmentListAllApi();
      if (response.code === 0 && response.data) {
        setAllDepartments(response.data);
      } else {
        notify(response.message ?? '加载部门列表失败', 'error');
      }
    } catch {
      notify('连接服务失败', 'error');
    }
  };

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
      const response = await departmentListApi(searchParams);
      if (response.code === 0 && response.data) {
        setPage(currentPage);
        setData((response.data.lists as DepartmentNode[]) ?? []);
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
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  const [viewDetailModalOpened, viewDetailModalActions] = useDisclosure(false);
  const [viewingDepartment, setViewingDepartment] = useState<Department | null>(null);

  const toggleRowSelection = (id: string) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id]
    );

  const toggleAll = () => {
    if (selection.length === data.length) {
      setSelection([]);
    } else {
      setSelection(data.map((item) => item.id));
    }
  };

  const toggleExpand = (id: string) =>
    setExpandedIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    );

  const calculateDisplayRange = () => {
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, count);
    return `显示 ${start}-${end} 条，共 ${count} 条`;
  };

  const flattenDepartmentsForSelect = (
    departments: DepartmentNode[],
    level = 0
  ): { value: string; label: string }[] =>
    departments.flatMap((dept) => [
      {
        value: dept.id,
        label: `${'— '.repeat(level)}${dept.name}`,
      },
      ...(dept.children
        ? flattenDepartmentsForSelect(dept.children as DepartmentNode[], level + 1)
        : []),
    ]);

  const parentOptions = useMemo(() => {
    if (!allDepartments || allDepartments.length === 0) return [];
    return flattenDepartmentsForSelect(allDepartments as DepartmentNode[]);
  }, [allDepartments]);

  const openViewDetailModal = async (department: Department) => {
    setLoading(true);
    try {
      const response = await getDepartment({ id: department.id });
      if (response.code === 0 && response.data) {
        setViewingDepartment(response.data);
        viewDetailModalActions.open();
      } else {
        notify(response.message ?? '获取部门详情失败', 'error');
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Internal Error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAddEditModal = async ({ action, department }: OpenAddEditModalParams) => {
    setAddEditAction(action);
    await loadAllDepartments();

    if (action === 'edit' && department) {
      setEditingDepartment(department);
      addEditForm.setValues({
        id: department.id,
        name: department.name,
        code: department.code ?? '',
        parentId: department.parentId || '',
        sort: department.sort ?? 0,
        status: department.status ?? 0,
      });
    } else {
      setEditingDepartment(null);
      addEditForm.setValues({
        id: '',
        name: '',
        code: '',
        parentId: '',
        sort: 0,
        status: 0,
      });
    }
    addEditModalActions.open();
  };

  const handleDeleteOne = async (item: Department) => {
    setLoading(true);
    try {
      const req: deleteDepartmentRequest = { ids: [item.id] };
      const response = await deleteDepartment(req);
      if (response.code === 0) {
        notify('部门删除成功', 'success');
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
      const req: deleteDepartmentRequest = { ids: selection };
      const response = await deleteDepartment(req);
      if (response.code === 0) {
        notify(
          `成功删除 ${response.data?.count ?? selection.length} 条部门`,
          'success'
        );
        await loadData(page);
      } else {
        notify(response.message ?? '删除失败', 'error');
      }
    } catch {
      notify('连接服务失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addEditForm = useForm({
    initialValues: {
      id: '',
      name: '',
      code: '',
      parentId: '',
      sort: 0,
      status: 0,
    },
    validate: {
      name: (val) => (!val?.trim() ? '此字段为必填项' : null),
      status: (val) =>
        val === undefined || val === null ? '此字段为必填项' : null,
    },
  });

  const handleAddEditSubmit = async (values: typeof addEditForm.values) => {
    if (addEditAction === 'add') {
      setLoading(true);
      try {
        const payload: createDepartmentRequest = {
          name: values.name,
          code: values.code || undefined,
          parentId: values.parentId || undefined,
          sort: values.sort,
          status: values.status,
        };
        const response = await createDepartment(payload);
        if (response.code === 0) {
          notify('部门添加成功', 'success');
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
    } else if (editingDepartment) {
      setLoading(true);
      try {
        const payload: editDepartmentRequest = {
          id: values.id,
          name: values.name,
          code: values.code || undefined,
          parentId: values.parentId || undefined,
          sort: values.sort,
          status: values.status,
        };
        const response = await editDepartment(payload);
        if (response.code === 0) {
          notify('部门更新成功', 'success');
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

  const renderRows = () => {
    const rows: React.ReactNode[] = [];

    const traverse = (department: DepartmentNode, level: number) => {
      const hasChildren = !!department.children && department.children.length > 0;
      const isExpanded = expandedIds.includes(department.id);
      const selected = selection.includes(department.id);

      rows.push(
        <Table.Tr
          key={department.id}
          className={cx({ [classes.rowSelected]: selected })}
        >
          <Table.Td w={40}>
            <Checkbox
              checked={selection.includes(department.id)}
              onChange={() => toggleRowSelection(department.id)}
            />
          </Table.Td>
          <Table.Td>
            <Group gap="xs">
              {hasChildren && (
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  aria-label={isExpanded ? '折叠' : '展开'}
                  onClick={() => toggleExpand(department.id)}
                >
                  {isExpanded ? (
                    <IconMinus size={14} stroke={1.5} />
                  ) : (
                    <IconPlus size={14} stroke={1.5} />
                  )}
                </ActionIcon>
              )}
              <Text size="sm" fw={level === 0 ? 500 : 400}>
                {`${'— '.repeat(level)}${department.name}`}
              </Text>
            </Group>
          </Table.Td>
          <Table.Td>
            <Text size="sm">{department.code ?? '-'}</Text>
          </Table.Td>
          <Table.Td>
            <Text size="sm" c={getStatusColor(department.status ?? 0)}>
              {getStatusLabel(department.status ?? 0)}
            </Text>
          </Table.Td>
          <Table.Td>
            <ActionIcon.Group>
              <ActionIcon
                onClick={() => openViewDetailModal(department)}
                variant="light"
                size="md"
                aria-label="查看详情"
              >
                <IconEye size={14} stroke={1.5} />
              </ActionIcon>
              <ActionIcon
                onClick={() =>
                  openAddEditModal({ action: 'edit', department })
                }
                variant="light"
                size="md"
                aria-label="编辑"
              >
                <IconEdit size={14} stroke={1.5} />
              </ActionIcon>
              <DeleteConfirm
                onConfirm={() => handleDeleteOne(department)}
                itemName={department.name}
              >
                <ActionIcon variant="light" size="md" aria-label="删除">
                  <IconTrash size={14} stroke={1.5} />
                </ActionIcon>
              </DeleteConfirm>
            </ActionIcon.Group>
          </Table.Td>
        </Table.Tr>
      );

      if (hasChildren && isExpanded) {
        department.children!.forEach((child) =>
          traverse(child as DepartmentNode, level + 1)
        );
      }
    };

    data.forEach((dept) => traverse(dept, 0));

    if (rows.length === 0) {
      return (
        <Table.Tr>
          <Table.Td colSpan={5} align="center">
            <Text c="dimmed">暂无数据</Text>
          </Table.Td>
        </Table.Tr>
      );
    }

    return rows;
  };

  const parentNameMap = useMemo(() => {
    const map = new Map<string, string>();
    const traverse = (departments: DepartmentNode[]) => {
      departments.forEach((d) => {
        map.set(d.id, d.name);
        if (d.children && d.children.length > 0) {
          traverse(d.children as DepartmentNode[]);
        }
      });
    };
    traverse((allDepartments as DepartmentNode[]) || []);
    return map;
  }, [allDepartments]);

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
          <Title order={3}>部门管理</Title>
          <Text size="sm" c="dimmed">
            管理部门及其层级结构。
          </Text>
        </Box>
        <Divider mb="lg" my="xs" variant="dashed" />

        <Grid>
          <Grid.Col span={{ base: 12, sm: 9 }} mb="xs">
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
                    : `${selection.length} 条部门`
                }
                title="删除选中的部门"
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
                添加部门
              </Button>
            </Group>
          </Flex>
        </SimpleGrid>

        <Box pos="relative">
          <LoadingOverlay visible={loading} />
          <ScrollArea>
            <Table verticalSpacing="xs" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th w={40}>
                    <Checkbox
                      onChange={toggleAll}
                      checked={selection.length === data.length && data.length > 0}
                      indeterminate={
                        selection.length > 0 && selection.length < data.length
                      }
                    />
                  </Table.Th>
                  <Table.Th miw={120}>名称</Table.Th>
                  <Table.Th miw={100}>编码</Table.Th>
                  <Table.Th miw={80}>状态</Table.Th>
                  <Table.Th>操作</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{renderRows()}</Table.Tbody>
            </Table>
          </ScrollArea>
          <Flex justify="space-between" align="center" mt="md">
            <Text size="sm" c="dimmed">
              {calculateDisplayRange()}
            </Text>
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
        </Box>
      </Paper>

      <Modal
        opened={addEditModalOpened}
        title={addEditAction === 'add' ? '添加部门' : '编辑部门'}
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
                  placeholder="输入部门名称"
                  value={addEditForm.values.name}
                  onChange={(e) =>
                    addEditForm.setFieldValue('name', e.currentTarget.value)
                  }
                  error={addEditForm.errors.name}
                  radius="md"
                />
                <TextInput
                  label="编码"
                  placeholder="输入部门编码"
                  value={addEditForm.values.code}
                  onChange={(e) =>
                    addEditForm.setFieldValue('code', e.currentTarget.value)
                  }
                  radius="md"
                />
                <Select
                  label="上级部门"
                  placeholder="选择上级部门（可选）"
                  value={addEditForm.values.parentId || null}
                  onChange={(v) =>
                    addEditForm.setFieldValue('parentId', v ?? '')
                  }
                  data={parentOptions}
                  clearable
                  searchable
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
        title="部门详情"
        onClose={viewDetailModalActions.close}
        size="lg"
      >
        <Box pos="relative">
          <LoadingOverlay visible={loading} />
          {viewingDepartment && (
            <Stack gap="md">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Box>
                  <Text size="sm" fw={600} mb={5}>
                    名称
                  </Text>
                  <Text size="sm">{viewingDepartment.name ?? '-'}</Text>
                </Box>
                <Box>
                  <Text size="sm" fw={600} mb={5}>
                    编码
                  </Text>
                  <Text size="sm">{viewingDepartment.code ?? '-'}</Text>
                </Box>
                <Box>
                  <Text size="sm" fw={600} mb={5}>
                    上级部门
                  </Text>
                  <Text size="sm">
                    {viewingDepartment.parentId
                      ? parentNameMap.get(viewingDepartment.parentId) ?? '-'
                      : '-'}
                  </Text>
                </Box>
                <Box>
                  <Text size="sm" fw={600} mb={5}>
                    排序
                  </Text>
                  <Text size="sm">{viewingDepartment.sort ?? '-'}</Text>
                </Box>
                <Box>
                  <Text size="sm" fw={600} mb={5}>
                    状态
                  </Text>
                  <Text size="sm" c={getStatusColor(viewingDepartment.status ?? 0)}>
                    {getStatusLabel(viewingDepartment.status ?? 0)}
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

export default DepartmentsPageRender;
