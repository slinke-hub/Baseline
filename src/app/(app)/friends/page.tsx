'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, getDocs, onSnapshot, query, where, Unsubscribe, DocumentData } from 'firebase/firestore';
import type { AppUser, Connection } from '@/lib/types';
import { Loader2, UserPlus, UserCheck, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

function UserCard({ otherUser, connections, onAdd, onAccept, onCancel }: {
    otherUser: AppUser,
    connections: { [key: string]: Connection },
    onAdd: (id: string) => void,
    onAccept: (id: string) => void,
    onCancel: (id: string) => void,
}) {
    const connection = connections[otherUser.uid];

    const renderButton = () => {
        if (!connection) {
            return <Button onClick={() => onAdd(otherUser.uid)}><UserPlus className="mr-2" />Add Friend</Button>;
        }
        if (connection.status === 'pending') {
             if (connection.initiator === otherUser.uid) { // They sent the request
                return <Button onClick={() => onAccept(otherUser.uid)} variant="secondary" className="bg-green-600 hover:bg-green-700 text-white">Accept Request</Button>;
             }
             return <Button onClick={() => onCancel(otherUser.uid)} variant="outline"><Clock className="mr-2"/>Pending</Button>;
        }
        if (connection.status === 'accepted') {
            return <Button disabled variant="ghost" className="text-green-500"><UserCheck className="mr-2"/>Friends</Button>;
        }
        return null;
    };

    return (
        <Card className="flex items-center p-4">
            <Avatar className="h-12 w-12">
                <AvatarImage src={otherUser.photoURL} alt={otherUser.displayName} />
                <AvatarFallback>{getInitials(otherUser.displayName)}</AvatarFallback>
            </Avatar>
            <div className="ml-4 flex-grow">
                <p className="font-bold">{otherUser.displayName}</p>
                <p className="text-sm text-muted-foreground">{otherUser.email}</p>
            </div>
            {renderButton()}
        </Card>
    );
}

function FriendRequests() {
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [requests, setRequests] = useState<AppUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(firestore, `users/${user.uid}/connections`),
            where('status', '==', 'pending'),
        );
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const pendingConnections = snapshot.docs
              .map(d => ({id: d.id, ...d.data() as Connection}))
              .filter(c => c.initiator !== user.uid);
            
            if (pendingConnections.length > 0) {
              const userIds = pendingConnections.map(c => c.id);
              const usersQuery = query(collection(firestore, 'users'), where('uid', 'in', userIds));
              const usersSnapshot = await getDocs(usersQuery);
              setRequests(usersSnapshot.docs.map(d => d.data() as AppUser));
            } else {
              setRequests([]);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, firestore]);
    
    const handleAccept = async (friendId: string) => {
        if (!user) return;
        // Accept on my side
        await setDoc(doc(firestore, 'users', user.uid, 'connections', friendId), { status: 'accepted' }, { merge: true });
        // Accept on their side
        await setDoc(doc(firestore, 'users', friendId, 'connections', user.uid), { status: 'accepted' }, { merge: true });

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
        // Set pending on my side
        await setDoc(doc(firestore, 'users', user.uid, 'connections', friendId), { status: 'pending', initiator: user.uid });
        // Set pending on their side
        await setDoc(doc(firestore, 'users', friendId, 'connections', user.uid), { status: 'pending', initiator: user.uid });
        toast({ title: 'Friend Request Sent!' });
    };

    const handleAcceptRequest = async (friendId: string) => {
        if (!user) return;
        // Accept on my side
        await setDoc(doc(firestore, 'users', user.uid, 'connections', friendId), { status: 'accepted' }, { merge: true });
        // Accept on their side
        await setDoc(doc(firestore, 'users', friendId, 'connections', user.uid), { status: 'accepted' }, { merge: true });
        toast({ title: 'Friend Added!' });
    };
    
    const handleCancelRequest = async (friendId: string) => {
        if(!user) return;
        await deleteDoc(doc(firestore, 'users', user.uid, 'connections', friendId));
        await deleteDoc(doc(firestore, 'users', friendId, 'connections', user.uid));
        toast({ title: 'Request Cancelled.' });
    };

    const filteredUsers = allUsers
        ?.filter(u => u.uid !== user?.uid)
        .filter(u => {
            if (searchTerm.trim() === '') return true;
            const term = searchTerm.toLowerCase();
            return u.displayName.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
        });
    const isLoading = isLoadingUsers || isLoadingConnections;

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
                                <Button type="submit">
                                    <span className="mr-2">😊</span> Find me
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isLoading ? (
                                <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                            ) : (
                                filteredUsers?.map(otherUser => (
                                    <UserCard
                                        key={otherUser.uid}
                                        otherUser={otherUser}
                                        connections={connections}
                                        onAdd={handleAddFriend}
                                        onAccept={handleAcceptRequest}
                                        onCancel={handleCancelRequest}
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
