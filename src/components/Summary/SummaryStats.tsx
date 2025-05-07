import React, { useEffect, useState } from 'react';
import { Product, ProductSummary } from '../../types/Product';
import { getProducts } from '../../firebase/productService';
import { calculateSummary, formatCurrency } from '../../utils/calculations';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingCart, 
  DollarSign,
  BarChart
} from 'lucide-react';

const SummaryStats: React.FC = () => {
  const [summary, setSummary] = useState<ProductSummary>({
    totalProducts: 0,
    soldProducts: 0,
    unsoldProducts: 0,
    totalInvestment: 0,
    totalRevenue: 0,
    totalProfit: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadSummary = () => {
      getProducts((products: Product[]) => {
        const calculatedSummary = calculateSummary(products);
        setSummary(calculatedSummary);
        setIsLoading(false);
      });
    };
    
    loadSummary();
  }, []);
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
        <div className="animate-pulse h-24 flex items-center justify-center">
          <p className="text-gray-500">Loading summary data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
        <BarChart size={20} className="mr-2 text-blue-600" />
        Business Summary
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard
          title="Inventory Status"
          icon={<Package size={18} className="text-blue-500" />}
          mainValue={summary.totalProducts}
          mainLabel="Total Products"
          items={[
            { label: 'In Stock', value: summary.unsoldProducts },
            { label: 'Sold', value: summary.soldProducts }
          ]}
          className="border-blue-100"
        />
        
        <SummaryCard
          title="Financial Overview"
          icon={<DollarSign size={18} className="text-green-500" />}
          mainValue={formatCurrency(summary.totalInvestment)}
          mainLabel="Total Investment"
          items={[
            { label: 'Revenue', value: formatCurrency(summary.totalRevenue) }
          ]}
          className="border-green-100"
        />
        
        <SummaryCard
          title="Profit Analysis"
          icon={summary.totalProfit >= 0 
            ? <TrendingUp size={18} className="text-green-500" /> 
            : <TrendingDown size={18} className="text-red-500" />
          }
          mainValue={formatCurrency(Math.abs(summary.totalProfit))}
          mainLabel={summary.totalProfit >= 0 ? "Total Profit" : "Total Loss"}
          items={[
            { 
              label: 'Profit Margin', 
              value: summary.totalRevenue > 0 
                ? `${((summary.totalProfit / summary.totalRevenue) * 100).toFixed(1)}%` 
                : '0%' 
            }
          ]}
          className={summary.totalProfit >= 0 ? "border-green-100" : "border-red-100"}
          accentColor={summary.totalProfit >= 0 ? "text-green-600" : "text-red-600"}
        />
      </div>
    </div>
  );
};

interface SummaryCardProps {
  title: string;
  icon: React.ReactNode;
  mainValue: string | number;
  mainLabel: string;
  items: Array<{ label: string; value: string | number }>;
  className?: string;
  accentColor?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  icon, 
  mainValue, 
  mainLabel, 
  items,
  className = "",
  accentColor = "text-blue-600"
}) => {
  return (
    <div className={`bg-white rounded-lg border p-4 transition-all duration-300 hover:shadow-md ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="rounded-full bg-gray-100 p-1">
          {icon}
        </div>
      </div>
      
      <div className="mb-3">
        <p className={`text-2xl font-bold ${accentColor}`}>{mainValue}</p>
        <p className="text-xs text-gray-500">{mainLabel}</p>
      </div>
      
      <div className="space-y-1 text-sm">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-gray-600">{item.label}:</span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryStats;