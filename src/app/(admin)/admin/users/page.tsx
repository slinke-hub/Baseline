
'use client';

import { useState, useEffect, useMemo, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Trash2, Edit, MoreVertical, Eye, Star, User, UserCheck, Loader2, CheckCircle, Key } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
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
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AppUser, Connection } from '@/lib/types';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, collectionGroup, doc, getDoc, getDocs, onSnapshot, query, where, writeBatch, updateDoc, Firestore, setDoc } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';


const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

type PendingRequest = {
    id: string;
    fromUser: AppUser;
    toUser: AppUser;
}

interface EditUserDialogProps {
  user: AppUser | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const EditUserDialog: FC<EditUserDialogProps> = ({ user, isOpen, onOpenChange }) => {
    const { firestore } = useFirebase();
    const { toast } = useToast();

    if (!user) return null;

    const handleEditUserSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        const updatedData = {
            displayName: formData.get('name') as string,
            email: formData.get('email') as string,
            role: formData.get('role') as AppUser['role'],
            totalSessions: parseInt(formData.get('totalSessions') as string, 10) || user.totalSessions,
            xp: parseInt(formData.get('xp') as string, 10) || 0,
        };
        
        const userDocRef = doc(firestore, 'users', user.uid);

        try {
            await updateDoc(userDocRef, updatedData);
            toast({ title: 'User Updated', description: `Updated details for ${updatedData.displayName}.` });
        } catch (error) {
            console.error("Error updating user:", error);
            toast({ title: 'Update Failed', description: 'Could not update user details.', variant: 'destructive' });
        } finally {
            onOpenChange(false);
        }
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleEditUserSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update the details for {user?.displayName}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">Name</Label>
                            <Input id="edit-name" name="name" defaultValue={user?.displayName} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-email" className="text-right">Email</Label>
                            <Input id="edit-email" name="email" type="email" defaultValue={user?.email} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">Role</Label>
                            <Select name="role" defaultValue={user?.role}>
                                <SelectTrigger className="col-span-3" id="role"><SelectValue placeholder="Select a role" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="client">Client</SelectItem>
                                    <SelectItem value="coach">Coach</SelectItem>
                                    <SelectItem value="seller">Seller</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="xp" className="text-right">XP Points</Label>
                            <Input id="xp" name="xp" type="number" defaultValue={user?.xp || 0} className="col-span-3" required />
                        </div>
                        {user?.role === 'client' && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="totalSessions" className="text-right">Total Sessions</Label>
                                <Input id="totalSessions" name="totalSessions" type="number" defaultValue={user?.totalSessions} className="col-span-3" required />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};


function FriendRequests() {
    const { firestore } = useFirebase();
    const { toast } = useToast();
    
    const pendingConnectionsQuery = useMemoFirebase(() => 
        query(collectionGroup(firestore, 'connections'), where('status', '==', 'pending')),
        [firestore]
    );
    const { data: pendingConnections, isLoading: isLoadingConnections } = useCollection<Connection>(pendingConnectionsQuery);

    const usersQuery = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
    const { data: allUsers, isLoading: isLoadingUsers } = useCollection<AppUser>(usersQuery);

    const [requests, setRequests] = useState<PendingRequest[]>([]);

    useEffect(() => {
        if (pendingConnections && allUsers) {
            const userMap = new Map(allUsers.map(u => [u.uid, u]));
            const allRequests: PendingRequest[] = [];
            
            pendingConnections.forEach(connection => {
                // This logic is complex because collectionGroup doesn't give parent doc ID easily.
                // A better approach is often needed for production apps.
            });
        }
    }, [pendingConnections, allUsers]);

    // Re-implementing the data fetching to be more robust
    useEffect(() => {
        if (!firestore || !allUsers || allUsers.length === 0) return;

        const q = query(collectionGroup(firestore, 'connections'), where('status', '==', 'pending'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const userMap = new Map(allUsers.map(u => [u.uid, u]));
            const allRequests: PendingRequest[] = [];
            snapshot.forEach(docSnap => {
                const connection = docSnap.data() as Connection;
                const pathParts = docSnap.ref.path.split('/');
                const userId = pathParts[1];
                const friendId = pathParts[3];

                const userA = userMap.get(userId);
                const userB = userMap.get(friendId);
                
                if (userA && userB) {
                    const fromUser = connection.initiator === userA.uid ? userA : userB;
                    const toUser = connection.initiator === userA.uid ? userB : userA;

                    if (fromUser.uid === connection.initiator) {
                        allRequests.push({ id: `${userA.uid}_${userB.uid}`, fromUser, toUser });
                    }
                }
            });
            const uniqueRequests = Array.from(new Map(allRequests.map(item => [`${item.fromUser.uid}-${item.toUser.uid}`, item])).values());
            setRequests(uniqueRequests);
        });

        return () => unsubscribe();

    }, [firestore, allUsers]);


    const handleAcceptRequest = async (fromUserId: string, toUserId: string) => {
        try {
            const batch = writeBatch(firestore);
            const fromUserRef = doc(firestore, 'users', fromUserId, 'connections', toUserId);
            const toUserRef = doc(firestore, 'users', toUserId, 'connections', fromUserId);

            batch.update(fromUserRef, { status: 'accepted' });
            batch.update(toUserRef, { status: 'accepted' });

            await batch.commit();

            toast({
                title: "Request Accepted",
                description: "The users are now friends.",
            });
        } catch (error) {
            console.error("Error accepting request:", error);
            toast({
                title: "Error",
                description: "Could not accept the friend request.",
                variant: "destructive",
            });
        }
    };
    
    const isLoading = isLoadingConnections || isLoadingUsers;

    if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>All pending friend requests across the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                {requests.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map(req => (
                                <TableRow key={req.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={req.fromUser.photoURL} />
                                                <AvatarFallback>{getInitials(req.fromUser.displayName)}</AvatarFallback>
                                            </Avatar>
                                            <span>{req.fromUser.displayName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={req.toUser.photoURL} />
                                                <AvatarFallback>{getInitials(req.toUser.displayName)}</AvatarFallback>
                                            </Avatar>
                                            <span>{req.toUser.displayName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">Pending</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" onClick={() => handleAcceptRequest(req.fromUser.uid, req.toUser.uid)}>
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Accept
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-center text-muted-foreground py-8">No pending friend requests.</p>
                )}
            </CardContent>
        </Card>
    );
}

export default function AdminUsersPage() {
    const { toast } = useToast();
    const { firestore, auth } = useFirebase();

    const usersQuery = useMemoFirebase(() => query(collection(firestore, 'users')), [firestore]);
    const { data: users, isLoading: isLoadingUsers } = useCollection<AppUser>(usersQuery);

    const [isAddUserOpen, setAddUserOpen] = useState(false);
    const [isEditUserOpen, setIsEditUserOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
    const [userToDelete, setUserToDelete] = useState<AppUser | null>(null);
    const [userToResetPassword, setUserToResetPassword] = useState<AppUser | null>(null);
    const [isAddingUser, setIsAddingUser] = useState(false);

    const handleAddUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsAddingUser(true);
        const formData = new FormData(event.currentTarget);
        const values = Object.fromEntries(formData.entries()) as any;
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password || 'password123');
            const user = userCredential.user;

            await updateProfile(user, { displayName: values.name });

            const userDocRef = doc(firestore, 'users', user.uid);
            const userData: Omit<AppUser, 'uid'> = {
                displayName: values.name,
                email: values.email,
                photoURL: '',
                role: values.role,
                sessionsCompleted: 0,
                totalSessions: 8,
                xp: 0,
            };

            await setDoc(userDocRef, userData);

            toast({
                title: "User Created",
                description: "The new user has been successfully created.",
            });
            setAddUserOpen(false);

            window.location.reload();

        } catch (error: any) {
            console.error("Error creating user:", error);
            toast({
                title: 'Creation Failed',
                description: error.message || 'Could not create user.',
                variant: 'destructive',
            });
        } finally {
            setIsAddingUser(false);
        }
    }
    
    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        const userDocRef = doc(firestore, 'users', userToDelete.uid);

        try {
            const batch = writeBatch(firestore);
            batch.delete(userDocRef);

            await batch.commit();

            toast({
                title: "User Deleted",
                description: "The user has been removed from the Firestore database.",
                variant: "destructive",
            });
            
        } catch (error) {
             toast({
                title: "Deletion Failed",
                description: "Could not delete user. Check permissions.",
                variant: "destructive",
            });
        } finally {
            setUserToDelete(null);
        }
    }

    const handleResetPassword = async () => {
        if (!userToResetPassword) return;

        try {
            await sendPasswordResetEmail(auth, userToResetPassword.email);
            toast({
                title: 'Password Reset Sent',
                description: `A password reset link has been sent to ${userToResetPassword.email}.`
            });
        } catch (error) {
            console.error("Error sending password reset email:", error);
            toast({
                title: 'Error',
                description: 'Could not send password reset email. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setUserToResetPassword(null);
        }
    };

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
            <Tabs defaultValue="clients">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
                        <p className="text-muted-foreground">Manage user profiles and roles.</p>
                    </div>
                    <TabsList>
                        <TabsTrigger value="clients">All Clients</TabsTrigger>
                        <TabsTrigger value="requests">Friend Requests</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="clients">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Client Management</CardTitle>
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
                                      <Input id="name" name="name" placeholder="Ja Morant" className="col-span-3" required/>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="email" className="text-right">
                                        Email
                                      </Label>
                                      <Input id="email" name="email" type="email" placeholder="ja@example.com" className="col-span-3" required/>
                                    </div>
                                     <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="password" className="text-right">
                                        Password
                                      </Label>
                                      <Input id="password" name="password" type="password" placeholder="Temporary password" className="col-span-3" required/>
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
                                    <Button type="submit" disabled={isAddingUser}>
                                        {isAddingUser && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                        Create User
                                    </Button>
                                  </DialogFooter>
                                </form>
                              </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                           {isLoadingUsers ? <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div> :
                            <div className="overflow-x-auto">
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
                                        {users?.map(user => (
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
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => setUserToResetPassword(user)}>
                                                                <Key className="mr-2 h-4 w-4" />Reset Password
                                                            </DropdownMenuItem>
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
                            </div>}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="requests">
                    <FriendRequests />
                </TabsContent>
            </Tabs>
             
            <EditUserDialog 
                user={selectedUser}
                isOpen={isEditUserOpen}
                onOpenChange={setIsEditUserOpen}
            />

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
            <AlertDialog open={!!userToResetPassword} onOpenChange={() => setUserToResetPassword(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reset Password for {userToResetPassword?.displayName}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will send a password reset link to {userToResetPassword?.email}. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetPassword}>Send Reset Link</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

    