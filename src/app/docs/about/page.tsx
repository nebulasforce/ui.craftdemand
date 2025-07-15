// /src/app/docs/about/page.tsx
"use client"
import { Text, Title } from '@mantine/core';
import { DoubleHeader } from '@/components/DoubleHeader/DoubleHeader';

const AboutPage = () => {
  return (
    <>
      <Title ta="center" mt={50}>
        关于我们
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={800} mx="auto" mt="xl">
        我们是一个充满激情和创新精神的团队，致力于为用户提供高质量的产品和服务。通过不断的努力和追求卓越，我们希望能够在行业中树立起良好的口碑，并为社会做出积极的贡献。
      </Text>
      <Text c="dimmed" ta="center" size="lg" maw={800} mx="auto" mt="xl">
        我们的团队由一群经验丰富、技术精湛的专业人士组成，他们在各自的领域拥有深厚的知识和丰富的经验。我们相信，通过团队的协作和共同努力，我们能够克服各种挑战，实现我们的目标。
      </Text>
      <Text c="dimmed" ta="center" size="lg" maw={800} mx="auto" mt="xl">
        如果您对我们的产品或服务感兴趣，或者有任何问题或建议，请随时联系我们。我们将竭诚为您服务！
      </Text>
    </>
  );
};

export default AboutPage;
