import React, { useState } from 'react';
import AppLayout from './components/Layout/AppLayout';
import ProductForm from './components/Product/ProductForm';
import ProductList from './components/Product/ProductList';
import SummaryStats from './components/Summary/SummaryStats';
import DashboardStats from './components/Analytics/DashboardStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/Tabs';
import { LayoutGrid, BarChart2 } from 'lucide-react';
import { ProductSummary } from './types/Product';

function App() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'analytics'>('inventory');
  
  // Initialize with default summary data to prevent undefined errors
  const defaultSummary: ProductSummary = {
    monthlySales: [],
    bestSellers: [],
    lowStockItems: [],
    categoryBreakdown: {},
    totalProducts: 0,
    totalValue: 0,
    averagePrice: 0,
    lowStockCount: 0,
    soldProducts: 0,
    unsoldProducts: 0,
    totalInvestment: 0,
    totalRevenue: 0,
    totalProfit: 0
  };

  return (
    <AppLayout>
      <Tabs value={activeTab} onValueChange={(value: 'inventory' | 'analytics') => setActiveTab(value)}>
        <TabsList className="mb-6">
          <TabsTrigger 
            value="inventory" 
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center ${activeTab === 'inventory' ? 'bg-blue-600 text-white' : ''}`}
          >
            <LayoutGrid size={16} className="mr-2" />
            Inventory
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : ''}`}
          >
            <BarChart2 size={16} className="mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className={activeTab === 'inventory' ? 'block' : 'hidden'}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ProductForm />
              <SummaryStats />
            </div>
            <div className="md:col-span-2">
              <ProductList />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className={activeTab === 'analytics' ? 'block' : 'hidden'}>
          <DashboardStats summary={defaultSummary} />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}

export default App;
