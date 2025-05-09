import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Order from '@/lib/db/models/Order';

// GET - קבל את כל ההזמנות
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const orders = await Order.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - צור הזמנה חדשה
export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // בדיקה שכל הפריטים מכילים את השדות הנדרשים
    if (body.items && Array.isArray(body.items)) {
      // וודא שלכל פריט יש שדה productId עם ערך ברירת מחדל תקין
      body.items = body.items.map(item => {
        // אם productId לא קיים או ריק, הוסף ערך ברירת מחדל תקין
        if (!item.productId || item.productId === "" || !(/^[0-9a-fA-F]{24}$/.test(item.productId))) {
          return {
            ...item,
            productId: "000000000000000000000000" // ObjectId תקין של אפסים
          };
        }
        return item;
      });
    }
    
    try {
      const order = await Order.create(body);
      return NextResponse.json(
        { success: true, order },
        { status: 201 }
      );
    } catch (error) {
      // שגיאות ולידציה של מונגו
      if (error.name === 'ValidationError') {
        const validationErrors = Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }));
        
        return NextResponse.json(
          { 
            success: false, 
            message: error.message,
            validationErrors 
          },
          { status: 400 }
        );
      }
      
      // שגיאות המרה של ObjectId
      if (error.name === 'CastError') {
        return NextResponse.json(
          { 
            success: false, 
            message: `שגיאת המרה בשדה ${error.path}: ${error.value} אינו בפורמט תקין` 
          },
          { status: 400 }
        );
      }
      
      throw error;
    }
  } catch (error) {
    console.error('שגיאה ביצירת הזמנה:', error);
    
    return NextResponse.json(
      { success: false, message: error.message || 'שגיאה לא צפויה ביצירת ההזמנה' },
      { status: 500 }
    );
  }
} 