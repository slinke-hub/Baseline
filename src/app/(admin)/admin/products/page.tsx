
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Trash2, Edit, MoreVertical, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import Image from 'next/image';
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
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { generateImage } from '@/ai/flows/generate-image-flow';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

export default function AdminProductsPage() {
    const { toast } = useToast();
    const { firestore, firebaseApp } = useFirebase();
    const { appUser } = useAuth();
    
    const productsQuery = useMemoFirebase(() => collection(firestore, 'products'), [firestore]);
    const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const isEditing = !!selectedProduct;

    const handleDelete = async (productId: string) => {
        try {
            await deleteDoc(doc(firestore, 'products', productId));
            toast({ title: "Product Deleted", variant: "destructive" });
        } catch (error) {
            toast({ title: "Deletion Failed", variant: "destructive" });
        }
    }

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!appUser) return;
        setIsGenerating(true);

        const formData = new FormData(event.currentTarget);
        const values = Object.fromEntries(formData.entries()) as any;
        const processedValues = {
            ...values,
            priceXp: parseInt(values.priceXp),
            priceCash: parseInt(values.priceCash),
            stock: parseInt(values.stock),
            creatorId: appUser.uid,
        };

        try {
            if (isEditing && selectedProduct) {
                await updateDoc(doc(firestore, 'products', selectedProduct.id), processedValues);
                toast({ title: "Product Updated" });
            } else {
                const prompt = `A professional e-commerce product photo for a "${values.name}", with a clean, white background. The style should be modern and appealing to basketball players.`;
                const { media: imageDataUri } = await generateImage(prompt);
                
                const storage = getStorage(firebaseApp);
                const storageRef = ref(storage, `product-photos/${Date.now()}_${values.name.replace(/\s+/g, '-')}.png`);
                const snapshot = await uploadString(storageRef, imageDataUri, 'data_url');
                const photoUrl = await getDownloadURL(snapshot.ref);

                const newProductData = {
                    ...processedValues,
                    photoUrl,
                };
                await addDoc(collection(firestore, 'products'), newProductData);
                toast({ title: "Product Added" });
            }
            closeForm();
        } catch (error) {
            console.error("Error saving product:", error);
            toast({ title: "Save Failed", variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
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
                    <CardDescription>Add, edit, or delete store products.</CardDescription>
                </div>
                <Button onClick={() => openForm()}><PlusCircle className="mr-2 h-4 w-4" /> Add Product</Button>
            </CardHeader>
            <CardContent>
                {isLoadingProducts ? (
                    <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>XP Price</TableHead>
                                <TableHead>Cash Price</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products?.map(product => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <Image src={product.photoUrl} alt={product.name} width={64} height={64} className="rounded-md object-cover" />
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell>{product.priceXp.toLocaleString()} XP</TableCell>
                                    <TableCell>${product.priceCash.toFixed(2)} SAR</TableCell>
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
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <form onSubmit={handleFormSubmit}>
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                            <DialogDescription>Fill in the details for the product. An image will be auto-generated for new products.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input id="name" name="name" defaultValue={selectedProduct?.name} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="description" className="text-right mt-2">Description</Label>
                                <Textarea id="description" name="description" defaultValue={selectedProduct?.description} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="space-y-2"><Label htmlFor="stock">Stock</Label><Input id="stock" name="stock" type="number" defaultValue={selectedProduct?.stock} required /></div>
                                <div className="space-y-2"><Label htmlFor="priceXp">XP Price</Label><Input id="priceXp" name="priceXp" type="number" defaultValue={selectedProduct?.priceXp} required /></div>
                                <div className="space-y-2"><Label htmlFor="priceCash">Cash Price (SAR)</Label><Input id="priceCash" name="priceCash" type="number" defaultValue={selectedProduct?.priceCash} required /></div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={closeForm}>Cancel</Button>
                            <Button type="submit" disabled={isGenerating}>
                                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : (isEditing ? 'Save Changes' : 'Create Product')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
