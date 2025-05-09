// סקריפט לאכלוס מסד הנתונים עם מידע התחלתי
import mongoose from 'mongoose';
import { products, categories } from '../src/lib/products.js';
import Product from '../src/lib/db/models/Product.js';
import dotenv from 'dotenv';

// טען משתני סביבה מקובץ .env.local
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jewelry-shop';

async function seedDatabase() {
  try {
    console.log('מתחבר למסד הנתונים...');
    await mongoose.connect(MONGODB_URI);
    console.log('מחובר לmongoDB!');

    // מחק נתונים קיימים
    console.log('מוחק נתונים קיימים...');
    await Product.deleteMany({});

    // הוסף שדה מלאי לכל מוצר
    const productsWithStock = products.map(product => ({
      ...product,
      stock: Math.floor(Math.random() * 30) + 5, // מלאי אקראי בין 5 ל-35
    }));

    // טען מוצרים חדשים
    console.log('מוסיף מוצרים חדשים...');
    await Product.insertMany(productsWithStock);

    console.log('מסד הנתונים אוכלס בהצלחה!');
  } catch (error) {
    console.error('שגיאה באכלוס מסד הנתונים:', error);
  } finally {
    // סגור את החיבור למסד הנתונים
    await mongoose.connection.close();
    console.log('החיבור למסד הנתונים נסגר.');
  }
}

// הפעל את פונקציית האכלוס
seedDatabase(); 