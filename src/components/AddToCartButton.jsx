"use client"

import { useState } from 'react'

export default function AddToCartButton({ product, className = '', showQuantity = false }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAdding(true);
    
    // הוספת המוצר לעגלה
    setTimeout(() => {
      try {
        // בדיקה וניפוי באגים
        console.log("מוצר לפני הוספה:", product);
        
        // קרא את העגלה הנוכחית מה-localStorage
        const cartItems = localStorage.getItem('cartItems');
        const currentCart = cartItems ? JSON.parse(cartItems) : [];
        
        // מיפוי מלא של המוצר ותיקון שדה התמונה
        const productId = product._id || product.id;
        const productName = product.name;
        const productPrice = product.discountPrice || product.price;
        
        // וידוא שנתיב התמונה מתחיל ב-/ 
        let productImage = product.image || '/images/placeholders/product-placeholder.jpg';
        // אם התמונה לא מתחילה ב-/ וגם לא ב-http, הוסף / בהתחלה
        if (productImage && !productImage.startsWith('/') && !productImage.startsWith('http')) {
          productImage = '/' + productImage;
        }
        
        const productCategory = product.category;
        
        console.log("פרטי המוצר שנשמרים:", {
          id: productId,
          name: productName,
          price: productPrice,
          image: productImage,
          category: productCategory
        });
        
        // פונקציה מדויקת יותר לבדיקת התאמה של מוצר בעגלה
        const isSameProduct = (cartItem) => {
          // בדוק גם את השם והקטגוריה בנוסף למזהה
          if (cartItem.id === productId || cartItem._id === productId) {
            // ודא שהשם והקטגוריה מתאימים כדי להימנע מהתנגשויות
            return cartItem.name === productName && 
                   (cartItem.category === productCategory || 
                   (!cartItem.category && !productCategory));
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
              return { 
                ...item, 
                quantity: item.quantity + quantity 
              };
            }
            return item;
          });
          console.log("עדכון מוצר קיים:", updatedCart[existingItemIndex]);
        } else {
          // הוסף מוצר חדש - עם בדיקה מקיפה שכל הפרטים קיימים
          const newItem = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: quantity,
            category: productCategory
          };
          
          console.log("מוסיף מוצר חדש:", newItem);
          updatedCart = [...currentCart, newItem];
        }
        
        // שמור את העגלה המעודכנת
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        
        // עדכון אירוע storage כדי שה-Header יעודכן
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('cartUpdated', {
          detail: { timestamp: Date.now() }
        }));
        
        // הצג הודעת הצלחה
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('אירעה שגיאה בהוספה לסל הקניות: ' + error.message);
      } finally {
        setIsAdding(false);
      }
    }, 500);
  };
  
  return (
    <div className={className}>
      {showQuantity && (
        <div className="flex items-center justify-end mb-3">
          <span className="ml-3">כמות:</span>
          <div className="flex items-center">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              className="p-1 rounded border border-gray-300 text-gray-500 disabled:opacity-50"
              type="button"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <span className="w-10 text-center">{quantity}</span>
            
            <button
              onClick={() => setQuantity(prev => prev + 1)}
              className="p-1 rounded border border-gray-300 text-gray-500"
              type="button"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`btn-primary w-full py-3 relative overflow-hidden transition-all ${isAdded ? 'bg-green-600' : ''}`}
      >
        {isAdding ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            מוסיף...
          </span>
        ) : isAdded ? (
          <span className="flex items-center justify-center">
            <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            נוסף לסל הקניות
          </span>
        ) : (
          <span>הוספה לסל הקניות</span>
        )}
      </button>
    </div>
  );
} 