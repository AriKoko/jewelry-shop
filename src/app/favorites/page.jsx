"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductGrid from '../../components/ProductGrid';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // טעינת המועדפים מהלוקאל סטורג'
    const loadFavorites = () => {
      try {
        const storedFavorites = JSON.parse(localStorage.getItem('favoriteItems') || '[]');
        console.log('המועדפים שנטענו מאחסון:', storedFavorites);
        setFavorites(storedFavorites || []);
        
        // בדיקה שיש מועדפים
        if (!storedFavorites || storedFavorites.length === 0) {
          setIsLoading(false);
          setProducts([]);
          return;
        }
        
        // טעינת מוצרים מהשרת
        fetch('/api/products')
          .then(response => response.json())
          .then(data => {
            let productsData = data;
            
            // בדיקה אם הנתונים הם אובייקט עם שדה products
            if (data && data.products && Array.isArray(data.products)) {
              productsData = data.products;
            } else if (!Array.isArray(data)) {
              console.error('פורמט הנתונים אינו תקין:', data);
              setError('התקבלו נתונים בפורמט לא תקין מהשרת');
              setProducts([]);
              setIsLoading(false);
              return;
            }
            
            console.log('כל המוצרים שהתקבלו:', productsData.length);
            
            // סינון רק המוצרים שנמצאים ברשימת המועדפים
            const favoriteProducts = productsData.filter(product => {
              console.log('בודק מוצר:', product.id, 'סוג:', typeof product.id);
              
              // בדיקה עם מרווח יותר גדול של אפשרויות התאמה
              const isInFavorites = storedFavorites.some(favId => {
                return String(favId) === String(product._id ?? product.id);
              });
              
              if (isInFavorites) {
                console.log('נמצא מוצר מועדף:', product.name, product.id);
              }
              
              return isInFavorites;
            });
            
            console.log('מוצרים מועדפים שנמצאו:', favoriteProducts.length);
            
            setProducts(favoriteProducts);
            setIsLoading(false);
          })
          .catch(error => {
            console.error('שגיאה בטעינת מוצרים:', error);
            setError('אירעה שגיאה בטעינת המוצרים מהשרת');
            setProducts([]);
            setIsLoading(false);
          });
      } catch (error) {
        console.error('שגיאה בטעינת מועדפים:', error);
        setError('אירעה שגיאה בטעינת המועדפים מהזיכרון המקומי');
        setProducts([]);
        setIsLoading(false);
      }
    };

    loadFavorites();

    // האזנה לשינויים במועדפים
    const handleFavoritesUpdate = () => {
      loadFavorites();
    };

    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    window.addEventListener('storage', handleFavoritesUpdate);
    
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
      window.removeEventListener('storage', handleFavoritesUpdate);
    };
  }, []);

  const clearAllFavorites = () => {
    localStorage.setItem('favoriteItems', '[]');
    setFavorites([]);
    setProducts([]);
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  return (
    <div className="container-custom py-20 mt-16">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2">המועדפים שלי</h1>
          <p className="text-gray-600">
            {favorites.length === 0
              ? 'אין לך עדיין פריטים ברשימת המועדפים'
              : `${favorites.length} פריטים ברשימת המועדפים שלך`}
          </p>
        </div>
        
        {favorites.length > 0 && (
          <button
            onClick={clearAllFavorites}
            className="mt-4 md:mt-0 btn-secondary bg-opacity-10 text-secondary hover:bg-opacity-20 transition"
          >
            ניקוי רשימה
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 text-red-600">
          <p className="font-medium">שגיאה:</p>
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary" role="status">
            <span className="visually-hidden">טוען...</span>
          </div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 text-gray-300">
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium mb-4">רשימת המועדפים שלך ריקה</h2>
          <p className="text-gray-600 mb-6">
            הוסיפי מוצרים לרשימת המועדפים על ידי לחיצה על אייקון הלב בדף המוצר או בקולקציה.
          </p>
          <Link href="/collection" className="btn-primary">
            לקולקציה המלאה
          </Link>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 text-gray-300">
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium mb-4">לא ניתן להציג את המוצרים שבמועדפים</h2>
          <p className="text-gray-600 mb-6">
            יש לך {favorites.length} פריטים במועדפים, אך לא ניתן למצוא אותם במערכת כרגע.
          </p>
          <div className="mb-4 p-4 border border-gray-200 bg-gray-100 rounded-md text-right">
            <p className="font-bold mb-2">מידע לאבחון:</p>
            <p>מזהי המועדפים שנשמרו: {JSON.stringify(favorites)}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/collection" className="btn-primary">
              לקולקציה המלאה
            </Link>
            <button 
              onClick={clearAllFavorites}
              className="btn-outline"
            >
              נקה רשימת מועדפים
            </button>
          </div>
        </div>
      ) : (
        <>
          {Array.isArray(products) && products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-8">
              <p>לא נמצאו מוצרים במועדפים</p>
            </div>
          )}

          <div className="mt-10 text-center">
            <Link href="/collection" className="btn-primary">
              להמשך הקולקציה המלאה
            </Link>
          </div>
        </>
      )}
    </div>
  );
} 