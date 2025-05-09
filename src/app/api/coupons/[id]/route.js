import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/dbConnect';
import Coupon from '@/lib/db/models/Coupon';

// קבלת קופון לפי ID
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const coupon = await Coupon.findById(id);
    
    if (!coupon) {
      return NextResponse.json(
        { success: false, message: 'קופון לא נמצא' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return NextResponse.json(
      { success: false, message: 'שגיאה בטעינת קופון' },
      { status: 500 }
    );
  }
}

// עדכון קופון
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const data = await request.json();
    
    // בדיקה אם הקופון קיים
    const existingCoupon = await Coupon.findById(id);
    if (!existingCoupon) {
      return NextResponse.json(
        { success: false, message: 'קופון לא נמצא' },
        { status: 404 }
      );
    }
    
    // בדיקה אם קוד הקופון כבר קיים (אם משנים את הקוד)
    if (data.code && data.code !== existingCoupon.code) {
      const duplicateCoupon = await Coupon.findOne({ code: data.code.toUpperCase(), _id: { $ne: id } });
      if (duplicateCoupon) {
        return NextResponse.json(
          { success: false, message: 'קופון עם קוד זה כבר קיים במערכת' },
          { status: 400 }
        );
      }
      
      // המרת הקוד לאותיות גדולות
      data.code = data.code.toUpperCase();
    }
    
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({ success: true, coupon: updatedCoupon });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { success: false, message: 'שגיאה בעדכון קופון', error: error.message },
      { status: 500 }
    );
  }
}

// מחיקת קופון
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    
    if (!deletedCoupon) {
      return NextResponse.json(
        { success: false, message: 'קופון לא נמצא' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'קופון נמחק בהצלחה' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { success: false, message: 'שגיאה במחיקת קופון' },
      { status: 500 }
    );
  }
} 