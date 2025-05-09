import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

// נתיב לקובץ בו נשמור את הנתונים
const dataPath = path.join(process.cwd(), 'data', 'custom-design-images.json');

// נתוני ברירת מחדל
const defaultData = {
  baseTypes: {
    necklace: '/images/placeholders/jewelry-placeholder.jpg',
    bracelet: '/images/placeholders/jewelry-placeholder.jpg'
  },
  braceletModels: {
    1: '/images/placeholders/jewelry-placeholder.jpg',
    2: '/images/placeholders/jewelry-placeholder.jpg'
  },
  necklaceModels: {
    5: '/images/placeholders/jewelry-placeholder.jpg',
    6: '/images/placeholders/jewelry-placeholder.jpg'
  }
};

// קריאת נתונים מהקובץ
async function readData() {
  try {
    await fs.access(dataPath);
    const raw = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(raw);
  } catch (_) {
    // אם אין קובץ, נייצר אחד עם ברירת המחדל
    await writeData(defaultData);
    return defaultData;
  }
}

// כתיבת נתונים לקובץ
async function writeData(data) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json(data);
  } catch (err) {
    console.error('שגיאה בקריאת תמונות עיצוב אישי:', err);
    return NextResponse.json({ error: 'שגיאה בטעינת התמונות' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'נתונים לא תקינים' }, { status: 400 });
    }
    await writeData(body);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('שגיאה בשמירת תמונות עיצוב אישי:', err);
    return NextResponse.json({ error: 'שגיאה בשמירת התמונות' }, { status: 500 });
  }
} 