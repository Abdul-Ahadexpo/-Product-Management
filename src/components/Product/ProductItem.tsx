import React, { useState } from 'react';
import { Product } from '../../types/Product';
import { markProductAsSold, deleteProduct, updateProduct } from '../../firebase/productService';
import { 
  calculateProfitLoss, 
  formatCurrency, 
  getProfitLossStatusClass,
  calculateProfitLossPercentage
} from '../../utils/calculations';
import { toast } from 'react-toastify';
import { 
  DollarSign, 
  Trash2, 
  Package, 
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Tag,
  Edit2,
  X
} from 'lucide-react';

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  const [soldPrice, setSoldPrice] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);
  
  const profitLoss = calculateProfitLoss(product);
  const profitLossPercentage = calculateProfitLossPercentage(product);
  const statusClass = getProfitLossStatusClass(profitLoss);
  
  const handleMarkAsSold = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!soldPrice) {
      toast.error('Please enter the sold price');
      return;
    }
    
    setIsSelling(true);
    
    try {
      await markProductAsSold(product.id, parseFloat(soldPrice));
      setIsExpanded(false);
      setSoldPrice('');
      toast.success('Product marked as sold!');
    } catch (error) {
      toast.error('Failed to update product. Please try again.');
      console.error('Error updating product:', error);
    } finally {
      setIsSelling(false);
    }
  };
  
  const handleDeleteProduct = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setIsDeleting(true);
      
      try {
        await deleteProduct(product.id);
        toast.success('Product deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete product. Please try again.');
        console.error('Error deleting product:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProduct(product.id, editedProduct);
      setIsEditing(false);
      toast.success('Product updated successfully!');
    } catch (error) {
      toast.error('Failed to update product. Please try again.');
      console.error('Error updating product:', error);
    }
  };
  
  const isLowStock = !product.isSold && product.quantity <= (product.lowStockThreshold || 5);
  
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${
      product.isSold ? 'bg-gray-50' : isLowStock ? 'border-amber-200 bg-amber-50' : 'hover:shadow-md'
    }`}>
      <div className="p-4">
        {!isEditing ? (
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-2">
              {product.isSold ? (
                <CheckCircle size={20} className="text-green-500 mt-1" />
              ) : isLowStock ? (
                <AlertCircle size={20} className="text-amber-500 mt-1" />
              ) : (
                <Package size={20} className="text-blue-600 mt-1" />
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Quantity: {product.quantity}</span>
                  <span>•</span>
                  <span>Original: {formatCurrency(product.originalPrice)}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Tag size={14} className="mr-1" />
                    {product.category}
                  </span>
                </div>
                {isLowStock && (
                  <p className="text-sm text-amber-600 mt-1 font-medium">
                    Low stock alert! Below threshold of {product.lowStockThreshold}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex space-x-1">
              {!product.isSold && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-white bg-green-600 hover:bg-green-700 rounded p-1 transition-colors"
                    title="Edit Product"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-white bg-blue-600 hover:bg-blue-700 rounded p-1 transition-colors"
                    title="Mark as Sold"
                  >
                    <DollarSign size={16} />
                  </button>
                </>
              )}
              
              <button
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                className="text-white bg-red-600 hover:bg-red-700 rounded p-1 transition-colors"
                title="Delete Product"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Edit Product</h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={editedProduct.name}
                onChange={(e) => setEditedProduct({...editedProduct, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={editedProduct.category}
                onChange={(e) => setEditedProduct({...editedProduct, category: e.target.value as ProductCategory})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="Electronics">Electronics</option>
                <option value="Anime">Anime</option>
                <option value="Accessories">Accessories</option>
                <option value="Toys">Toys</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={editedProduct.quantity}
                  onChange={(e) => setEditedProduct({...editedProduct, quantity: parseInt(e.target.value) || 1})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Price (TK)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editedProduct.originalPrice}
                  onChange={(e) => setEditedProduct({...editedProduct, originalPrice: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Low Stock Threshold
              </label>
              <input
                type="number"
                min="1"
                value={editedProduct.lowStockThreshold}
                onChange={(e) => setEditedProduct({...editedProduct, lowStockThreshold: parseInt(e.target.value) || 1})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
        
        {product.isSold && (
          <div className="mt-3 p-2 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">
                  Sold for: {formatCurrency(product.soldPrice || 0)}
                </p>
                <p className={`${statusClass} text-sm font-medium`}>
                  {profitLoss >= 0 ? 'Profit' : 'Loss'}: {formatCurrency(Math.abs(profitLoss))} 
                  <span className="text-xs ml-1">
                    ({profitLoss >= 0 ? '+' : ''}{profitLossPercentage.toFixed(1)}%)
                  </span>
                </p>
              </div>
              <div className={`rounded-full w-10 h-10 flex items-center justify-center ${
                profitLoss >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {profitLoss >= 0 ? (
                  <CheckCircle size={20} className="text-green-600" />
                ) : (
                  <AlertCircle size={20} className="text-red-600" />
                )}
              </div>
            </div>
          </div>
        )}
        
        {isExpanded && !product.isSold && (
          <div className="mt-3 p-4 bg-gray-50 rounded-md animate-fadeIn">
            <form onSubmit={handleMarkAsSold}>
              <label 
                htmlFor={`soldPrice-${product.id}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sold Price (TK) *
              </label>
              <div className="flex">
                <input
                  id={`soldPrice-${product.id}`}
                  type="number"
                  step="0.01"
                  min="0"
                  value={soldPrice}
                  onChange={(e) => setSoldPrice(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  required
                />
                <button
                  type="submit"
                  disabled={isSelling}
                  className={`bg-green-600 hover:bg-green-700 text-white font-medium px-4 rounded-r-md transition-colors flex items-center ${
                    isSelling ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <ShoppingCart size={16} className="mr-1" />
                  {isSelling ? 'Saving...' : 'Mark as Sold'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
