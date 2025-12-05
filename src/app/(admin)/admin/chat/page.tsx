'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockClients = [
    { id: 'user-1', name: 'LeBron James', avatar: '/avatars/lebron.png', lastMessage: "Thanks, coach! I'll work on it.", lastMessageTime: "5m ago"},
    { id: 'user-2', name: 'Stephen Curry', avatar: '/avatars/steph.png', lastMessage: "Got it. How's my form looking?", lastMessageTime: "1h ago" },
    { id: 'user-3', name: 'Kevin Durant', avatar: '/avatars/kd.png', lastMessage: "Can we reschedule for Friday?", lastMessageTime: "3h ago"},
];

const mockMessages = {
    'user-1': [
        { sender: 'client', text: "Hey coach, what's the focus for today?" },
        { sender: 'admin', text: "We're working on post moves. Get ready to dominate the paint!" },
        { sender: 'client', text: "Thanks, coach! I'll work on it." },
    ],
    'user-2': [
        { sender: 'admin', text: "Steph, let's focus on your shot consistency off the dribble today." },
        { sender: 'client', text: "Got it. How's my form looking?" },
    ],
    'user-3': [
        { sender: 'client', text: "Can we reschedule for Friday?" },
    ],
};

export default function AdminChatPage() {
    const [selectedClient, setSelectedClient] = useState(mockClients[0]);
    const [messages, setMessages] = useState(mockMessages[selectedClient.id as keyof typeof mockMessages] || []);
    const [newMessage, setNewMessage] = useState('');

    const handleSelectClient = (client: typeof mockClients[0]) => {
        setSelectedClient(client);
        setMessages(mockMessages[client.id as keyof typeof mockMessages] || []);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            setMessages([...messages, { sender: 'admin', text: newMessage.trim() }]);
            setNewMessage('');
        }
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
                    <CardContent className="p-2 space-y-1">
                        {mockClients.map(client => (
                            <button
                                key={client.id}
                                className={cn(
                                    "w-full flex items-center gap-3 text-left p-2 rounded-lg transition-colors",
                                    selectedClient.id === client.id ? "bg-accent" : "hover:bg-accent/50"
                                )}
                                onClick={() => handleSelectClient(client)}
                            >
                                <Avatar>
                                    <AvatarImage src={client.avatar} />
                                    <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-semibold truncate">{client.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{client.lastMessage}</p>
                                </div>
                                <span className="text-xs text-muted-foreground">{client.lastMessageTime}</span>
                            </button>
                        ))}
                    </CardContent>
                </div>
                <div className="flex flex-col">
                    <CardHeader className="flex-row items-center gap-3 border-b">
                         <Avatar>
                            <AvatarImage src={selectedClient.avatar} />
                            <AvatarFallback>{selectedClient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{selectedClient.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-6 space-y-4 overflow-y-auto">
                        {messages.map((message, index) => (
                            <div key={index} className={cn(
                                "flex items-end gap-2",
                                message.sender === 'admin' ? 'justify-end' : 'justify-start'
                            )}>
                                {message.sender === 'client' && <Avatar className="h-8 w-8"><AvatarImage src={selectedClient.avatar} /><AvatarFallback>{selectedClient.name.charAt(0)}</AvatarFallback></Avatar>}
                                <div className={cn(
                                    "max-w-xs md:max-w-md rounded-lg px-4 py-2",
                                    message.sender === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                                )}>
                                    <p>{message.text}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <div className="p-4 border-t">
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
            </Card>
        </div>
    );
}
