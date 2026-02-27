import { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export const metadata: Metadata = {
  title: 'Forgot Password | Vincollins School Portal',
  description: 'Reset your password',
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}