"use client"

import { useState } from 'react'
import ProductCard from './ProductCard'

export default function ProductGrid({ products, isLoading = false, loadingItemsCount = 8 }) {
  const [sortBy, setSortBy] = useState('newest');
  
  // מיון המוצרים לפי הבחירה
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      return priceA - priceB;
    } else if (sortBy === 'price-high') {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      return priceB - priceA;
    } else {
      // מיון לפי הכי חדש (לפי מזהה - בהנחה שמספר גבוה יותר משמעותו מוצר חדש יותר)
      return b.id - a.id;
    }
  });
  
  // יוצר מערך של פריטי טעינה ריקים
  const loadingArray = Array.from({ length: loadingItemsCount }, (_, i) => i);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {loadingArray.map((item) => (
          <div key={item} className="bg-white rounded-lg p-3 sm:p-4 shadow-sm animate-pulse">
            <div className="w-full h-48 sm:h-52 bg-gray-200 rounded-lg mb-3 sm:mb-4"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-9 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }
  
  // אם אין מוצרים
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex p-4 bg-accent/10 text-primary rounded-full mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-medium mb-1">לא נמצאו מוצרים</h3>
        <p className="text-gray-500 text-sm sm:text-base">נסי לשנות את הסינון או לחפש מחדש</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-xl font-medium text-gray-800 mb-3 sm:mb-0">
          {sortedProducts.length} מוצרים
        </h2>
        
        <div className="flex items-center space-x-4 space-x-reverse">
          <label className="text-sm text-gray-600 ml-2">מיין לפי:</label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-lg text-sm px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="newest">הכי חדש</option>
            <option value="price-low">מחיר - מהנמוך לגבוה</option>
            <option value="price-high">מחיר - מהגבוה לנמוך</option>
          </select>
        </div>
      </div>
      
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {sortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">לא נמצאו מוצרים בקטגוריה זו</p>
        </div>
      )}
    </div>
  )
} 