import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ProductSummary, Product } from '../../types/Product';
import { formatCurrency } from '../../utils/calculations';
import { BarChart2, TrendingUp, AlertTriangle, Package } from 'lucide-react';

interface DashboardStatsProps {
  summary: ProductSummary;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ summary }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <BarChart2 className="mr-2 text-blue-600" size={20} />
          Monthly Sales Overview
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={summary.monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#3B82F6" />
              <Line type="monotone" dataKey="profit" stroke="#10B981" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="mr-2 text-green-600" size={20} />
            Best Selling Products
          </h3>
          <div className="space-y-4">
            {summary.bestSellers.map((product) => (
              <div key={product.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    {product.category} • Sold for {formatCurrency(product.soldPrice || 0)}
                  </p>
                </div>
                <div className="text-green-600 font-medium">
                  +{formatCurrency(product.soldPrice! - product.originalPrice)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertTriangle className="mr-2 text-amber-600" size={20} />
            Low Stock Alerts
          </h3>
          <div className="space-y-4">
            {summary.lowStockItems.map((product) => (
              <div key={product.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    {product.category} • {product.quantity} left in stock
                  </p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Restock
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Package className="mr-2 text-blue-600" size={20} />
          Category Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(summary.categoryBreakdown).map(([category, count]) => (
            <div key={category} className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium">{category}</p>
              <p className="text-2xl font-bold text-blue-600">{count}</p>
              <p className="text-sm text-gray-500">products</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;