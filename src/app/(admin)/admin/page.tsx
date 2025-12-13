
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Activity, Dumbbell, UtensilsCrossed, Megaphone, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockWorkouts, mockMeals } from '@/lib/mock-data';
import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { useFirebase } from '@/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Input } from '@/components/ui/input';

// Mock user data for demonstration
const mockUsers = [
    { id: 'user-1', name: 'LeBron James', email: 'lebron@example.com', role: 'client', plan: 'Pro', joined: '2023-10-26' },
    { id: 'user-2', name: 'Stephen Curry', email: 'steph@example.com', role: 'client', plan: 'Pro', joined: '2023-10-25' },
    { id: 'user-3', name: 'Kevin Durant', email: 'kd@example.com', role: 'client', plan: 'Free', joined: '2023-10-24' },
    { id: 'user-4', name: 'Admin User', email: 'admin@baseline.dev', role: 'admin', plan: 'N/A', joined: '2023-10-20' },
];

type Announcement = {
    id: number;
    author: string;
    text: string;
    date: Date;
}

export default function AdminDashboardPage() {
    const { toast } = useToast();
    const { firebaseApp } = useFirebase();
    const [newAnnouncement, setNewAnnouncement] = useState('');
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    useEffect(() => {
      // Initialize announcements on the client to avoid hydration errors
      const initialAnnouncements = [
          { id: 1, author: 'Admin', text: 'Reminder: The gym will be closed this Friday for maintenance. All sessions are canceled.', date: new Date() },
          { id: 2, author: 'Admin', text: 'New "Vertical Jump" workouts have been added! Check them out in the workouts section.', date: new Date(new Date().setDate(new Date().getDate() - 1)) },
      ];
      setAnnouncements(initialAnnouncements);

      const storage = getStorage(firebaseApp);
      const logoRef = ref(storage, 'app/logo.png');
      getDownloadURL(logoRef).then(setLogoPreview).catch(() => {});

    }, [firebaseApp]);

    const handlePostAnnouncement = () => {
        if (!newAnnouncement.trim()) return;

        const announcement = {
            id: Date.now(),
            author: 'Admin',
            text: newAnnouncement,
            date: new Date(),
        };

        setAnnouncements([announcement, ...announcements]);
        setNewAnnouncement('');
        toast({ title: "Announcement Posted", description: "Your announcement is now visible to all clients." });
    }

    const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(true);

      try {
        const storage = getStorage(firebaseApp);
        const logoRef = ref(storage, 'app/logo.png');
        await uploadBytes(logoRef, file);
        const downloadUrl = await getDownloadURL(logoRef);
        setLogoPreview(downloadUrl);
        toast({ title: 'Logo Updated', description: 'The new app logo has been uploaded successfully. It may take a moment to update across the app.'});
        // Force a reload to see the new logo in the header
        window.location.reload();
      } catch (error) {
        console.error("Logo upload failed: ", error);
        toast({ title: 'Upload Failed', description: 'Could not upload the new logo.', variant: 'destructive' });
      } finally {
        setIsUploading(false);
      }
    };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Baseline control center.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
          <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-primary/20 hover:shadow-lg flex flex-col justify-center items-center p-1 text-center">
              <CardHeader className="p-1">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 justify-center"><Users className="h-4 w-4 text-muted-foreground" /> Total Users</CardTitle>
              </CardHeader>
              <CardContent className="p-1">
                  <div className="text-2xl font-bold">{mockUsers.length}</div>
                  <p className="text-xs text-muted-foreground">+2 since last week</p>
              </CardContent>
          </Card>
          <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-primary/20 hover:shadow-lg flex flex-col justify-center items-center p-1 text-center">
              <CardHeader className="p-1">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 justify-center"><Dumbbell className="h-4 w-4 text-muted-foreground" /> Total Workouts</CardTitle>
              </CardHeader>
              <CardContent className="p-1">
                  <div className="text-2xl font-bold">{mockWorkouts.length}</div>
                  <p className="text-xs text-muted-foreground">Manage workout content</p>
              </CardContent>
          </Card>
          <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-primary/20 hover:shadow-lg flex flex-col justify-center items-center p-1 text-center">
              <CardHeader className="p-1">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 justify-center"><UtensilsCrossed className="h-4 w-4 text-muted-foreground" /> Total Meals</CardTitle>
              </CardHeader>
              <CardContent className="p-1">
                  <div className="text-2xl font-bold">{mockMeals.length}</div>
                  <p className="text-xs text-muted-foreground">Manage nutrition plans</p>
              </CardContent>
          </Card>
      </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Megaphone className="h-5 w-5 text-primary" /> Post an Announcement</CardTitle>
                    <CardDescription>This message will be broadcast to all client dashboards.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="Type your announcement here..."
                        value={newAnnouncement}
                        onChange={(e) => setNewAnnouncement(e.target.value)}
                        rows={4}
                    />
                    <Button onClick={handlePostAnnouncement} disabled={!newAnnouncement.trim()}>Post Announcement</Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Recent Announcements</CardTitle>
                    <CardDescription>A log of your most recent posts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                        {announcements.map(ann => (
                             <div key={ann.id} className="flex items-start gap-4">
                                <Avatar className="h-9 w-9 border">
                                    <AvatarFallback>A</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{ann.author}</p>
                                    <p className="text-sm text-muted-foreground">{ann.text}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{format(ann.date, "PPP p")}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>App Branding</CardTitle>
                    <CardDescription>Manage the application's logo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-32 h-16 relative rounded-md border p-2 flex items-center justify-center">
                          {logoPreview ? <img src={logoPreview} alt="Logo preview" className="object-contain max-h-full max-w-full" /> : <ImageIcon className="h-8 w-8 text-muted-foreground" />}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold">App Logo</h3>
                            <p className="text-xs text-muted-foreground">Upload a PNG file. Recommended size: 256x128px.</p>
                        </div>
                    </div>
                    <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        Upload New Logo
                    </Button>
                    <Input type="file" ref={fileInputRef} className="hidden" accept="image/png" onChange={handleLogoUpload} />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
