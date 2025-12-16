
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Trash2, Edit, MoreVertical, Star } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { mockProducts as initialProducts } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import placeholderData from '@/lib/placeholder-images.json';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';

export default function AdminProductsPage() {
    const { toast } = useToast();
    const [products, setProducts] = useState(initialProducts);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const isEditing = !!selectedProduct;

    const handleDelete = (productId: string) => {
        setProducts(current => current.filter(p => p.id !== productId));
        toast({ title: "Product Deleted", description: "The product has been removed from the store.", variant: "destructive" });
    }

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const values = Object.fromEntries(formData.entries()) as any;
        const processedValues = {
            ...values,
            priceXp: parseInt(values.priceXp, 10),
            priceCash: parseFloat(values.priceCash),
        }

        if (isEditing) {
            setProducts(current => current.map(p => p.id === selectedProduct.id ? { ...p, ...processedValues } : p));
            toast({ title: "Product Updated", description: "The product has been successfully updated." });
        } else {
            const newProduct: Product = {
                id: `prod-${Date.now()}`,
                imageId: 'merch-tee', // Default image for new products
                ...processedValues
            };
            setProducts(current => [newProduct, ...current]);
            toast({ title: "Product Added", description: "The new product has been created." });
        }
        closeForm();
    }
    
    const openForm = (product?: Product) => {
        setSelectedProduct(product || null);
        setIsFormOpen(true);
    }
    
    const closeForm = () => {
        setIsFormOpen(false);
        setSelectedProduct(null);
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>Add, edit, or delete store merchandise.</CardDescription>
                </div>
                <Button onClick={() => openForm()}><PlusCircle className="mr-2 h-4 w-4" /> Add Product</Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>XP Price</TableHead>
                            <TableHead>Cash Price</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map(product => {
                            const image = placeholderData.placeholderImages.find(p => p.id === product.imageId);
                            return (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        {image && <Image src={image.imageUrl} alt={product.name} width={64} height={64} className="rounded-md object-cover" data-ai-hint={image.imageHint} />}
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-400" />
                                        {product.priceXp.toLocaleString()}
                                    </TableCell>
                                    <TableCell>${product.priceCash.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openForm(product)}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <div className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive w-full">
                                                            <Trash2 className="mr-2 h-4 w-4" />Delete
                                                        </div>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure you want to delete {product.name}?</AlertDialogTitle>
                                                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-xl">
                    <form onSubmit={handleFormSubmit}>
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                            <DialogDescription>Fill in the details for the merchandise.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input id="name" name="name" defaultValue={selectedProduct?.name} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" defaultValue={selectedProduct?.description} required rows={4} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="priceXp">XP Price</Label>
                                    <Input id="priceXp" name="priceXp" type="number" defaultValue={selectedProduct?.priceXp} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="priceCash">Cash Price ($)</Label>
                                    <Input id="priceCash" name="priceCash" type="number" step="0.01" defaultValue={selectedProduct?.priceCash} required />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={closeForm}>Cancel</Button>
                            <Button type="submit">{isEditing ? 'Save Changes' : 'Create Product'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
