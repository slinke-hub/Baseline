
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Activity, Dumbbell, UtensilsCrossed, PlusCircle, Trash2, Edit } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockWorkouts, mockMeals } from '@/lib/mock-data';
import Image from 'next/image';
import placeholderData from '@/lib/placeholder-images.json';
import Link from 'next/link';

// Mock user data for demonstration
const mockUsers = [
    { id: 'user-1', name: 'LeBron James', email: 'lebron@example.com', role: 'client', plan: 'Pro', joined: '2023-10-26' },
    { id: 'user-2', name: 'Stephen Curry', email: 'steph@example.com', role: 'client', plan: 'Pro', joined: '2023-10-25' },
    { id: 'user-3', name: 'Kevin Durant', email: 'kd@example.com', role: 'client', plan: 'Free', joined: '2023-10-24' },
    { id: 'user-4', name: 'Admin User', email: 'admin@hoopscoach.dev', role: 'admin', plan: 'N/A', joined: '2023-10-20' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the HoopsCoach control center.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-primary/20 hover:shadow-lg flex flex-col justify-center items-center aspect-square text-center p-4">
              <CardHeader className="p-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 justify-center"><Users className="h-4 w-4 text-muted-foreground" /> Total Users</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                  <div className="text-3xl font-bold">{mockUsers.length}</div>
                  <p className="text-xs text-muted-foreground">+2 since last week</p>
              </CardContent>
          </Card>
          <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-primary/20 hover:shadow-lg flex flex-col justify-center items-center aspect-square text-center p-4">
              <CardHeader className="p-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 justify-center"><Dumbbell className="h-4 w-4 text-muted-foreground" /> Total Workouts</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                  <div className="text-3xl font-bold">{mockWorkouts.length}</div>
                  <p className="text-xs text-muted-foreground">Manage workout content</p>
              </CardContent>
          </Card>
          <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-primary/20 hover:shadow-lg flex flex-col justify-center items-center aspect-square text-center p-4">
              <CardHeader className="p-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 justify-center"><UtensilsCrossed className="h-4 w-4 text-muted-foreground" /> Total Meals</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                  <div className="text-3xl font-bold">{mockMeals.length}</div>
                  <p className="text-xs text-muted-foreground">Manage nutrition plans</p>
              </CardContent>
          </Card>
      </div>
        <Card className="mt-6">
        <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>A log of recent user activities will be shown here.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
                <Activity className="h-12 w-12 mb-4" />
                <p>Real-time activity feed coming soon.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
