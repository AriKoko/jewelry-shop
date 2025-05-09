import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'נא להזין שם מוצר'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'נא להזין מחיר'],
    min: [0, 'המחיר חייב להיות מספר חיובי'],
  },
  discountPrice: {
    type: Number,
    min: [0, 'מחיר מבצע חייב להיות מספר חיובי'],
    default: null,
  },
  description: {
    type: String,
    required: [true, 'נא להזין תיאור מוצר'],
  },
  material: {
    type: String,
    required: [true, 'נא להזין חומר'],
  },
  category: {
    type: String,
    required: [true, 'נא לבחור קטגוריה'],
    enum: ['necklaces', 'bracelets', 'earrings', 'phone_stickers', 'face_masks', 'custom_design'],
  },
  image: {
    type: String,
    required: [true, 'נא להוסיף תמונה'],
  },
  tags: {
    type: [String],
    default: [],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  stock: {
    type: Number,
    required: [true, 'נא להזין כמות במלאי'],
    min: [0, 'המלאי חייב להיות מספר חיובי'],
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema); 