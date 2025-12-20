'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Edit, AtSign, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function AdminProfilePage() {
  const { appUser } = useAuth();

  const getInitials = (name?: string | null) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const profileItems = [
    { icon: AtSign, label: 'Email', value: appUser?.email },
    { icon: Shield, label: 'Role', value: appUser?.role },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Profile</h1>
        <p className="text-muted-foreground">View and manage your account information.</p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src={appUser?.photoURL} alt={appUser?.displayName || 'Admin'} />
              <AvatarFallback className="text-3xl">{getInitials(appUser?.displayName)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{appUser?.displayName}</CardTitle>
              <p className="text-muted-foreground">Administrator</p>
            </div>
          </div>
          <Button asChild>
            <Link href="/profile/edit"><Edit className="mr-2 h-4 w-4" /> Edit Profile</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Separator className="my-4"/>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {profileItems.map(item => (
                item.value && (
                    <div key={item.label} className="flex items-center gap-4">
                        <div className="rounded-lg bg-secondary p-3">
                            <item.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">{item.label}</p>
                            <p className="font-medium capitalize">{item.value}</p>
                        </div>
                    </div>
                )
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
