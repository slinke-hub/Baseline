import { ProfileForm } from '@/components/profile-form';

export default function EditProfilePage() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
        <p className="text-muted-foreground">Update your personal and athletic information.</p>
      </div>
      <ProfileForm />
    </div>
  );
}
