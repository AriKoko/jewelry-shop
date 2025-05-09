import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'יש להזין קוד קופון'],
    trim: true,
    unique: true,
    uppercase: true,
  },
  type: {
    type: String,
    required: [true, 'יש לבחור סוג הנחה'],
    enum: ['percent', 'fixed'], // הנחה באחוזים או הנחה בסכום קבוע
  },
  value: {
    type: Number,
    required: [true, 'יש להזין ערך הנחה'],
    min: [0, 'ערך ההנחה חייב להיות מספר חיובי'],
  },
  minPurchase: {
    type: Number,
    default: 0,
    min: [0, 'מינימום רכישה חייב להיות מספר חיובי'],
  },
  maxUses: {
    type: Number,
    default: null, // null = ללא הגבלה
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  validFrom: {
    type: Date,
    default: Date.now,
  },
  validUntil: {
    type: Date,
    default: null, // null = ללא תאריך תפוגה
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    default: '',
  },
  applicableProducts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
    default: [], // ריק = כל המוצרים
  },
  applicableCategories: {
    type: [String],
    default: [], // ריק = כל הקטגוריות
  },
  isBirthdayPromo: {
    type: Boolean,
    default: false,
  },
  isFirstOrder: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema); 