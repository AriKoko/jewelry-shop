"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import AddToCartButton from './AddToCartButton'
import ImageWithFallback from './ImageWithFallback'

export default function ProductCard({ product, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // פונקציה להחזרת אייקון לפי קטגוריה כשאין תמונה
  const getCategoryIcon = () => {
    switch (product.category) {
      case 'necklaces':
        return (
          <svg className="h-12 w-12 mx-auto text-primary/60 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 15a2 2 0 100-6m-7-7a7 7 0 103 13.83M5 15a2 2 0 110-6" />
          </svg>
        );
      case 'bracelets':
        return (
          <svg className="h-12 w-12 mx-auto text-accent/60 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16a4 4 0 100-8 4 4 0 000 8z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'face_masks':
        return (
          <svg className="h-12 w-12 mx-auto text-green-400/60 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 10v3m0 0v3m0-3h3m-3 0H7m6-3v3m0 0v3m0-3h3m-3 0h-3" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
          </svg>
        );
      case 'phone_stickers':
        return (
          <svg className="h-12 w-12 mx-auto text-blue-400/60 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="h-12 w-12 mx-auto text-gray-400/60 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
    }
  };
  
  // בדיקה אם המוצר במועדפים בעת הטעינה
  useEffect(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favoriteItems') || '[]');
      const prodId = product._id ?? product.id;
      setIsFavorite(favorites.some(id => String(id) === String(prodId)));
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
  }, [product._id, product.id]);
  
  const handleQuickAdd = (e) => {
    e.preventDefault(); // מניעת ניווט לעמוד המוצר
    setIsAddingToCart(true);
    
    // הוספת המוצר לעגלה
    try {
      // קרא את העגלה הנוכחית מה-localStorage
      const cartItems = localStorage.getItem('cartItems');
      const currentCart = cartItems ? JSON.parse(cartItems) : [];
      
      // שימוש במזהה אמיתי של המוצר (_id או id). אם אין – נ fallback לשם.
      const productId = product._id || product.id || `${product.name}-${product.category || ''}`;
      const productName = product.name;
      const productCategory = product.category || null;
      
      // פונקציה לבדיקת התאמה מדויקת של מוצר בעגלה
      const isSameProduct = (item) => {
        if (item.id === productId) {
          return item.name === productName && 
                 (item.category === productCategory || (!item.category && !productCategory));
        }
        return false;
      };
      
      // בדוק אם המוצר כבר קיים בעגלה
      const existingItemIndex = currentCart.findIndex(isSameProduct);
      
      let updatedCart;
      if (existingItemIndex >= 0) {
        // עדכן כמות אם המוצר כבר קיים
        updatedCart = currentCart.map(item => {
          if (isSameProduct(item)) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      } else {
        // הוסף מוצר חדש
        const newItem = {
          id: productId,
          name: productName,
          price: product.discountPrice || product.price,
          image: product.image || '/images/placeholders/product-placeholder.jpg',
          quantity: 1,
          category: productCategory
        };
        updatedCart = [...currentCart, newItem];
      }
      
      // שמור את העגלה המעודכנת
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      
      // עדכון אירוע storage כדי שה-Header יעודכן
      window.dispatchEvent(new Event('storage'));
      
      // הצג אנימציה קטנה
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAddingToCart(false);
    }
  };
  
  const toggleFavorite = (e) => {
    e.preventDefault(); // מניעת ניווט לעמוד המוצר
    
    try {
      // קרא את המועדפים הנוכחיים מה-localStorage
      const favorites = JSON.parse(localStorage.getItem('favoriteItems') || '[]');
      const prodId = product._id ?? product.id;
      let updatedFavorites;
      if (isFavorite) {
        updatedFavorites = favorites.filter(id => String(id) !== String(prodId));
      } else {
        updatedFavorites = [...new Set([...favorites, prodId])];
      }
      
      // שמור את המועדפים המעודכנים
      localStorage.setItem('favoriteItems', JSON.stringify(updatedFavorites));
      
      // עדכן את המצב המקומי
      setIsFavorite(!isFavorite);
      
      // שלח אירוע לעדכן רכיבים אחרים
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };
  
  // חישוב השהיה לאנימציית כניסה בהתאם לאינדקס
  const getAnimationDelay = () => `${100 + (index * 50)}ms`;
  
  return (
    <div
      className="relative rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={(e)=>{
        const rect=e.currentTarget.getBoundingClientRect();
        const x=e.clientX-rect.left;
        const y=e.clientY-rect.top;
        e.currentTarget.style.setProperty('--x',`${x}px`);
        e.currentTarget.style.setProperty('--y',`${y}px`);
      }}
      style={{ 
        animationDelay: `${index * 0.1}s`,
        opacity: 0,
        animation: 'fadeInUp 0.5s forwards'
      }}
    >
      <div className="card-glow absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      <Link 
        href={`/collection/${product._id || product.id}`} 
        className="block focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-opacity-50 rounded-xl overflow-hidden"
      >
        <div className="relative h-40 xs:h-48 sm:h-56 overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-gray-400"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
                <p className="mt-2 text-xs sm:text-sm text-gray-500">אין תמונה</p>
              </div>
            </div>
          )}
          
          {/* תג קטגוריה */}
          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 text-primary-dark px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium shadow-sm">
            {product.category === 'necklaces' ? 'שרשראות' : 
             product.category === 'bracelets' ? 'צמידים' : 
             product.category === 'face_masks' ? 'מסכות פנים' : 
             product.category === 'phone_stickers' ? 'מדבקות לטלפון' : 'אחר'}
          </span>
          
          {/* תג מחיר */}
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-primary text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-md">
            ₪{product.price}
          </div>
        </div>
        
        <div className="p-3 sm:p-4">
          <h3 className="text-sm sm:text-lg font-medium text-primary-dark mb-1 rtl:text-right line-clamp-1">{product.name}</h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-2 rtl:text-right line-clamp-2">{product.description || 'תיאור מוצר לא זמין'}</p>
          
          {/* הצגת צבעים אם יש */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 rtl:justify-end">
              {product.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      <div 
        className={`absolute bottom-0 right-0 left-0 flex justify-between items-center px-3 py-2 sm:px-4 sm:py-3 bg-white transition-transform duration-300 ${
          isHovered ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <button 
          onClick={handleQuickAdd}
          disabled={isAddingToCart}
          className="bg-primary hover:bg-primary-dark text-white rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-colors duration-300 flex items-center"
        >
          {isAddingToCart ? (
            <>
              <svg className="animate-spin -ml-0.5 mr-1.5 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              מוסיף...
            </>
          ) : (
            <>
              <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <span className="hidden xs:inline">הוסף לעגלה</span>
              <span className="xs:hidden">הוסף</span>
            </>
          )}
        </button>
        
        <button 
          onClick={toggleFavorite}
          className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100"
          aria-label={isFavorite ? "הסר ממועדפים" : "הוסף למועדפים"}
        >
          {isFavorite ? (
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

// הוספת אנימציה CSS - אפשר להוסיף ב-global.css, אבל נוסיף כאן בינתיים
const inlineStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`; 