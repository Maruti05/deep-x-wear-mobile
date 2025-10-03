export interface ColorsType {
  code: string;
  name: string;
}

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  discount: number;
  compare_at_price?: string | null;
  category_id: string;
  main_image_url: string;
  image_urls?: string[]; // array of URLs
  sizes: string[];
  colors: ColorsType[];
  stock_quantity: number;
  track_quantity: boolean;
  is_active: boolean;
  is_featured: boolean;
  is_trendy: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at: string;
  updated_at: string;
  calculated_price: number;
}

export interface ProductCardType extends ProductType {
  item?: ProductType;
}
