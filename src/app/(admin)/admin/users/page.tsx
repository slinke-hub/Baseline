
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Trash2, Edit, MoreVertical, Eye, Star } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AppUser } from '@/lib/types';


// Mock user data for demonstration
const initialUsers: AppUser[] = [
    { uid: 'user-4', displayName: 'Admin User', email: 'monti.training@gmail.com', role: 'admin' as const, photoURL: '', sessionsCompleted: 0, totalSessions: 0, xp: 9999 },
    { uid: 'user-coach-1', displayName: 'Coach Carter', email: 'coach@baseline.dev', role: 'coach' as const, photoURL: '', sessionsCompleted: 0, totalSessions: 0, xp: 0 },
    { uid: 'user-seller-1', displayName: 'Delivery Dan', email: 'seller@baseline.dev', role: 'seller' as const, photoURL: '', sessionsCompleted: 0, totalSessions: 0, xp: 0 },
    { uid: 'user-1', displayName: 'LeBron James', email: 'lebron@example.com', role: 'client' as const, photoURL: '', sessionsCompleted: 4, totalSessions: 8, xp: 1250, address: '123 Main St, Akron, OH' },
    { uid: 'user-2', displayName: 'Stephen Curry', email: 'steph@example.com', role: 'client' as const, photoURL: '', sessionsCompleted: 6, totalSessions: 8, xp: 2300, address: '456 High St, Charlotte, NC' },
    { uid: 'user-3', displayName: 'Kevin Durant', email: 'kd@example.com', role: 'client' as const, photoURL: '', sessionsCompleted: 1, totalSessions: 12, xp: 800, address: '789 Slim Ave, Washington, DC' },
    { uid: 'user-5', displayName: 'Zion Williamson', email: 'zion@example.com', role: 'client' as const, photoURL: '', sessionsCompleted: 8, totalSessions: 8, xp: 3000, address: '901 Pelican Way, New Orleans, LA' },
];


export default function AdminUsersPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState(initialUsers);
    const [isAddUserOpen, setAddUserOpen] = useState(false);
    const [isEditUserOpen, setIsEditUserOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
    const [userToDelete, setUserToDelete] = useState<AppUser | null>(null);

    const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const role = formData.get('role') as AppUser['role'];
        
        const newUser: AppUser = {
            uid: `user-${Date.now()}`,
            displayName: name,
            email,
            role: role || 'client',
            photoURL: '',
            sessionsCompleted: 0,
            totalSessions: 8,
            xp: 0,
        };

        setUsers(currentUsers => [newUser, ...currentUsers]);

        toast({ title: 'User Added', description: `Added new user: ${name} (${email})` });
        setAddUserOpen(false);
    }
    
    const handleDeleteUser = () => {
        if (!userToDelete) return;
        setUsers(currentUsers => currentUsers.filter(user => user.uid !== userToDelete.uid));
        toast({
            title: "User Deleted",
            description: "The user has been removed from the list.",
            variant: "destructive",
        })
        setUserToDelete(null);
    }

    const handleEditUser = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedUser) return;
        const formData = new FormData(event.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const role = formData.get('role') as AppUser['role'];
        const totalSessions = formData.get('totalSessions') as string;
        const xp = formData.get('xp') as string;

        setUsers(currentUsers => currentUsers.map(user => 
            user.uid === selectedUser.uid ? { 
                ...user, 
                displayName: name, 
                email, 
                role, 
                totalSessions: parseInt(totalSessions, 10) || user.totalSessions,
                xp: parseInt(xp, 10) || 0,
             } : user
        ));

        toast({ title: 'User Updated', description: `Updated details for ${name}.` });
        setIsEditUserOpen(false);
        setSelectedUser(null);
    }

    const openEditDialog = (user: AppUser) => {
      setSelectedUser(user);
      setIsEditUserOpen(true);
    }
    
    const getRoleBadge = (role: AppUser['role']) => {
        switch(role) {
            case 'admin': return <Badge variant="default">{role}</Badge>;
            case 'coach': return <Badge className="bg-blue-500 text-white hover:bg-blue-500/80">{role}</Badge>;
            case 'seller': return <Badge className="bg-orange-500 text-white hover:bg-orange-500/80">{role}</Badge>;
            case 'client': return <Badge variant="secondary">{role}</Badge>;
            default: return <Badge variant="outline">{role}</Badge>;
        }
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>View, edit, or delete user profiles.</CardDescription>
                    </div>
                    <Dialog open={isAddUserOpen} onOpenChange={setAddUserOpen}>
                      <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> Add User</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleAddUser}>
                          <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                            <DialogDescription>
                              Fill in the details for the new user. An invitation will be sent to their email.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Name
                              </Label>
                              <Input id="name" name="name" defaultValue="Ja Morant" className="col-span-3" required/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="email" className="text-right">
                                Email
                              </Label>
                              <Input id="email" name="email" type="email" defaultValue="ja@example.com" className="col-span-3" required/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="role" className="text-right">
                                Role
                              </Label>
                               <Select name="role" defaultValue="client">
                                <SelectTrigger className="col-span-3" id="role">
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="client">Client</SelectItem>
                                  <SelectItem value="coach">Coach</SelectItem>
                                  <SelectItem value="seller">Seller</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Create User</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>XP</TableHead>
                                <TableHead>Monthly Sessions</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.uid}>
                                    <TableCell className="font-medium">{user.displayName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 text-yellow-400" />
                                            {user.xp?.toLocaleString() || 0}
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.role === 'client' ? `${user.sessionsCompleted} / ${user.totalSessions}` : 'N/A'}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/schedule?userId=${user.uid}`}>
                                                        <Eye className="mr-2 h-4 w-4" />View Schedule
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openEditDialog(user)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="text-destructive"
                                                    onClick={() => setUserToDelete(user)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
                  <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleEditUser}>
                      <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                          Update the details for {selectedUser?.displayName}.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-name" className="text-right">
                            Name
                          </Label>
                          <Input id="edit-name" name="name" defaultValue={selectedUser?.displayName} className="col-span-3" required/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-email" className="text-right">
                            Email
                          </Label>
                          <Input id="edit-email" name="email" type="email" defaultValue={selectedUser?.email} className="col-span-3" required/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="role" className="text-right">
                                Role
                              </Label>
                               <Select name="role" defaultValue={selectedUser?.role}>
                                <SelectTrigger className="col-span-3" id="role">
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="client">Client</SelectItem>
                                  <SelectItem value="coach">Coach</SelectItem>
                                  <SelectItem value="seller">Seller</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="xp" className="text-right">
                            XP Points
                          </Label>
                          <Input id="xp" name="xp" type="number" defaultValue={selectedUser?.xp || 0} className="col-span-3" required/>
                        </div>
                         {selectedUser?.role === 'client' && (
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="totalSessions" className="text-right">
                                Total Sessions
                              </Label>
                              <Input id="totalSessions" name="totalSessions" type="number" defaultValue={selectedUser?.totalSessions} className="col-span-3" required/>
                            </div>
                         )}
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setIsEditUserOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
            </Card>

            <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete {userToDelete?.displayName}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user's account and remove their data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
