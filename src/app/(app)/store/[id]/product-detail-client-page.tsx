
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from 'next/link';
import Image from "next/image";
import placeholderData from '@/lib/placeholder-images.json';
import { ArrowLeft, Star, ShoppingCart, Loader2, PackageCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import type { Product, UserOrder } from "@/lib/types";
import { useAuth } from '@/hooks/use-auth';
import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useFirebase, FirestorePermissionError, errorEmitter } from '@/firebase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ProductDetailClientPage({ product }: { product: Product }) {
  const router = useRouter();
  
  const { appUser, user } = useAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async (method: 'xp' | 'cod') => {
    if (!user || !appUser) {
        toast({ title: "Not Logged In", description: "You must be logged in to make a purchase.", variant: 'destructive' });
        return;
    }

    setIsLoading(true);

    const amount = method === 'xp' ? product.priceXp : product.priceCash;
    if (method === 'xp' && (appUser.xp || 0) < amount) {
        toast({ title: "Not Enough XP", description: "You don't have enough XP to purchase this item.", variant: 'destructive' });
        setIsLoading(false);
        return;
    }
    
    const orderData: Omit<UserOrder, 'id' | 'createdAt'> = {
        userId: user.uid,
        productId: product.id,
        productName: product.name,
        productImageId: product.imageId,
        paymentMethod: method,
        amountPaid: amount,
        status: 'Pending',
    };

    try {
        const ordersColRef = collection(firestore, 'users', user.uid, 'orders');
        await addDoc(ordersColRef, { ...orderData, createdAt: serverTimestamp() }).catch(serverError => {
            const permissionError = new FirestorePermissionError({
                path: ordersColRef.path,
                operation: 'create',
                requestResourceData: orderData,
            });
            errorEmitter.emit('permission-error', permissionError);
            throw new Error('Firestore permission denied while creating order.');
        });

        if (method === 'xp') {
            const userDocRef = doc(firestore, 'users', user.uid);
            await updateDoc(userDocRef, {
                xp: increment(-amount)
            });
        }
        
        toast({
            title: "Purchase Successful!",
            description: `${product.name} is on its way.`,
        });

        router.push('/store/my-orders');

    } catch (e) {
        console.error("Purchase failed:", e);
        toast({ title: "Purchase Failed", description: "There was an error processing your order. Please try again.", variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  };

  const productImage = placeholderData.placeholderImages.find(p => p.id === product.imageId);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Link href="/store" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back to Store
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            {productImage && (
                <div className="relative aspect-video w-full">
                <Image
                    src={productImage.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    data-ai-hint={productImage.imageHint}
                />
                </div>
            )}
          </Card>
        </div>
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Separator />
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Price</span>
                            <div className="text-right">
                                <p className="font-bold text-lg flex items-center gap-1 justify-end"><Star className="h-5 w-5 text-yellow-400" /> {product.priceXp.toLocaleString()} XP</p>
                                <p className="text-sm text-muted-foreground">or ${product.priceCash.toFixed(2)} Cash on Delivery</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Your Balance</span>
                            <p className="font-bold text-lg flex items-center gap-1 justify-end"><Star className="h-4 w-4 text-yellow-400" /> {appUser?.xp?.toLocaleString() || 0} XP</p>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="lg" className="w-full" disabled={isLoading || (appUser?.xp || 0) < product.priceXp}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Star className="mr-2 h-4 w-4" />}
                                    Buy with XP
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Purchase with XP?</AlertDialogTitle>
                                    <AlertDialogDescription>This will deduct {product.priceXp.toLocaleString()} XP from your account.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handlePurchase('xp')}>Confirm</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="lg" variant="secondary" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
                                    Cash on Delivery
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Cash on Delivery?</AlertDialogTitle>
                                    <AlertDialogDescription>You will pay ${product.priceCash.toFixed(2)} when the item is delivered.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handlePurchase('cod')}>Confirm</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <PackageCheck className="h-4 w-4 text-green-500" />
                        <span>Ships in 3-5 business days.</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
