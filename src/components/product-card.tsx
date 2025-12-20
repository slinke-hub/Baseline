
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import placeholderData from '@/lib/placeholder-images.json';
import { Button } from './ui/button';
import { Star, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Input } from './ui/input';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const productImage = placeholderData.placeholderImages.find(p => p.id === product.imageId);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent link navigation
    onAddToCart(product, quantity);
    setQuantity(1); // Reset quantity after adding
  };
  
  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 neon-border">
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
            <div className="flex items-center gap-2 mb-4">
                <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                    <Minus className="h-4 w-4" />
                </Button>
                <Input
                    type="number"
                    className="w-16 text-center"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                    min={1}
                />
                 <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <Button className="w-full" onClick={handleAddToCartClick}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
            </Button>
        </div>
    </Card>
  );
}
