
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { UserOrder } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Package, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import placeholderData from '@/lib/placeholder-images.json';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function MyOrdersPage() {
    const { firestore } = useFirebase();
    const { user } = useAuth();

    const ordersQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(collection(firestore, 'users', user.uid, 'orders'), orderBy('createdAt', 'desc'));
    }, [user, firestore]);

    const { data: orders, isLoading } = useCollection<UserOrder>(ordersQuery);
    
    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-8">
                <Button asChild variant="outline" size="icon">
                    <Link href="/store"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
                    <p className="text-muted-foreground">Track your merchandise orders.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>A list of all your past and current orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : orders && orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.map(order => {
                                const productImage = placeholderData.placeholderImages.find(p => p.id === order.productImageId);
                                return (
                                <div key={order.id} className="flex flex-col sm:flex-row items-center gap-4 border p-4 rounded-lg">
                                    {productImage && (
                                        <Image 
                                            src={productImage.imageUrl} 
                                            alt={order.productName}
                                            width={80}
                                            height={80}
                                            className="rounded-md object-cover aspect-square"
                                        />
                                    )}
                                    <div className="flex-1 text-center sm:text-left">
                                        <p className="font-bold">{order.productName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Ordered on {order.createdAt ? format(order.createdAt.toDate(), 'PPP') : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                        {order.paymentMethod === 'xp' ? <Star className="h-4 w-4 text-yellow-400" /> : '$'}
                                        {order.amountPaid.toLocaleString()} {order.paymentMethod === 'xp' ? 'XP' : ''}
                                    </div>
                                    <Badge 
                                        className={
                                            order.status === 'Delivered' ? 'bg-green-500 text-white' : 
                                            order.status === 'Shipped' ? 'bg-blue-500 text-white' : ''
                                        }
                                    >
                                        {order.status}
                                    </Badge>
                                </div>
                            )})}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
                            <Package className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="font-semibold">No Orders Yet</h3>
                            <p className="text-sm">Your purchased items will appear here.</p>
                            <Button asChild variant="link" className="mt-2">
                                <Link href="/store">Go to Store</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
