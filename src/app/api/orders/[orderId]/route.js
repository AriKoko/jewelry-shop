import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Order from '@/lib/db/models/Order';

// GET - קבל הזמנה ספציפית לפי ID
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { orderId } = params;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'הזמנה לא נמצאה' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error('Error fetching order:', error);
    
    // שגיאת המרה של ObjectId
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return NextResponse.json(
        { success: false, message: 'מזהה הזמנה לא תקין' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PATCH - עדכן הזמנה
export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    
    const { orderId } = params;
    const body = await request.json();
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'הזמנה לא נמצאה' },
        { status: 404 }
      );
    }
    
    // עדכן רק את השדות שהתקבלו בבקשה
    Object.keys(body).forEach(key => {
      if (key in order) {
        order[key] = body[key];
      }
    });
    
    await order.save();
    
    return NextResponse.json(
      { success: true, order },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating order:', error);
    
    // שגיאת המרה של ObjectId
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return NextResponse.json(
        { success: false, message: 'מזהה הזמנה לא תקין' },
        { status: 400 }
      );
    }
    
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
    
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - מחק הזמנה
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const { orderId } = params;
    
    const order = await Order.findByIdAndDelete(orderId);
    
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'הזמנה לא נמצאה' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'הזמנה נמחקה בהצלחה' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting order:', error);
    
    // שגיאת המרה של ObjectId
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return NextResponse.json(
        { success: false, message: 'מזהה הזמנה לא תקין' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 