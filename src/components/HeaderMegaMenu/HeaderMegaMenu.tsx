// src/components/HeaderMegaMenu/HeaderMegaMenu.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  IconBook,
  IconChartPie3,
  IconChevronDown,
  IconCode,
  IconCoin,
  IconFingerprint,
  IconNotification,
} from '@tabler/icons-react';
import {
  Anchor,
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  Divider,
  Drawer,
  Group,
  HoverCard,
  ScrollArea,
  SimpleGrid,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { User } from '@/api/my/typings';
import { HeaderDropdown } from '@/components/HeaderDropdown/HeaderDropdown';
import { Logo } from '@/components/Logo/Logo';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import classes from './HeaderMegaMenu.module.css';

const mockdata = [
  {
    icon: IconCode,
    title: 'Open source',
    description: 'This Pokémon’s cry is very loud and distracting',
  },
  {
    icon: IconCoin,
    title: 'Free for everyone',
    description: 'The fluid of Smeargle’s tail secretions changes',
  },
  {
    icon: IconBook,
    title: 'Documentation',
    description: 'Yanma is capable of seeing 360 degrees without',
  },
  {
    icon: IconFingerprint,
    title: 'Security',
    description: 'The shell’s rounded shape and the grooves on its.',
  },
  {
    icon: IconChartPie3,
    title: 'Analytics',
    description: 'This Pokémon uses its flying ability to quickly chase',
  },
  {
    icon: IconNotification,
    title: 'Notifications',
    description: 'Combusken battles with the intensely hot flames it spews',
  },
];

interface HeaderMegaMenuProps {
  user: User | null;
}

export function HeaderMegaMenu({ user }: HeaderMegaMenuProps) {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();
  const { user: authedUser } = useAuth();
  const [userDisplay, setUserDisplay] = useState<User | null>(user);

  useEffect(() => {
    setUserDisplay(authedUser);
  }, [authedUser]);

  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={22} color={theme.colors.blue[6]} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Logo size={30} src="/avatar.png" />

          <Group h="100%" gap={0} visibleFrom="sm" ml="md" pos="relative">
            <Link href="/" passHref className={classes.link}>
              Home
            </Link>
            <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
              <HoverCard.Target>
                <Link href="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Features
                    </Box>
                    <IconChevronDown size={16} color={theme.colors.blue[6]} />
                  </Center>
                </Link>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                <Group justify="space-between" px="md">
                  <Text fw={500}>Features</Text>
                  <Anchor href="#" fz="xs">
                    View all
                  </Anchor>
                </Group>

                <Divider my="sm" />

                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>

                <div className={classes.dropdownFooter}>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500} fz="sm">
                        Get started
                      </Text>
                      <Text size="xs" c="dimmed">
                        Their food sources have decreased, and their numbers
                      </Text>
                    </div>
                    <Button variant="default">Get started</Button>
                  </Group>
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
            <Link href="#" className={classes.link}>
              Learn
            </Link>
            <Link href="#" className={classes.link}>
              Academy
            </Link>
            <Link href="/docs/about" className={classes.link}>
              About
            </Link>
          </Group>

          <Group visibleFrom="md" ml="auto">
            {userDisplay ? (
              <HeaderDropdown user={userDisplay} />
            ) : (
              <>
                <Link href="/auth/login" passHref>
                  <Button variant="default">Log in</Button>
                </Link>
                <Link href="/auth/register" passHref>
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation1"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px" mx="-md">
          <Divider my="sm" />

          <Link href="/" onClick={closeDrawer} className={classes.link} passHref>
            Home
          </Link>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              <IconChevronDown size={16} color={theme.colors.blue[6]} />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          <Link href="#" onClick={closeDrawer} className={classes.link}>
            Learn
          </Link>
          <Link href="#" onClick={closeDrawer} className={classes.link}>
            Academy
          </Link>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            {userDisplay ? (
              <HeaderDropdown user={userDisplay} />
            ) : (
              <>
                <Link  href="/auth/login" passHref>
                  <Button onClick={closeDrawer}  variant="default">Log in</Button>
                </Link>
                <Link href="/auth/register" passHref>
                  <Button onClick={closeDrawer} >Sign up</Button>
                </Link>
              </>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
