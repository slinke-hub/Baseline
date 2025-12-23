
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useFirebase, FirestorePermissionError, errorEmitter } from '@/firebase';
import { collection, addDoc, serverTimestamp, writeBatch, doc, increment } from 'firebase/firestore';
import type { Product, UserOrder } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CartItem {
  product: Product;
  quantity: number;
}

export function CheckoutPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { appUser, user } = useAuth();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'xp' | 'cod' | null>(null);

    useEffect(() => {
        const cartData = searchParams.get('cart');
        if (cartData) {
            try {
                setCart(JSON.parse(cartData));
            } catch (error) {
                console.error("Failed to parse cart data", error);
                router.push('/store');
            }
        } else {
            router.push('/store');
        }
    }, [searchParams, router]);

    const cartTotalXP = cart.reduce((total, item) => total + (item.product.priceXp * item.quantity), 0);
    const cartTotalCash = cart.reduce((total, item) => total + (item.product.priceCash * item.quantity), 0);
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const handlePlaceOrder = async () => {
        if (!user || !appUser || !paymentMethod) return;
        
        if (paymentMethod === 'xp' && (appUser.xp || 0) < cartTotalXP) {
            toast({ title: "Not Enough XP", description: "You don't have enough XP for this purchase.", variant: 'destructive' });
            return;
        }

        setIsLoading(true);

        const batch = writeBatch(firestore);
        
        for (const item of cart) {
            const orderData: Omit<UserOrder, 'id' | 'createdAt'> = {
                userId: user.uid,
                productId: item.product.id,
                productName: item.product.name,
                photoUrl: item.product.photoUrl,
                paymentMethod: paymentMethod,
                amountPaid: paymentMethod === 'xp' ? item.product.priceXp * item.quantity : item.product.priceCash * item.quantity,
                status: 'Pending',
            };
            const orderRef = doc(collection(firestore, 'users', user.uid, 'orders'));
            batch.set(orderRef, { ...orderData, createdAt: serverTimestamp() });
        }
        
        if (paymentMethod === 'xp') {
            const userRef = doc(firestore, 'users', user.uid);
            batch.update(userRef, { xp: increment(-cartTotalXP) });
        }

        try {
            await batch.commit();
            toast({
                title: "Order Placed!",
                description: "Your order has been successfully placed. You can track it in 'My Orders'.",
            });
            router.push('/store/my-orders');
        } catch (e) {
            console.error("Failed to place order:", e);
            toast({ title: "Order Failed", description: "There was an issue placing your order. Please try again.", variant: 'destructive' });
            setIsLoading(false);
        }
    }

    if (cart.length === 0) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <Link href="/store" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Store
            </Link>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                        <CardDescription>Review the items in your cart.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {cart.map(item => (
                            <div key={item.product.id} className="flex items-center gap-4">
                                <Image src={item.product.photoUrl} alt={item.product.name} width={64} height={64} className="rounded-md object-cover"/>
                                <div className="flex-1">
                                    <p className="font-semibold">{item.product.name}</p>
                                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold flex items-center gap-1 justify-end"><Star className="h-4 w-4 text-yellow-400" /> {(item.product.priceXp * item.quantity).toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground">${(item.product.priceCash * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                        <Separator />
                        <div className="space-y-2 font-medium">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${cartTotalCash.toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between text-muted-foreground text-sm">
                                <span>Shipping</span>
                                <span>FREE</span>
                            </div>
                            <Separator />
                             <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>${cartTotalCash.toFixed(2)} SAR</span>
                            </div>
                            <div className="text-center text-muted-foreground pt-2">
                                or pay with <span className="font-bold text-yellow-400">{cartTotalXP.toLocaleString()} XP</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Payment & Shipping</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2">Shipping Address</h3>
                            <div className="p-4 border rounded-md bg-secondary text-muted-foreground">
                                {appUser?.address ? <p>{appUser.address}</p> : <p>No address on file. <Link href="/profile/edit" className="text-primary underline">Add one now</Link>.</p>}
                            </div>
                        </div>
                         <div>
                            <h3 className="font-semibold mb-2">Select Payment Method</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <Button 
                                    variant={paymentMethod === 'xp' ? 'default' : 'outline'} 
                                    onClick={() => setPaymentMethod('xp')} 
                                    disabled={(appUser?.xp || 0) < cartTotalXP}
                                >
                                    Use {cartTotalXP.toLocaleString()} XP
                                </Button>
                                <Button variant={paymentMethod === 'cod' ? 'default' : 'outline'} onClick={() => setPaymentMethod('cod')}>
                                    Cash on Delivery
                                </Button>
                            </div>
                            {(appUser?.xp || 0) < cartTotalXP && paymentMethod !== 'cod' && (
                                <p className="text-xs text-destructive mt-2 text-center">Not enough XP to make this purchase.</p>
                            )}
                        </div>
                        <Button 
                            size="lg" 
                            className="w-full" 
                            disabled={!paymentMethod || isLoading || !appUser?.address}
                            onClick={handlePlaceOrder}
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : 'Place Order'}
                        </Button>
                        {!appUser?.address && <p className="text-xs text-destructive text-center">Please add a shipping address to your profile before placing an order.</p>}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
