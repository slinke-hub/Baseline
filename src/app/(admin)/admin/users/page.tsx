'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock user data for demonstration
const mockUsers = [
    { id: 'user-1', name: 'LeBron James', email: 'lebron@example.com', role: 'client', plan: 'Pro', joined: '2023-10-26' },
    { id: 'user-2', name: 'Stephen Curry', email: 'steph@example.com', role: 'client', plan: 'Pro', joined: '2023-10-25' },
    { id: 'user-3', name: 'Kevin Durant', email: 'kd@example.com', role: 'client', plan: 'Free', joined: '2023-10-24' },
    { id: 'user-4', name: 'Admin User', email: 'admin@hoopscoach.dev', role: 'admin', plan: 'N/A', joined: '2023-10-20' },
];

export default function AdminUsersPage() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View, edit, or delete user profiles.</CardDescription>
                </div>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add User</Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockUsers.map(user => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell><Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge></TableCell>
                                <TableCell>{user.joined}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
