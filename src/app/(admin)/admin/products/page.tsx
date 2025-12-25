
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Trash2, Edit, MoreVertical, Loader2, MessageSquare } from 'lucide-react';
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
  DropdownMenuSeparator,
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
  AlertDialogTrigger,
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
import { useRouter } from 'next/navigation';

const prefilledProducts: Omit<Product, 'id' | 'photoUrl' | 'creatorId'>[] = [
    {
        name: "Baseline Performance Hoodie",
        description: "Stay warm and ready for action with our premium performance hoodie, featuring the official Baseline logo. Perfect for warm-ups and cool-downs.",
        priceXp: 5000,
        priceCash: 180,
        stock: 50,
    },
    {
        name: "Baseline Tech T-Shirt",
        description: "A lightweight, breathable tech shirt with the Baseline logo. Engineered for comfort and performance during intense training sessions.",
        priceXp: 2500,
        priceCash: 90,
        stock: 100,
    },
    {
        name: "Baseline Snapback Hat",
        description: "Represent the brand on and off the court with this classic snapback hat, featuring a high-quality embroidered Baseline logo.",
        priceXp: 1800,
        priceCash: 70,
        stock: 75,
    },
];

const ADMIN_UID = '96tEClb7y8aUnYxTds2v4pW0b2C2'; // This should be managed in a better way in a real app

export default function AdminProductsPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { firestore, firebaseApp } = useFirebase();
    const { appUser } = useAuth();
    
    const productsQuery = useMemoFirebase(() => collection(firestore, 'products'), [firestore]);
    const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | Partial<Product> | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const isSeller = appUser?.role === 'seller';
    const isEditing = !!(selectedProduct && 'id' in selectedProduct);
    
    const availablePrefills = prefilledProducts.filter(prefill => !products?.some(p => p.name === prefill.name));


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
        if (!appUser || isSeller) return;
        setIsGenerating(true);

        const formData = new FormData(event.currentTarget);
        const values = Object.fromEntries(formData.entries()) as any;
        
        const discountedPriceXp = values.discountedPriceXp ? parseInt(values.discountedPriceXp) : undefined;
        const discountedPriceCash = values.discountedPriceCash ? parseInt(values.discountedPriceCash) : undefined;

        const processedValues: Omit<Product, 'id' | 'photoUrl'> = {
            name: values.name,
            description: values.description,
            priceXp: parseInt(values.priceXp),
            priceCash: parseInt(values.priceCash),
            stock: parseInt(values.stock),
            discountedPriceXp,
            discountedPriceCash,
            creatorId: appUser.uid,
        };

        try {
            if (isEditing && selectedProduct && 'id' in selectedProduct) {
                await updateDoc(doc(firestore, 'products', selectedProduct.id), processedValues);
                toast({ title: "Product Updated" });
            } else {
                const prompt = `A professional e-commerce product photo for a "${values.name}" with the "Baseline" brand logo on it, on a clean, white studio background. The style should be modern and appealing to basketball players.`;
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
    
    const openForm = (product?: Product | Partial<Product> | null) => {
        setSelectedProduct(product || null);
        setIsFormOpen(true);
    }
    
    const closeForm = () => {
        setIsFormOpen(false);
        setSelectedProduct(null);
    }

    const handleRequestChange = () => {
        if (!appUser) return;
        const chatId = appUser.uid < ADMIN_UID ? `${appUser.uid}_${ADMIN_UID}` : `${ADMIN_UID}_${appUser.uid}`;
        // This is a simplified navigation. In a real app, you might want to pre-fill the chat.
        router.push(`/admin/chat?userId=${ADMIN_UID}&message=I would like to request a product change:`);
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>
                        {isSeller ? "View products. Request changes from an admin." : "Add, edit, or delete store products."}
                    </CardDescription>
                </div>
                 {isSeller ? (
                    <Button onClick={handleRequestChange}>
                        <MessageSquare className="mr-2 h-4 w-4" /> Request Change
                    </Button>
                 ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Product</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => openForm(null)}>
                                Create Custom Product
                            </DropdownMenuItem>
                            {availablePrefills.length > 0 && <DropdownMenuSeparator />}
                            {availablePrefills.map(prefill => (
                                <DropdownMenuItem key={prefill.name} onClick={() => openForm(prefill)}>
                                    Add {prefill.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
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
                                <TableHead>Price</TableHead>
                                <TableHead>Discount Price</TableHead>
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
                                    <TableCell>
                                        <div>{product.priceXp.toLocaleString()} XP</div>
                                        <div>${product.priceCash.toFixed(2)} SAR</div>
                                    </TableCell>
                                    <TableCell>
                                         { (product.discountedPriceXp || product.discountedPriceCash) ? (
                                            <>
                                                {product.discountedPriceXp && <div>{product.discountedPriceXp.toLocaleString()} XP</div>}
                                                {product.discountedPriceCash && <div>${product.discountedPriceCash.toFixed(2)} SAR</div>}
                                            </>
                                        ) : 'N/A' }
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" disabled={isSeller}><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
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
                                <div className="space-y-2"><Label htmlFor="priceCash">Cash Price (SAR)</Label><Input id="priceCash" name="priceCash" type="number" step="0.01" defaultValue={selectedProduct?.priceCash} required /></div>
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="discountedPriceXp">Discounted XP Price (Optional)</Label>
                                    <Input id="discountedPriceXp" name="discountedPriceXp" type="number" defaultValue={selectedProduct?.discountedPriceXp} placeholder="e.g., 800" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="discountedPriceCash">Discounted Cash Price (Optional)</Label>
                                    <Input id="discountedPriceCash" name="discountedPriceCash" type="number" step="0.01" defaultValue={selectedProduct?.discountedPriceCash} placeholder="e.g., 49.99" />
                                </div>
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

    