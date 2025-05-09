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
    const charms = db.collection('charms');
    
    // רשימת התליונים להוספה
    const charmsList = [
      "פפיון לבן (חרוז)",
      "פרפר",
      "ירח לב",
      "כוכב בתוך כוכב",
      "חמסה",
      "כוכב ים",
      "פרח",
      "מפתח",
      "נוצה",
      "צדפה",
      "כוכב ים",
      "פלפל חריף",
      "כוכב ים כחול",
      "כוכב ים לבן",
      "פפיון לבן",
      "פפיון ורוד",
      "צב ים",
      "צב ים ירוק",
      "מזלות",
      "לב (חרוז)",
      "צדפה עם פנינה",
      "דובי (חרוז)",
      "פפיון",
      "פפיון",
      "לב ברבורים",
      "לב",
      "דג",
      "לב עם חץ",
      "כוכב ים",
      "דג",
      "לב",
      "תילתן",
      "דג",
      "נוצה",
      "עלה",
      "חמסה",
      "כדור הארץ לב",
      "ליבתן",
      "בת ים",
      "פרפר",
      "כוכב ים",
      "לב",
      "לב",
      "שמש",
      "לב",
      "לב בתוך לב",
      "דולפינים",
      "כסף",
      "לב",
      "מגן דוד",
      "סנפיר",
      "A משובץ",
      "ABC",
      "ABC",
      "דולר",
      "קשת בענן",
      "פפיונים",
      "חרוזים",
      "בלון כלב",
      "כוכב",
      "לב",
      "סנפיר",
      "ים",
      "דובוני גומי",
      "צמיד ים",
      "חרוזים",
      "חרוזים",
      "פטריק",
      "בובספוג",
      "מר קרב",
      "סקווידויד",
      "גרי",
      "סוקריות",
      "סטיץ",
      "סטיץ בוכה",
      "סטיץ מובך",
      "סטיץ שמח",
      "סוכריה (חרוז)",
      "כוכב (חרוז)",
      "רפונזל",
      "נסיכה",
      "שלגיה",
      "סנדרלה",
      "סוס פוני",
      "בת הים הקטנה",
      "חרוזים צבעונים"
    ];
    
    const defaultImage = '/images/charms/placeholder.jpg';
    
    // יצירת מסמכים של תליונים
    const charmsToInsert = charmsList.map((name, index) => {
      // קביעת קטגוריה בהתאם לתנאי - אם השם מכיל "כסף" או "זהב", שמור את הקטגוריה המתאימה. אחרת, השתמש ב"other"
      let category = 'other';
      let material = 'אחר';
      
      if (name.includes('כסף')) {
        category = 'silver';
        material = 'כסף';
      } else if (name.includes('זהב')) {
        category = 'gold';
        material = 'זהב';
      }
      
      return {
        name: name,
        image: defaultImage,
        price: 5, // מחיר קבוע - 5 ש"ח
        description: `תליון ${name} מרהיב ואיכותי`,
        category: category,
        material: material,
        stock: 25, // מלאי קבוע - 25 יחידות
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });
    
    // הוספה לבסיס הנתונים
    const result = await charms.insertMany(charmsToInsert);
    
    console.log(`נוספו ${result.insertedCount} תליונים למסד הנתונים`);
  } catch (err) {
    console.error('אירעה שגיאה:', err);
  } finally {
    await client.close();
    console.log('החיבור למסד הנתונים נסגר');
  }
}

run().catch(console.error); 