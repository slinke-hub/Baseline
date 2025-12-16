
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { User, Edit, AtSign, Cake, Ruler, Weight, Medal, MapPin, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const { appUser } = useAuth();

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const profileItems = [
    { icon: Star, label: 'Experience Points', value: appUser?.xp ? `${appUser.xp} XP` : '0 XP' },
    { icon: AtSign, label: 'Email', value: appUser?.email },
    { icon: Cake, label: 'Age', value: appUser?.age ? `${appUser.age} years old` : 'Not set' },
    { icon: Ruler, label: 'Height', value: appUser?.height ? `${appUser.height} cm` : 'Not set' },
    { icon: Weight, label: 'Weight', value: appUser?.weight ? `${appUser.weight} kg` : 'Not set' },
    { icon: MapPin, label: 'Position', value: appUser?.position || 'Not set' },
    { icon: Medal, label: 'Experience', value: appUser?.experienceLevel || 'Not set' },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">View and manage your personal information.</p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src={appUser?.photoURL} alt={appUser?.displayName || 'User'} />
              <AvatarFallback className="text-3xl">{getInitials(appUser?.displayName)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{appUser?.displayName}</CardTitle>
              {appUser?.position && appUser?.experienceLevel && (
                 <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{appUser.position}</Badge>
                    <Badge variant="outline">{appUser.experienceLevel}</Badge>
                 </div>
              )}
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
                            <p className="font-medium">{item.value}</p>
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
