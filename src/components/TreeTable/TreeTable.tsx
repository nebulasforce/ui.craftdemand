import { useState } from 'react';
import cx from 'clsx';
import {
  ActionIcon,
  Box,
  Checkbox,
  Flex,
  Group,
  LoadingOverlay,
  Pagination,
  ScrollArea,
  Stack,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { Menu } from '@/api/menu/typings';
import { DynamicIcon } from '@/components/DynamicIcon';
import classes from './TreeTable.module.css';

type MenuNode = Menu & {
  children?: MenuNode[];
};

interface StatusItem {
  label: string;
  color: string;
}

const statusMap: { [key: number]: StatusItem } = {
  0: { label: '启用', color: 'green' },
  1: { label: '禁用', color: 'orange' },
  [-1]: { label: '已删除', color: 'red' },
};

const getStatusLabel = (status: number | string) => {
  const n = typeof status === 'string' ? parseInt(status, 10) : status;
  return statusMap[n]?.label ?? '未知';
};

const getStatusColor = (status: number | string) => {
  const n = typeof status === 'string' ? parseInt(status, 10) : status;
  return statusMap[n]?.color ?? 'gray';
};

export interface TreeTableProps {
  data: MenuNode[];
  loading: boolean;
  page: number;
  pageSize: number;
  totalPage: number;
  count: number;
  selection: string[];
  onSelectionChange: (ids: string[]) => void;
  onPageChange: (page: number) => void;
  getMenuTypeLabel?: (type: number | string | undefined) => string;
  renderActions?: (menu: MenuNode) => React.ReactNode;
}

export const TreeTable = ({
  data,
  loading,
  page,
  pageSize,
  totalPage,
  count,
  selection,
  onSelectionChange,
  onPageChange,
  getMenuTypeLabel,
  renderActions,
}: TreeTableProps) => {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleRowSelection = (id: string) =>
    onSelectionChange(
      selection.includes(id)
        ? selection.filter((x) => x !== id)
        : [...selection, id]
    );

  const toggleAll = () => {
    if (selection.length === data.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map((item) => item.id));
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

  const renderRows = () => {
    const rows: React.ReactNode[] = [];

    data.forEach((item) => {
      const isExpanded = expandedIds.includes(item.id);
      const hasChildren = !!item.children && item.children.length > 0;

      rows.push(
        <Table.Tr
          key={item.id}
          className={cx({ [classes.rowSelected]: selection.includes(item.id) })}
        >
          <Table.Td w={40}>
            <Checkbox
              checked={selection.includes(item.id)}
              onChange={() => toggleRowSelection(item.id)}
            />
          </Table.Td>
          <Table.Td>
            <Group gap="xs">
              {hasChildren && (
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  aria-label={isExpanded ? '折叠' : '展开'}
                  onClick={() => toggleExpand(item.id)}
                >
                  {isExpanded ? (
                    <IconMinus size={14} stroke={1.5} />
                  ) : (
                    <IconPlus size={14} stroke={1.5} />
                  )}
                </ActionIcon>
              )}
              <Text size="sm" fw={500}>
                {item.name}
              </Text>
            </Group>
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
              {item.url || '-'}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text size="sm" lineClamp={1}>
              {item.route ?? '-'}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text size="sm">{item.target ?? '-'}</Text>
          </Table.Td>
          <Table.Td>
            <Text size="sm">{item.sort ?? 0}</Text>
          </Table.Td>
          <Table.Td>
            <Text size="sm">{getMenuTypeLabel?.(item.type) ?? '-'}</Text>
          </Table.Td>
          <Table.Td>
            <Text size="sm" c={getStatusColor(item.status)}>
              {getStatusLabel(item.status)}
            </Text>
          </Table.Td>
          <Table.Td>
            {renderActions?.(item) ?? null}
          </Table.Td>
        </Table.Tr>
      );

      if (hasChildren && isExpanded) {
        item.children!.forEach((child) => {
          rows.push(
            <Table.Tr
              key={child.id}
              className={cx({ [classes.rowSelected]: selection.includes(child.id) })}
            >
              <Table.Td w={40}>
                <Checkbox
                  checked={selection.includes(child.id)}
                  onChange={() => toggleRowSelection(child.id)}
                />
              </Table.Td>
              <Table.Td>
                <Group gap="xs" pl={16}>
                  <IconMinus size={14} stroke={1.5} />
                  <Text size="sm">{child.name}</Text>
                </Group>
              </Table.Td>
              <Table.Td>
                <Tooltip label={child.icon} withArrow>
                  <Group gap="xs">
                    <DynamicIcon name={child.icon} size={18} stroke={1.5} />
                    <Text size="sm" c="dimmed">
                      {child.icon}
                    </Text>
                  </Group>
                </Tooltip>
              </Table.Td>
              <Table.Td>
                <Text size="sm" lineClamp={1}>
                  {child.url || '-'}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" lineClamp={1}>
                  {child.route ?? '-'}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{child.target ?? '-'}</Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{child.sort ?? 0}</Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{getMenuTypeLabel?.(child.type) ?? '-'}</Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c={getStatusColor(child.status)}>
                  {getStatusLabel(child.status)}
                </Text>
              </Table.Td>
              <Table.Td>
                {renderActions?.(child) ?? null}
              </Table.Td>
            </Table.Tr>
          );
        });
      }
    });

    return rows;
  };

  return (
    <Box pos="relative">
      <Stack gap="lg">
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
                <Table.Th miw={100}>名称</Table.Th>
                <Table.Th miw={100}>图标</Table.Th>
                <Table.Th miw={120}>URL</Table.Th>
                <Table.Th miw={100}>路由</Table.Th>
                <Table.Th miw={80}>目标</Table.Th>
                <Table.Th miw={60}>排序</Table.Th>
                <Table.Th miw={100}>类型</Table.Th>
                <Table.Th miw={80}>状态</Table.Th>
                <Table.Th>操作</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.length > 0 ? (
                renderRows()
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={10} align="center">
                    <Text c="dimmed">暂无数据</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
        <Flex justify="space-between" align="center">
          <Text size="sm" c="dimmed">
            {calculateDisplayRange()}
          </Text>
          <Pagination
            total={totalPage || 0}
            withEdges
            value={page}
            size="sm"
            onChange={onPageChange}
            siblings={2}
            disabled={loading || totalPage <= 1}
          />
        </Flex>
      </Stack>
    </Box>
  );
};
