'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconChevronDown, IconChevronUp, IconEdit, IconPlus, IconSearch, IconTrash, IconX } from '@tabler/icons-react';
import cx from 'clsx';
import { ActionIcon, Anchor, Box, Breadcrumbs, Button, Checkbox, Collapse, Divider, Flex, FocusTrap, Grid, Group, LoadingOverlay, Modal, Pagination, Paper, ScrollArea, Select, SimpleGrid, Stack, Table, Text, Textarea, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { createMessage, deleteMessage, editMessage, list as messageList } from '@/api/message/api'; // 导入API

import { createMessageRequest, deleteMessageRequest, editMessageRequest } from '@/api/message/request';
import { listData } from '@/api/message/response';
import { Message } from '@/api/message/typings';
import { DeleteConfirm } from '@/components/DeleteConfirm/DeleteConfirm';
import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';
import notify from '@/utils/notify'; // 导入通知工具
import { formatTimestamp } from '@/utils/time';
import classes from './style.module.css';


interface MessagesProps {
  initialData: listData | null;
}

// 定义状态项接口
interface statusItem {
  label: string;
  color: string;
}

// 定义类型项接口
interface typeItem {
  label: string;
  color: string;
}

interface openAddEditModalParams {
  action: 'add' | 'edit';
  message?: Message;
}

// 消息类型常量
export const MESSAGE_TYPE = {
  SYSTEM: 0, // 系统消息
  NORMAL: 1, // 普通消息
} as const;

// 类型映射
const typeMap: {[key:number]:typeItem} = {
  [MESSAGE_TYPE.SYSTEM]: { label: 'System', color: 'blue' },
  [MESSAGE_TYPE.NORMAL]: { label: 'Normal', color: 'gray' },
};

// 状态映射
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

// 获取类型显示文本
const getTypeLabel = (type: number | string) => {
  const typeNumber = typeof type === 'string' ? parseInt(type, 10) : type;
  return typeMap[typeNumber]?.label || 'Unknown';
};

// 获取类型显示颜色
const getTypeColor = (type: number | string) => {
  const typeNumber = typeof type === 'string' ? parseInt(type, 10) : type;
  return typeMap[typeNumber]?.color || 'gray';
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


const MessagesPageRender =  ({ initialData }:MessagesProps) => {
  const { setActive, setSection } = useNavbar();
  const router = useRouter();

  useEffect(() => {
    setSection('System');
    setActive('Messages');
  }, []); // 合并依赖项


  // 面包屑
  const items = [
    { title: 'Home', href: '/' },
    { title: 'System' },
    { title: 'Messages' }
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
    title: '',
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
    setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.id)));

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

      const response = await messageList(searchParams);
      if (response.code === 0 && response.data) {
        setPage(currentPage);
        setData(response.data.lists || []);
        setTotalPage(response.data.totalPage || 0);
        setCount(response.data.count || 0);
        setSelection([]);
        // window.scrollTo({ top: 0, behavior: 'smooth' });
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
            {item.title}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm" lineClamp={2}>
            {item.content}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text c={getTypeColor(item.type)}>
            {getTypeLabel(item.type)}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text c={getStatusColor(item.status)}>
            {getStatusLabel(item.status)}
          </Text>
        </Table.Td>
        <Table.Td>
          {item.creator ? (item.creator.nickname || item.creator.username || '-') : '-'}
        </Table.Td>
        <Table.Td>{item.createdAt ? formatTimestamp(item.createdAt) : '-'}</Table.Td>
        <Table.Td>
          {item.updater ? (item.updater.nickname || item.updater.username || '-') : '-'}
        </Table.Td>
        <Table.Td>{item.updatedAt ? formatTimestamp(item.updatedAt) : '-'}</Table.Td>
        <Table.Td>
          <ActionIcon.Group>
            <ActionIcon onClick={()=>{openAddEditModal({action:'edit',message:item})}} variant="light" size="md" aria-label="Edit">
              <IconEdit size={14} stroke={1.5} />
            </ActionIcon>
            <DeleteConfirm onConfirm={()=>{handleDeleteOneMessage(item)}} itemName={item.title}>
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
      title: '',
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
  const [editingMessage, setEditingMessage] = useState<Message|null>(null);

  // 打开表单模态窗口
  const openAddEditModal = ({action, message}: openAddEditModalParams) => {
    setAddEditAction(action);
    if (action === 'edit' && message) {
      // 编辑模式：填充现有数据
      setEditingMessage(message);
      // 重置表单为message的值
      addEditForm.setValues({
        id: message.id,
        title: message.title,
        content: message.content,
        status: message.status,
      });
    } else {
      // 新增模式：重置表单
      setEditingMessage(null);
      addEditForm.setValues({
        id: '',
        title: '',
        content: '',
        status: 0,
      });
    }

    addEditModalActions.open();
  };

  const handleDeleteOneMessage = async (message: Message) => {
    setLoading(true);
    try {
      const requestData: deleteMessageRequest = {
        ids: [message.id],
      };
      const response = await deleteMessage(requestData);
      if (response.code === 0) {
        notify('Message deleted successfully', 'success');
        await loadData(page);
      } else {
        notify(response.message || 'Failed to delete the message', 'error');
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

  // 批量删除选中的消息
  const handleDeleteSelected = async () => {
    if (selection.length === 0) {
      return;
    }
    setLoading(true);
    try {
      const requestData: deleteMessageRequest = {
        ids: selection,
      };
      const response = await deleteMessage(requestData);
      if (response.code === 0) {
        notify(`Successfully deleted ${response.data?.count || selection.length} message(s)`, 'success');
        await loadData(page);
      } else {
        notify(response.message || 'Failed to delete the messages', 'error');
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
      id: editingMessage?.id || '',
      title: editingMessage?.title || '',
      content: editingMessage?.content || '',
      status: editingMessage?.status || 0,
    },
    validate: {
      title: (val) => {
        if (!val || val.trim() === '') {
          return 'This field is required';
        }
        return null;
      },
      content: (val) => {
        if (!val || val.trim() === '') {
          return 'This field is required';
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
      setLoading(true);
      try {
        // 处理表单数据，转换为API需要的格式
        const formattedData: createMessageRequest = {
          title: values.title,
          content: values.content,
          status: values.status,
        };
        // 调用创建消息API
        const response = await createMessage(formattedData);

        if (response.code === 0) {
          loadData(page).then()
          notify('Message added successfully', 'success');
        } else {
          notify(response.message || 'Failed to add the message', 'error');
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
      if (!editingMessage) {return;} // 确保消息存在
      setLoading(true);
      try {
        // 处理表单数据，转换为API需要的格式
        const formattedData: editMessageRequest = {
          id: values.id,
          title: values.title,
          content: values.content,
          status: values.status,
        };
        // 调用编辑消息API
        const response = await editMessage(formattedData);

        if (response.code === 0) {
          loadData(page).then()
          notify('Message updated successfully', 'success');
        } else {
          notify(response.message || 'Failed to update the message', 'error');
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
            <Anchor key={index} role="button" component="span" onClick={() => {}}>
              {item.title}
            </Anchor>
          )
        )}
      </Breadcrumbs>
      <Paper pt="xs" pb="xs">
        {/* 页面容器 - 标题 */}
        <Box mb="md">
          <Title order={3}>Messages</Title>
          <Text size="sm" c="dimmed">
            Manage and control messages efficiently.
          </Text>
        </Box>
        <Divider mb="lg" my="xs" variant="dashed" />
        <Grid>
          <Grid.Col span={{ base: 12, sm: 9 }} mb="xs">
            {/* 基础搜索组件 */}
            <TextInput
              placeholder="Search by title, content etc..."
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
              // disabled={loading}
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
                label="Title"
                value={advancedFilters.title}
                onChange={(e) => handleAdvancedFilterChange('title', e.target.value)}
                placeholder="Search by title"
                // disabled={loading}
              />
              <Select
                label="Status"
                value={advancedFilters.status || null}
                onChange={(value) => handleAdvancedFilterChange('status', value || '')}
                placeholder="Select status"
                data={statusOptions}
                clearable
                // disabled={loading}
              />
            </SimpleGrid>

            <Group gap="sm" mt="md" justify="flex-end">
              <Button variant="ghost" onClick={resetAdvancedFilters} /* disabled={loading}*/>
                Reset
              </Button>
              <Button onClick={handleAdvancedSearch}/* disabled={loading}*/>
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
                itemName={selection.length === 1 ? data.find(item => selection.includes(item.id))?.title : `${selection.length} messages`}
                title="Delete Selected Messages"
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
                // disabled={loading}
                onClick={() => openAddEditModal({action:'add'})}
              >
                Add Message
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
                    <Table.Th miw={150}>Title</Table.Th>
                    <Table.Th>Content</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th miw={120}>Created By</Table.Th>
                    <Table.Th miw={180}>Created At</Table.Th>
                    <Table.Th miw={120}>Updated By</Table.Th>
                    <Table.Th miw={180}>Updated At</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rows.length > 0 ? (
                    rows
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={10} align="center">
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
        title={addEditAction === 'add' ? 'Add Message' : 'Edit Message'}
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
                label="Title"
                placeholder="Input message title"
                value={addEditForm.values.title}
                onChange={(event) =>
                  addEditForm.setFieldValue('title', event.currentTarget.value)
                }
                error={addEditForm.errors.title}
                radius="md"
                mb="md"
              />
              <Textarea
                required
                label="Content"
                placeholder="Input message content"
                value={addEditForm.values.content}
                onChange={(event) =>
                  addEditForm.setFieldValue('content', event.currentTarget.value)
                }
                error={addEditForm.errors.content}
                radius="md"
                minRows={4}
                mb="md"
              />
              <Select
                label="Status"
                required
                value={addEditForm.values.status.toString()}
                onChange={(value) => addEditForm.setFieldValue('status', parseInt(value||'0',10))}
                placeholder="Select status"
                data={statusOptions}
                disabled={loading}
                mb="md"
              />
              <Flex justify="flex-end" gap="sm" mt="lg">
                <Button type="submit" disabled={loading}>Save</Button>
              </Flex>
            </form>
          </FocusTrap>
        </Box>
      </Modal>

    </Box>
  );
}

export default MessagesPageRender;
