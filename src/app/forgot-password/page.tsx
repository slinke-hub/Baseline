
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background p-4 relative"
      style={{
        backgroundImage: `url(/logo.png)`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
      }}
    >
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      <div className="w-full max-w-md z-10">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
