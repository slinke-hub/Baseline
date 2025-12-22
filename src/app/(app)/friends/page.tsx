
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, getDocs, onSnapshot, query, where, writeBatch } from 'firebase/firestore';
import type { AppUser, Connection } from '@/lib/types';
import { Loader2, UserPlus, UserCheck, Clock, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useNotifications } from '@/hooks/use-notifications';

const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

function UserCard({ otherUser, connectionStatus, onAdd, onAccept, onCancel, onRemove }: {
    otherUser: AppUser,
    connectionStatus: { status: 'pending' | 'accepted' | 'none', initiator?: string },
    onAdd: (id: string) => void,
    onAccept: (id: string) => void,
    onCancel: (id: string) => void,
    onRemove: (id: string) => void,
}) {
    const { user } = useAuth();

    const renderButton = () => {
        switch (connectionStatus.status) {
            case 'none':
                return <Button onClick={() => onAdd(otherUser.uid)} size="sm"><Plus className="mr-2 h-4 w-4" />Add</Button>;
            case 'pending':
                if (connectionStatus.initiator === user?.uid) {
                    return <Button onClick={() => onCancel(otherUser.uid)} variant="outline" size="sm"><Clock className="mr-2 h-4 w-4"/>Pending</Button>;
                } else {
                    return <Button onClick={() => onAccept(otherUser.uid)} variant="secondary" size="sm" className="bg-green-600 hover:bg-green-700 text-white">Accept</Button>;
                }
            case 'accepted':
                return <Button onClick={() => onRemove(otherUser.uid)} variant="destructive" size="sm"><UserCheck className="mr-2 h-4 w-4"/>Friends</Button>;
            default:
                return null;
        }
    };

    return (
        <Card className="flex items-center p-3 sm:p-4">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                <AvatarImage src={otherUser.photoURL} alt={otherUser.displayName} />
                <AvatarFallback>{getInitials(otherUser.displayName)}</AvatarFallback>
            </Avatar>
            <div className="ml-3 sm:ml-4 flex-grow overflow-hidden">
                <p className="font-bold text-sm sm:text-base truncate">{otherUser.displayName}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{otherUser.email}</p>
            </div>
            <div className="ml-2 shrink-0">
                {renderButton()}
            </div>
        </Card>
    );
}

function FriendRequests() {
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const { showNotification } = useNotifications();
    const [requests, setRequests] = useState<AppUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(firestore, `users/${user.uid}/connections`),
            where('status', '==', 'pending'),
        );

        let isFirstLoad = true;
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const pendingConnections = snapshot.docs
              .map(d => ({id: d.id, ...d.data() as Connection}))
              .filter(c => c.initiator !== user.uid);
            
            if (pendingConnections.length > 0) {
              const userIds = pendingConnections.map(c => c.id);
              const usersQuery = query(collection(firestore, 'users'), where('uid', 'in', userIds));
              const usersSnapshot = await getDocs(usersQuery);
              const newRequests = usersSnapshot.docs.map(d => d.data() as AppUser)
              setRequests(newRequests);

              if (!isFirstLoad && newRequests.length > requests.length) {
                  const latestRequester = newRequests.find(newUser => !requests.some(oldUser => oldUser.uid === newUser.uid));
                  if(latestRequester) {
                      showNotification('New Friend Request', {
                          body: `${latestRequester.displayName} wants to be your friend!`
                      });
                  }
              }

            } else {
              setRequests([]);
            }
            setIsLoading(false);
            isFirstLoad = false;
        });

        return () => unsubscribe();
    }, [user, firestore, showNotification, requests]);
    
    const handleAccept = async (friendId: string) => {
        if (!user) return;
        const batch = writeBatch(firestore);
        batch.update(doc(firestore, 'users', user.uid, 'connections', friendId), { status: 'accepted' });
        batch.update(doc(firestore, 'users', friendId, 'connections', user.uid), { status: 'accepted' });
        await batch.commit();

        toast({ title: 'Friend Added!' });
    };

    if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    
    return (
        <div className="space-y-4">
            {requests.length > 0 ? requests.map(reqUser => (
                <Card key={reqUser.uid} className="flex items-center p-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={reqUser.photoURL} alt={reqUser.displayName} />
                        <AvatarFallback>{getInitials(reqUser.displayName)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 flex-grow">
                        <p className="font-bold">{reqUser.displayName}</p>
                        <p className="text-sm text-muted-foreground">Wants to be your friend.</p>
                    </div>
                    <Button onClick={() => handleAccept(reqUser.uid)}>Accept</Button>
                </Card>
            )) : (
                <p className="text-center text-muted-foreground py-8">No new friend requests.</p>
            )}
        </div>
    );
}

export default function FriendsPage() {
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const { toast } = useToast();

    const usersQuery = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
    const { data: allUsers, isLoading: isLoadingUsers } = useCollection<AppUser>(usersQuery);

    const [connections, setConnections] = useState<{ [key: string]: Connection }>({});
    const [isLoadingConnections, setIsLoadingConnections] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!user) return;
        setIsLoadingConnections(true);
        const connectionsRef = collection(firestore, 'users', user.uid, 'connections');
        const unsubscribe = onSnapshot(connectionsRef, (snapshot) => {
            const userConnections: { [key: string]: Connection } = {};
            snapshot.forEach(doc => {
                userConnections[doc.id] = doc.data() as Connection;
            });
            setConnections(userConnections);
            setIsLoadingConnections(false);
        });
        return () => unsubscribe();
    }, [user, firestore]);

    const handleAddFriend = async (friendId: string) => {
        if (!user) return;
        const batch = writeBatch(firestore);
        batch.set(doc(firestore, 'users', user.uid, 'connections', friendId), { status: 'pending', initiator: user.uid });
        batch.set(doc(firestore, 'users', friendId, 'connections', user.uid), { status: 'pending', initiator: user.uid });
        await batch.commit();
        toast({ title: 'Friend Request Sent!' });
    };

    const handleAcceptRequest = async (friendId: string) => {
        if (!user) return;
        const batch = writeBatch(firestore);
        batch.update(doc(firestore, 'users', user.uid, 'connections', friendId), { status: 'accepted' });
        batch.update(doc(firestore, 'users', friendId, 'connections', user.uid), { status: 'accepted' });
        await batch.commit();
        toast({ title: 'Friend Added!' });
    };
    
    const handleCancelRequest = async (friendId: string) => {
        if(!user) return;
        const batch = writeBatch(firestore);
        batch.delete(doc(firestore, 'users', user.uid, 'connections', friendId));
        batch.delete(doc(firestore, 'users', friendId, 'connections', user.uid));
        await batch.commit();
        toast({ title: 'Request Cancelled.' });
    };

    const handleRemoveFriend = async (friendId: string) => {
        if(!user) return;
        const batch = writeBatch(firestore);
        batch.delete(doc(firestore, 'users', user.uid, 'connections', friendId));
        batch.delete(doc(firestore, 'users', friendId, 'connections', user.uid));
        await batch.commit();
        toast({ title: 'Friend Removed.', variant: 'destructive' });
    }

    const filteredUsers = useMemo(() => {
        if (!allUsers) return [];
        return allUsers
            .filter(u => u.uid !== user?.uid)
            .filter(u => {
                if (searchTerm.trim() === '') return true;
                const term = searchTerm.toLowerCase();
                return u.displayName.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
            });
    }, [allUsers, user, searchTerm]);

    const isLoading = isLoadingUsers || isLoadingConnections;

    const getConnectionStatus = (otherUserId: string) => {
        const connection = connections[otherUserId];
        if (!connection) {
            return { status: 'none' as const };
        }
        return { status: connection.status, initiator: connection.initiator };
    };

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Find Friends</h1>
                    <p className="text-muted-foreground">Connect with other players on Baseline.</p>
                </div>
                <Button asChild><Link href="/chat">Go to Chat</Link></Button>
            </div>

            <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="all">All Users</TabsTrigger>
                    <TabsTrigger value="requests">Friend Requests</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Users</CardTitle>
                            <CardDescription>Find and add other players.</CardDescription>
                            <div className="flex w-full max-w-sm items-center space-x-2 pt-4">
                                <Input 
                                    type="text" 
                                    placeholder="Search by name or email..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button type="submit">Search</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isLoading ? (
                                <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                            ) : (
                                filteredUsers.map(otherUser => (
                                    <UserCard
                                        key={otherUser.uid}
                                        otherUser={otherUser}
                                        connectionStatus={getConnectionStatus(otherUser.uid)}
                                        onAdd={handleAddFriend}
                                        onAccept={handleAcceptRequest}
                                        onCancel={handleCancelRequest}
                                        onRemove={handleRemoveFriend}
                                    />
                                ))
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="requests">
                     <Card>
                        <CardHeader>
                            <CardTitle>Friend Requests</CardTitle>
                            <CardDescription>Accept incoming friend requests.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FriendRequests />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
    