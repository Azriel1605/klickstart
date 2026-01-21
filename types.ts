export enum UserRole {
  BUYER = 'BUYER',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  balance: number; // For escrow simulation
}

export enum ProductCategory {
  VEGETABLES = 'Vegetables',
  FRUIT = 'Fruit',
  GRAINS = 'Grains',
  SPICES = 'Spices'
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  unit: string;
  location: string;
  agentId: string;
  agentName: string;
  description: string;
  imageUrl: string;
  updatedAt: string;
}

export interface PriceLog {
  id: string;
  productId: string;
  oldPrice: number;
  newPrice: number;
  changedBy: string; // Agent ID
  timestamp: string;
  reason: string;
}

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID_WAITING_CONFIRMATION = 'PAID_WAITING_CONFIRMATION',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Order {
  id: string;
  buyerId: string;
  agentId: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
}