import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import CustomItem from '@/lib/db/models/CustomItem';

// GET - קבל פריט מותאם אישית לפי מזהה
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { customItemId } = params;
    
    const customItem = await CustomItem.findById(customItemId);
    
    if (!customItem) {
      return NextResponse.json(
        { success: false, message: 'הפריט המותאם אישית לא נמצא' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, customItem }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT - עדכן פריט מותאם אישית לפי מזהה
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const { customItemId } = params;
    const body = await request.json();
    
    // הוסף תאריך עדכון
    body.updatedAt = Date.now();
    
    const customItem = await CustomItem.findByIdAndUpdate(
      customItemId,
      body,
      { new: true, runValidators: true }
    );
    
    if (!customItem) {
      return NextResponse.json(
        { success: false, message: 'הפריט המותאם אישית לא נמצא' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, customItem }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - מחק פריט מותאם אישית לפי מזהה
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const { customItemId } = params;
    
    const customItem = await CustomItem.findByIdAndDelete(customItemId);
    
    if (!customItem) {
      return NextResponse.json(
        { success: false, message: 'הפריט המותאם אישית לא נמצא' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'הפריט המותאם אישית נמחק בהצלחה' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 