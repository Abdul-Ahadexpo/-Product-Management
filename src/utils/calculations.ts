import { Product, ProductSummary, ProductCategory } from '../types/Product';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

// Calculate profit or loss for a single product
export const calculateProfitLoss = (product: Product): number => {
  if (!product.isSold || product.soldPrice === undefined) {
    return 0;
  }
  
  return product.soldPrice - product.originalPrice;
};

// Format currency 
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('৳', '') + ' TK';
};

// Calculate profit/loss percentage
export const calculateProfitLossPercentage = (product: Product): number => {
  if (!product.isSold || product.soldPrice === undefined || product.originalPrice === 0) {
    return 0;
  }
  
  return ((product.soldPrice - product.originalPrice) / product.originalPrice) * 100;
};

// Get profit/loss status class for styling
export const getProfitLossStatusClass = (amount: number): string => {
  if (amount > 0) return 'text-green-600';
  if (amount < 0) return 'text-red-600';
  return 'text-gray-600';
};

// Calculate monthly sales data
const calculateMonthlySales = (products: Product[]): Array<{ date: string; sales: number; profit: number }> => {
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    
    const monthlyProducts = products.filter(p => 
      p.isSold && 
      p.soldDate && 
      p.soldDate >= start.getTime() && 
      p.soldDate <= end.getTime()
    );
    
    const sales = monthlyProducts.reduce((sum, p) => sum + (p.soldPrice || 0), 0);
    const profit = monthlyProducts.reduce((sum, p) => sum + calculateProfitLoss(p), 0);
    
    return {
      date: format(date, 'MMM yyyy'),
      sales,
      profit
    };
  }).reverse();
  
  return months;
};

// Get best selling products
const getBestSellers = (products: Product[]): Product[] => {
  return products
    .filter(p => p.isSold && p.soldPrice)
    .sort((a, b) => calculateProfitLoss(b) - calculateProfitLoss(a))
    .slice(0, 5);
};

// Get low stock items
const getLowStockItems = (products: Product[]): Product[] => {
  return products
    .filter(p => !p.isSold && p.quantity <= (p.lowStockThreshold || 5))
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5);
};

// Calculate category breakdown
const getCategoryBreakdown = (products: Product[]): Record<ProductCategory, number> => {
  const breakdown: Record<ProductCategory, number> = {
    Electronics: 0,
    Clothing: 0,
    Accessories: 0,
    Other: 0
  };
  
  products.forEach(product => {
    if (product.category) {
      breakdown[product.category]++;
    } else {
      breakdown.Other++;
    }
  });
  
  return breakdown;
};

// Calculate summary statistics
export const calculateSummary = (products: Product[]): ProductSummary => {
  const soldProducts = products.filter(p => p.isSold);
  const unsoldProducts = products.filter(p => !p.isSold);
  
  const totalInvestment = products.reduce(
    (total, product) => total + (product.originalPrice * product.quantity), 
    0
  );
  
  const totalRevenue = soldProducts.reduce(
    (total, product) => total + (product.soldPrice || 0), 
    0
  );
  
  const totalProfit = soldProducts.reduce(
    (total, product) => total + calculateProfitLoss(product),
    0
  );
  
  const monthlySales = calculateMonthlySales(products);
  const bestSellers = getBestSellers(products);
  const lowStockItems = getLowStockItems(products);
  const categoryBreakdown = getCategoryBreakdown(products);
  
  return {
    totalProducts: products.length,
    soldProducts: soldProducts.length,
    unsoldProducts: unsoldProducts.length,
    totalInvestment,
    totalRevenue,
    totalProfit,
    monthlySales,
    bestSellers,
    lowStockItems,
    categoryBreakdown,
    averagePrice: products.length > 0 ? totalInvestment / products.length : 0,
    lowStockCount: lowStockItems.length
  };
};
