
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Trash2, Edit, MoreVertical, Eye } from 'lucide-react';
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
  AlertDialogTrigger,
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


// Mock user data for demonstration
const initialUsers = [
    { id: 'user-1', name: 'LeBron James', email: 'lebron@example.com', role: 'client' as const, plan: 'Pro', joined: '2023-10-26' },
    { id: 'user-2', name: 'Stephen Curry', email: 'steph@example.com', role: 'client' as const, plan: 'Pro', joined: '2023-10-25' },
    { id: 'user-3', name: 'Kevin Durant', email: 'kd@example.com', role: 'client' as const, plan: 'Free', joined: '2023-10-24' },
    { id: 'user-4', name: 'Admin User', email: 'admin@baseline.dev', role: 'admin' as const, plan: 'N/A', joined: '2023-10-20' },
    { id: 'user-5', name: 'Zion Williamson', email: 'zion@example.com', role: 'client' as const, plan: 'Pro', joined: '2023-11-01' },
];

type User = typeof initialUsers[0];

export default function AdminUsersPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState(initialUsers);
    const [isAddUserOpen, setAddUserOpen] = useState(false);
    const [isEditUserOpen, setIsEditUserOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        
        const newUser: User = {
            id: `user-${Date.now()}`,
            name,
            email,
            role: 'client',
            plan: 'Free',
            joined: new Date().toISOString().split('T')[0],
        };

        setUsers(currentUsers => [newUser, ...currentUsers]);

        toast({ title: 'User Added', description: `Added new user: ${name} (${email})` });
        setAddUserOpen(false);
    }
    
    const handleDeleteUser = () => {
        if (!userToDelete) return;
        setUsers(currentUsers => currentUsers.filter(user => user.id !== userToDelete.id));
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
        
        setUsers(currentUsers => currentUsers.map(user => 
            user.id === selectedUser.id ? { ...user, name, email } : user
        ));

        toast({ title: 'User Updated', description: `Updated details for ${name}.` });
        setIsEditUserOpen(false);
        setSelectedUser(null);
    }

    const openEditDialog = (user: User) => {
      setSelectedUser(user);
      setIsEditUserOpen(true);
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
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell><Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge></TableCell>
                                    <TableCell>{user.joined}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/schedule?userId=${user.id}`}>
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
                          Update the details for {selectedUser?.name}.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-name" className="text-right">
                            Name
                          </Label>
                          <Input id="edit-name" name="name" defaultValue={selectedUser?.name} className="col-span-3" required/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-email" className="text-right">
                            Email
                          </Label>
                          <Input id="edit-email" name="email" type="email" defaultValue={selectedUser?.email} className="col-span-3" required/>
                        </div>
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
                        <AlertDialogTitle>Are you sure you want to delete {userToDelete?.name}?</AlertDialogTitle>
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
