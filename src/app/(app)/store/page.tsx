
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, ShoppingCart, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { mockProducts } from '@/lib/mock-data';
import Image from 'next/image';
import placeholderData from '@/lib/placeholder-images.json';
import type { Product, UserOrder } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
} from '@/components/ui/sheet';
import { ProductCard } from '@/components/product-card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
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
import { useFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';


type CartItem = {
  product: Product;
  quantity: number;
};

export default function StorePage() {
  const { appUser, user, loading } = useAuth();
  const { firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  // In a real app, products would be fetched from Firestore
  const products = mockProducts;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleAddToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name} has been added.`
    })
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };
  
  const handleCheckout = async () => {
      if (!user || !appUser) {
          toast({ title: "Not Logged In", description: "You must be logged in to checkout.", variant: 'destructive' });
          return;
      }
      if (cart.length === 0) {
          toast({ title: "Empty Cart", description: "Your cart is empty.", variant: 'destructive' });
          return;
      }

      setIsCheckingOut(true);

      const totalCost = cart.reduce((acc, item) => acc + item.product.priceXp * item.quantity, 0);

      if ((appUser.xp || 0) < totalCost) {
          toast({ title: "Insufficient XP", description: `You need ${totalCost.toLocaleString()} XP but only have ${(appUser.xp || 0).toLocaleString()}.`, variant: 'destructive' });
          setIsCheckingOut(false);
          return;
      }

      try {
          // Create an order for each item in the cart
          const orderPromises = cart.map(item => {
              const orderData: Omit<UserOrder, 'id' | 'createdAt'> = {
                  userId: user.uid,
                  productId: item.product.id,
                  productName: item.product.name,
                  productImageId: item.product.imageId,
                  paymentMethod: 'xp', // Assuming XP payment for this flow
                  amountPaid: item.product.priceXp * item.quantity,
                  status: 'Pending',
              };
              const ordersColRef = collection(firestore, 'users', user.uid, 'orders');
              return addDoc(ordersColRef, { ...orderData, createdAt: serverTimestamp() }).catch(serverError => {
                  const permissionError = new FirestorePermissionError({
                      path: ordersColRef.path,
                      operation: 'create',
                      requestResourceData: orderData,
                  });
                  errorEmitter.emit('permission-error', permissionError);
                  throw new Error(`Firestore permission denied while creating order for ${item.product.name}.`);
              });
          });

          await Promise.all(orderPromises);

          // Deduct XP
          const userDocRef = doc(firestore, 'users', user.uid);
          await updateDoc(userDocRef, {
              xp: increment(-totalCost)
          });
          
          setCart([]);
          toast({
              title: "Checkout Successful!",
              description: `Your order has been placed. You spent ${totalCost.toLocaleString()} XP.`,
          });
          router.push('/store/my-orders');
      } catch (e) {
          console.error("Checkout failed:", e);
          toast({ title: "Checkout Failed", description: "There was an error processing your order. Please try again.", variant: 'destructive' });
      } finally {
          setIsCheckingOut(false);
      }
  };

  const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.product.priceXp * item.quantity, 0);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Merch Store</h1>
          <p className="text-muted-foreground">Rep the brand. Redeem your XP for exclusive gear.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Your Balance</p>
            <p className="font-bold flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400" /> {appUser?.xp?.toLocaleString() || 0} XP</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/store/my-orders">My Orders</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <ShoppingCart className="mr-2" />
                Cart
                {totalItemsInCart > 0 && <Badge className="ml-2">{totalItemsInCart}</Badge>}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
                <SheetDescription>
                  Review items before checkout.
                </SheetDescription>
              </SheetHeader>
              <div className="py-8">
                {cart.length > 0 ? (
                  <div className="space-y-4">
                    {cart.map(item => {
                      const productImage = placeholderData.placeholderImages.find(p => p.id === item.product.imageId);
                      return (
                        <div key={item.product.id} className="flex gap-4">
                          <Image
                            src={productImage?.imageUrl || ''}
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="rounded-md object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-semibold">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} x {item.product.priceXp.toLocaleString()} XP
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveFromCart(item.product.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      )
                    })}
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Subtotal</span>
                      <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400" /> {cartSubtotal.toLocaleString()} XP</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p>Your cart is empty.</p>
                  </div>
                )}
              </div>
              <SheetFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button disabled={cart.length === 0 || isCheckingOut} className="w-full">
                       {isCheckingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Star className="mr-2 h-4 w-4" />}
                      Checkout with XP
                    </Button>
                  </AlertDialogTrigger>
                   <AlertDialogContent>
                      <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Checkout</AlertDialogTitle>
                          <AlertDialogDescription>
                              This will spend a total of <span className="font-bold text-foreground">{cartSubtotal.toLocaleString()}</span> XP. Are you sure you want to proceed?
                          </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleCheckout}>Confirm Purchase</AlertDialogAction>
                      </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Store Coming Soon</h3>
            <p>New merch is dropping soon. Keep grinding to earn more XP!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
