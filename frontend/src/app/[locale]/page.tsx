import HomeClient from "@/components/HomeClient";
import { fetchCategories, fetchProducts, type Product } from "@/lib/products";

export default async function HomePage() {
  let products: Product[] = [];
  let categories: string[] = [];
  let error: string | null = null;

  try {
    const [p, c] = await Promise.all([
      fetchProducts({ limit: 500 }),
      fetchCategories(),
    ]);
    products = p;
    categories = c;
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }

  return (
    <HomeClient
      initialProducts={products}
      initialCategories={categories}
      initialError={error}
    />
  );
}
