import { supabase } from "@/app/lib/supabase";
import { ProductType } from "@/app/types/ProductType";

// Fetch multiple products with optional filters
export async function getProducts(options?: {
  categoryId?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
}): Promise<ProductType[]> {
  let query = supabase.from("products").select("*").eq("is_active", true);

  if (options?.categoryId) query = query.eq("category_id", options.categoryId);
  if (options?.featured) query = query.eq("is_featured", true);
  if (options?.search) query = query.ilike("name", `%${options.search}%`);

  query = query.order("created_at", { ascending: false }).limit(options?.limit || 50);

  const { data, error } = await query;
  if (error) throw error;

  return data as ProductType[];
}

// Fetch a single product by slug
export async function getProductBySlug(slug: string): Promise<ProductType | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) throw error;
  return data as ProductType;
}

// Fetch a single product along with its category
export async function getProductWithCategory(productId: string) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories(*)
    `)
    .eq("id", productId)
    .single();

  if (error) throw error;
  return data;
}

// Fetch a single product by ID
export async function getProductById(productId: string): Promise<ProductType | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error) throw error;
  return data as ProductType;
}
