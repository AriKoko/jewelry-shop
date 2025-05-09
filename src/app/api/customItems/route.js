import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import CustomItem from '@/lib/db/models/CustomItem';

// GET - קבל את כל הפריטים המותאמים אישית
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');
    
    let query = {};
    
    if (type) {
      query.type = type;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    const customItems = await CustomItem.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, customItems }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - צור פריט מותאם אישית חדש
export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    const customItem = await CustomItem.create(body);
    
    return NextResponse.json(
      { success: true, customItem },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 