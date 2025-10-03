export type CartItem = {
  product_id: string;
  name: string;
  price: string;
  main_image_url: string;
  size: string;
  color: string;
  quantity: number;
  discount?: number;
  calculated_price: number | 0;
  stock_quantity: number | 0;
  is_trendy?: boolean; // added as you mentioned
};

export type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartItem: (index: number, updatedItem: Partial<CartItem>) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
};
export interface CartItemProps {
  item: CartItem; // Ideally should be your cart item type, e.g. CartItem or ProductType
  i: number;
  selected: boolean;
  onSelect: (index: number) => void;
  updateCartItem: (index: number, changes: Partial<any>) => void; // Replace any with CartItem type
  removeFromCart: (index: number) => void;
}