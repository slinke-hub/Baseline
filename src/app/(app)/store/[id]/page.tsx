import { notFound } from 'next/navigation';
import { ProductDetailClientPage } from "./product-detail-client-page";
import { getAllProducts, getProductById } from '@/lib/firebase-admin-utils';
import type { Product } from "@/lib/types";

// This function tells Next.js which product IDs to generate static pages for at build time.
export async function generateStaticParams() {
  const products = await getAllProducts();
 
  return products.map((product) => ({
    id: product.id,
  }));
}

// This function fetches the data for a specific product page.
async function getProduct(id: string): Promise<Product | null> {
    try {
        const product = await getProductById(id);
        return product;
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        return null;
    }
}


export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClientPage product={product} />;
}