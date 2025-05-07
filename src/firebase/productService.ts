import { 
  ref, 
  set, 
  push, 
  onValue, 
  update, 
  remove, 
  query, 
  orderByChild 
} from 'firebase/database';
import { database } from './config';
import { Product } from '../types/Product';
import { v4 as uuidv4 } from 'uuid';

const productsRef = ref(database, 'products');

// Create a new product
export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  const timestamp = Date.now();
  const newProductKey = uuidv4();
  
  const newProduct: Product = {
    ...product,
    id: newProductKey,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  
  await set(ref(database, `products/${newProductKey}`), newProduct);
  return newProduct;
};

// Get all products
export const getProducts = (callback: (products: Product[]) => void) => {
  const orderedQuery = query(productsRef, orderByChild('createdAt'));
  
  onValue(orderedQuery, (snapshot) => {
    const products: Product[] = [];
    snapshot.forEach((childSnapshot) => {
      products.push(childSnapshot.val() as Product);
    });
    
    // Sort by most recent first
    products.sort((a, b) => b.createdAt - a.createdAt);
    callback(products);
  });
};

// Update a product
export const updateProduct = async (id: string, updates: Partial<Product>) => {
  const updatedData = {
    ...updates,
    updatedAt: Date.now()
  };
  
  await update(ref(database, `products/${id}`), updatedData);
  return updatedData;
};

// Mark product as sold
export const markProductAsSold = async (id: string, soldPrice: number) => {
  return updateProduct(id, {
    isSold: true,
    soldPrice,
    soldDate: Date.now()
  });
};

// Delete a product
export const deleteProduct = async (id: string) => {
  await remove(ref(database, `products/${id}`));
};