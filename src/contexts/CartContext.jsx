"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import { validateCoupon } from '@/lib/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [coupon, setCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState('');
  const [automaticDiscount, setAutomaticDiscount] = useState(0);

  // פונקציה להפעלת אירועי העדכון
  const dispatchCartEvents = () => {
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { timestamp: Date.now() }
    }));
  };

  // טעינת פריטי העגלה בעת טעינת האפליקציה
  useEffect(() => {
    const loadCartItems = () => {
      setIsLoading(true);
      try {
        const savedItems = localStorage.getItem('cartItems');
        const parsedItems = savedItems ? JSON.parse(savedItems) : [];
        setCartItems(parsedItems);
        
        // טעינת קופון שמור
        const savedCoupon = localStorage.getItem('activeCoupon');
        if (savedCoupon) {
          const parsedCoupon = JSON.parse(savedCoupon);
          setCoupon(parsedCoupon.coupon);
          setDiscount(parsedCoupon.discount);
          setCouponMessage(parsedCoupon.message);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        setCartItems([]);
        setCoupon(null);
        setDiscount(0);
        setCouponMessage('');
      } finally {
        setIsLoading(false);
      }
    };

    loadCartItems();

    // האזנה לשינויים בעגלה
    window.addEventListener('storage', loadCartItems);
    return () => window.removeEventListener('storage', loadCartItems);
  }, []);

  // הוספת פריט לעגלה
  const addToCart = (item, quantity = 1) => {
    try {
      // מיפוי מדויק של המוצר
      const itemId = item.id || item.type?.id;
      const itemName = item.name || (item.type ? `${item.type.name} מותאם אישית` : '');
      const itemCategory = item.category || null;
      
      // יצירת פונקציה לבדיקת התאמה של מוצר בעגלה
      const isSameProduct = (cartItem) => {
        if (cartItem.id === itemId) {
          // בדוק גם את השם והקטגוריה כדי להימנע מהתנגשויות
          return cartItem.name === itemName && 
                 (cartItem.category === itemCategory || 
                 (!cartItem.category && !itemCategory));
        }
        return false;
      };
      
      // בדוק אם המוצר כבר קיים בעגלה
      const existingItemIndex = cartItems.findIndex(isSameProduct);
      
      let updatedCart;
      
      if (existingItemIndex >= 0) {
        // עדכון כמות אם המוצר כבר קיים
        updatedCart = cartItems.map(cartItem => {
          if (isSameProduct(cartItem)) {
            return { ...cartItem, quantity: cartItem.quantity + quantity };
          }
          return cartItem;
        });
      } else {
        // טיפול בנתיב התמונה
        let imagePath = item.image || '/images/placeholders/product-placeholder.jpg';
        // וידוא שנתיב התמונה מתחיל ב-/ אם זו תמונה מקומית
        if (imagePath && !imagePath.startsWith('/') && !imagePath.startsWith('http')) {
          imagePath = '/' + imagePath;
        }
        
        // הוספת מוצר חדש
        const newItem = {
          id: itemId,
          name: itemName,
          price: item.price || item.totalPrice || (item.discountPrice || item.price),
          image: imagePath,
          quantity: quantity,
          custom: item.custom || false,
          customDetails: item.customDetails || null,
          category: itemCategory,
        };
        updatedCart = [...cartItems, newItem];
      }
      
      // שמירה ב-localStorage ועדכון ה-state
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      
      // בדיקה מחדש של הקופון אם קיים
      if (coupon) {
        applyCoupon(coupon.code, false);
      }
      
      // הפעלת אירועים
      dispatchCartEvents();
      
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  // עדכון כמות של פריט
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return false;
    
    try {
      const updatedItems = cartItems.map(item => {
        if (item.id === itemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      setCartItems(updatedItems);
      
      // בדיקה מחדש של הקופון אם קיים
      if (coupon) {
        applyCoupon(coupon.code, false);
      }
      
      // הפעלת אירועים
      dispatchCartEvents();
      
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      return false;
    }
  };

  // הסרת פריט מהעגלה
  const removeItem = (itemId) => {
    try {
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      setCartItems(updatedItems);
      
      // בדיקה מחדש של הקופון אם קיים
      if (coupon) {
        applyCoupon(coupon.code, false);
      }
      
      // הפעלת אירועים
      dispatchCartEvents();
      
      return true;
    } catch (error) {
      console.error('Error removing item:', error);
      return false;
    }
  };

  // חישוב סכום העגלה
  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  // הפעלת קופון
  const applyCoupon = async (code, showMessages = true) => {
    if (!code) {
      if (showMessages) setCouponError('נא להזין קוד קופון');
      return false;
    }
    
    try {
      // ניקוי הודעות קודמות
      if (showMessages) {
        setCouponError('');
        setCouponMessage('');
      }
      
      const cartTotal = getCartTotal();
      const productIds = cartItems.map(item => item.id);
      const categories = cartItems.map(item => item.category).filter(Boolean);
      
      const result = await validateCoupon(code, cartTotal, productIds, categories);
      
      if (!result.valid) {
        if (showMessages) setCouponError(result.message);
        
        // אם זה אותו קופון שכבר הופעל וכעת אינו תקף, מוחקים אותו
        if (coupon && coupon.code === code.toUpperCase()) {
          removeCoupon();
        }
        
        return false;
      }
      
      // שמירת פרטי הקופון
      setCoupon(result.coupon);
      setDiscount(result.discount);
      if (showMessages) setCouponMessage(result.message);
      
      // שמירה בלוקל סטורג'
      localStorage.setItem('activeCoupon', JSON.stringify({
        coupon: result.coupon,
        discount: result.discount,
        message: result.message
      }));
      
      // הפעלת אירועים
      dispatchCartEvents();
      
      return true;
    } catch (error) {
      console.error('Error applying coupon:', error);
      if (showMessages) setCouponError('אירעה שגיאה בהפעלת הקופון');
      return false;
    }
  };
  
  // הסרת קופון
  const removeCoupon = () => {
    setCoupon(null);
    setDiscount(0);
    setCouponMessage('');
    setCouponError('');
    
    localStorage.removeItem('activeCoupon');
    
    // הפעלת אירועים
    dispatchCartEvents();
  };
  
  // חישוב סכום לתשלום (לאחר הנחות)
  const getPayableTotal = () => {
    const total = getCartTotal();
    let finalTotal = total - discount;
    
    // הנחה אוטומטית של 10% עבור קניות מעל 100 ש"ח
    if (total > 100) {
      const autoDiscount = total * 0.1; // 10% הנחה
      setAutomaticDiscount(autoDiscount);
      finalTotal = finalTotal - autoDiscount;
    } else {
      setAutomaticDiscount(0);
    }
    
    return Math.max(0, finalTotal);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        updateQuantity, 
        removeItem, 
        getCartTotal,
        coupon,
        discount,
        couponMessage,
        couponError,
        applyCoupon,
        removeCoupon,
        getPayableTotal,
        isLoading,
        automaticDiscount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 