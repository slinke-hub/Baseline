
import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background p-4 relative"
      style={{
        backgroundImage: `url(/logo.png)`,
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '512px',
      }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="w-full max-w-md z-10">
        <SignupForm />
      </div>
    </div>
  );
}
