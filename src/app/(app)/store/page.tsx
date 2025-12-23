
'use client';

import { useState } from 'react';
import { ProductCard } from '@/components/product-card';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Loader2, ShoppingCart, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import Image from 'next/image';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function StorePage() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const productsQuery = useMemoFirebase(() => query(collection(firestore, 'products'), orderBy('name')), [firestore]);
  const { data: products, isLoading } = useCollection<Product>(productsQuery);

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
      description: `${quantity} x ${product.name} added.`,
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };
  
  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity: newQuantity } : item));
  };

  const cartTotalXP = cart.reduce((total, item) => total + (item.product.priceXp * item.quantity), 0);
  const cartTotalCash = cart.reduce((total, item) => total + (item.product.priceCash * item.quantity), 0);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Merch Store</h1>
            <p className="text-muted-foreground">Redeem your XP or pay with cash for exclusive gear.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
              <Link href="/store/my-orders">My Orders</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
               <Button>
                <ShoppingCart className="mr-2 h-4 w-4" />
                View Cart 
                {totalItems > 0 && <Badge variant="secondary" className="ml-2">{totalItems}</Badge>}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Your Shopping Cart</SheetTitle>
              </SheetHeader>
              <div className="h-[calc(100%-150px)] overflow-y-auto pr-4">
                {cart.length > 0 ? (
                  <div className="space-y-4 py-4">
                    {cart.map(item => (
                      <div key={item.product.id} className="flex gap-4 items-center">
                        <Image src={item.product.photoUrl} alt={item.product.name} width={64} height={64} className="rounded-md object-cover"/>
                        <div className="flex-1">
                          <p className="font-semibold">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">{item.product.priceXp} XP / ${item.product.priceCash}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}><Minus className="h-4 w-4"/></Button>
                            <span>{item.quantity}</span>
                            <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}><Plus className="h-4 w-4"/></Button>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveFromCart(item.product.id)}><X className="h-4 w-4"/></Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mb-4" />
                    <p>Your cart is empty.</p>
                  </div>
                )}
              </div>
              <SheetFooter>
                <div className="w-full space-y-4">
                  <div className="flex justify-between font-bold">
                    <span>Total XP:</span>
                    <span>{cartTotalXP.toLocaleString()}</span>
                  </div>
                   <div className="flex justify-between font-bold">
                    <span>Total Cash:</span>
                    <span>${cartTotalCash.toFixed(2)} SAR</span>
                  </div>
                  <SheetClose asChild>
                      <Button asChild className="w-full" disabled={cart.length === 0}>
                        <Link href={{ pathname: '/store/checkout', query: { cart: JSON.stringify(cart) }}}>Proceed to Checkout</Link>
                      </Button>
                  </SheetClose>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products?.map((product: Product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
