import React, { useState, useEffect } from 'react';
import { Product } from '../../types/Product';
import { getProducts } from '../../firebase/productService';
import ProductItem from './ProductItem';
import { Package, ShoppingBag } from 'lucide-react';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'sold' | 'unsold'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const loadProducts = () => {
      getProducts((productData) => {
        setProducts(productData);
        setIsLoading(false);
      });
    };
    
    loadProducts();
  }, []);
  
  const filteredProducts = products
    .filter(product => {
      if (filter === 'sold') return product.isSold;
      if (filter === 'unsold') return !product.isSold;
      return true;
    })
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
        <ShoppingBag size={20} className="mr-2 text-blue-600" />
        Product Inventory
      </h2>
      
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="sm:flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        
        <div className="flex">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md border transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unsold')}
            className={`px-4 py-2 text-sm font-medium border-t border-b transition-colors ${
              filter === 'unsold'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            In Stock
          </button>
          <button
            onClick={() => setFilter('sold')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md border transition-colors ${
              filter === 'sold'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Sold
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
          <Package size={40} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600">
            {searchTerm 
              ? 'No products match your search' 
              : filter === 'sold' 
                ? 'No sold products found' 
                : filter === 'unsold' 
                  ? 'No products in stock' 
                  : 'No products found'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {searchTerm 
              ? 'Try a different search term' 
              : 'Add a new product to get started'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductList;