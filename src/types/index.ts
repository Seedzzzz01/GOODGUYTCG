// === Product / Set ===
export interface TCGSet {
  id: string;
  name: string;
  slug: string;
  code: string;
  description: string;
  image: string;
  boxCount: number;
  pricePerBox: number;
  stock: number;
  status: "in-stock" | "pre-order" | "sold-out";
  releaseDate: string;
  packsPerBox: number;
  cardsPerPack: number;
  category?: "booster" | "extra" | "premium" | "starter";
  islandTheme: {
    name: string;
    color: string;
    gradient: string;
    description: string;
    arc: string;
    keyCharacters: string[];
  };
}

// === Cart ===
export interface CartItem {
  set: TCGSet;
  quantity: number;
}

// === Gamification ===
export interface BountyRank {
  name: string;
  minSpent: number;
  discount: number;
  icon: string;
  image?: string;
  color: string;
}

export interface SpinReward {
  label: string;
  color: string;
  probability: number;
}

// === Auth / User ===
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  phone: string;
  lineId: string;
  avatarUrl: string;
  totalSpent: number;
  orderCount: number;
  role: "customer" | "admin";
  createdAt: string;
}

// === Address ===
export interface ShippingAddress {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  province: string;
  zipcode: string;
  isDefault: boolean;
}

// === Order ===
export type OrderStatus =
  | "pending"
  | "payment_uploaded"
  | "payment_confirmed"
  | "packing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  discountAmount: number;
  discountRank: string;
  total: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingProvince: string;
  shippingZipcode: string;
  trackingNumber: string;
  paymentMethod: string;
  paymentProofUrl: string;
  note: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productCode: string;
  productImage?: string;
  price: number;
  quantity: number;
}

// === OPTCG API (external) ===
export interface OPTCGCard {
  inventory_price: number | null;
  market_price: number | null;
  card_name: string;
  set_name: string;
  card_text: string;
  set_id: string;
  rarity: string;
  card_set_id: string;
  card_color: string;
  card_type: string;
  life: string | null;
  card_cost: string | null;
  card_power: string | null;
  sub_types: string;
  counter_amount: number | null;
  attribute: string;
  card_image_id: string;
  card_image: string;
}

export interface OPTCGSet {
  set_name: string;
  set_id: string;
}
