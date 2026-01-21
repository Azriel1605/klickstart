import { Product, PriceLog, Order, User, UserRole, ProductCategory, OrderStatus } from '../types';

// Initial Mock Data
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Budi Santoso', role: UserRole.AGENT, email: 'agent@cropchain.com', balance: 5000000 },
  { id: 'u2', name: 'Restoran Pagi Sore', role: UserRole.BUYER, email: 'buyer@cropchain.com', balance: 10000000 },
  { id: 'u3', name: 'System Admin', role: UserRole.ADMIN, email: 'admin@cropchain.com', balance: 0 },
];

let MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Cabai Rawit Merah Premium',
    category: ProductCategory.VEGETABLES,
    price: 45000,
    stock: 150,
    unit: 'kg',
    location: 'Brebes, Jawa Tengah',
    agentId: 'u1',
    agentName: 'Budi Santoso',
    description: 'Cabai rawit merah segar kualitas super, panen hari ini.',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    name: 'Bawang Merah Brebes',
    category: ProductCategory.VEGETABLES,
    price: 32000,
    stock: 500,
    unit: 'kg',
    location: 'Brebes, Jawa Tengah',
    agentId: 'u1',
    agentName: 'Budi Santoso',
    description: 'Bawang merah lokal, ukuran sedang hingga besar.',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'p3',
    name: 'Mangga Gedong Gincu',
    category: ProductCategory.FRUIT,
    price: 28000,
    stock: 200,
    unit: 'kg',
    location: 'Cirebon, Jawa Barat',
    agentId: 'u1',
    agentName: 'Budi Santoso',
    description: 'Mangga masak pohon, manis dan harum.',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    updatedAt: new Date().toISOString(),
  },
];

let MOCK_PRICE_LOGS: PriceLog[] = [
  {
    id: 'l1',
    productId: 'p1',
    oldPrice: 40000,
    newPrice: 45000,
    changedBy: 'u1',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    reason: 'Kenaikan harga pupuk',
  }
];

let MOCK_ORDERS: Order[] = [];

// Service Class to mimic Backend
export class CropChainService {
  
  static async login(email: string): Promise<User | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_USERS.find(u => u.email === email));
      }, 500);
    });
  }

  static async getProducts(filters?: { category?: string; location?: string; minPrice?: number; maxPrice?: number; search?: string }): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...MOCK_PRODUCTS];
        if (filters) {
          if (filters.category) result = result.filter(p => p.category === filters.category);
          if (filters.location) result = result.filter(p => p.location.includes(filters.location!));
          if (filters.minPrice) result = result.filter(p => p.price >= filters.minPrice!);
          if (filters.maxPrice) result = result.filter(p => p.price <= filters.maxPrice!);
          if (filters.search) {
            const q = filters.search.toLowerCase();
            result = result.filter(p => p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
          }
        }
        resolve(result);
      }, 600); // Simulate network latency
    });
  }

  static async getProductById(id: string): Promise<Product | undefined> {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_PRODUCTS.find(p => p.id === id)), 300));
  }

  static async getAgentProducts(agentId: string): Promise<Product[]> {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_PRODUCTS.filter(p => p.agentId === agentId)), 400));
  }

  // CRITICAL: Manual Pricing Authority Logic
  static async updateProductPrice(productId: string, agentId: string, newPrice: number, reason: string): Promise<Product> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const productIndex = MOCK_PRODUCTS.findIndex(p => p.id === productId);
        if (productIndex === -1) {
          reject("Product not found");
          return;
        }
        
        const product = MOCK_PRODUCTS[productIndex];
        
        // Security check
        if (product.agentId !== agentId) {
          reject("Unauthorized: Only the owner agent can update price.");
          return;
        }

        const oldPrice = product.price;
        
        // Update Product
        const updatedProduct = { ...product, price: newPrice, updatedAt: new Date().toISOString() };
        MOCK_PRODUCTS[productIndex] = updatedProduct;

        // Log Change (Audit Trail)
        const newLog: PriceLog = {
          id: `l${Date.now()}`,
          productId: productId,
          oldPrice: oldPrice,
          newPrice: newPrice,
          changedBy: agentId,
          timestamp: new Date().toISOString(),
          reason: reason
        };
        MOCK_PRICE_LOGS.push(newLog);

        resolve(updatedProduct);
      }, 800);
    });
  }

  static async getPriceHistory(productId: string): Promise<PriceLog[]> {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_PRICE_LOGS.filter(l => l.productId === productId).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())), 400));
  }

  static async createOrder(buyerId: string, productId: string, quantity: number): Promise<Order> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = MOCK_PRODUCTS.find(p => p.id === productId)!;
        const total = product.price * quantity;
        
        const newOrder: Order = {
          id: `ord-${Date.now()}`,
          buyerId,
          agentId: product.agentId,
          totalAmount: total,
          status: OrderStatus.PAID_WAITING_CONFIRMATION, // Simulating Escrow lock immediately
          createdAt: new Date().toISOString(),
          items: [{
            productId: product.id,
            productName: product.name,
            quantity,
            priceAtPurchase: product.price
          }]
        };
        MOCK_ORDERS.push(newOrder);
        resolve(newOrder);
      }, 1000);
    });
  }

  static async getAgentOrders(agentId: string): Promise<Order[]> {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_ORDERS.filter(o => o.agentId === agentId)), 500));
  }
}