
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, useCollection } from '@/firebase';
import { collectionGroup, query, where, doc, updateDoc, getDoc, writeBatch, increment } from 'firebase/firestore';
import type { UserOrder, AppUser, Product } from '@/lib/types';
import { Loader2, PackageCheck, Truck } from 'lucide-react';
import Image from 'next/image';
import placeholderData from '@/lib/placeholder-images.json';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type OrderWithUser = UserOrder & { user?: AppUser };

export default function AdminOrdersPage() {
    const { toast } = useToast();
    const { firestore } = useFirebase();

    const [orders, setOrders] = useState<OrderWithUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<'Pending' | 'Shipped' | 'Delivered'>('Pending');

    const ordersQuery = query(
        collectionGroup(firestore, 'orders'),
        where('paymentMethod', '==', 'cod'),
        where('status', '==', statusFilter)
    );
    const { data: fetchedOrders, isLoading: isLoadingOrders } = useCollection<UserOrder>(ordersQuery);

    useEffect(() => {
        if (isLoadingOrders || !fetchedOrders) return;

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

    const handleUpdateStatus = async (order: UserOrder, newStatus: 'Shipped' | 'Delivered') => {
        try {
            const orderDocRef = doc(firestore, 'users', order.userId, 'orders', order.id);
            const batch = writeBatch(firestore);

            batch.update(orderDocRef, { status: newStatus });
            
            if(newStatus === 'Delivered') {
                const productDocRef = doc(firestore, 'products', order.productId);
                batch.update(productDocRef, { stock: increment(-1) });
            }

            await batch.commit();

            toast({
                title: `Order ${newStatus}`,
                description: `Order for ${order.productName} has been marked as ${newStatus.toLowerCase()}.`,
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
        }
    }


    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Cash on Delivery Orders</CardTitle>
                    <CardDescription>Manage and fulfill COD orders.</CardDescription>
                </div>
                <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
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
                                                <Button size="sm" onClick={() => handleUpdateStatus(order, 'Shipped')}>
                                                    <Truck className="mr-2 h-4 w-4" /> Ship
                                                </Button>
                                            )}
                                            {order.status === 'Shipped' && (
                                                <Button size="sm" variant="secondary" onClick={() => handleUpdateStatus(order, 'Delivered')}>
                                                    <PackageCheck className="mr-2 h-4 w-4" /> Deliver
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
            </CardContent>
        </Card>
    );
}
