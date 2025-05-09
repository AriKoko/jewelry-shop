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
    const charms = db.collection('charms');
    
    // 1. עדכון מחירי שרשראות ל-10 ש"ח
    const necklacesResult = await products.updateMany(
      { category: 'necklaces' },
      { $set: { price: 10 } }
    );
    
    console.log(`עודכנו ${necklacesResult.modifiedCount} שרשראות למחיר 10 ש"ח`);
    
    // 2. עדכון מחירי צמידים ל-5 ש"ח
    const braceletsResult = await products.updateMany(
      { category: 'bracelets' },
      { $set: { price: 5 } }
    );
    
    console.log(`עודכנו ${braceletsResult.modifiedCount} צמידים למחיר 5 ש"ח`);
    
    // 3. עדכון מחירי מסכות פנים ל-2 ש"ח
    const masksResult = await products.updateMany(
      { category: 'face_masks' },
      { $set: { price: 2 } }
    );
    
    console.log(`עודכנו ${masksResult.modifiedCount} מסכות פנים למחיר 2 ש"ח`);
    
    // 4. עדכון מחירי מדבקות אחוריות לטלפון ל-5 ש"ח
    const stickersResult = await products.updateMany(
      { category: 'phone_stickers' },
      { $set: { price: 5 } }
    );
    
    console.log(`עודכנו ${stickersResult.modifiedCount} מדבקות אחוריות לטלפון למחיר 5 ש"ח`);
    
    // 5. עדכון צמידים בעיצוב אישי ל-5 ש"ח
    const customBraceletsResult = await customItems.updateMany(
      { type: 'bracelet' },
      { $set: { basePrice: 5 } }
    );
    
    console.log(`עודכנו ${customBraceletsResult.modifiedCount} צמידים בעיצוב אישי למחיר 5 ש"ח`);

    // 6. עדכון מחירי שרשראות בעיצוב אישי ל-10 ש"ח
    const customNecklacesResult = await customItems.updateMany(
      { type: 'necklace' },
      { $set: { basePrice: 10 } }
    );
    
    console.log(`עודכנו ${customNecklacesResult.modifiedCount} שרשראות בעיצוב אישי למחיר 10 ש"ח`);
    
    // 7. עדכון כל התליונים
    // מחפש את כל התליונים שאין בשמם את המילים "כסף" או "זהב"
    const charmsToUpdate = await charms.find({
      name: { 
        $not: {
          $regex: '(כסף|זהב)'
        } 
      }
    }).toArray();
    
    let updatedCharmsCount = 0;
    
    // עדכון כל תליון - מחיר 5, קטגוריה "other", חומר "אחר", מלאי 25
    for (const charm of charmsToUpdate) {
      await charms.updateOne(
        { _id: charm._id },
        { 
          $set: { 
            price: 5,
            category: 'other',
            material: 'אחר',
            stock: 25
          } 
        }
      );
      updatedCharmsCount++;
    }
    
    console.log(`עודכנו ${updatedCharmsCount} תליונים למחיר 5 ש"ח, קטגוריה 'אחר', חומר 'אחר' ומלאי 25`);
    
    // 8. עדכון תליונים עם "כסף" בשם
    const silverCharmsResult = await charms.updateMany(
      { name: { $regex: 'כסף' } },
      { 
        $set: { 
          price: 5,
          category: 'silver',
          material: 'כסף',
          stock: 25
        } 
      }
    );
    
    console.log(`עודכנו ${silverCharmsResult.modifiedCount} תליוני כסף`);
    
    // 9. עדכון תליונים עם "זהב" בשם
    const goldCharmsResult = await charms.updateMany(
      { name: { $regex: 'זהב' } },
      { 
        $set: { 
          price: 5,
          category: 'gold',
          material: 'זהב',
          stock: 25
        } 
      }
    );
    
    console.log(`עודכנו ${goldCharmsResult.modifiedCount} תליוני זהב`);
    
    console.log('כל המחירים והמאפיינים עודכנו בהצלחה!');
    
  } catch (err) {
    console.error('אירעה שגיאה:', err);
  } finally {
    await client.close();
    console.log('החיבור למסד הנתונים נסגר');
  }
}

run().catch(console.error); 