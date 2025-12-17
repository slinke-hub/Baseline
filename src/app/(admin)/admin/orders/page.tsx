
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';
import { collectionGroup, query, where, doc, updateDoc, getDoc, writeBatch, increment } from 'firebase/firestore';
import type { UserOrder, AppUser } from '@/lib/types';
import { Loader2, PackageCheck, Truck, XCircle, Undo2 } from 'lucide-react';
import Image from 'next/image';
import placeholderData from '@/lib/placeholder-images.json';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type OrderWithUser = UserOrder & { user?: AppUser };
type StatusFilter = 'Pending' | 'Shipped' | 'Delivered' | 'Canceled';

function OrdersTable({ statusFilter }: { statusFilter: StatusFilter }) {
    const { toast } = useToast();
    const { firestore } = useFirebase();

    const [orders, setOrders] = useState<OrderWithUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const ordersQuery = query(
        collectionGroup(firestore, 'orders'),
        where('paymentMethod', '==', 'cod'),
        where('status', '==', statusFilter)
    );
    const { data: fetchedOrders, isLoading: isLoadingOrders } = useCollection<UserOrder>(ordersQuery);

    useEffect(() => {
        if (isLoadingOrders || !fetchedOrders) {
            if (!isLoadingOrders) {
                setOrders([]);
                setIsLoading(false);
            }
            return;
        };

        const fetchUsersForOrders = async () => {
            setIsLoading(true);
            const ordersWithUsers = await Promise.all(
                fetchedOrders.map(async (order) => {
                    const userDoc = await getDoc(doc(firestore, 'users', order.userId));
                    return { ...order, user: userDoc.data() as AppUser };
                })
            );
            setOrders(ordersWithUsers);
            setIsLoading(false);
        };

        fetchUsersForOrders();
    }, [fetchedOrders, isLoadingOrders, firestore]);

    const handleUpdateStatus = async (order: UserOrder, newStatus: 'Shipped' | 'Delivered' | 'Canceled') => {
        try {
            const batch = writeBatch(firestore);
            const orderDocRef = doc(firestore, 'users', order.userId, 'orders', order.id);
            const productDocRef = doc(firestore, 'products', order.productId);
            const userDocRef = doc(firestore, 'users', order.userId);

            batch.update(orderDocRef, { status: newStatus });
            
            if (newStatus === 'Delivered') {
                batch.update(productDocRef, { stock: increment(-1) });
            } else if (newStatus === 'Canceled') {
                // If the order was paid with XP, refund it.
                if(order.paymentMethod === 'xp') {
                     batch.update(userDocRef, { xp: increment(order.amountPaid) });
                }
                // If the order was shipped, it's now back in inventory. If it was pending, it never left.
                // We only increment if the delivery was not completed.
                if(order.status !== 'Delivered') {
                    batch.update(productDocRef, { stock: increment(1) });
                }
            }

            await batch.commit();

            toast({
                title: `Order ${newStatus}`,
                description: `Order for ${order.productName} has been updated.`,
            });
        } catch (error) {
            console.error("Error updating order status:", error);
            toast({ title: 'Update Failed', description: 'Could not update order status.', variant: 'destructive' });
        }
    };
    
    const getStatusBadge = (status: UserOrder['status']) => {
        switch(status) {
            case 'Pending': return <Badge variant="destructive">{status}</Badge>;
            case 'Shipped': return <Badge className="bg-blue-500 text-white">{status}</Badge>;
            case 'Delivered': return <Badge className="bg-green-500 text-white">{status}</Badge>;
            case 'Canceled': return <Badge variant="secondary">{status}</Badge>;
        }
    }


    return (
         <>
            {isLoading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length > 0 ? orders.map(order => {
                            const image = placeholderData.placeholderImages.find(p => p.id === order.productImageId);
                            return (
                                <TableRow key={order.id}>
                                    <TableCell className="flex items-center gap-2">
                                        {image && <Image src={image.imageUrl} alt={order.productName} width={40} height={40} className="rounded-md object-cover" />}
                                        <span className="font-medium">{order.productName}</span>
                                    </TableCell>
                                    <TableCell>{order.user?.displayName || 'N/A'}</TableCell>
                                    <TableCell>{order.user?.address || 'N/A'}</TableCell>
                                    <TableCell>${order.amountPaid.toFixed(2)}</TableCell>
                                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {order.status === 'Pending' && (
                                            <>
                                                <Button size="sm" onClick={() => handleUpdateStatus(order, 'Shipped')}>
                                                    <Truck className="mr-2 h-4 w-4" /> Ship
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(order, 'Canceled')}>
                                                    <XCircle className="mr-2 h-4 w-4" /> Cancel
                                                </Button>
                                            </>
                                        )}
                                        {order.status === 'Shipped' && (
                                             <>
                                                <Button size="sm" variant="secondary" onClick={() => handleUpdateStatus(order, 'Delivered')}>
                                                    <PackageCheck className="mr-2 h-4 w-4" /> Deliver
                                                </Button>
                                                 <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(order, 'Canceled')}>
                                                    <XCircle className="mr-2 h-4 w-4" /> Cancel
                                                </Button>
                                            </>
                                        )}
                                        {order.status === 'Canceled' && (
                                             <Button size="sm" variant="outline" disabled>
                                                <Undo2 className="mr-2 h-4 w-4" /> Refunded
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )
                        }) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No {statusFilter.toLowerCase()} orders found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </>
    );
}

export default function AdminOrdersPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Cash on Delivery Orders</CardTitle>
                <CardDescription>Manage and fulfill COD orders.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="Pending">
                    <TabsList>
                        <TabsTrigger value="Pending">Pending</TabsTrigger>
                        <TabsTrigger value="Shipped">Shipped</TabsTrigger>
                        <TabsTrigger value="Delivered">Delivered</TabsTrigger>
                        <TabsTrigger value="Canceled">Canceled</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Pending"><OrdersTable statusFilter="Pending" /></TabsContent>
                    <TabsContent value="Shipped"><OrdersTable statusFilter="Shipped" /></TabsContent>
                    <TabsContent value="Delivered"><OrdersTable statusFilter="Delivered" /></TabsContent>
                    <TabsContent value="Canceled"><OrdersTable statusFilter="Canceled" /></TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
