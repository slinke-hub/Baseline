
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';
import { mockProducts } from '@/lib/mock-data';
import Image from 'next/image';
import placeholderData from '@/lib/placeholder-images.json';
import type { Product } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetDescription } from '@/components/ui/sheet';

function ProductCard({ product }: { product: Product }) {
  const productImage = placeholderData.placeholderImages.find(p => p.id === product.imageId);
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent link navigation
    toast({
        title: "Added to Cart!",
        description: `${product.name} has been added to your cart.`,
    });
    // In a real app, you would add logic here to update the cart state.
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <Link href={`/store/${product.id}`} className="flex flex-col h-full">
            {productImage && (
            <div className="relative h-64 w-full">
                <Image
                src={productImage.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                data-ai-hint={productImage.imageHint}
                />
            </div>
            )}
            <CardHeader>
                <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
            </CardContent>
        </Link>
        <div className="p-6 pt-0">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400"/>
                    <span className="font-bold">{product.priceXp.toLocaleString()} XP</span>
                </div>
                <Badge variant="secondary">${product.priceCash.toFixed(2)}</Badge>
            </div>
            <Button className="w-full" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
            </Button>
        </div>
    </Card>
  );
}

export default function StorePage() {
  const { appUser, loading } = useAuth();
  // In a real app, products would be fetched from Firestore
  const products = mockProducts;

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
                  <ShoppingCart className="mr-2" /> Cart
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Your Cart</SheetTitle>
                  <SheetDescription>
                    Review items before checkout. (This is a demo)
                  </SheetDescription>
                </SheetHeader>
                <div className="py-8 text-center text-muted-foreground">
                  <p>Your cart is empty.</p>
                </div>
                <SheetFooter>
                  <Button disabled className="w-full">Checkout</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
        </div>
      </div>
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
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
