
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, ShoppingCart, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { mockProducts } from '@/lib/mock-data';
import Image from 'next/image';
import placeholderData from '@/lib/placeholder-images.json';
import type { Product } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetDescription } from '@/components/ui/sheet';
import { ProductCard } from '@/components/product-card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

type CartItem = {
    product: Product;
    quantity: number;
};

export default function StorePage() {
  const { appUser, loading } = useAuth();
  const { toast } = useToast();
  // In a real app, products would be fetched from Firestore
  const products = mockProducts;
  const [cart, setCart] = useState<CartItem[]>([]);

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
                    Review items before checkout. (This is a demo)
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
                           <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400"/> {cartSubtotal.toLocaleString()} XP</span>
                       </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                        <p>Your cart is empty.</p>
                    </div>
                  )}
                </div>
                <SheetFooter>
                  <Button disabled={cart.length === 0} className="w-full">Checkout</Button>
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
