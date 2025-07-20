"use client"

import { useState,useEffect } from 'react';
import { Anchor, Box, Burger, Container, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './DoubleHeader.module.css';

import { listFront } from '@/api/menu/api';
import { listFrontData } from '@/api/menu/response';

const userLinks = [
  { link: '#', label: 'Privacy & Security' },
  { link: '#', label: 'Account settings' },
  { link: '#', label: 'Support options' },
];

const mainLinks = [
  { link: '#', label: 'Book a demo' },
  { link: '#', label: 'Documentation' },
  { link: '#', label: 'Community' },
  { link: '#', label: 'Academy' },
  { link: '#', label: 'Forums' },
];



export function DoubleHeader() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(0);

  // 新增从接口获取菜单
  const [menuData ,setMenuData] = useState<listFrontData>();
  const [loading, setLoading] = useState(true);

  const fetchMenu = async (): Promise<void> => {
    try {
      const response = await listFront();
      if (response.code === 0) {
        setMenuData(response.data);
      }
    }catch(error) {
      console.error(error);
    }finally {
      setLoading(false);
    }


  }

  useEffect(() => {
    fetchMenu().then(() =>{} );
  }, []);



  const mainItems = menuData?.headings.map((item, index) => (
    <Anchor<'a'>
      href={item.url}
      key={item.name}
      className={classes.mainLink}
      data-active={index === active || undefined}
      onClick={(event) => {
        event.preventDefault();
        setActive(index);
      }}
    >
      {item.name}
    </Anchor>
  ));

  const secondaryItems = menuData?.subheadings.map((item) => (
    <Anchor
      href={item.url}
      key={item.name}
      onClick={(event) => event.preventDefault()}
      className={classes.secondaryLink}
    >
      {item.name}
    </Anchor>
  ));

  return (
    <header className={classes.header}>
      <Container className={classes.inner}>
        <MantineLogo size={34} />
        <Box className={classes.links} visibleFrom="sm">
          <Group justify="flex-end">{secondaryItems}</Group>
          <Group gap={0} justify="flex-end" className={classes.mainLinks}>
            {mainItems}
          </Group>
        </Box>
        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
          hiddenFrom="sm"
        />
      </Container>
    </header>
  );
}
