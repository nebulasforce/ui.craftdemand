
import { AuthenticationForm } from '@/components/AuthenticationForm/AuthenticationForm';
import { Container } from '@mantine/core';

const LoginPage = () => {
  return (
    <Container size={500} my={80}>
      <AuthenticationForm />
    </Container>
  )
}

export default LoginPage;
