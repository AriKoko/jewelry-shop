import { NextResponse } from 'next/server';
import { writeFile, unlink, access } from 'fs/promises';
import { join } from 'path';
import { nanoid } from 'nanoid';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'לא נשלח קובץ' }, 
        { status: 400 }
      );
    }

    // בדוק אם הקובץ הוא תמונה
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'הקובץ חייב להיות תמונה (JPEG, PNG, GIF, WEBP)' }, 
        { status: 400 }
      );
    }

    // מגבלת גודל 5MB
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'התמונה חייבת להיות קטנה מ-5MB' }, 
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // יצירת שם קובץ ייחודי
    const uniqueId = nanoid(10);
    const fileExt = file.name.split('.').pop();
    const fileName = `${uniqueId}.${fileExt}`;
    
    // שמירת הקובץ בתיקיית התמונות הציבורית
    const path = join(process.cwd(), 'public', 'images', 'uploads', fileName);
    await writeFile(path, buffer);

    // החזרת נתיב התמונה יחסי לשורש האתר
    const imageUrl = `/images/uploads/${fileName}`;
    
    return NextResponse.json({
      success: true,
      message: 'התמונה הועלתה בהצלחה',
      imageUrl
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { success: false, message: 'אירעה שגיאה בהעלאת התמונה' }, 
      { status: 500 }
    );
  }
}

// מחיקת תמונה על פי הנתיב
export async function DELETE(request) {
  try {
    // קבל את נתיב התמונה מהבקשה
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('path');
    
    if (!imagePath) {
      return NextResponse.json(
        { success: false, message: 'נתיב התמונה לא סופק' }, 
        { status: 400 }
      );
    }
    
    // ודא שאנחנו מוחקים רק מתיקיית ה-uploads
    if (!imagePath.startsWith('/images/uploads/')) {
      return NextResponse.json(
        { success: false, message: 'מסיבות אבטחה, ניתן למחוק רק תמונות מתיקיית ההעלאות' }, 
        { status: 403 }
      );
    }
    
    // קבל את שם הקובץ מהנתיב
    const fileName = imagePath.split('/').pop();
    
    // בנה את הנתיב המלא לקובץ
    const fullPath = join(process.cwd(), 'public', 'images', 'uploads', fileName);
    
    // בדוק אם הקובץ קיים
    try {
      await access(fullPath);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'התמונה לא נמצאה' }, 
        { status: 404 }
      );
    }
    
    // מחק את הקובץ
    await unlink(fullPath);
    
    return NextResponse.json({
      success: true,
      message: 'התמונה נמחקה בהצלחה'
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, message: 'אירעה שגיאה במחיקת התמונה' }, 
      { status: 500 }
    );
  }
} 