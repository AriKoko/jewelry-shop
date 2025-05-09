"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  fetchCoupons, 
  createCoupon, 
  updateCoupon, 
  deleteCoupon 
} from '@/lib/api'

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState({
    code: '',
    type: 'percent',
    value: 0,
    minPurchase: 0,
    maxUses: null,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: null,
    isActive: true,
    description: '',
    applicableProducts: [],
    applicableCategories: [],
    isBirthdayPromo: false,
    isFirstOrder: false
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // טעינת כל הקופונים
  const loadCoupons = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCoupons();
      setCoupons(data);
    } catch (error) {
      console.error('Error loading coupons:', error);
      setError('אירעה שגיאה בטעינת הקופונים');
    } finally {
      setIsLoading(false);
    }
  };
  
  // טעינת קופונים בעת טעינת הדף
  useEffect(() => {
    loadCoupons();
  }, []);
  
  // טיפול בשינויים בטופס
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // טיפול בתאריכים ריקים
    if (type === 'date' && value === '') {
      setEditingCoupon(prev => ({ ...prev, [name]: null }));
      return;
    }
    
    // טיפול במספר שימושים מקסימלי ריק
    if (name === 'maxUses' && value === '') {
      setEditingCoupon(prev => ({ ...prev, [name]: null }));
      return;
    }
    
    setEditingCoupon(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // התחלת עריכת קופון קיים
  const startEditing = (coupon) => {
    // להכין את התאריכים לשדות מסוג date
    const preparedCoupon = {
      ...coupon,
      validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : '',
      validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : ''
    };
    
    setEditingCoupon(preparedCoupon);
    setIsEditing(true);
    setError('');
    setSuccessMessage('');
  };
  
  // התחלת יצירת קופון חדש
  const startCreating = () => {
    setEditingCoupon({
      code: '',
      type: 'percent',
      value: 0,
      minPurchase: 0,
      maxUses: null,
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: null,
      isActive: true,
      description: '',
      applicableProducts: [],
      applicableCategories: [],
      isBirthdayPromo: false,
      isFirstOrder: false
    });
    setIsEditing(true);
    setError('');
    setSuccessMessage('');
  };
  
  // ביטול עריכה/יצירה
  const cancelEditing = () => {
    setIsEditing(false);
    setEditingCoupon({
      code: '',
      type: 'percent',
      value: 0,
      minPurchase: 0,
      maxUses: null,
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: null,
      isActive: true,
      description: '',
      applicableProducts: [],
      applicableCategories: [],
      isBirthdayPromo: false,
      isFirstOrder: false
    });
    setError('');
    setSuccessMessage('');
  };
  
  // שמירת קופון (יצירה או עדכון)
  const saveCoupon = async (e) => {
    e.preventDefault();
    
    try {
      // בדיקות תקינות
      if (!editingCoupon.code.trim()) {
        setError('יש להזין קוד קופון');
        return;
      }
      
      if (editingCoupon.value <= 0) {
        setError('ערך ההנחה חייב להיות גדול מאפס');
        return;
      }
      
      if (editingCoupon.type === 'percent' && editingCoupon.value > 100) {
        setError('הנחה באחוזים לא יכולה להיות גדולה מ-100%');
        return;
      }
      
      // יצירת אובייקט לשליחה
      const couponData = {
        ...editingCoupon,
        code: editingCoupon.code.toUpperCase(),
        value: Number(editingCoupon.value),
        minPurchase: Number(editingCoupon.minPurchase),
        maxUses: editingCoupon.maxUses !== null ? Number(editingCoupon.maxUses) : null
      };
      
      let savedCoupon;
      
      if (editingCoupon._id) {
        // עדכון קופון קיים
        savedCoupon = await updateCoupon(editingCoupon._id, couponData);
        setSuccessMessage('הקופון עודכן בהצלחה');
      } else {
        // יצירת קופון חדש
        savedCoupon = await createCoupon(couponData);
        setSuccessMessage('הקופון נוצר בהצלחה');
      }
      
      // טעינה מחדש של רשימת הקופונים
      await loadCoupons();
      
      // איפוס הטופס
      setIsEditing(false);
      setEditingCoupon({
        code: '',
        type: 'percent',
        value: 0,
        minPurchase: 0,
        maxUses: null,
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: null,
        isActive: true,
        description: '',
        applicableProducts: [],
        applicableCategories: [],
        isBirthdayPromo: false,
        isFirstOrder: false
      });
    } catch (error) {
      console.error('Error saving coupon:', error);
      setError(error.message || 'אירעה שגיאה בשמירת הקופון');
    }
  };
  
  // מחיקת קופון
  const removeCoupon = async (id) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את הקופון?')) {
      return;
    }
    
    try {
      await deleteCoupon(id);
      setSuccessMessage('הקופון נמחק בהצלחה');
      
      // טעינה מחדש של רשימת הקופונים
      await loadCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      setError(error.message || 'אירעה שגיאה במחיקת הקופון');
    }
  };
  
  // עיצוב תאריך בפורמט נוח לקריאה
  const formatDate = (dateString) => {
    if (!dateString) return 'ללא תאריך';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };
  
  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">ניהול קופונים</h1>
        
        <div className="flex gap-4">
          <Link href="/admin" className="btn-outline-secondary">
            חזרה לדף ניהול
          </Link>
          
          {!isEditing && (
            <button onClick={startCreating} className="btn-primary">
              יצירת קופון חדש
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      {isEditing ? (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-medium mb-4">
            {editingCoupon._id ? 'עריכת קופון' : 'יצירת קופון חדש'}
          </h2>
          
          <form onSubmit={saveCoupon}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium mb-1">קוד קופון</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={editingCoupon.code}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">הקוד יומר אוטומטית לאותיות גדולות</p>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">תיאור קופון</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={editingCoupon.description}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-1">סוג הנחה</label>
                <select
                  id="type"
                  name="type"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={editingCoupon.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="percent">אחוזים</option>
                  <option value="fixed">סכום קבוע</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="value" className="block text-sm font-medium mb-1">
                  ערך ההנחה {editingCoupon.type === 'percent' ? '(%)' : '(₪)'}
                </label>
                <input
                  type="number"
                  id="value"
                  name="value"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={editingCoupon.value}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label htmlFor="minPurchase" className="block text-sm font-medium mb-1">סכום רכישה מינימלי (₪)</label>
                <input
                  type="number"
                  id="minPurchase"
                  name="minPurchase"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={editingCoupon.minPurchase}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label htmlFor="maxUses" className="block text-sm font-medium mb-1">מספר שימושים מקסימלי</label>
                <input
                  type="number"
                  id="maxUses"
                  name="maxUses"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={editingCoupon.maxUses === null ? '' : editingCoupon.maxUses}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="ללא הגבלה"
                />
                <p className="text-sm text-gray-500 mt-1">השאר ריק לשימוש ללא הגבלה</p>
              </div>
              
              <div>
                <label htmlFor="validFrom" className="block text-sm font-medium mb-1">תאריך תחילת תוקף</label>
                <input
                  type="date"
                  id="validFrom"
                  name="validFrom"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={editingCoupon.validFrom || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="validUntil" className="block text-sm font-medium mb-1">תאריך סיום תוקף</label>
                <input
                  type="date"
                  id="validUntil"
                  name="validUntil"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={editingCoupon.validUntil || ''}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-gray-500 mt-1">השאר ריק אם אין תאריך תפוגה</p>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <label className="flex items-center gap-2 mb-0">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={editingCoupon.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4"
                    />
                    <span>קופון פעיל</span>
                  </label>
                </div>
                
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <label className="flex items-center gap-2 mb-0">
                    <input
                      type="checkbox"
                      name="isBirthdayPromo"
                      checked={editingCoupon.isBirthdayPromo}
                      onChange={handleInputChange}
                      className="h-4 w-4"
                    />
                    <span>קופון יום הולדת</span>
                  </label>
                </div>
                
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <label className="flex items-center gap-2 mb-0">
                    <input
                      type="checkbox"
                      name="isFirstOrder"
                      checked={editingCoupon.isFirstOrder}
                      onChange={handleInputChange}
                      className="h-4 w-4"
                    />
                    <span>הזמנה ראשונה בלבד</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button type="button" onClick={cancelEditing} className="btn-outline-secondary">
                ביטול
              </button>
              <button type="submit" className="btn-primary">
                שמירה
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : coupons.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-lg mb-4">לא נמצאו קופונים במערכת</p>
              <button onClick={startCreating} className="btn-primary">
                יצירת קופון חדש
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        קוד
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        הנחה
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        תוקף
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        מצב
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        שימושים
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        פעולות
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {coupons.map(coupon => (
                      <tr key={coupon._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="font-bold">{coupon.code}</div>
                          <div className="text-gray-500 text-xs">{coupon.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {coupon.type === 'percent'
                            ? `${coupon.value}%`
                            : `₪${coupon.value}`
                          }
                          {coupon.minPurchase > 0 && (
                            <div className="text-gray-500 text-xs">מינימום: ₪{coupon.minPurchase}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div>מ: {formatDate(coupon.validFrom)}</div>
                          <div>עד: {formatDate(coupon.validUntil)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {coupon.isActive ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              פעיל
                            </span>
                          ) : (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              מושבת
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {coupon.usedCount || 0} / {coupon.maxUses === null ? '∞' : coupon.maxUses}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            onClick={() => startEditing(coupon)}
                            className="text-primary hover:text-primary-dark mr-3"
                          >
                            עריכה
                          </button>
                          <button
                            onClick={() => removeCoupon(coupon._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            מחיקה
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 