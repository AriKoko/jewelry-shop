import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/dbConnect';
import Coupon from '@/lib/db/models/Coupon';

// קבלת כל הקופונים
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    
    const query = {};
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }
    
    const coupons = await Coupon.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { success: false, message: 'שגיאה בטעינת קופונים' },
      { status: 500 }
    );
  }
}

// יצירת קופון חדש
export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // בדיקה אם קוד קופון כבר קיים
    const existingCoupon = await Coupon.findOne({ code: data.code.toUpperCase() });
    if (existingCoupon) {
      return NextResponse.json(
        { success: false, message: 'קופון עם קוד זה כבר קיים במערכת' },
        { status: 400 }
      );
    }
    
    // המרת הקוד לאותיות גדולות
    data.code = data.code.toUpperCase();
    
    const coupon = await Coupon.create(data);
    
    return NextResponse.json(
      { success: true, coupon }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { success: false, message: 'שגיאה ביצירת קופון', error: error.message },
      { status: 500 }
    );
  }
} 