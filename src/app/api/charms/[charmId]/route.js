import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Charm from '@/lib/db/models/Charm';

// GET - קבל תליון לפי ID
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { charmId } = params;
    
    const charm = await Charm.findById(charmId);
    
    if (!charm) {
      return NextResponse.json(
        { success: false, message: 'התליון לא נמצא' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, charm }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT - עדכן תליון קיים
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const { charmId } = params;
    const body = await request.json();
    
    // עדכון גם שדה updatedAt
    body.updatedAt = new Date();
    
    const charm = await Charm.findByIdAndUpdate(
      charmId,
      body,
      { new: true, runValidators: true }
    );
    
    if (!charm) {
      return NextResponse.json(
        { success: false, message: 'התליון לא נמצא' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, charm }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - מחק תליון
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const { charmId } = params;
    
    const charm = await Charm.findByIdAndDelete(charmId);
    
    if (!charm) {
      return NextResponse.json(
        { success: false, message: 'התליון לא נמצא' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'התליון נמחק בהצלחה' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 