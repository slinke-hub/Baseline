
'use client';

import { ProductDetailClientPage } from "./product-detail-client-page";
import { notFound, useParams } from "next/navigation";
import { useFirebase, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { Product } from "@/lib/types";
import { BasketballLoader } from "@/components/basketball-loader";

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string };
  const { firestore } = useFirebase();

  const productDocRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'products', id);
  }, [firestore, id]);

  const { data: product, isLoading } = useDoc<Product>(productDocRef);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <BasketballLoader />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailClientPage product={product} />;
}
