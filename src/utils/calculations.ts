import { Product, ProductSummary } from '../types/Product';

// Calculate profit or loss for a single product
export const calculateProfitLoss = (product: Product): number => {
  if (!product.isSold || product.soldPrice === undefined) {
    return 0;
  }
  
  return product.soldPrice - product.originalPrice;
};

// Format currency 
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
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

// Calculate summary statistics
export const calculateSummary = (products: Product[]): ProductSummary => {
  const soldProducts = products.filter(p => p.isSold);
  const unsoldProducts = products.filter(p => !p.isSold);
  
  const totalInvestment = products.reduce(
    (total, product) => total + product.originalPrice, 
    0
  );
  
  const totalRevenue = soldProducts.reduce(
    (total, product) => total + (product.soldPrice || 0), 
    0
  );
  
  const totalProfit = totalRevenue - totalInvestment;
  
  return {
    totalProducts: products.length,
    soldProducts: soldProducts.length,
    unsoldProducts: unsoldProducts.length,
    totalInvestment,
    totalRevenue,
    totalProfit
  };
};