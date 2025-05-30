import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jewelry-shop';

if (!MONGODB_URI) {
  throw new Error(
    'אנא הגדר את משתנה הסביבה MONGODB_URI בקובץ .env.local'
  );
}

/**
 * גלובלי שמחזיק את חיבור mongoose למניעת יצירת חיבורים מרובים במהלך פיתוח בhot-reloading
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect; 