import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';

// GET - קבל את כל המוצרים או חיפוש
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const q = searchParams.get('q');
    
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }

    // תמיכה בחיפוש טקסטואלי
    if (q) {
      const regex = new RegExp(q, 'i'); // חיפוש לא רגיש לאותיות
      query.$or = [
        { name: regex },
        { description: regex },
        { tags: regex },
        { category: regex }
      ];
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - צור מוצר חדש
export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    const product = await Product.create(body);
    
    return NextResponse.json(
      { success: true, product },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 