
import { AuthenticationForm } from '@/components/AuthenticationForm/AuthenticationForm';
import { Container } from '@mantine/core';

const AuthPage = () => {
  return (
    <Container size={460} my={60}>
      <AuthenticationForm />
    </Container>
  )
}

export default AuthPage;
