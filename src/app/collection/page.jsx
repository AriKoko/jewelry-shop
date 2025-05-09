"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { categories } from '../../lib/products';
import { fetchProducts } from '../../lib/api';
import ProductCard from '../../components/ProductCard';
import Link from 'next/link';

// רכיב עבור התוכן של העמוד עם גישה ל-searchParams
function CollectionContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    console.log("דף קולקציות: נטען", { categoryParam, activeCategory });
    
    // עדכון הקטגוריה הפעילה כאשר מתקבל פרמטר בכתובת
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
    
    // מתחיל את מצב הטעינה
    setIsLoading(true);
    setError(null);
    
    // טען מוצרים מה-API במקום ממערך סטטי
    fetchProducts(activeCategory !== 'all' ? activeCategory : null)
      .then(products => {
        console.log(`נטענו ${products.length} מוצרים מה-API`);
        setDisplayedProducts(products);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("שגיאה בטעינת מוצרים:", err);
        setError("שגיאה בטעינת רשימת המוצרים");
        setDisplayedProducts([]);
        setIsLoading(false);
      });
      
  }, [activeCategory, categoryParam]);
  
  // החלפת קטגוריה פעילה
  const handleCategoryChange = (categoryId) => {
    console.log("שינוי קטגוריה:", categoryId);
    setActiveCategory(categoryId);
    // עדכון כתובת ה-URL בלי לרענן את הדף
    const url = categoryId === 'all' 
      ? '/collection' 
      : `/collection?category=${categoryId}`;
    window.history.pushState({}, '', url);
  };
  
  return (
    <div className="container-custom py-24">
      {console.log("RENDER דף קולקציות:", { 
        isLoading, 
        error, 
        productsCount: displayedProducts.length,
        firstProduct: displayedProducts[0] 
      })}
      <div className="mb-8">
        <h1 className="text-3xl font-title text-primary mb-4">הקולקציה שלנו</h1>
        <div className="w-20 h-0.5 bg-primary/30 mb-6"></div>
      </div>
      
      {/* סרגל ניווט קטגוריות */}
      <div className="mb-10 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 pb-2">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all font-medium ${
              activeCategory === 'all'
                ? 'bg-primary text-white shadow-pastel'
                : 'bg-white text-gray-800 hover:bg-primary/10 hover:shadow-sm border border-gray-200 hover:border-primary/30'
            }`}
          >
            הכל
          </button>
          
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all font-medium ${
                  activeCategory === category.id
                    ? 'bg-primary text-white shadow-pastel'
                    : 'bg-white text-gray-800 hover:bg-primary/10 hover:shadow-sm border border-gray-200 hover:border-primary/30'
                }`}
              >
                {category.name}
              </button>
            ))
          ) : (
            <p className="text-gray-500">אין קטגוריות זמינות</p>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow-pastel">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-title text-primary mb-4">שגיאה בטעינת המוצרים</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            נסה שוב
          </button>
        </div>
      ) : displayedProducts && displayedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product, index) => (
            <ProductCard key={product._id || product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center shadow-pastel">
          <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-title text-primary mb-4">אין מוצרים בקטגוריה זו</h2>
          <p className="text-gray-600 mb-6">לא נמצאו מוצרים בקטגוריה שבחרת</p>
          <button 
            onClick={() => handleCategoryChange('all')} 
            className="btn-primary font-medium py-2.5 px-6 rounded-full bg-primary text-white hover:bg-primary-dark transition-all duration-300 shadow-sm hover:shadow-md"
          >
            הצג את כל המוצרים
          </button>
        </div>
      )}
    </div>
  );
}

// פאלבק לתצוגה בזמן טעינה
function CollectionFallback() {
  return (
    <div className="container-custom py-24">
      <div className="mb-8">
        <h1 className="text-3xl font-title text-primary mb-4">הקולקציה שלנו</h1>
        <div className="w-20 h-0.5 bg-primary/30 mb-6"></div>
      </div>
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
}

// רכיב העמוד הראשי עם עטיפת Suspense
export default function CollectionPage() {
  console.log("רנדור דף קולקציות");
  
  return (
    <Suspense fallback={<CollectionFallback />}>
      <CollectionContent />
    </Suspense>
  );
}