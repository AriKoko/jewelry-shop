import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/dbConnect';
import Coupon from '@/lib/db/models/Coupon';

export async function POST(request) {
  try {
    await dbConnect();
    const { code, cartTotal, productIds = [], categories = [] } = await request.json();
    
    if (!code) {
      return NextResponse.json(
        { valid: false, message: 'נא להזין קוד קופון' },
        { status: 400 }
      );
    }
    
    // חיפוש קופון פעיל ותקף
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      $or: [
        { validUntil: { $gt: new Date() } },
        { validUntil: null }
      ]
    });
    
    if (!coupon) {
      return NextResponse.json(
        { valid: false, message: 'קופון לא נמצא או שאינו תקף' },
        { status: 404 }
      );
    }
    
    // בדיקת מספר שימושים מקסימלי
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json(
        { valid: false, message: 'קופון מוצה את מספר השימושים המקסימלי שלו' },
        { status: 400 }
      );
    }
    
    // בדיקת סכום מינימלי לרכישה
    if (cartTotal < coupon.minPurchase) {
      return NextResponse.json(
        { 
          valid: false, 
          message: `הקופון תקף לרכישה בסכום מינימלי של ₪${coupon.minPurchase}` 
        },
        { status: 400 }
      );
    }
    
    // בדיקת תאימות למוצרים ספציפיים (אם מוגדר)
    if (coupon.applicableProducts.length > 0 && productIds.length > 0) {
      const hasMatchingProduct = productIds.some(id => 
        coupon.applicableProducts.includes(id.toString())
      );
      
      if (!hasMatchingProduct) {
        return NextResponse.json(
          { valid: false, message: 'הקופון אינו תקף למוצרים שבסל הקניות שלך' },
          { status: 400 }
        );
      }
    }
    
    // בדיקת תאימות לקטגוריות (אם מוגדר)
    if (coupon.applicableCategories.length > 0 && categories.length > 0) {
      const hasMatchingCategory = categories.some(category => 
        coupon.applicableCategories.includes(category)
      );
      
      if (!hasMatchingCategory) {
        return NextResponse.json(
          { valid: false, message: 'הקופון אינו תקף לקטגוריות המוצרים שבסל הקניות שלך' },
          { status: 400 }
        );
      }
    }
    
    // חישוב סכום ההנחה
    let discount = 0;
    if (coupon.type === 'percent') {
      discount = (cartTotal * coupon.value) / 100;
    } else { // fixed
      discount = Math.min(coupon.value, cartTotal); // לא להעניק הנחה גדולה מסך ההזמנה
    }
    
    // הכנת הודעה מתאימה
    let message = '';
    if (coupon.type === 'percent') {
      message = `הנחה של ${coupon.value}% הופעלה`;
    } else {
      message = `הנחה של ₪${coupon.value} הופעלה`;
    }
    
    return NextResponse.json({
      valid: true,
      coupon,
      discount,
      message
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { valid: false, message: 'אירעה שגיאה בבדיקת הקופון' },
      { status: 500 }
    );
  }
} 