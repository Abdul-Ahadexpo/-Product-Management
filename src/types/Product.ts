export type ProductCategory = 'Electronics' | 'Clothing' | 'Accessories' | 'Other';

export interface Product {
  id: string;
  name: string;
  quantity: number;
  originalPrice: number;
  category: ProductCategory;
  isSold: boolean;
  soldPrice?: number;
  soldDate?: number;
  buyerInfo?: string;
  createdAt: number;
  updatedAt: number;
  lowStockThreshold?: number;
}

export interface ProductSummary {
  totalProducts: number;
  soldProducts: number;
  unsoldProducts: number;
  totalInvestment: number;
  totalRevenue: number;
  totalProfit: number;
  monthlySales: {
    date: string;
    sales: number;
    profit: number;
  }[];
  bestSellers: Product[];
  lowStockItems: Product[];
  categoryBreakdown: Record<ProductCategory, number>;
}

export interface SalesHistory {
  productId: string;
  productName: string;
  soldDate: number;
  soldPrice: number;
  originalPrice: number;
  profit: number;
  buyerInfo?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  currency: 'USD' | 'BDT';
  lowStockThreshold: number;
}