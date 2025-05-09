"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { paymentOptions } from '../../lib/products'
import { useCart } from '@/contexts/CartContext'
import { updateCouponUsage } from '@/lib/api'

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    cartItems, 
    getCartTotal, 
    getPayableTotal,
    coupon,
    discount,
    couponMessage,
    automaticDiscount
  } = useCart();
  
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [orderDetails, setOrderDetails] = useState({
    fullName: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // פונקציה לטעינת פריטי העגלה
  useEffect(() => {
    try {
      // בדיקה שהעגלה לא ריקה
      if (cartItems.length === 0) {
        // אם העגלה ריקה, נחזור לעמוד העגלה
        router.push('/cart');
        return;
      }
      
      // עדכון סכומים
      setTotalAmount(getCartTotal());
      setDiscountAmount(discount);
      setFinalAmount(getPayableTotal());
    } catch (error) {
      console.error('Error loading cart in checkout:', error);
      router.push('/cart');
    }
  }, [router, cartItems, getCartTotal, getPayableTotal, discount]);
  
  // טיפול בשינויים בטופס
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails(prev => ({ ...prev, [name]: value }));
  };
  
  // שליחת הזמנה
  const submitOrder = async (e) => {
    e.preventDefault();
    
    if (!selectedPayment) {
      alert('יש לבחור אמצעי תשלום');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // יצירת אובייקט ההזמנה
      const orderData = {
        customerName: orderDetails.fullName,
        customerPhone: orderDetails.phone,
        customerEmail: orderDetails.email,
        // עיבוד פריטי הסל
        items: cartItems.map(item => {
          // הוספת אובייקט ID אם לא קיים, כדי לעבור את הבדיקת תקינות
          return {
            // תמיד נשלח productId עם ערך ברירת מחדל אם לא קיים
            productId: item.id || "000000000000000000000000",
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            customization: item.customDetails || null
          };
        }),
        subtotal: totalAmount,
        discount: discountAmount,
        total: finalAmount,
        paymentMethod: selectedPayment.id,
        notes: orderDetails.notes,
        couponUsed: coupon ? coupon.code : null
      };
      
      console.log('Sending order data:', JSON.stringify(orderData));
      
      // שליחת הנתונים לשרת
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `שגיאת שרת: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'אירעה שגיאה בעת יצירת ההזמנה');
      }
      
      // עדכון מספר השימושים בקופון אם קיים
      if (coupon) {
        try {
          await updateCouponUsage(coupon.code);
          console.log('Coupon usage updated successfully');
        } catch (error) {
          console.error('Failed to update coupon usage:', error);
          // ממשיכים בתהליך גם אם עדכון הקופון נכשל
        }
      }
      
      // נקה את העגלה
      localStorage.removeItem('cartItems');
      localStorage.removeItem('activeCoupon');
      window.dispatchEvent(new Event('storage'));
      
      setIsComplete(true);
    } catch (error) {
      console.error('שגיאה ביצירת הזמנה:', error);
      alert('אירעה שגיאה בעת יצירת ההזמנה: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isComplete) {
    return (
      <div className="container-custom py-12">
        <div className="text-center max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="mb-6 text-green-500">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">ההזמנה התקבלה בהצלחה!</h1>
          <p className="mb-6">
            {selectedPayment?.id === 'cash' 
              ? 'תודה על הזמנתך! ניצור איתך קשר בהקדם לתיאום איסוף ותשלום.' 
              : 'תודה על הזמנתך! נא להעביר תשלום דרך ' + selectedPayment?.name + ' למספר ' + selectedPayment?.phoneNumber}
          </p>
          
          {selectedPayment?.id !== 'cash' && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6 text-right">
              <p className="text-yellow-800 font-bold mb-1">שימי לב:</p>
              <p className="text-yellow-700">ההזמנה לא תתחיל להיות מוכנה עד שהתשלום יועבר. לאחר העברת התשלום, נא לשלוח הודעת וואטסאפ עם צילום מסך של ההעברה.</p>
            </div>
          )}
          
          <div className="flex justify-center">
            <Link href="/" className="btn-primary mx-2">
              חזרה לדף הבית
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold mb-2">השלמת הזמנה</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          בחרי את אמצעי התשלום והשלימי את פרטי ההזמנה
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* טופס השלמת הזמנה */}
        <div className="lg:col-span-2">
          <form onSubmit={submitOrder} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-medium">פרטי הזמנה</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-1">שם מלא</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={orderDetails.fullName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">טלפון</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={orderDetails.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">אימייל</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={orderDetails.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-1">הערות (לא חובה)</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  value={orderDetails.notes}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">בחירת אמצעי תשלום</h3>
                <div className="space-y-3">
                  {paymentOptions.map((option) => (
                    <div key={option.id} className="border rounded-md p-4 cursor-pointer transition-all hover:border-primary hover:bg-primary/5"
                      onClick={() => setSelectedPayment(option)}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id={`payment-${option.id}`}
                          name="paymentMethod"
                          checked={selectedPayment?.id === option.id}
                          onChange={() => setSelectedPayment(option)}
                          className="mr-2"
                        />
                        <label htmlFor={`payment-${option.id}`} className="flex flex-grow items-center cursor-pointer">
                          <div className="h-8 w-8 mr-3 flex items-center justify-center rounded-full bg-gray-100">
                            <span className="text-primary text-lg">{option.emoji}</span>
                          </div>
                          <div>
                            <div className="font-medium">{option.name}</div>
                            <div className="text-sm text-gray-500 mt-1">{option.description}</div>
                          </div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-gray-50">
              <button 
                type="submit" 
                className="btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 mr-3 border-b-2 border-white rounded-full"></div>
                    <span>שולח הזמנה...</span>
                  </div>
                ) : (
                  <span>שליחת הזמנה</span>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* סיכום הזמנה */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-6">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-medium">סיכום הזמנה</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-1 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between py-2">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-500 text-sm"> x{item.quantity}</span>
                    </div>
                    <span>₪{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">סה"כ ביניים</span>
                  <span>₪{totalAmount.toFixed(2)}</span>
                </div>
                
                {coupon && discountAmount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <div>
                      <span>הנחה </span>
                      <span className="text-xs">({coupon.code})</span>
                    </div>
                    <span>-₪{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                {automaticDiscount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>הנחה אוטומטית (10%)</span>
                    <span>-₪{automaticDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
                  <span>סה"כ לתשלום</span>
                  <span>₪{finalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p>* המוצרים לאיסוף עצמי בלבד</p>
                {coupon && <p className="text-green-700 mt-2">{couponMessage}</p>}
              </div>
              
              <div className="mt-6">
                <Link href="/cart" className="block text-center text-primary hover:text-primary-dark">
                  חזרה לעגלת הקניות
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 