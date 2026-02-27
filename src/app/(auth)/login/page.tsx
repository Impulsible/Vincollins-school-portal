import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Login | Vincollins School Portal',
  description: 'Login to access the Vincollins School Portal',
}

export default function LoginPage() {
  return <LoginForm />
}