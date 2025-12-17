
import { mockProducts } from "@/lib/mock-data";
import { ProductDetailClientPage } from "./product-detail-client-page";
import type { Product } from "@/lib/types";

export async function generateStaticParams() {
  return mockProducts.map((product) => ({
    id: product.id,
  }));
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product: Product | undefined = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
        <div className="p-8 text-center">
            <p>Product not found.</p>
        </div>
    );
  }

  return <ProductDetailClientPage product={product} />;
}
