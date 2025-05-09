import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

// מיקום שמירת הנתונים (בקובץ JSON)
const dataPath = path.join(process.cwd(), 'data', 'homepage-images.json');

// יצירת נתונים דיפולטיביים אם הקובץ לא קיים
const defaultData = {
  collections: '/images/placeholders/jewelry-placeholder.jpg',
  customDesign: '/images/placeholders/jewelry-placeholder.jpg',
  categories: {
    necklaces: '/images/placeholders/jewelry-placeholder.jpg',
    bracelets: '/images/placeholders/jewelry-placeholder.jpg',
    faceMasks: '/images/placeholders/jewelry-placeholder.jpg',
    phoneStickers: '/images/placeholders/jewelry-placeholder.jpg'
  }
};

// פונקציית עזר לקריאת נתונים מהקובץ
async function readData() {
  try {
    // בדיקה אם הקובץ קיים
    await fs.access(dataPath);
    // אם הקובץ קיים, נקרא אותו
    const raw = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    // אם הקובץ לא קיים או לא ניתן לקרוא אותו, נשתמש בנתונים דיפולטיביים
    // נוודא שתיקיית הנתונים קיימת
    try {
      await fs.mkdir(path.dirname(dataPath), { recursive: true });
    } catch (error) {
      // מתעלם משגיאות אם התיקייה כבר קיימת
    }
    // נשמור את הנתונים הדיפולטיביים
    await fs.writeFile(dataPath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
}

// פונקציית עזר לכתיבת נתונים לקובץ
async function writeData(data) {
  // נוודא שתיקיית הנתונים קיימת
  try {
    await fs.mkdir(path.dirname(dataPath), { recursive: true });
  } catch (error) {
    // מתעלם משגיאות אם התיקייה כבר קיימת
  }
  // נשמור את הנתונים
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
}

// טיפול בבקשות GET - קבלת נתוני תמונות
export async function GET() {
  try {
    let data = await readData();
    // המרה של מפתח ישן 'earrings' ל-'faceMasks' במקרה שמוצאים אותו
    if (data.categories && data.categories.earrings && !data.categories.faceMasks) {
      data.categories.faceMasks = data.categories.earrings;
      delete data.categories.earrings;
      await writeData(data);
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('שגיאה בקריאת נתוני תמונות דף הבית:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת תמונות דף הבית' },
      { status: 500 }
    );
  }
}

// טיפול בבקשות PUT - עדכון נתוני תמונות
export async function PUT(request) {
  try {
    const updatedData = await request.json();
    
    // וידוא שהנתונים שהתקבלו הם תקינים
    if (!updatedData || typeof updatedData !== 'object') {
      return NextResponse.json(
        { error: 'נתוני תמונות לא תקינים' },
        { status: 400 }
      );
    }
    
    // נשמור את הנתונים המעודכנים
    await writeData(updatedData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'נתוני תמונות דף הבית עודכנו בהצלחה'
    });
  } catch (error) {
    console.error('שגיאה בעדכון נתוני תמונות דף הבית:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון תמונות דף הבית' },
      { status: 500 }
    );
  }
} 