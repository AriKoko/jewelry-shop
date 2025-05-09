"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { paymentOptions } from '../../lib/products'
import ImageWithFallback from '../../components/ImageWithFallback'
import { useCart } from '@/contexts/CartContext'

export default function CartPage() {
  const router = useRouter();
  const { 
    cartItems, 
    updateQuantity: updateCartQuantity, 
    removeItem: removeCartItem, 
    getCartTotal, 
    getPayableTotal,
    coupon,
    discount,
    couponMessage,
    couponError,
    applyCoupon,
    removeCoupon,
    automaticDiscount
  } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  // פונקציה לטעינת פריטי העגלה
  useEffect(() => {
    // בפועל, יתחבר למערכת ניהול עגלה אמיתית
    const loadCartItems = () => {
      setIsLoading(true);
      
      try {
        // קריאה מה-localStorage לצורך הדגמה
        const savedItems = localStorage.getItem('cartItems');
        const parsedItems = savedItems ? JSON.parse(savedItems) : [];
        
        // חישוב סכום ביניים
        const total = parsedItems.reduce((sum, item) => {
          return sum + (item.price * item.quantity);
        }, 0);
        setSubTotal(total);
      } catch (error) {
        console.error('Error loading cart:', error);
        setSubTotal(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCartItems();
    
    // האזנה לשינויים בעגלה
    window.addEventListener('storage', loadCartItems);
    return () => window.removeEventListener('storage', loadCartItems);
  }, []);
  
  // מעבר לתשלום
  const proceedToCheckout = () => {
    router.push('/checkout');
  };
  
  // הוספת מוצר לדוגמה (רק לצורך הדגמה)
  const addSampleProduct = () => {
    const sampleProducts = [
      {
        id: '1',
        name: 'שרשרת חישוק זהב',
        price: 99,
        image: '/images/placeholders/jewelry-placeholder.jpg',
        quantity: 1
      },
      {
        id: '2',
        name: 'צמיד כסף משולב אבני חן',
        price: 85,
        image: '/images/placeholders/jewelry-placeholder.jpg',
        quantity: 1
      },
      {
        id: '3',
        name: 'עגילי זהב אדום תלויים',
        price: 125,
        image: '/images/placeholders/jewelry-placeholder.jpg',
        quantity: 1
      }
    ];
    
    // בחר מוצר אקראי להוספה
    const randomProduct = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
    
    // בדוק אם המוצר כבר קיים בעגלה
    const existingItemIndex = cartItems.findIndex(item => item.id === randomProduct.id);
    
    let updatedItems;
    if (existingItemIndex >= 0) {
      // עדכן כמות אם המוצר כבר קיים
      updatedItems = cartItems.map(item => {
        if (item.id === randomProduct.id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
    } else {
      // הוסף מוצר חדש
      updatedItems = [...cartItems, randomProduct];
    }
    
    // עדכון ב-localStorage
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    
    // עדכון אירוע storage כדי שה-Header יעודכן
    window.dispatchEvent(new Event('storage'));
  };
  
  // טיפול בשליחת קופון
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (isApplyingCoupon) return;
    
    setIsApplyingCoupon(true);
    try {
      await applyCoupon(couponCode);
    } finally {
      setIsApplyingCoupon(false);
    }
  };
  
  return (
    <div className="container-custom py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold mb-2">סל הקניות שלך</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          סקרי את המוצרים שבחרת והמשיכי לתשלום
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <div className="mb-4">
            <svg className="h-16 w-16 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium mb-4">סל הקניות שלך ריק</h2>
          <p className="text-gray-600 mb-8">לא נמצאו מוצרים בסל הקניות שלך</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/collection" className="btn-primary">
              חזרה לקולקציה
            </Link>
            <button 
              onClick={addSampleProduct} 
              className="btn-secondary"
            >
              הוסף מוצר לדוגמה
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* רשימת המוצרים */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-medium">מוצרים בעגלה ({cartItems.length})</h2>
              </div>
              
              <ul className="divide-y divide-gray-100">
                {cartItems.map(item => (
                  <li key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative h-20 w-20 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      {item.custom ? (
                        <>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-primary">פריט מותאם אישית</p>
                          {item.customDetails && (
                            <p className="text-xs text-gray-500 mt-1">
                              {item.customDetails.baseType && `בסיס: ${item.customDetails.baseType}`}
                              {item.customDetails.selectedCharms && ` עם ${item.customDetails.selectedCharms.length} תליונים`}
                            </p>
                          )}
                        </>
                      ) : (
                        <h3 className="font-medium">{item.name}</h3>
                      )}
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={isUpdating}
                            className="h-7 w-7 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            disabled={isUpdating}
                            className="h-7 w-7 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="font-medium">
                          {item.price * item.quantity} ₪
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => removeCartItem(item.id)}
                      disabled={isUpdating}
                      className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors disabled:opacity-50"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      הסר
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* סיכום הזמנה */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-medium">סיכום הזמנה</h2>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">סכום ביניים:</span>
                  <span>{getCartTotal().toFixed(2)} ₪</span>
                </div>
                
                {/* הנחה אוטומטית */}
                {automaticDiscount > 0 && (
                  <div className="flex justify-between mb-2 text-green-700">
                    <span>הנחה אוטומטית (10%)</span>
                    <span>-{automaticDiscount.toFixed(2)} ₪</span>
                  </div>
                )}
                
                {/* אזור קופון */}
                <div className="mt-4 mb-4">
                  {coupon ? (
                    <div className="bg-green-50 rounded-md p-3 border border-green-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-green-800 font-medium">קופון: {coupon.code}</span>
                        <button 
                          onClick={removeCoupon} 
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          הסר
                        </button>
                      </div>
                      {couponMessage && <p className="text-green-700 text-sm">{couponMessage}</p>}
                      <div className="flex justify-between mt-2 text-green-800">
                        <span>הנחה</span>
                        <span>-₪{discount.toFixed(2)}</span>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="mb-2">
                      <label htmlFor="couponCode" className="block text-sm font-medium mb-1">קוד קופון</label>
                      <div className="flex">
                        <input
                          type="text"
                          id="couponCode"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-grow p-2 border border-gray-300 rounded-r-none rounded-md"
                          placeholder="הזינו קוד קופון"
                        />
                        <button
                          type="submit"
                          disabled={isApplyingCoupon || !couponCode}
                          className="btn-sm-primary rounded-l-none disabled:opacity-50"
                        >
                          {isApplyingCoupon ? 'טוען...' : 'החל'}
                        </button>
                      </div>
                      {couponError && <p className="text-red-500 text-sm mt-1">{couponError}</p>}
                    </form>
                  )}
                </div>
                
                <div className="my-4 border-t border-gray-100 pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>סה"כ לתשלום:</span>
                    <span>{getPayableTotal().toFixed(2)} ₪</span>
                  </div>
                </div>
                
                <button
                  onClick={proceedToCheckout}
                  disabled={cartItems.length === 0 || isUpdating}
                  className="btn-primary w-full py-3 mb-4 flex justify-center items-center"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></div>
                      <span>אנא המתיני...</span>
                    </>
                  ) : (
                    <span>המשך לתשלום</span>
                  )}
                </button>
                
                <Link href="/collection" className="block text-center text-primary hover:text-primary-dark">
                  המשך לקנות
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 