'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  ActionIcon,
  Anchor,
  Box,
  Breadcrumbs,
  Button,
  Divider, Flex,
  Grid,
  Paper,
  Space,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';
import { useUser } from '@/contexts/UserContext/UserContext';
import {
  IconEdit,
  IconBrandGoogleFilled,
  IconBrandX,
  IconBrandWechat,
  IconBrandAlipay
} from '@tabler/icons-react';


interface AccountPageProps {
  initialData: any
}

const AccountPageRender =  ({ initialData }:AccountPageProps) => {
  const { setActive, setSection } = useNavbar();
  const { user } = useUser();
  const items = [{ title: 'Home', href: '/' }, { title: 'Authentication' }];
  useEffect(() => {
    setSection('Account');
    setActive('Authentication');
  }, []); // 合并依赖项


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

      <Paper pt="lg" pb="lg">
        {/* 页面容器 - 标题 */}
        <Box mb="lg">
          <Title order={3}>Authentication</Title>
          <Text size="sm" c="dimmed">
            Verify your identity to enhance account security and access additional features.
          </Text>
        </Box>
        <Divider mb="lg" my="xs" variant="dashed" />

        <Box pos="relative">
            <Stack gap="lg"  >
              {/*username*/}
              <Grid>
                <Grid.Col  span={{ base: 10, md: 10, lg: 6, xl: 6 }} >
                  <Text  size="sm">Username</Text>
                  <Text size="sm" c="dimmed">
                    Your username is active:  <Space w="md" component="span" /> <b>{user?.account?.username}</b>
                  </Text>
                </Grid.Col>
                <Grid.Col display="flex"  span={{ base: 2, md: 2, lg: 2, xl: 2 }}>
                    <Flex align="center">
                      <Button leftSection={<IconEdit size={14} />} variant="default" size="xs">
                        Edit
                      </Button>
                    </Flex>
                </Grid.Col>
              </Grid>

              <Grid >
                <Grid.Col  span={{ base: 12, md: 12, lg: 8, xl: 8 }}>
                  <Divider my="xs" />
                </Grid.Col>
              </Grid>

              {/*password*/}
              <Grid>
                <Grid.Col  span={{ base: 10, md: 10, lg: 6, xl: 6 }} >
                  <Text  size="sm">Password</Text>
                  <Text size="sm" c="dimmed">
                    Your password is set.
                  </Text>
                </Grid.Col>
                <Grid.Col display="flex"  span={{ base: 2, md: 2, lg: 2, xl: 2 }}>
                  <Flex align="center">
                    <Button leftSection={<IconEdit size={14} />} variant="default" size="xs">
                      Edit
                    </Button>
                  </Flex>
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={{ base: 12, md: 12, lg: 8, xl: 8 }}>
                  <Divider my="xs" />
                </Grid.Col>
              </Grid>

              {/*email*/}
              <Grid>
                <Grid.Col  span={{ base: 10, md: 10, lg: 6, xl: 6 }} >
                  <Text  size="sm">Email</Text>
                  <Text size="sm" c="dimmed">
                    Your email is verified:  <Space w="md" component="span" /> <b>{user?.account?.email}</b>
                  </Text>
                </Grid.Col>
                <Grid.Col display="flex"  span={{ base: 2, md: 2, lg: 2, xl: 2 }}>
                  <Flex align="center">
                    <Button leftSection={<IconEdit size={14} />} variant="default" size="xs">
                      Edit
                    </Button>
                  </Flex>
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={{ base: 12, md: 12, lg: 8, xl: 8 }}>
                  <Divider my="xs" />
                </Grid.Col>
              </Grid>

              {/*mobile*/}
              <Grid>
                <Grid.Col  span={{ base: 10, md: 10, lg: 6, xl: 6 }} >
                  <Text  size="sm">Mobile Number</Text>
                  <Text size="sm" c="dimmed">
                    Your mobile number is verified:  <Space w="md" component="span" /> <b>{user?.account?.mobile}</b>
                  </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 2, md: 2, lg: 2, xl: 2 }}>
                  <Button leftSection={<IconEdit size={14} />} size="xs" variant="default">
                    Edit
                  </Button>
                </Grid.Col>
              </Grid>

              <Grid >
                <Grid.Col  span={{ base: 12, md: 12, lg: 8, xl: 8 }}>
                  <Divider my="xs" />
                </Grid.Col>
              </Grid>

              {/*三方*/}
              <Grid>
                <Grid.Col  span={{ base: 12, md: 12, lg: 8, xl: 8 }} >
                  <Text  size="sm">Social Account</Text>
                </Grid.Col>
              </Grid>
              <Grid >
                <Grid.Col  span={{ base: 12, md: 12, lg: 8, xl: 8 }} >
                  <Flex
                    gap="md"
                  >
                    <ActionIcon size="lg" variant="default" aria-label="ActionIcon with size as a number">
                      <IconBrandGoogleFilled size={24} />
                    </ActionIcon>
                    <ActionIcon size="lg" variant="default" aria-label="ActionIcon with size as a number">
                      <IconBrandX size={24} />
                    </ActionIcon>
                    <ActionIcon size="lg" variant="default" aria-label="ActionIcon with size as a number">
                      <IconBrandWechat size={24} />
                    </ActionIcon>
                    <ActionIcon size="lg" variant="default" aria-label="ActionIcon with size as a number">
                      <IconBrandAlipay size={24} />
                    </ActionIcon>
                  </Flex>
                </Grid.Col>
              </Grid>

            </Stack>

        </Box>
      </Paper>
    </Box>
  );
}

export default AccountPageRender;
