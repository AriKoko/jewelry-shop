import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Charm from '@/lib/db/models/Charm';

// GET - קבל את כל התליונים
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const active = searchParams.get('active');
    
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (active === 'true') {
      query.active = true;
    }
    
    const charms = await Charm.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, charms }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - צור תליון חדש
export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    const charm = await Charm.create(body);
    
    return NextResponse.json(
      { success: true, charm },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 