'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// NOTE: This uses the same mock data as the admin chat to simulate a conversation
const mockMessages = [
    { sender: 'admin', text: "Steph, let's focus on your shot consistency off the dribble today." },
    { sender: 'client', text: "Got it. How's my form looking?" },
];

const adminProfile = { name: 'Admin Coach', avatar: '/avatars/admin.png' };


export default function ClientChatPage() {
    const { appUser } = useAuth();
    const [messages, setMessages] = useState(mockMessages);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            setMessages([...messages, { sender: 'client', text: newMessage.trim() }]);
            setNewMessage('');
        }
    };
    
    const getInitials = (name?: string | null) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className="flex flex-col h-full p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Chat with your Coach</h1>
                <p className="text-muted-foreground">Ask questions, get feedback, and stay connected.</p>
            </div>
            <Card className="flex-1 flex flex-col">
                <CardHeader className="flex-row items-center gap-3 border-b">
                     <Avatar>
                        <AvatarImage src={adminProfile.avatar} />
                        <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                    <CardTitle>{adminProfile.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {messages.map((message, index) => (
                        <div key={index} className={cn(
                            "flex items-end gap-2",
                            message.sender === 'client' ? 'justify-end' : 'justify-start'
                        )}>
                            {message.sender === 'admin' && <Avatar className="h-8 w-8"><AvatarImage src={adminProfile.avatar} /><AvatarFallback>C</AvatarFallback></Avatar>}
                            <div className={cn(
                                "max-w-xs md:max-w-md rounded-lg px-4 py-2",
                                message.sender === 'client' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                            )}>
                                <p>{message.text}</p>
                            </div>
                            {message.sender === 'client' && <Avatar className="h-8 w-8"><AvatarImage src={appUser?.photoURL} /><AvatarFallback>{getInitials(appUser?.displayName)}</AvatarFallback></Avatar>}
                        </div>
                    ))}
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
            </Card>
        </div>
    );
}
