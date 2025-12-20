
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
import { collection, query, where, orderBy, addDoc, serverTimestamp, Unsubscribe, onSnapshot } from 'firebase/firestore';
import type { AppUser, ChatMessage } from '@/lib/types';

const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const getChatId = (uid1: string, uid2: string) => {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
};

export default function AdminChatPage() {
    const { user: adminUser } = useAuth();
    const { firestore } = useFirebase();
    const [selectedClient, setSelectedClient] = useState<AppUser | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesUnsubscribe = useRef<Unsubscribe | null>(null);
    
    const clientsQuery = useMemoFirebase(() => query(collection(firestore, 'users'), where('role', '==', 'client')), [firestore]);
    const { data: clients, isLoading: isLoadingClients } = useCollection<AppUser>(clientsQuery);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (!adminUser || !selectedClient) {
            setMessages([]);
            return;
        }

        setIsLoadingMessages(true);
        const chatId = getChatId(adminUser.uid, selectedClient.uid);
        const messagesQuery = query(collection(firestore, 'chats', chatId, 'messages'), orderBy('createdAt', 'asc'));

        if (messagesUnsubscribe.current) {
            messagesUnsubscribe.current();
        }

        messagesUnsubscribe.current = onSnapshot(messagesQuery, (snapshot) => {
            const msgs = snapshot.docs.map(doc => doc.data() as ChatMessage);
            setMessages(msgs);
            setIsLoadingMessages(false);
        }, (error) => {
            console.error("Error fetching messages:", error);
            setIsLoadingMessages(false);
        });

        return () => {
            if (messagesUnsubscribe.current) {
                messagesUnsubscribe.current();
            }
        };
    }, [selectedClient, adminUser, firestore]);

    const handleSelectClient = (client: AppUser) => {
        setSelectedClient(client);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !adminUser || !selectedClient) return;

        const chatId = getChatId(adminUser.uid, selectedClient.uid);
        await addDoc(collection(firestore, 'chats', chatId, 'messages'), {
            text: newMessage.trim(),
            senderId: adminUser.uid,
            receiverId: selectedClient.uid,
            createdAt: serverTimestamp(),
        });

        setNewMessage('');
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Client Chat</h1>
                <p className="text-muted-foreground">Communicate directly with your clients.</p>
            </div>
            <Card className="flex-1 grid grid-cols-1 md:grid-cols-[300px_1fr]">
                <div className="flex flex-col border-r">
                    <CardHeader>
                        <CardTitle>Clients</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 space-y-1 overflow-y-auto">
                        {isLoadingClients ? <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin"/></div> :
                         clients?.map(client => (
                            <button
                                key={client.uid}
                                className={cn(
                                    "w-full flex items-center gap-3 text-left p-2 rounded-lg transition-colors",
                                    selectedClient?.uid === client.uid ? "bg-accent" : "hover:bg-accent/50"
                                )}
                                onClick={() => handleSelectClient(client)}
                            >
                                <Avatar>
                                    <AvatarImage src={client.photoURL} />
                                    <AvatarFallback>{getInitials(client.displayName)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-semibold truncate">{client.displayName}</p>
                                </div>
                            </button>
                        ))}
                    </CardContent>
                </div>
                {selectedClient ? (
                    <div className="flex flex-col">
                        <CardHeader className="flex-row items-center gap-3 border-b">
                             <Avatar>
                                <AvatarImage src={selectedClient.photoURL} />
                                <AvatarFallback>{getInitials(selectedClient.displayName)}</AvatarFallback>
                            </Avatar>
                            <CardTitle>{selectedClient.displayName}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-6 space-y-4 overflow-y-auto">
                            {isLoadingMessages ? <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin"/></div> :
                             messages.map((message, index) => (
                                <div key={index} className={cn(
                                    "flex items-end gap-2",
                                    message.senderId === adminUser?.uid ? 'justify-end' : 'justify-start'
                                )}>
                                    {message.senderId !== adminUser?.uid && <Avatar className="h-8 w-8"><AvatarImage src={selectedClient.photoURL} /><AvatarFallback>{getInitials(selectedClient.displayName)}</AvatarFallback></Avatar>}
                                    <div className={cn(
                                        "max-w-xs md:max-w-md rounded-lg px-4 py-2",
                                        message.senderId === adminUser?.uid ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                                    )}>
                                        <p>{message.text}</p>
                                    </div>
                                    {message.senderId === adminUser?.uid && <Avatar className="h-8 w-8"><AvatarImage src={adminUser?.photoURL || undefined} /><AvatarFallback>{getInitials(adminUser?.displayName)}</AvatarFallback></Avatar>}
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
                        <p className="text-muted-foreground">Select a client to start chatting</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
