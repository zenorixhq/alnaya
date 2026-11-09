import { products } from "@/data/mockData";
import ProductDetailPageClient from "./ProductDetailPageClient";

export const dynamicParams = true;

export function generateStaticParams() {
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export default function Page({ params }: { params: { slug: string } }) {
  return <ProductDetailPageClient params={params} />;
}
