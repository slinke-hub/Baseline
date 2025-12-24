
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Package, Star, MoreVertical, Check, Truck, X } from 'lucide-react';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, collectionGroup, doc, updateDoc, writeBatch, query, increment } from 'firebase/firestore';
import type { UserOrder, AppUser } from '@/lib/types';
import Image from 'next/image';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/hooks/use-auth';

function OrderTable({ orders, users, statusFilter, onUpdateStatus }: { 
    orders: UserOrder[], 
    users: AppUser[],
    statusFilter: UserOrder['status'] | 'All', 
    onUpdateStatus: (order: UserOrder, newStatus: UserOrder['status']) => void 
}) {
    const filteredOrders = useMemo(() => {
        if (statusFilter === 'All') return orders;
        return orders.filter(order => order.status === statusFilter);
    }, [orders, statusFilter]);

    const getUserName = (userId: string) => {
        return users.find(u => u.uid === userId)?.displayName || 'Unknown User';
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                    <tr>
                        <th className="p-2">Product</th>
                        <th className="p-2">Customer</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Status</th>
                        <th className="p-2 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map(order => (
                        <tr key={order.id} className="border-t">
                            <td className="p-2">
                                <div className="flex items-center gap-3">
                                    <Image src={order.photoUrl} alt={order.productName} width={40} height={40} className="rounded-md object-cover" />
                                    <span className="font-semibold">{order.productName}</span>
                                </div>
                            </td>
                            <td className="p-2">{getUserName(order.userId)}</td>
                            <td className="p-2">{order.createdAt ? format(order.createdAt.toDate(), 'PPP') : 'N/A'}</td>
                            <td className="p-2">
                                <div className="flex items-center gap-1">
                                    {order.paymentMethod === 'xp' ? <Star className="h-4 w-4 text-yellow-400" /> : '$'}
                                    {order.amountPaid.toLocaleString()}
                                    {order.paymentMethod === 'cod' && ' SAR'}
                                </div>
                            </td>
                            <td className="p-2">
                                <Badge 
                                    className={
                                        order.status === 'Delivered' ? 'bg-green-500' :
                                        order.status === 'Shipped' ? 'bg-blue-500' :
                                        order.status === 'Canceled' ? 'bg-red-500' : ''
                                    }
                                >
                                    {order.status}
                                </Badge>
                            </td>
                            <td className="p-2 text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {order.status === 'Pending' && <DropdownMenuItem onClick={() => onUpdateStatus(order, 'Shipped')}><Truck className="mr-2 h-4 w-4"/>Mark as Shipped</DropdownMenuItem>}
                                        {order.status === 'Shipped' && <DropdownMenuItem onClick={() => onUpdateStatus(order, 'Delivered')}><Check className="mr-2 h-4 w-4"/>Mark as Delivered</DropdownMenuItem>}
                                        {order.status !== 'Canceled' && order.status !== 'Delivered' && <DropdownMenuItem className="text-destructive" onClick={() => onUpdateStatus(order, 'Canceled')}><X className="mr-2 h-4 w-4"/>Cancel Order</DropdownMenuItem>}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default function AdminOrdersPage() {
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const { appUser } = useAuth();

    const ordersQuery = useMemoFirebase(() => query(collectionGroup(firestore, 'orders')), [firestore]);
    const { data: orders, isLoading: isLoadingOrders } = useCollection<UserOrder>(ordersQuery);

    const usersQuery = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
    const { data: users, isLoading: isLoadingUsers } = useCollection<AppUser>(usersQuery);

    const handleUpdateStatus = async (order: UserOrder, newStatus: UserOrder['status']) => {
        try {
            const orderRef = doc(firestore, 'users', order.userId, 'orders', order.id);
            await updateDoc(orderRef, { status: newStatus });

            if(newStatus === 'Canceled' && order.paymentMethod === 'xp') {
                // Refund XP
                const userRef = doc(firestore, 'users', order.userId);
                await updateDoc(userRef, { xp: increment(order.amountPaid) });
                toast({ title: "Order Canceled", description: "XP has been refunded to the user." });
            } else {
                toast({ title: "Order Status Updated", description: `Order marked as ${newStatus}.` });
            }
        } catch (e) {
            console.error(e);
            toast({ title: "Update Failed", description: "Could not update the order status.", variant: 'destructive' });
        }
    }
    
    const isLoading = isLoadingOrders || isLoadingUsers;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Merchandise Orders</h1>
                    <p className="text-muted-foreground">Manage and fulfill customer orders.</p>
                </div>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                    <CardDescription>A list of all orders placed by users.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : orders && users ? (
                        <Tabs defaultValue="All">
                            <TabsList>
                                <TabsTrigger value="All">All</TabsTrigger>
                                <TabsTrigger value="Pending">Pending</TabsTrigger>
                                <TabsTrigger value="Shipped">Shipped</TabsTrigger>
                                <TabsTrigger value="Delivered">Delivered</TabsTrigger>
                                <TabsTrigger value="Canceled">Canceled</TabsTrigger>
                            </TabsList>
                            <TabsContent value="All" className="mt-4">
                                <OrderTable orders={orders} users={users} statusFilter="All" onUpdateStatus={handleUpdateStatus} />
                            </TabsContent>
                            <TabsContent value="Pending" className="mt-4">
                                <OrderTable orders={orders} users={users} statusFilter="Pending" onUpdateStatus={handleUpdateStatus} />
                            </TabsContent>
                             <TabsContent value="Shipped" className="mt-4">
                                <OrderTable orders={orders} users={users} statusFilter="Shipped" onUpdateStatus={handleUpdateStatus} />
                            </TabsContent>
                            <TabsContent value="Delivered" className="mt-4">
                                <OrderTable orders={orders} users={users} statusFilter="Delivered" onUpdateStatus={handleUpdateStatus} />
                            </TabsContent>
                            <TabsContent value="Canceled" className="mt-4">
                                <OrderTable orders={orders} users={users} statusFilter="Canceled" onUpdateStatus={handleUpdateStatus} />
                            </TabsContent>
                        </Tabs>
                    ) : (
                         <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
                            <Package className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="font-semibold">No Orders Yet</h3>
                            <p className="text-sm">Customer orders will appear here.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
