
'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useNotifications() {
  const { toast } = useToast();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast({
        title: 'Notifications Not Supported',
        description: 'Your browser does not support desktop notifications.',
        variant: 'destructive',
      });
      return false;
    }

    if (permission === 'granted') {
      return true;
    }

    const newPermission = await Notification.requestPermission();
    setPermission(newPermission);

    if (newPermission === 'granted') {
      new Notification('Permissions Granted!', {
        body: 'You will now receive notifications from Baseline.',
        icon: '/logo.png',
      });
      return true;
    } else {
      toast({
        title: 'Permissions Denied',
        description: 'You will not receive notifications. You can change this in your browser settings.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission !== 'granted') {
      console.warn('Notification permission not granted.');
      return;
    }
    
    // Check if the page is visible. If so, don't show the notification to avoid being intrusive.
    if(document.visibilityState === 'visible') {
        return;
    }

    new Notification(title, {
      icon: '/logo.png',
      ...options,
    });
  };

  return { requestPermission, showNotification, permission, isSupported };
}
