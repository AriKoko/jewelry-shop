import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/dbConnect';
import Coupon from '@/lib/db/models/Coupon';

// קבלת קופון לפי קוד
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { code } = params;
    
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
        { success: false, message: 'קופון לא נמצא או שאינו תקף' },
        { status: 404 }
      );
    }
    
    // בדיקה שהקופון לא נוצל יותר מדי פעמים
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json(
        { success: false, message: 'קופון מוצה את מספר השימושים המקסימלי שלו' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error('Error fetching coupon by code:', error);
    return NextResponse.json(
      { success: false, message: 'שגיאה בטעינת קופון' },
      { status: 500 }
    );
  }
} 