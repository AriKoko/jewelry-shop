import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';

// GET - קבל מוצר לפי מזהה
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { productId } = params;
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'המוצר לא נמצא' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT - עדכן מוצר לפי מזהה
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const { productId } = params;
    const body = await request.json();
    
    // הוסף תאריך עדכון
    body.updatedAt = Date.now();
    
    const product = await Product.findByIdAndUpdate(
      productId,
      body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'המוצר לא נמצא' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - מחק מוצר לפי מזהה
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const { productId } = params;
    
    const product = await Product.findByIdAndDelete(productId);
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'המוצר לא נמצא' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'המוצר נמחק בהצלחה' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 