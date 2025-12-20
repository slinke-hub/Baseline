
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/use-notifications';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const { toast } = useToast();
  const { requestPermission, permission } = useNotifications();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    setNotificationsEnabled(permission === 'granted');
  }, [permission]);

  const handleDeleteAccount = () => {
    // In a real app, this would call a Firebase function to delete user data
    toast({
        title: 'Account Deletion Actioned',
        description: 'If this were a real app, your account would now be deleted.',
        variant: 'destructive',
    });
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestPermission();
      setNotificationsEnabled(granted);
    } else {
      // Cannot programmatically revoke permission. User must do it in browser settings.
      toast({
        title: 'How to Disable Notifications',
        description: 'To turn off notifications, you need to update the settings for this site in your browser.',
      });
      // Revert the switch if permission is still granted
      if (permission === 'granted') {
          setTimeout(() => setNotificationsEnabled(true), 100);
      }
    }
  }

  const handleToggle = (feature: string, enabled: boolean) => {
    toast({
        title: `${feature} ${enabled ? 'Enabled' : 'Disabled'}`,
        description: `This setting would be saved to your profile.`,
    });
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your app and account settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your app experience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="notifications" className="flex flex-col space-y-1">
                <span>Push Notifications</span>
                <span className="font-normal leading-snug text-muted-foreground">
                    Enable workout reminders and progress updates.
                </span>
            </Label>
            <Switch 
              id="notifications" 
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationToggle} 
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                <span>Dark Mode</span>
                <span className="font-normal leading-snug text-muted-foreground">
                    Toggle between light and dark themes. (UI does not change in demo)
                </span>
            </Label>
            <Switch id="dark-mode" defaultChecked onCheckedChange={(checked) => handleToggle('Dark Mode', checked)}/>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="units" className="flex flex-col space-y-1">
                <span>Use Imperial Units</span>
                <span className="font-normal leading-snug text-muted-foreground">
                    Switch between metric (kg, cm) and imperial (lbs, ft).
                </span>
            </Label>
            <Switch id="units" onCheckedChange={(checked) => handleToggle('Imperial Units', checked)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account information.</CardDescription>
        </CardHeader>
        <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-sm text-muted-foreground mt-2">Permanently remove your account and all associated data.</p>
        </CardContent>
      </Card>
    </div>
  );
}
