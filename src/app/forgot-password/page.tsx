
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background p-4 relative"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="w-full max-w-md z-10">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
