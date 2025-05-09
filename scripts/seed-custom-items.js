// סקריפט לאכלוס מסד הנתונים עם פריטים מותאמים אישית
import mongoose from 'mongoose';
import CustomItem from '../src/lib/db/models/CustomItem.js';
import dotenv from 'dotenv';

// טען משתני סביבה מקובץ .env.local
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jewelry-shop';

// נתוני דוגמה לפריטים מותאמים אישית - מבוססים על קטגוריות ותליונים אמיתיים מהאתר
const sampleCustomItems = [
  {
    type: 'bracelet',
    name: 'צמיד ים מותאם אישית',
    basePrice: 85,
    baseType: 'צמיד חוט',
    material: 'כסף',
    description: 'צמיד ים מותאם אישית עם תליונים בעיצוב ימי לבחירה: כוכב ים, צדפה, צב ים ועוד',
    images: ['/images/placeholders/jewelry-placeholder.jpg'],
    featured: true,
    active: true,
    allowCustomText: false,
    allowCustomCharms: true,
    maxCharms: 5,
    availableCharms: [
      { name: 'כוכב ים', image: '/images/placeholders/jewelry-placeholder.jpg', price: 15 },
      { name: 'צדפה', image: '/images/placeholders/jewelry-placeholder.jpg', price: 15 },
      { name: 'צב ים', image: '/images/placeholders/jewelry-placeholder.jpg', price: 20 },
      { name: 'צב ים ירוק', image: '/images/placeholders/jewelry-placeholder.jpg', price: 20 },
      { name: 'כוכב ים כחול', image: '/images/placeholders/jewelry-placeholder.jpg', price: 15 },
      { name: 'כוכב ים לבן', image: '/images/placeholders/jewelry-placeholder.jpg', price: 15 },
      { name: 'צדפה עם פנינה', image: '/images/placeholders/jewelry-placeholder.jpg', price: 25 },
      { name: 'דג', image: '/images/placeholders/jewelry-placeholder.jpg', price: 15 },
      { name: 'בת ים', image: '/images/placeholders/jewelry-placeholder.jpg', price: 25 },
      { name: 'דולפינים', image: '/images/placeholders/jewelry-placeholder.jpg', price: 20 }
    ],
    sizeOptions: ['S', 'M', 'L']
  },
  {
    type: 'necklace',
    name: 'שרשרת תליון מותאמת אישית',
    basePrice: 120,
    baseType: 'שרשרת כסף',
    material: 'כסף 925',
    description: 'שרשרת כסף איכותית עם תליון לבחירה והקדשה אישית',
    images: ['/images/placeholders/jewelry-placeholder.jpg'],
    featured: true,
    active: true,
    allowCustomText: true,
    maxTextLength: 20,
    fontOptions: [
      { name: 'classic', displayName: 'קלאסי', sample: 'אבג' },
      { name: 'script', displayName: 'סקריפט', sample: 'אבג' }
    ],
    availableCharms: [
      { name: 'לב', image: '/images/placeholders/jewelry-placeholder.jpg', price: 20 },
      { name: 'כוכב', image: '/images/placeholders/jewelry-placeholder.jpg', price: 20 },
      { name: 'פרפר', image: '/images/placeholders/jewelry-placeholder.jpg', price: 20 },
      { name: 'ירח לב', image: '/images/placeholders/jewelry-placeholder.jpg', price: 25 },
      { name: 'מגן דוד', image: '/images/placeholders/jewelry-placeholder.jpg', price: 20 },
      { name: 'חמסה', image: '/images/placeholders/jewelry-placeholder.jpg', price: 25 }
    ],
    sizeOptions: ['40cm', '45cm', '50cm']
  },
  {
    type: 'bracelet',
    name: 'צמיד חרוזים צבעוני בהתאמה אישית',
    basePrice: 60,
    material: 'חרוזי זכוכית',
    description: 'צמיד חרוזים צבעוני בהתאמה אישית, עם אפשרות לבחירת חרוזים שונים ותליונים',
    images: ['/images/placeholders/jewelry-placeholder.jpg'],
    featured: true,
    active: true,
    allowCustomCharms: true,
    maxCharms: 8,
    availableCharms: [
      { name: 'חרוזים צבעונים', image: '/images/placeholders/jewelry-placeholder.jpg', price: 5 },
      { name: 'לב (חרוז)', image: '/images/placeholders/jewelry-placeholder.jpg', price: 10 },
      { name: 'דובי (חרוז)', image: '/images/placeholders/jewelry-placeholder.jpg', price: 10 },
      { name: 'כוכב (חרוז)', image: '/images/placeholders/jewelry-placeholder.jpg', price: 10 },
      { name: 'פפיון לבן (חרוז)', image: '/images/placeholders/jewelry-placeholder.jpg', price: 10 },
      { name: 'סוכריה (חרוז)', image: '/images/placeholders/jewelry-placeholder.jpg', price: 10 }
    ],
    sizeOptions: ['S', 'M', 'L']
  },
  {
    type: 'necklace',
    name: 'שרשרת פלפל חריף מותאמת אישית',
    basePrice: 95,
    material: 'כסף וזכוכית',
    description: 'שרשרת עם תליון פלפל חריף צבעוני ותליונים נוספים לבחירה',
    images: ['/images/placeholders/jewelry-placeholder.jpg'],
    featured: false,
    active: true,
    allowCustomCharms: true,
    maxCharms: 3,
    availableCharms: [
      { name: 'פלפל חריף', image: '/images/placeholders/jewelry-placeholder.jpg', price: 20 },
      { name: 'לב', image: '/images/placeholders/jewelry-placeholder.jpg', price: 15 },
      { name: 'כוכב', image: '/images/placeholders/jewelry-placeholder.jpg', price: 15 },
      { name: 'פרח', image: '/images/placeholders/jewelry-placeholder.jpg', price: 15 }
    ],
    sizeOptions: ['40cm', '45cm', '50cm']
  },
  {
    type: 'bracelet',
    name: 'צמיד סטיץ בהתאמה אישית',
    basePrice: 70,
    material: 'סיליקון וחרוזים',
    description: 'צמיד חמוד בעיצוב סטיץ עם אפשרות להוספת תליונים נוספים',
    images: ['/images/placeholders/jewelry-placeholder.jpg'],
    featured: true,
    active: true,
    allowCustomCharms: true,
    maxCharms: 5,
    availableCharms: [
      { name: 'סטיץ', image: '/images/placeholders/jewelry-placeholder.jpg', price: 25 },
      { name: 'סטיץ בוכה', image: '/images/placeholders/jewelry-placeholder.jpg', price: 25 },
      { name: 'סטיץ מובך', image: '/images/placeholders/jewelry-placeholder.jpg', price: 25 },
      { name: 'סטיץ שמח', image: '/images/placeholders/jewelry-placeholder.jpg', price: 25 },
      { name: 'לב (חרוז)', image: '/images/placeholders/jewelry-placeholder.jpg', price: 10 },
      { name: 'כוכב (חרוז)', image: '/images/placeholders/jewelry-placeholder.jpg', price: 10 }
    ],
    sizeOptions: ['S', 'M', 'L']
  }
];

async function seedCustomItems() {
  try {
    console.log('מתחבר למסד הנתונים...');
    await mongoose.connect(MONGODB_URI);
    console.log('מחובר לmongoDB!');

    // מחק פריטים מותאמים אישית קיימים
    console.log('מוחק פריטים מותאמים אישית קיימים...');
    await CustomItem.deleteMany({});

    // טען פריטים מותאמים אישית חדשים
    console.log('מוסיף פריטים מותאמים אישית חדשים...');
    await CustomItem.insertMany(sampleCustomItems);

    console.log('פריטים מותאמים אישית נוספו בהצלחה!');
  } catch (error) {
    console.error('שגיאה באכלוס מסד הנתונים עם פריטים מותאמים אישית:', error);
  } finally {
    // סגור את החיבור למסד הנתונים
    await mongoose.connection.close();
    console.log('החיבור למסד הנתונים נסגר.');
  }
}

// הפעל את פונקציית האכלוס
seedCustomItems(); 