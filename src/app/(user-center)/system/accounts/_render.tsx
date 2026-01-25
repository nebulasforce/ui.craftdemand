'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconChevronDown, IconChevronUp, IconEdit, IconKey, IconPlus, IconSearch, IconTrash, IconUserCog, IconX } from '@tabler/icons-react';
import cx from 'clsx';
import { ActionIcon, Anchor, Avatar, Box, Breadcrumbs, Button, Checkbox, Collapse, Divider, Flex, FocusTrap, Grid, Group, LoadingOverlay, Modal, Pagination, Paper, ScrollArea, Select, SimpleGrid, Stack, Table, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { createAccount, deleteAccount, editAccount, list, resetAccountPassword } from '@/api/account/api';

import { createAccountRequest, deleteAccountRequest, editAccountRequest, resetAccountPasswordRequest } from '@/api/account/request';
import { listData } from '@/api/account/response';
import { User } from '@/api/my/typings';
import { DeleteConfirm } from '@/components/DeleteConfirm/DeleteConfirm';
import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';
import notify from '@/utils/notify';
import { formatTimestamp } from '@/utils/time';
import apiConfig from '@/config/api.config';
import classes from './style.module.css';


interface AccountsProps {
  initialData: listData | null;
}

// 定义状态项接口
interface statusItem {
  label: string;
  color: string;
}

interface openAddEditModalParams {
  action: 'add' | 'edit';
  user?: User;
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
  return statusMap[statusNumber]?.label || 'Unknown';
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


const AccountsPageRender =  ({ initialData }:AccountsProps) => {
  const { setActive, setSection } = useNavbar();
  const router = useRouter();

  useEffect(() => {
    setSection('System');
    setActive('Accounts');
  }, []);


  // 面包屑
  const items = [
    { title: 'Home', href: '/' },
    { title: 'System' },
    { title: 'Accounts' }
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
    username: '',
    mobile: '',
    email: '',
    status: '',
  });

  // 状态管理
  const [data, setData] = useState<User[]>(initialData?.lists || []);
  const [page, setPage] = useState(initialData?.page || 1);
  const [pageSize] = useState(initialData?.pageSize || 10);
  const [count, setCount] = useState(initialData?.count || 0);
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [totalPage, setTotalPage] = useState(initialData?.totalPage || 0);

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
    const currentKeyword = searchKeywordRef.current;

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
        searchParams.keyword = currentKeyword.toLowerCase();
      }

      // 添加高级搜索参数（只包含有值的字段）
      if (advancedSearchOpen) {
        Object.entries(advancedFilters).forEach(([key, value]) => {
          if (value) {
            searchParams[key] = value;
          }
        });
      }

      const response = await list(searchParams);
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

  // 拼装图片路径的辅助函数
  const getAvatarUrl = (avatar?: string) => {
    if (avatar && avatar !== '') {
      // 如果已经是完整URL，直接返回
      if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
        return avatar;
      }
      // 否则使用 baseURL 拼装
      return `${apiConfig.baseURL}${avatar.startsWith('/') ? '' : '/'}${avatar}`;
    }
    return '/avatar_default.png';
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
            <Avatar size={26} src={getAvatarUrl(item.profile?.avatar)} radius={26} />
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
            <ActionIcon onClick={()=>{openAddEditModal({action:'edit',user:item})}} variant="light" size="md" aria-label="Edit">
              <IconEdit size={14} stroke={1.5} />
            </ActionIcon>
            <ActionIcon onClick={()=>{openResetPasswordModal(item)}} variant="light" size="md" aria-label="Reset Password">
              <IconKey size={14} stroke={1.5} />
            </ActionIcon>
            <ActionIcon onClick={()=>{handleSettingAccount(item)}} variant="light" size="md" aria-label="Setting">
              <IconUserCog size={14} stroke={1.5} />
            </ActionIcon>
            <DeleteConfirm onConfirm={()=>{handleDeleteOneAccount(item)}} itemName={item.account.username}>
              <ActionIcon variant="light" size="md" aria-label="Delete">
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
      username: '',
      mobile: '',
      email: '',
      status: '',
    });
    // 手动触发 Select 组件的 onChange 来确保状态更新
    handleAdvancedFilterChange('status', '');
  };


  // 处理基础搜索输入
  const handleSearchChange = (value: string) => {
    // 清除之前的计时器
    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    setSearchKeyword(value);
    // 设置新的防抖计时器
    const timer = setTimeout(() => {
      // 搜索时重置到第一页
      loadData(1).then();
    }, 500); // 500ms防抖

    setSearchTimer(timer);
  };

  // 处理高级搜索提交
  const handleAdvancedSearch = () => {
    loadData(1).then();
  };


  const [addEditAction, setAddEditAction] = useState<'add' | 'edit'>('add');
  const [addEditModalOpened, addEditModalActions] = useDisclosure(false);
  const [editingAccount, setEditingAccount] = useState<User|null>(null);

  // 重置密码模态框状态
  const [resetPasswordModalOpened, resetPasswordModalActions] = useDisclosure(false);
  const [resettingAccount, setResettingAccount] = useState<User|null>(null);

  // 打开表单模态窗口
  const openAddEditModal = ({action, user}: openAddEditModalParams) => {
    setAddEditAction(action);
    if (action === 'edit' && user) {
      // 编辑模式：填充现有数据
      setEditingAccount(user);
      // 重置表单为account的值
      addEditForm.setValues({
        id: user.account.id,
        username: user.account.username,
        email: user.account.email,
        mobile: user.account.mobile,
        status: user.account.status,
      });
    } else {
      // 新增模式：重置表单
      setEditingAccount(null);
      addEditForm.setValues({
        id: '',
        username: '',
        password: '',
        email: '',
        mobile: '',
        status: 0,
      });
    }

    addEditModalActions.open();
  };

  const handleDeleteOneAccount = async (user: User) => {
    setLoading(true);
    try {
      const requestData: deleteAccountRequest = {
        ids: [user.account.id],
      };
      const response = await deleteAccount(requestData);
      if (response.code === 0) {
        notify('Account deleted successfully', 'success');
        await loadData(page);
      } else {
        notify(response.message || 'Failed to delete the account', 'error');
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

  // 批量删除选中的账号
  const handleDeleteSelected = async () => {
    if (selection.length === 0) {
      return;
    }
    setLoading(true);
    try {
      const requestData: deleteAccountRequest = {
        ids: selection,
      };
      const response = await deleteAccount(requestData);
      if (response.code === 0) {
        notify(`Successfully deleted ${response.data?.count || selection.length} account(s)`, 'success');
        await loadData(page);
      } else {
        notify(response.message || 'Failed to delete the accounts', 'error');
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

  const handleSettingAccount = (user: User) => {
    console.log('设置账户:', user);
  }

  // 打开重置密码模态框
  const openResetPasswordModal = (user: User) => {
    setResettingAccount(user);
    resetPasswordForm.setValues({
      password: '',
    });
    resetPasswordModalActions.open();
  };

  // 处理重置密码
  const handleResetPassword = async (user: User, password: string) => {
    setLoading(true);
    try {
      const requestData: resetAccountPasswordRequest = {
        id: user.account.id,
        password: password,
      };
      const response = await resetAccountPassword(requestData);
      if (response.code === 0) {
        notify('Password reset successfully', 'success');
        resetPasswordModalActions.close();
      } else {
        notify(response.message || 'Failed to reset password', 'error');
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
      id: editingAccount?.account.id || '',
      username: editingAccount?.account.username || '',
      password: '',
      email: editingAccount?.account.email || '',
      mobile: editingAccount?.account.mobile || '',
      status: editingAccount?.account.status || 0,
    },
    validate: {
      username: (val) => {
        if (!val || val.trim() === '') {
          return 'This field is required';
        }
        return null;
      },
      password: (val) => {
        // 如果值为空，不进行验证
        if (val && val.trim() !== '') {
          const password = val.trim();
          // 基础密码验证：至少6位
          if (password.length < 6) {
            return 'Password must be at least 6 characters long.';
          }
        }

        // 验证通过
        return null;
      },
      email: (val) => {
        if (!val || val.trim() === '') {
          return 'This field is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          return 'Invalid email format';
        }
        return null;
      },
      mobile: (val) => {
        // 添加手机号格式验证（根据需求调整）
        const cleaned = val.replace(/[^\d+]/g, '');
        if (!/^\+?[\d]+$/.test(cleaned)) {
          return 'Mobile number should contain only digits';
        }
        return null;
      },
      status: (val) => {
        if (val === undefined || val === null) {
          return 'This field is required';
        }
        return null;
      }
    },
  });

  const handleAdEditFormSubmit = async (values: typeof addEditForm.values): Promise<void> => {
    if (addEditAction === 'add'){
      // 在新增模式下，验证密码是否填写
      if (!values.password || values.password.trim() === '') {
        addEditForm.setFieldError('password', 'Password is required');
        return;
      }
      setLoading(true);
      try {
        // 处理表单数据，转换为API需要的格式
        const formattedData: createAccountRequest = {
          username: values.username,
          password: values.password,
          email: values.email,
          mobile: values.mobile,
          status: values.status,
        };
        // 调用创建账号API
        const response = await createAccount(formattedData);

        if (response.code === 0) {
          loadData(page).then()
          notify('Account added successfully', 'success');
        } else {
          notify(response.message || 'Failed to add the account', 'error');
        }
      } catch (err){
        if (err instanceof Error) {
          notify(err.message, 'error');
        } else {
          notify('Internal Error', 'error');
        }
      } finally {
        setLoading(false);
        addEditModalActions.close();
      }

    }else if(addEditAction === 'edit'){
      if (!editingAccount) {return;} // 确保账号存在
      setLoading(true);
      try {
        // 处理表单数据，转换为API需要的格式
        const formattedData: editAccountRequest = {
          id: values.id,
          username: values.username,
          email: values.email,
          mobile: values.mobile,
          status: values.status,
        };
        // 调用编辑账号API
        const response = await editAccount(formattedData);

        if (response.code === 0) {
          loadData(page).then()
          notify('Account updated successfully', 'success');
        } else {
          notify(response.message || 'Failed to update the account', 'error');
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

  // 重置密码表单
  const resetPasswordForm = useForm({
    initialValues: {
      password: '',
    },
    validate: {
      password: (val) => {
        if (!val || val.trim() === '') {
          return 'Password is required';
        }
        if (val.length < 6) {
          return 'Password must be at least 6 characters long';
        }
        return null;
      },
    },
  });

  // 处理重置密码表单提交
  const handleResetPasswordFormSubmit = async (values: typeof resetPasswordForm.values): Promise<void> => {
    if (!resettingAccount) {
      return;
    }
    await handleResetPassword(resettingAccount, values.password);
    resetPasswordForm.reset();
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
          <Title order={3}>Accounts</Title>
          <Text size="sm" c="dimmed">
            Manage and control system accounts.
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
              {advancedSearchOpen ? 'Hide Advanced Search' : 'Advanced Search'}
            </Button>
          </Grid.Col>
        </Grid>

        {/* 高级搜索部分 - 可折叠 */}
        <Collapse in={advancedSearchOpen} transitionDuration={200}>
          <Paper p="md" mb="lg" withBorder>
            <Title order={5} mb="md">
              Advanced Filters
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
              <TextInput
                label="Username"
                value={advancedFilters.username}
                onChange={(e) => handleAdvancedFilterChange('username', e.target.value)}
                placeholder="Search by username"
              />
              <TextInput
                label="Mobile"
                value={advancedFilters.mobile}
                onChange={(e) => handleAdvancedFilterChange('mobile', e.target.value)}
                placeholder="Search by mobile number"
              />
              <TextInput
                label="Email"
                value={advancedFilters.email}
                onChange={(e) => handleAdvancedFilterChange('email', e.target.value)}
                placeholder="Search by email"
              />
              <Select
                label="Status"
                value={advancedFilters.status || null}
                onChange={(value) => handleAdvancedFilterChange('status', value || '')}
                placeholder="Select status"
                data={statusOptions}
                clearable
              />
            </SimpleGrid>

            <Group gap="sm" mt="md" justify="flex-end">
              <Button variant="ghost" onClick={resetAdvancedFilters}>
                Reset
              </Button>
              <Button onClick={handleAdvancedSearch}>
                Apply Filters
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
                itemName={selection.length === 1 ? data.find(item => selection.includes(item.account.id))?.account.username : `${selection.length} accounts`}
                title="Delete Selected Accounts"
              >
                <Button
                  variant="danger"
                  leftSection={<IconTrash size={16} stroke={1.5} />}
                  disabled={selection.length === 0 || loading}
                >
                  Delete Selected
                </Button>
              </DeleteConfirm>
              <Button
                leftSection={<IconPlus size={16} stroke={1.5} />}
                onClick={() => openAddEditModal({action:'add'})}
              >
                Add Account
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
                      <Table.Td colSpan={7} align="center">
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

      {/*独立的添加/编辑弹窗*/}
      <Modal
        opened={addEditModalOpened}
        title={addEditAction === 'add' ? 'Add Account' : 'Edit Account'}
        onClose={addEditModalActions.close}
        size="md"
      >
        <Box pos="relative">
          <LoadingOverlay visible={loading} />
          <FocusTrap active>
            <form onSubmit={addEditForm.onSubmit(handleAdEditFormSubmit)}>
              <TextInput
                required
                data-autofocus
                label="Username"
                placeholder="Input your username"
                value={addEditForm.values.username}
                onChange={(event) =>
                  addEditForm.setFieldValue('username', event.currentTarget.value)
                }
                error={addEditForm.errors.username}
                radius="md"
              />
              <TextInput
                required
                label="Email"
                placeholder="Input your email"
                value={addEditForm.values.email}
                onChange={(event) =>
                  addEditForm.setFieldValue('email', event.currentTarget.value)
                }
                error={addEditForm.errors.email}
                radius="md"
              />
              {
                addEditAction === 'add' &&(
                  <TextInput
                    required
                    label="Password"
                    placeholder="Input your password"
                    value={addEditForm.values.password}
                    onChange={(event) =>
                      addEditForm.setFieldValue('password', event.currentTarget.value)
                    }
                    error={addEditForm.errors.password}
                    radius="md"
                  />
                )
              }
              <TextInput
                required
                label="Mobile"
                placeholder="Input your mobile number"
                value={addEditForm.values.mobile}
                onChange={(event) =>
                  addEditForm.setFieldValue('mobile', event.currentTarget.value)
                }
                error={addEditForm.errors.mobile}
                radius="md"
              />
              <Select
                label="Status"
                required
                value={addEditForm.values.status.toString()}
                onChange={(value) => addEditForm.setFieldValue('status', parseInt(value||'0',10))}
                placeholder="Select status"
                data={statusOptions}
                disabled={loading}
              />
              <Flex justify="flex-end" gap="sm" mt="lg">
                <Button type="submit" disabled={loading}>Save</Button>
              </Flex>
            </form>
          </FocusTrap>
        </Box>
      </Modal>

      {/* 重置密码模态框 */}
      <Modal
        opened={resetPasswordModalOpened}
        title="Reset Password"
        onClose={resetPasswordModalActions.close}
        size="md"
      >
        <Box pos="relative">
          <LoadingOverlay visible={loading} />
          <FocusTrap active>
            <form onSubmit={resetPasswordForm.onSubmit(handleResetPasswordFormSubmit)}>
              <Text size="sm" c="dimmed" mb="md">
                Reset password for: <Text span fw={500}>{resettingAccount?.account.username}</Text>
              </Text>
              <TextInput
                required
                data-autofocus
                label="New Password"
                placeholder="Enter new password"
                value={resetPasswordForm.values.password}
                onChange={(event) =>
                  resetPasswordForm.setFieldValue('password', event.currentTarget.value)
                }
                error={resetPasswordForm.errors.password}
                radius="md"
              />
              <Flex justify="flex-end" gap="sm" mt="lg">
                <Button variant="default" onClick={resetPasswordModalActions.close} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  Reset Password
                </Button>
              </Flex>
            </form>
          </FocusTrap>
        </Box>
      </Modal>

    </Box>
  );
}

export default AccountsPageRender;
