
import { RegisterForm } from '@/components/AuthenticationForm/RegisterForm';
import { Container } from '@mantine/core';

const RegisterPage = () => {
  return (
    <Container size={460} my={60}>
      <RegisterForm />
    </Container>
  )
}

export default RegisterPage;
