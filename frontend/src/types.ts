export interface Beer {
  id: string;
  name: string;
  style: string;
  abv: number;
  ibu: number | null;
  description: string;
  imageUrl: string | null;
  price: string;
  stock: number;
  active: boolean;
}

export type OrderStatus = "pendiente" | "confirmado" | "entregado" | "cancelado";

export interface OrderItem {
  id: string;
  orderId: string;
  beerId: string;
  beer: Beer;
  quantity: number;
  unitPrice: string;
}

export interface Order {
  id: string;
  customerName: string;
  address: string;
  zone: string | null;
  preferredTime: string | null;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}
