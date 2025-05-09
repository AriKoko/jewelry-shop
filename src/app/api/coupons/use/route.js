import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/dbConnect';
import Coupon from '@/lib/db/models/Coupon';

// עדכון שימוש בקופון
export async function POST(request) {
  try {
    await dbConnect();
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json(
        { success: false, message: 'קוד קופון חסר' },
        { status: 400 }
      );
    }
    
    // מציאת הקופון לפי קוד
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (!coupon) {
      return NextResponse.json(
        { success: false, message: 'קופון לא נמצא' },
        { status: 404 }
      );
    }
    
    // עדכון מספר השימושים
    coupon.usedCount = (coupon.usedCount || 0) + 1;
    await coupon.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'מספר השימושים בקופון עודכן',
      coupon: coupon
    });
  } catch (error) {
    console.error('Error updating coupon usage:', error);
    return NextResponse.json(
      { success: false, message: 'שגיאה בעדכון השימוש בקופון' },
      { status: 500 }
    );
  }
} 