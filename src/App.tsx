import React from 'react';
import AppLayout from './components/Layout/AppLayout';
import ProductForm from './components/Product/ProductForm';
import ProductList from './components/Product/ProductList';
import SummaryStats from './components/Summary/SummaryStats';

function App() {
  return (
    <AppLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ProductForm />
          <SummaryStats />
        </div>
        <div className="md:col-span-2">
          <ProductList />
        </div>
      </div>
    </AppLayout>
  );
}

export default App;