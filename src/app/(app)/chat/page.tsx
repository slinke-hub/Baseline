
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, doc, onSnapshot, addDoc, serverTimestamp, orderBy, Unsubscribe, getDoc } from 'firebase/firestore';
import type { AppUser, Connection, ChatMessage } from '@/lib/types';

// Helper to get initials from a name
const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

// Helper to create a consistent chat ID
const getChatId = (uid1: string, uid2: string) => {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
};

export default function ClientChatPage() {
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const [friends, setFriends] = useState<AppUser[]>([]);
    const [selectedFriend, setSelectedFriend] = useState<AppUser | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoadingFriends, setIsLoadingFriends] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesUnsubscribe = useRef<Unsubscribe | null>(null);

    // Fetch accepted friends
    useEffect(() => {
        if (!user || !firestore) return;
        setIsLoadingFriends(true);

        const connectionsQuery = query(collection(firestore, 'users', user.uid, 'connections'), where('status', '==', 'accepted'));
        
        const unsubscribe = onSnapshot(connectionsQuery, async (snapshot) => {
            const acceptedFriendsIds = snapshot.docs.map(doc => doc.id);
            if (acceptedFriendsIds.length > 0) {
                const usersQuery = query(collection(firestore, 'users'), where('uid', 'in', acceptedFriendsIds));
                const usersSnapshot = await getDocs(usersQuery);
                const friendsData = usersSnapshot.docs.map(d => d.data() as AppUser);
                setFriends(friendsData);
            } else {
                setFriends([]);
            }
            setIsLoadingFriends(false);
        });

        return () => unsubscribe();
    }, [user, firestore]);

    // Fetch messages for the selected chat
    useEffect(() => {
        if (!user || !selectedFriend || !firestore) {
            setMessages([]);
            return;
        }

        setIsLoadingMessages(true);
        const chatId = getChatId(user.uid, selectedFriend.uid);
        const messagesQuery = query(collection(firestore, 'chats', chatId, 'messages'), orderBy('createdAt', 'asc'));

        // Clean up previous listener
        if (messagesUnsubscribe.current) {
            messagesUnsubscribe.current();
        }

        messagesUnsubscribe.current = onSnapshot(messagesQuery, (snapshot) => {
            const msgs = snapshot.docs.map(doc => doc.data() as ChatMessage);
            setMessages(msgs);
            setIsLoadingMessages(false);
        });

        return () => {
            if (messagesUnsubscribe.current) {
                messagesUnsubscribe.current();
            }
        };
    }, [selectedFriend, user, firestore]);
    
    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSelectFriend = (friend: AppUser) => {
        setSelectedFriend(friend);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !selectedFriend) return;

        const chatId = getChatId(user.uid, selectedFriend.uid);
        const messagesColRef = collection(firestore, 'chats', chatId, 'messages');

        await addDoc(messagesColRef, {
            text: newMessage.trim(),
            senderId: user.uid,
            receiverId: selectedFriend.uid,
            createdAt: serverTimestamp(),
        });

        setNewMessage('');
    };

    return (
        <div className="h-[calc(100vh-theme(spacing.20))] md:h-screen flex flex-col p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Chat</h1>
                <p className="text-muted-foreground">Talk with your friends.</p>
            </div>
            <Card className="flex-1 grid grid-cols-1 md:grid-cols-[300px_1fr] neon-border">
                <div className="flex flex-col border-r">
                    <CardHeader>
                        <CardTitle>Friends</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 space-y-1 overflow-y-auto">
                        {isLoadingFriends ? <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin"/></div> :
                         friends.length > 0 ? friends.map(friend => (
                            <button
                                key={friend.uid}
                                className={cn(
                                    "w-full flex items-center gap-3 text-left p-2 rounded-lg transition-colors",
                                    selectedFriend?.uid === friend.uid ? "bg-accent" : "hover:bg-accent/50"
                                )}
                                onClick={() => handleSelectFriend(friend)}
                            >
                                <Avatar>
                                    <AvatarImage src={friend.photoURL} />
                                    <AvatarFallback>{getInitials(friend.displayName)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-semibold truncate">{friend.displayName}</p>
                                </div>
                            </button>
                        )) : <p className="text-center text-sm text-muted-foreground p-4">No friends yet. Go add some!</p>}
                    </CardContent>
                </div>
                {selectedFriend ? (
                    <div className="flex flex-col">
                        <CardHeader className="flex-row items-center gap-3 border-b">
                             <Avatar>
                                <AvatarImage src={selectedFriend.photoURL} />
                                <AvatarFallback>{getInitials(selectedFriend.displayName)}</AvatarFallback>
                            </Avatar>
                            <CardTitle>{selectedFriend.displayName}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-6 space-y-4 overflow-y-auto">
                           {isLoadingMessages ? <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin"/></div> : 
                           messages.map((message, index) => (
                                <div key={index} className={cn(
                                    "flex items-end gap-2",
                                    message.senderId === user?.uid ? 'justify-end' : 'justify-start'
                                )}>
                                    {message.senderId !== user?.uid && <Avatar className="h-8 w-8"><AvatarImage src={selectedFriend.photoURL} /><AvatarFallback>{getInitials(selectedFriend.displayName)}</AvatarFallback></Avatar>}
                                    <div className={cn(
                                        "max-w-xs md:max-w-md rounded-lg px-4 py-2",
                                        message.senderId === user?.uid ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                                    )}>
                                        <p>{message.text}</p>
                                    </div>
                                    {message.senderId === user?.uid && <Avatar className="h-8 w-8"><AvatarImage src={user?.photoURL || undefined} /><AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback></Avatar>}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </CardContent>
                        <div className="p-4 border-t bg-background">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                <Input
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    autoComplete="off"
                                />
                                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">Select a friend to start chatting</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
