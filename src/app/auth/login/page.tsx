
import { LoginForm } from '@/components/AuthenticationForm/LoginForm';
import { Container } from '@mantine/core';

const LoginPage = () => {
  return (
    <Container size={460} my={60}>
      <LoginForm />
    </Container>
  )
}

export default LoginPage;
