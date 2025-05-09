import mongoose from 'mongoose';

// סכמה עבור תליונים
const CharmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: false,
    default: 0
  },
  description: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: false
  },
  material: {
    type: String,
    required: false
  }
});

// סכמה עבור אבני חן
const GemstoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  color: {
    type: mongoose.Schema.Types.Mixed, // יכול להיות מחרוזת או אובייקט עם שם וערך hex
    required: false
  },
  size: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: false,
    default: 0
  },
  description: {
    type: String,
    required: false
  }
});

// סכמה עבור פריט מותאם אישית
const CustomItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['bracelet', 'necklace', 'earrings', 'ring', 'other'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  baseType: {
    type: String,
    required: false
  },
  modelName: {
    type: String,
    required: false
  },
  material: {
    type: mongoose.Schema.Types.Mixed, // מחרוזת או אובייקט עם שם
    required: false
  },
  length: {
    type: mongoose.Schema.Types.Mixed, // מחרוזת או אובייקט עם ערך יחידות
    required: false
  },
  width: {
    type: mongoose.Schema.Types.Mixed, // מחרוזת או אובייקט עם ערך יחידות
    required: false
  },
  color: {
    type: mongoose.Schema.Types.Mixed, // מחרוזת או אובייקט עם שם וערך hex
    required: false
  },
  style: {
    type: mongoose.Schema.Types.Mixed, // מחרוזת או אובייקט עם שם
    required: false
  },
  pattern: {
    type: mongoose.Schema.Types.Mixed, // מחרוזת או אובייקט עם שם
    required: false
  },
  clasp: {
    type: mongoose.Schema.Types.Mixed, // מחרוזת או אובייקט עם שם
    required: false
  },
  availableCharms: {
    type: [CharmSchema],
    default: []
  },
  availableGemstones: {
    type: [GemstoneSchema],
    default: []
  },
  sizeOptions: {
    type: [String],
    default: []
  },
  fontOptions: {
    type: [{
      name: String,
      displayName: String,
      sample: String
    }],
    default: []
  },
  allowCustomText: {
    type: Boolean,
    default: false
  },
  maxTextLength: {
    type: Number,
    default: 30
  },
  allowCustomGemstones: {
    type: Boolean,
    default: false
  },
  maxGemstones: {
    type: Number,
    default: 5
  },
  allowCustomCharms: {
    type: Boolean,
    default: false
  },
  maxCharms: {
    type: Number,
    default: 10
  },
  description: {
    type: String,
    required: false
  },
  images: {
    type: [String],
    default: []
  },
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.models.CustomItem || mongoose.model('CustomItem', CustomItemSchema); 