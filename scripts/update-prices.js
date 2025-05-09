import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// קביעת נתיב לקובץ .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const envPath = path.resolve(rootDir, '.env.local');

// טעינת משתני סביבה מקובץ .env.local
dotenv.config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('אנא הגדר MONGODB_URI בקובץ .env.local');
  process.exit(1);
}

async function run() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('מחובר למסד הנתונים');
    
    const db = client.db();
    const products = db.collection('products');
    const customItems = db.collection('customItems');
    
    // עדכון מחירי השראות ל-10 ש"ח
    const inspirationsResult = await products.updateMany(
      { category: 'inspirations' },
      { $set: { price: 10 } }
    );
    
    console.log(`עודכנו ${inspirationsResult.modifiedCount} מוצרי השראות למחיר 10 ש"ח`);
    
    // עדכון מחירי צמידים ל-5 ש"ח
    const braceletsResult = await products.updateMany(
      { category: 'bracelets' },
      { $set: { price: 5 } }
    );
    
    console.log(`עודכנו ${braceletsResult.modifiedCount} צמידים למחיר 5 ש"ח`);
    
    // עדכון מחירי מסכות פנים ל-2 ש"ח
    const masksResult = await products.updateMany(
      { category: 'face_masks' },
      { $set: { price: 2 } }
    );
    
    console.log(`עודכנו ${masksResult.modifiedCount} מסכות פנים למחיר 2 ש"ח`);
    
    // עדכון מחירי מדבקות אחוריות לטלפון ל-5 ש"ח
    const stickersResult = await products.updateMany(
      { category: 'phone_stickers' },
      { $set: { price: 5 } }
    );
    
    console.log(`עודכנו ${stickersResult.modifiedCount} מדבקות אחוריות לטלפון למחיר 5 ש"ח`);
    
    // עדכון מחירי צמידים בעיצוב אישי ל-5 ש"ח
    const customBraceletsResult = await customItems.updateMany(
      { type: 'bracelet' },
      { $set: { basePrice: 5 } }
    );
    
    console.log(`עודכנו ${customBraceletsResult.modifiedCount} צמידים בעיצוב אישי למחיר 5 ש"ח`);
    
    console.log('כל המחירים עודכנו בהצלחה!');
    
  } catch (err) {
    console.error('אירעה שגיאה:', err);
  } finally {
    await client.close();
    console.log('החיבור למסד הנתונים נסגר');
  }
}

run().catch(console.error); 