
'use client';
import { ProductDetailClientPage } from "./product-detail-client-page";
import type { Product } from "@/lib/types";
import { useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { useFirebase } from "@/firebase/provider";
import { Loader2 } from "lucide-react";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { firestore } = useFirebase();

  const productDocRef = useMemoFirebase(() => doc(firestore, 'products', id), [firestore, id]);
  const { data: product, isLoading } = useDoc<Product>(productDocRef);

  if (isLoading) {
    return (
        <div className="flex h-[calc(100vh-80px)] items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  if (!product) {
    return (
        <div className="p-8 text-center">
            <p>Product not found.</p>
        </div>
    );
  }

  return <ProductDetailClientPage product={product} />;
}

    