'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Group,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconSearch,
} from '@tabler/icons-react';
import cx from 'clsx';
import classes from './ApiTransferBox.module.css';

export interface ApiTransferItem {
  id: string;
  title: string;
  subtitle?: string;
}

export interface ApiTransferBoxProps {
  items: ApiTransferItem[];
  value: string[];
  onChange: (nextIds: string[]) => void;
  loading?: boolean;
  leftTitle?: string;
  rightTitle?: string;
  emptyLeft?: string;
  emptyRight?: string;
}

const itemMap = (items: ApiTransferItem[]) =>
  new Map(items.map((i) => [i.id, i]));

export function ApiTransferBox({
  items,
  value,
  onChange,
  loading,
  leftTitle = '可选',
  rightTitle = '已选',
  emptyLeft = '暂无数据',
  emptyRight = '暂无已选',
}: ApiTransferBoxProps) {
  const byId = useMemo(() => itemMap(items), [items]);

  const leftIds = useMemo(
    () => items.filter((i) => !value.includes(i.id)).map((i) => i.id),
    [items, value]
  );

  const rightOrdered = useMemo(
    () => value.map((id) => byId.get(id)).filter(Boolean) as ApiTransferItem[],
    [value, byId]
  );

  const [leftFilter, setLeftFilter] = useState('');
  const [rightFilter, setRightFilter] = useState('');
  const [leftPick, setLeftPick] = useState<string[]>([]);
  const [rightPick, setRightPick] = useState<string[]>([]);

  const filterFn = (q: string, list: ApiTransferItem[]) => {
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter(
      (i) =>
        i.title.toLowerCase().includes(s) ||
        (i.subtitle && i.subtitle.toLowerCase().includes(s))
    );
  };

  const leftList = filterFn(
    leftFilter,
    leftIds.map((id) => byId.get(id)!).filter(Boolean)
  );
  const rightList = filterFn(rightFilter, rightOrdered);

  const leftVisibleIds = useMemo(
    () => leftList.map((i) => i.id),
    [leftList]
  );
  const rightVisibleIds = useMemo(
    () => rightList.map((i) => i.id),
    [rightList]
  );

  const toggleLeft = (id: string) =>
    setLeftPick((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleRight = (id: string) =>
    setRightPick((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const setLeftPickAllVisible = () => {
    setLeftPick(leftVisibleIds);
  };

  const clearLeftPick = () => setLeftPick([]);

  const setRightPickAllVisible = () => {
    setRightPick(rightVisibleIds);
  };

  const clearRightPick = () => setRightPick([]);

  const moveToRight = (ids: string[]) => {
    if (ids.length === 0) return;
    const set = new Set([...value, ...ids]);
    onChange(items.filter((i) => set.has(i.id)).map((i) => i.id));
    setLeftPick([]);
  };

  const moveToLeft = (ids: string[]) => {
    if (ids.length === 0) return;
    const remove = new Set(ids);
    onChange(value.filter((id) => !remove.has(id)));
    setRightPick([]);
  };

  const moveAllRight = () => {
    const set = new Set([...value, ...leftIds]);
    onChange(items.filter((i) => set.has(i.id)).map((i) => i.id));
    setLeftPick([]);
  };

  const moveAllLeft = () => {
    onChange([]);
    setRightPick([]);
  };

  return (
    <Group align="stretch" wrap="nowrap" gap="sm" className={classes.root}>
      <Stack gap="xs" className={classes.panel}>
        <Group justify="space-between" align="center" gap="xs" wrap="nowrap">
          <Text size="sm" fw={600}>
            {leftTitle}（{leftIds.length}）
          </Text>
          <Group gap={6} wrap="nowrap">
            <Button
              variant="subtle"
              size="compact-xs"
              disabled={loading || leftVisibleIds.length === 0}
              onClick={setLeftPickAllVisible}
            >
              全选
            </Button>
            <Button
              variant="subtle"
              size="compact-xs"
              disabled={loading || leftPick.length === 0}
              onClick={clearLeftPick}
            >
              清空
            </Button>
          </Group>
        </Group>
        <TextInput
          placeholder="筛选..."
          value={leftFilter}
          onChange={(e) => setLeftFilter(e.currentTarget.value)}
          leftSection={<IconSearch size={14} stroke={1.5} />}
          size="sm"
          disabled={loading}
        />
        <ScrollArea h={280} className={classes.scroll} type="auto">
          <Stack gap={4}>
            {leftList.length === 0 ? (
              <Text size="sm" c="dimmed" ta="center" py="md">
                {emptyLeft}
              </Text>
            ) : (
              leftList.map((item) => (
                <Box
                  key={item.id}
                  className={cx(classes.row, {
                    [classes.rowActive]: leftPick.includes(item.id),
                  })}
                  onClick={() => toggleLeft(item.id)}
                >
                  <Checkbox
                    checked={leftPick.includes(item.id)}
                    onChange={() => toggleLeft(item.id)}
                    onClick={(e) => e.stopPropagation()}
                    size="sm"
                  />
                  <Box style={{ minWidth: 0, flex: 1 }}>
                    <Text size="sm" lineClamp={1}>
                      {item.title}
                    </Text>
                    {item.subtitle && (
                      <Text size="xs" c="dimmed" lineClamp={1}>
                        {item.subtitle}
                      </Text>
                    )}
                  </Box>
                </Box>
              ))
            )}
          </Stack>
        </ScrollArea>
      </Stack>

      <Stack justify="center" gap="xs" className={classes.actions}>
        <Button
          variant="light"
          size="compact-sm"
          disabled={loading || leftPick.length === 0}
          onClick={() => moveToRight(leftPick)}
          aria-label="添加选中"
        >
          <IconChevronRight size={16} />
        </Button>
        <Button
          variant="light"
          size="compact-sm"
          disabled={loading || leftIds.length === 0}
          onClick={moveAllRight}
          aria-label="全部添加"
        >
          <IconChevronsRight size={16} />
        </Button>
        <Button
          variant="light"
          size="compact-sm"
          disabled={loading || rightPick.length === 0}
          onClick={() => moveToLeft(rightPick)}
          aria-label="移除选中"
        >
          <IconChevronLeft size={16} />
        </Button>
        <Button
          variant="light"
          size="compact-sm"
          disabled={loading || value.length === 0}
          onClick={moveAllLeft}
          aria-label="全部移除"
        >
          <IconChevronsLeft size={16} />
        </Button>
      </Stack>

      <Stack gap="xs" className={classes.panel}>
        <Group justify="space-between" align="center" gap="xs" wrap="nowrap">
          <Text size="sm" fw={600}>
            {rightTitle}（{value.length}）
          </Text>
          <Group gap={6} wrap="nowrap">
            <Button
              variant="subtle"
              size="compact-xs"
              disabled={loading || rightVisibleIds.length === 0}
              onClick={setRightPickAllVisible}
            >
              全选
            </Button>
            <Button
              variant="subtle"
              size="compact-xs"
              disabled={loading || rightPick.length === 0}
              onClick={clearRightPick}
            >
              清空
            </Button>
          </Group>
        </Group>
        <TextInput
          placeholder="筛选..."
          value={rightFilter}
          onChange={(e) => setRightFilter(e.currentTarget.value)}
          leftSection={<IconSearch size={14} stroke={1.5} />}
          size="sm"
          disabled={loading}
        />
        <ScrollArea h={280} className={classes.scroll} type="auto">
          <Stack gap={4}>
            {rightList.length === 0 ? (
              <Text size="sm" c="dimmed" ta="center" py="md">
                {emptyRight}
              </Text>
            ) : (
              rightList.map((item) => (
                <Box
                  key={item.id}
                  className={cx(classes.row, {
                    [classes.rowActive]: rightPick.includes(item.id),
                  })}
                  onClick={() => toggleRight(item.id)}
                >
                  <Checkbox
                    checked={rightPick.includes(item.id)}
                    onChange={() => toggleRight(item.id)}
                    onClick={(e) => e.stopPropagation()}
                    size="sm"
                  />
                  <Box style={{ minWidth: 0, flex: 1 }}>
                    <Text size="sm" lineClamp={1}>
                      {item.title}
                    </Text>
                    {item.subtitle && (
                      <Text size="xs" c="dimmed" lineClamp={1}>
                        {item.subtitle}
                      </Text>
                    )}
                  </Box>
                </Box>
              ))
            )}
          </Stack>
        </ScrollArea>
      </Stack>
    </Group>
  );
}
